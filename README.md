# Street Wise  

This is an application built for everyone, targeting neurodivergent individuals, specifically, those who are autistic, ADHers, people with sensory processing differences or anyone who lives in a world that makes navigation tools feel overwhelming. Common challenges that are not commonly considered in standard routing apps like Google maps include bright flashing zones, noisy areas and crowded areas which can all trigger sensory overload and discomfort. Street-Wise aims to tackle this issue by providing the user with the best possible route to reach their location while taking into consideration of these factors.

Authors: Ranica Chawla, Krishi Dalal, Molly He


## Features
- Multiple route alternatives via Google Directions
- Sensory scoring using nearby place types (noise, crowds, brightness)
- Weighted preferences (user-controlled sliders)
- AI-generated route explanation (Gemini)

---

## Tech Stack
**Frontend**
- Vue 3
- Leaflet
- Google Maps Directions & Places APIs
- Gemini API

---


## Running Locally

### Prerequisites
- Node.js **18+**
- npm
- Google Maps API key with:
  - Directions API
  - Places API
- Gemini API key

---

## Setup/Running

### Install dependencies
```bash
cd street-wise
npm install
```

### Create `.env`

```bash
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_KEY
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY
```

### Run Locally

```bash
npm run dev
```

