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
        <div class="main card">
          <div class="sectionTitle">Start</div>
          <input ref="startInput" class="input" v-model="start" placeholder="Enter start" />

          <div class="sectionTitle" style="margin-top:12px;">End</div>
          <input ref="endInput" class="input" v-model="end" placeholder="Enter destination" />

          <div class="hr"></div>

          <div class="sectionTitle">Weights</div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Brightness</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1"
              v-model.number="weights.brightnessWeight" />
            <div class="weightValue">{{ weights.brightnessWeight.toFixed(1) }}</div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Noise</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1"
              v-model.number="weights.noiseWeight" />
            <div class="weightValue">{{ weights.noiseWeight.toFixed(1) }}</div>
          </div>

          <div class="row" style="margin-top:8px;">
            <div class="kv">Crowds</div>
            <input class="input input--sm slider" type="range" min="0" max="5" step="0.1"
              v-model.number="weights.crowdsWeight" />
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

      <!-- Reasoning card with scores and Gemini explanation -->
      <div class="main card reasonCard">
        <div class="reasonHeader">
          <div class="routeChip">
            {{ bestRouteName || "—" }}
          </div>
        </div>

        <div class="scoreRow">
          <div class="scorePill">
            <div class="pillTop">
              <span class="pillDot dotBright"></span>
              <span class="pillLabel">Brightness</span>
            </div>
            <div class="pillValue">{{ bestAverages.brightness }}</div>
            <div class="pillHint">Lower is calmer</div>
          </div>

          <div class="scorePill">
            <div class="pillTop">
              <span class="pillDot dotNoise"></span>
              <span class="pillLabel">Noise</span>
            </div>
            <div class="pillValue">{{ bestAverages.noise }}</div>
            <div class="pillHint">Lower is quieter</div>
          </div>

          <div class="scorePill">
            <div class="pillTop">
              <span class="pillDot dotCrowd"></span>
              <span class="pillLabel">Crowds</span>
            </div>
            <div class="pillValue">{{ bestAverages.crowds }}</div>
            <div class="pillHint">Lower is less busy</div>
          </div>
        </div>

        <div class="reasonSummary">
          {{ shortReason || "No reasoning yet. Enter start/end and click Find Best Route." }}
        </div>

        <details class="reasonDetails" v-if="reasoningText">
          <summary></summary>
          <div class="reasonText" v-html="reasoningHtml"></div>
        </details>
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
      bestRouteName: "",
      bestAverages: { brightness: "—", noise: "—", crowds: "—" },
      apiKey: import.meta.env.VITE_GEMINI_API_KEY,
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
      const startInput = this.$refs.startInput;
      const endInput = this.$refs.endInput;

      if (startInput) {
        this.startAutocomplete = new google.maps.places.Autocomplete(startInput);
        this.startAutocomplete.addListener("place_changed", () => {
          const place = this.startAutocomplete.getPlace();
          this.start = place.formatted_address || place.name;
        });
      }

      if (endInput) {
        this.endAutocomplete = new google.maps.places.Autocomplete(endInput);
        this.endAutocomplete.addListener("place_changed", () => {
          const place = this.endAutocomplete.getPlace();
          this.end = place.formatted_address || place.name;
        });
      }
    },

    async callGemini(prompt) {
      const response = await fetch(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=" + this.apiKey,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      console.log("Gemini API raw response:", data);

      const text =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No reasoning generated.";

      return text;
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
      const start = this.start;
      const end = this.end;

      if (!start || !end) {
        alert("Please enter both start and destination.");
        return;
      }

      this.reasoningText = "Providing route suggestion...";
      this.loading = true;

      try {
        // 1. Get Google routes
        const googleRoutes = await this.getGoogleRoutes(start, end);

        // 2. Convert + score routes
        const converted = [];
        for (const r of googleRoutes) {
          const c = await this.convertGoogleDirectionsRoute(r);
          c.score = this.scoreRoute(c.sensory);
          converted.push(c);
        }

        // 3. Pick best route
        const best = this.pickBestRoute(converted);

        // 4. Draw routes on map
        this.routesLayer.clearLayers();
        converted.forEach(r =>
          this.drawMapRoute(
            r,
            r === best
              ? { color: "blue", weight: 6, opacity: 0.9 }
              : { color: "black", weight: 4, opacity: 0.5 }
          )
        );

        // 5. Build score panel HTML
        let html = "<h3>Overall Sensory Scores for Each Route</h3>";

        converted.forEach(route => {
          const totals = {
            brightness: this.average(route.sensory.map(s => s.brightness)).toFixed(1),
            noise: this.average(route.sensory.map(s => s.noise)).toFixed(1),
            crowds: this.average(route.sensory.map(s => s.crowds)).toFixed(1),
          };
          
          // Store best route name and averages for display in right panel
          this.bestRouteName = best.name;
          
          this.bestAverages = {
            brightness: totals.brightness,
            noise: totals.noise,
            crowds: totals.crowds
          };

          html += `
        <div class="score-block">
          <strong>${route.name}</strong><br>
          Brightness: ${totals.brightness}<br>
          Noise: ${totals.noise}<br>
          Crowds: ${totals.crowds}<br>
          Weighted Score: ${route.score.toFixed(2)}
        </div>
      `;
        });

        setTimeout(() => {
          this.scorePanel = html;
        }, 3000);

        // 6. Gemini reasoning (paragraph style)
        const totals = {
          brightness: this.average(best.sensory.map(s => s.brightness)).toFixed(1),
          noise: this.average(best.sensory.map(s => s.noise)).toFixed(1),
          crowds: this.average(best.sensory.map(s => s.crowds)).toFixed(1),
        };

        const prompt = `
Chosen route: ${best.name}

User weights:
Brightness: ${this.weights.brightnessWeight}
Noise: ${this.weights.noiseWeight}
Crowds: ${this.weights.crowdsWeight}

Total sensory scores:
Brightness: ${totals.brightness}
Noise: ${totals.noise}
Crowds: ${totals.crowds}

Write a friendly, conversational explanation that:
- Starts by confidently naming the chosen route
- Explains why this route is the best match for the user's priorities
- Mentions which factors scored well or poorly
- Connects the scores to the user's weights
- Ends with a positive, encouraging tone

Do NOT output JSON. Write natural paragraphs.
`;

        const reasoning = await this.callGemini(prompt);

        console.log("Gemini reasoning:", reasoning);

        this.routeDescription = reasoning;
        this.reasoningText = reasoning;

      } catch (e) {
        this.reasoningText = "Error: " + e;
      } finally {
        this.loading = false;
      }
    }

  },
  computed: {
    shortReason() {
      if (!this.reasoningText) return "";
      // first sentence / first ~140 chars
      const first = this.reasoningText.split("\n").join(" ").trim();
      return first.length > 140 ? first.slice(0, 140) + "…" : first;
    },
    reasoningHtml() {
      // convert **bold** to <strong> and newlines to <br>
      const safe = (this.reasoningText || "")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\n/g, "<br>");
      return safe;
    }
  }

};

</script>