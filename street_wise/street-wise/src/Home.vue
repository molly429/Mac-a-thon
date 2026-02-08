<template>
  <div class="bg">
    <!-- Top nav -->
    <header class="nav">
      <div class="brand">
        <div class="logo">SW</div>
        <div class="brandText">
          <div class="brandName">Street Wise</div>
          <div class="brandTag">Calm Route Scorer</div>
        </div>
      </div>

      <div class="navLinks">
        <a class="navLink" href="#about">About</a>
        <a class="navLink" href="#how">How to use</a>
        <RouterLink class="navBtn" to="/application">Try Demo</RouterLink>
      </div>
    </header>

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

          <div class="hint">
            Tip: Try “McMaster University, Hamilton, ON” → “Jackson Square, Hamilton, ON”.
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

      <!-- About -->
      <section id="about" class="section">
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
      </section>

      <!-- How to use -->
      <section id="how" class="section">
        <div class="sectionHead">
          <div class="kicker">How to use</div>
          <h2 class="h2">Get a calmer route in under a minute</h2>
          <p class="p">
            Open the demo, enter start and end locations, tune your weights, then generate
            alternatives and choose the lowest-score route.
          </p>
        </div>

        <div class="grid3">
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
  import { RouterLink } from "vue-router";
</script>

<style scoped>
.bg{
  min-height:100vh;
  color:#eef2ff;
  background:
    radial-gradient(900px 600px at 15% 10%, rgba(147, 51, 234, .28), transparent 60%),
    radial-gradient(900px 600px at 85% 30%, rgba(59, 130, 246, .20), transparent 60%),
    radial-gradient(700px 500px at 50% 85%, rgba(168, 85, 247, .16), transparent 60%),
    linear-gradient(180deg, #05030a, #05030a 25%, #04020b 70%, #03010a);
}

.wrap{
  max-width: 1120px;
  margin: 0 auto;
  padding: 22px 18px 56px;
}

/* Nav */
.nav{
  max-width: 1120px;
  margin: 0 auto;
  padding: 18px 18px 10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:14px;
}

.brand{
  display:flex;
  gap:10px;
  align-items:center;
}

.logo{
  width:40px;
  height:40px;
  border-radius:14px;
  display:grid;
  place-items:center;
  font-weight:900;
  color:#0b1020;
  background: linear-gradient(135deg, rgba(168,85,247,.95), rgba(59,130,246,.9));
  box-shadow: 0 18px 40px rgba(168,85,247,.18);
}

.brandText{ line-height:1.05; }
.brandName{ font-weight:800; letter-spacing:.2px; }
.brandTag{ font-size:12px; color: rgba(238,242,255,.65); margin-top:4px; }

.navLinks{
  display:flex;
  gap:10px;
  align-items:center;
  flex-wrap:wrap;
}

.navLink{
  color: rgba(238,242,255,.72);
  text-decoration:none;
  padding:8px 10px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
}

.navLink:hover{ border-color: rgba(168,85,247,.25); }

.navBtn{
  text-decoration:none;
  padding: 9px 12px;
  border-radius: 12px;
  font-weight:750;
  color:#0b1020;
  background: linear-gradient(135deg, rgba(168,85,247,.95), rgba(59,130,246,.9));
  border: none;
}

/* Hero */
.hero{
  margin-top: 10px;
  display:grid;
  grid-template-columns: 1.15fr .85fr;
  gap: 16px;
  align-items: stretch;
}

@media (max-width: 980px){
  .hero{ grid-template-columns: 1fr; }
}

.heroLeft{ padding: 18px 6px; }

.pill{
  display:inline-flex;
  align-items:center;
  gap:8px;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 13px;
  color: rgba(238,242,255,.75);
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
  backdrop-filter: blur(10px);
}

.title{
  margin: 14px 0 10px;
  font-size: 48px;
  letter-spacing: -0.8px;
  line-height: 1.02;
}

.subtitle{
  margin: 0;
  max-width: 60ch;
  color: rgba(238,242,255,.70);
  font-size: 16.5px;
  line-height: 1.55;
}

.ctaRow{
  margin-top: 16px;
  display:flex;
  gap: 10px;
  flex-wrap:wrap;
}

.ctaPrimary{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 800;
  text-decoration:none;
  color:#0b1020;
  background: linear-gradient(135deg, rgba(168,85,247,.95), rgba(59,130,246,.92));
  box-shadow: 0 18px 40px rgba(59,130,246,.10);
}

.ctaGhost{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  padding: 10px 14px;
  border-radius: 14px;
  font-weight: 700;
  text-decoration:none;
  color: rgba(238,242,255,.85);
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.03);
}

.hint{
  margin-top: 10px;
  font-size: 13px;
  color: rgba(238,242,255,.55);
}

.logos{
  margin-top: 18px;
}

.logosLabel{
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(238,242,255,.55);
  margin-bottom: 8px;
}

.logoRow{
  display:flex;
  gap: 10px;
  flex-wrap: wrap;
}

.chip{
  padding: 8px 10px;
  border-radius: 999px;
  font-size: 13px;
  color: rgba(238,242,255,.8);
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(255,255,255,.03);
}

/* Right card (glass) */
.heroRight{ padding: 18px 0; }

.glassCard{
  height: 100%;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(14px);
  box-shadow: 0 24px 60px rgba(0,0,0,.35);
  padding: 16px;
}

.cardTitle{
  font-weight: 800;
  letter-spacing: .2px;
  margin-bottom: 10px;
  color: rgba(238,242,255,.9);
}

.metric{
  display:flex;
  gap: 10px;
  padding: 10px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255,255,255,.08);
  background: rgba(0,0,0,.18);
  margin-bottom: 10px;
}

.dot{
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 6px;
  flex: 0 0 auto;
}

.dotBlue{ background: rgba(59,130,246,.9); box-shadow: 0 0 0 6px rgba(59,130,246,.14); }
.dotPurple{ background: rgba(168,85,247,.9); box-shadow: 0 0 0 6px rgba(168,85,247,.14); }
.dotWhite{ background: rgba(238,242,255,.82); box-shadow: 0 0 0 6px rgba(238,242,255,.10); }

.metricName{ font-weight: 800; }
.metricDesc{ font-size: 13px; color: rgba(238,242,255,.62); margin-top: 3px; line-height: 1.35; }

.divider{
  height: 1px;
  background: rgba(255,255,255,.08);
  margin: 12px 0;
}

.miniTitle{ font-weight: 800; }
.miniDesc{ font-size: 13px; color: rgba(238,242,255,.62); margin-top: 4px; line-height: 1.35; }

/* Sections */
.section{
  margin-top: 26px;
  padding-top: 10px;
}

.sectionHead{
  margin-bottom: 12px;
}

.kicker{
  font-size: 12px;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: rgba(238,242,255,.55);
  margin-bottom: 6px;
}

.h2{
  margin: 0 0 8px;
  font-size: 28px;
  letter-spacing: -0.4px;
}

.p{
  margin: 0;
  color: rgba(238,242,255,.68);
  max-width: 80ch;
  line-height: 1.55;
}

.grid3{
  display:grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

@media (max-width: 980px){
  .grid3{ grid-template-columns: 1fr; }
  .title{ font-size: 38px; }
}

.card{
  border-radius: 20px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 40px rgba(0,0,0,.28);
  padding: 14px;
}

.h3{
  margin: 0 0 6px;
  font-size: 16px;
}

.p2{
  margin: 0;
  color: rgba(238,242,255,.62);
  line-height: 1.5;
  font-size: 13.5px;
}

.stepNum{
  width: 28px;
  height: 28px;
  border-radius: 12px;
  display:grid;
  place-items:center;
  font-weight: 900;
  color:#0b1020;
  background: linear-gradient(135deg, rgba(168,85,247,.95), rgba(59,130,246,.92));
  margin-bottom: 10px;
}

.bottomCta{
  margin-top: 14px;
  border-radius: 22px;
  border: 1px solid rgba(255,255,255,.10);
  background: rgba(255,255,255,.04);
  backdrop-filter: blur(12px);
  padding: 14px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 12px;
}

.bottomTitle{ font-weight: 900; }
.bottomDesc{ color: rgba(238,242,255,.62); font-size: 13.5px; margin-top: 4px; }

/* Footer */
.footer{
  margin-top: 26px;
  padding-top: 14px;
  border-top: 1px solid rgba(255,255,255,.08);
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap: 10px;
  color: rgba(238,242,255,.55);
  font-size: 13px;
}

.footRight{
  display:flex;
  gap: 12px;
  flex-wrap:wrap;
}

.footLink{
  color: rgba(238,242,255,.65);
  text-decoration:none;
}

.footLink:hover{ text-decoration: underline; text-underline-offset: 3px; }
</style>