<template>
  <div class="bg">
    <div class="shell">
      <!-- Top nav -->
      <Navbar />

      <!-- Hero -->
      <main class="wrap">
        <section class="hero">
          <div class="heroLeft">
            <div class="pill">Sensory-friendly routing • Prototype</div>

            <h1 class="title">
              Routes that feel calmer,<br />
              not just faster.
            </h1>

            <p class="subtitle">
              Street Wise scores route options using estimated sensory load
              (noise, brightness, crowds) so you can choose the path that feels best.
            </p>

            <div class="ctaRow">
              <RouterLink class="ctaPrimary" to="/application">Try Demo</RouterLink>
              <a class="ctaGhost" href="#how">How it works</a>
            </div>

            <div class="logos">
              <div class="logosLabel">Built with</div>
              <div class="logoRow">
                <div class="chip">Vue</div>
                <div class="chip">Leaflet</div>
                <div class="chip">Google Places</div>
                <div class="chip">Google Directions</div>
                <div class="chip">Gemini</div>
              </div>
            </div>
          </div>

          <div class="heroRight">
            <div class="glassCard">
              <div class="cardTitle">What we optimize for</div>
              <div class="metrics">
                <div class="metric">
                  <div class="dot dotBlue"></div>
                  <div class="metricText">
                    <div class="metricName">Lower noise</div>
                    <div class="metricDesc">Avoids bars/nightclubs, stadium areas, transit hubs.</div>
                  </div>
                </div>

                <div class="metric">
                  <div class="dot dotPurple"></div>
                  <div class="metricText">
                    <div class="metricName">Lower crowds</div>
                    <div class="metricDesc">Avoids malls, schools, dense public venues when possible.</div>
                  </div>
                </div>

                <div class="metric">
                  <div class="dot dotWhite"></div>
                  <div class="metricText">
                    <div class="metricName">Lower brightness</div>
                    <div class="metricDesc">Prioritizes calmer-feeling streets and surroundings.</div>
                  </div>
                </div>
              </div>

              <div class="divider"></div>

              <div class="mini">
                <div class="miniTitle">You control the weights</div>
                <div class="miniDesc">
                  Want “quiet” more than “less crowded”? Slide the weights and rerun.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      </div>
      <main class="wrap">
      <!-- About -->
      
      <section id="about" class="section">
        <div class="about-inner">
        <div class="sectionHead">
          <div class="kicker">About</div>
          <h2 class="h2">Designed with neurodivergent experiences in mind</h2>
          <p class="p">
            Many navigation apps optimize for time — but that can push you through
            overwhelming places. Street Wise aims to reduce sensory stress by highlighting
            routes that are more likely to feel calmer.
          </p>
        </div>

        <div class="grid3">
          <div class="card">
            <h3 class="h3">Predictable sensory load</h3>
            <p class="p2">
              The scorer estimates where noise, crowds, and intense activity may be higher,
              then favors calmer alternatives when they exist.
            </p>
          </div>

          <div class="card">
            <h3 class="h3">Personal control</h3>
            <p class="p2">
              Sensory preferences differ. You choose what matters most by changing weights
              instead of using a one-size-fits-all route.
            </p>
          </div>

          <div class="card">
            <h3 class="h3">Explains the “why”</h3>
            <p class="p2">
              It doesn’t just pick a route — it shows reasoning (average noise/brightness/crowds)
              so the choice feels understandable.
            </p>
          </div>
        </div>
        </div>
      </section>

      <!-- How to use -->
      <section id="how" class="section">
        <div class="about-inner">
        <div class="sectionHead">
          <div class="kicker">How to use</div>
          <h2 class="h2">Get a calmer route in under a minute</h2>
          <p class="p">
            Open the demo, enter start and end locations, tune your weights, then generate
            alternatives and choose the lowest-score route.
          </p>
        </div>

        <div class="grid3 how">
          <div class="card step">
            <div class="stepNum">1</div>
            <h3 class="h3">Enter locations</h3>
            <p class="p2">
              Use specific addresses (include city/province) to avoid routing errors.
            </p>
          </div>

          <div class="card step">
            <div class="stepNum">2</div>
            <h3 class="h3">Set your weights</h3>
            <p class="p2">
              Increase “noise” if you want the quietest route, or “crowds” if you want less busy areas.
            </p>
          </div>

          <div class="card step">
            <div class="stepNum">3</div>
            <h3 class="h3">Try the best route</h3>
            <p class="p2">
              The map highlights the best option and the reasoning panel explains the decision.
            </p>
          </div>
        </div>

        <div class="bottomCta">
          <div class="bottomLeft">
            <div class="bottomTitle">Ready to try it?</div>
            <div class="bottomDesc">Open the demo and generate a calm route.</div>
          </div>
          <RouterLink class="ctaPrimary" to="/application">Try Demo</RouterLink>
        </div>
        </div>
      </section>

      <footer class="footer">
        <div class="footLeft">© Street Wise • Built for accessibility-first navigation.</div>
        <div class="footRight">
          <a class="footLink" href="#about">About</a>
          <a class="footLink" href="#how">How to use</a>
          <RouterLink class="footLink" to="/application">Demo</RouterLink>
        </div>
      </footer>
    </main>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import './home.css';
</script>