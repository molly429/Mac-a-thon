<template>
  <div class="app">
    <!-- LEFT PANEL -->
    <aside class="panel sidebar mainControls">
      <div class="sidebar__top">
        <div class="sidebar__row">
          <div class="sidebar__title">Street Wise</div>
        </div>
      </div>

      <div class="sidebar__list">
        <div class="card">
          <div class="sectionTitle">Start</div>
          <input ref="startInput" class="input" v-model="start" placeholder="Enter start" />

          <div class="sectionTitle" style="margin-top:12px;">End</div>
          <input ref="endInput" class="input" v-model="end" placeholder="Enter destination" />

          <div class="hr"></div>

          <div class="sectionTitle">Weights</div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Brightness</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1" v-model.number="weights.brightnessWeight" />
            <div class="weightValue">{{ weights.brightnessWeight.toFixed(1) }}</div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Noise</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1" v-model.number="weights.noiseWeight" />
            <div class="weightValue">{{ weights.noiseWeight.toFixed(1) }}</div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Crowds</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1" v-model.number="weights.crowdsWeight" />
            <div class="weightValue">{{ weights.crowdsWeight.toFixed(1) }}</div>
          </div>

          <div class="hr"></div>

          <div class="row">
            <button class="btn btn--primary" @click="determineBestPossibleRoute" :disabled="loading">
              {{ loading ? "Working..." : "Find Best Route" }}
            </button>

            <button class="btn btn--speak" @click="speakReasoning" :disabled="!routeDescription">
              Speak
            </button>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAP -->
    <main class="panel mapWrap">
      <div id="map" class="map"></div>
    </main>

    <!-- RIGHT PANEL -->
    <aside class="panel details">
      <div class="details__top">
        <div class="details__name">Route Reasoning</div>
      </div>

      <div class="details__body">
        <div class="card" style="white-space:pre-wrap; min-height: 220px;">
          {{ reasoningText || "No reasoning yet. Enter start/end and click Find Best Route." }}
        </div>
      </div>
    </aside>
  </div>
</template>

<script>
import "./main.css";

export default {
  data() {
    return {
      start: "",
      end: "",
      weights: {
        brightnessWeight: 1,
        noiseWeight: 1,
        crowdsWeight: 1
      },
      loading: false,
      reasoningText: "",
      routeDescription: "",
      map: null,
      routesLayer: null,
    };
  },

  mounted() {
    // Initialize the Leaflet map centered around Hamilton, Ontario 
    this.map = L.map("map").setView([43.2557, -79.8711], 13);
    // Add OpenStreetMap tiles as the base layer of the map
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(this.map);
    // Create a layer group to store all the route polylines to easily clear the map
    this.routesLayer = L.layerGroup().addTo(this.map);

    // Initialize Google Maps Places Autocomplete for the start and end input fields
    this.initAutocomplete();
  },

  methods: {
    initAutocomplete() {
      // Find the input fields by their placeholder text and attach Google Places Autocomplete to them
      const startInput = document.querySelector('input[placeholder="Enter start"]');
      const endInput = document.querySelector('input[placeholder="Enter destination"]');
      // If the input fields are found, initialize Autocomplete on them to provide location suggestions as the user types
      if (startInput) new google.maps.places.Autocomplete(startInput);
      if (endInput) new google.maps.places.Autocomplete(endInput);
    },
    async getGoogleRoutes(start, end) {
      return new Promise((resolve, reject) => {
        //Google Maps Directions API client
        const directionsClient = new google.maps.DirectionsService();

        // Request directions between from + to destination
        directionsClient.route(
          {
            origin: start,
            destination: end,
            travelMode: google.maps.TravelMode.DRIVING,
            //Return multiple route options
            provideRouteAlternatives: true,
            region: "CA"
          },
          (result, status) => {
            //If request is a success, return the possible list of routes
            if (status === google.maps.DirectionsStatus.OK) resolve(result.routes);
            else reject("Directions request has failed: " + status);
          }
        );
      });
    },

    async getPlacesAlongRoute(lat, lng) {
      return new Promise((resolve) => {
        // Form a PlacesService instance 
        const service = new google.maps.places.PlacesService(document.createElement("div"));
        // Search for nearby places around the route coordinate
        service.nearbySearch(
          {
            location: { lat, lng },
            radius: 1000,
            types: [
              "night_club", "bar", "stadium", "shopping_mall", "school",
              "restaurant", "cafe", "gym", "movie_theater",
              "transit_station", "bus_station", "train_station"
            ]
          },
          (results, status) => {
            // If a success, return the places, else return an empty array
            if (status === google.maps.places.PlacesServiceStatus.OK) resolve(results);
            else resolve([]);
          }
        );
      });
    },

// Calculate sensory score for single point on the routes
async sensoryScorePoint(lat, lng) {
    //determine nearby places around the route coordinate
    const places = await this.getPlacesAlongRoute(lat, lng);
    //intialize sensory conditions scores
    let brightness = 0, noise = 0, crowds = 0;
    //determine score for each place based on sensory condition
    places.forEach(place => {
        const placeTypes = place.types || [];

        if (placeTypes.includes("night_club") || placeTypes.includes("bar")) {
            noise += 8; crowds += 6;
        }
        if (placeTypes.includes("stadium")) {
            brightness += 9; noise += 7;
        }
        if (placeTypes.includes("shopping_mall")) crowds += 8;
        if (placeTypes.includes("school")) crowds += 5;
    });

    return { brightness, noise, crowds };
},


  //Sample points along polyline to reduce API load
   samplePoints(points, step = 5) {
     const samplePoints = [];
     for (let i = 0; i < points.length; i += step) samplePoints.push(points[i]);
     return samplePoints;
   },

  //Convert a Google Directions route into internal format
   async convertGoogleDirectionsRoute(route) {
     const path = route.overview_path;
     if (!path || !path.length) throw new Error("Route has no overview_path.");
  // Convert Google latitude, longtitude objects into [latitutde, langitude] pairs
     const decoded = path.map((p) => [p.lat(), p.lng()]);
     // Reduce number of points to avoid excessive API calls
     const samplePoints = this.samplePoints(decoded, 5);

     const points = [];
     const sensory = [];

     // Compute sensory score for each sample coordinate
     for (const [lat, lng] of samplePoints) {
       points.push([lat, lng]);
       sensory.push(await this.sensoryScorePoint(lat, lng));
     }

     return { name: route.summary || "Unnamed Route", points, sensory };
   },

   // Compute total sensory score for routes
   scoreRoute(sensoryArr) {
     const brightnessW = Number(this.weights.brightnessWeight);
     const noiseW = Number(this.weights.noiseWeight);
     const crowdsW = Number(this.weights.crowdsWeight);


     let total = 0;
     sensoryArr.forEach((seg) => {
      //totals in each sensory category
       total += seg.brightness * brightnessW;
       total += seg.noise * noiseW;
       total += seg.crowds * crowdsW;
     });
     return total;
   },

  //Determine the route with the lowest sensory score
   pickBestRoute(routeList) {
     let best = null;
     let bestScore = Infinity;


     routeList.forEach((route) => {
       const score = this.scoreRoute(route.sensory);
       // Store score on route object
       route.score = score;

         //lowest score is best route
       if (score < bestScore) {
         bestScore = score;
         best = route;
       }
     });


     return best;
   },

   // Compute average of numeric array
   average(arr) {
     return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
   },

   //Generate reasoning for chosen route
   generateReasoning(route) {
     const averageBrightness = this.average(route.sensory.map((s) => s.brightness));
     const averageNoise = this.average(route.sensory.map((s) => s.noise));
     const averageCrowds = this.average(route.sensory.map((s) => s.crowds));


     return `
Best Route Selected: ${route.name}


Reason:
- Lowest sensory load score: ${route.score.toFixed(2)}
- Average brightness: ${averageBrightness.toFixed(1)}
- Average noise: ${averageNoise.toFixed(1)}
- Average crowds: ${averageCrowds.toFixed(1)}


Weights used:
- Brightness: ${this.weights.brightnessWeight}
- Noise:      ${this.weights.noiseWeight}
- Crowds:     ${this.weights.crowdsWeight}
`.trim();
   },

   // Draw a route polyline on the map
   drawMapRoute(route, style) {
     L.polyline(route.points, style).addTo(this.routesLayer);
   },


   async determineBestPossibleRoute() {
     const start = (this.start || "").trim();
     const end = (this.end || "").trim();


     if (!start || !end) {
       alert("Please enter both start and destination.");
       return;
     }


     this.loading = true;
     this.reasoningText = "Calculating routes and sensory scores...";


     try {
      //get all possible Google routes
       const googleRoutes = await this.getGoogleRoutes(start, end);
       console.log("Google routes returned:", googleRoutes.length);

      // Convert each Google route into internal format
       const converted = [];
       for (const r of googleRoutes) converted.push(await this.convertGoogleDirectionsRoute(r));

      // Determine best route based on it's sensory score
       const best = this.pickBestRoute(converted);

      // Clear old map layers
       this.routesLayer.clearLayers();
       converted.forEach((r) => {
         const isBest = r.name === best.name && r.score === best.score;
         this.drawMapRoute(
           r,
           isBest
             ? { color: "blue", weight: 6, opacity: 0.9 }
             : { color: "black", weight: 4, opacity: 0.5 }
         );
       });

    // Create route reasoning text
       const reasoning = this.generateReasoning(best);
       this.routeDescription = reasoning;
       this.reasoningText = reasoning;
     } catch (e) {
       console.error(e);
       this.reasoningText = "Error: " + e;
     } finally {
       this.loading = false;
     }
   },
  }

};
 </script>