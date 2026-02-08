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
          <input class="input" v-model="start" placeholder="Enter start" />

          <div class="sectionTitle" style="margin-top:12px;">End</div>
          <input class="input" v-model="end" placeholder="Enter destination" />

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
            <button class="btn btn--primary" @click="findBestRoute" :disabled="loading">
              {{ loading ? "Working..." : "Find Best Route" }}
            </button>

            <button class="btn" @click="speakReasoning" :disabled="!routeDescription">
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
  },

  methods: {
    async obtainRoutes(start, end) {
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

    async placesThroughRoute(latitude, longitude) {
      return new Promise((resolve) => {
        // Form a PlacesService instance 
        const placesServiceInstance = new google.maps.places.PlacesService(document.createElement("div"));
        // Search for nearby places around the route coordinate
        placesServiceInstance.nearbySearch(
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

};
</script>
