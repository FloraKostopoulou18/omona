# Mosaic

Mosaic is an adaptive reading-support frontend built with Angular standalone components. It uses mock services so the learner flow can be explored before a Django API is available.

## Start the app

Install dependencies and start a local server:

```bash
npm install
npm start
```

Open `http://localhost:4200/`. The dashboard is the default demo route. Registration leads through onboarding and a six-activity assessment; practice, real-world activities, progress, and profile are available from the navigation.
Practice is organized into six-activity sets, with a clear finish option before starting another set.

## Structure

- `src/app/core/models` contains learner, activity, exercise, and progress contracts.
- `src/app/core/services` contains mock data and service abstractions, with API paths centralized for a future Django integration.
- `src/app/features` contains route-level feature pages.
- `src/app/shared` contains the reusable exercise interaction and feedback components.
- `src/app/layout` contains the authenticated application shell and responsive navigation.
- `docs/backend-api-contract.md` specifies the proposed Django/PostgreSQL models and REST payloads for backend integration.
- `docs/figma-import-guide.md` explains how to import the live app screens; `docs/figma-assets/mosaic-foundations.svg` is an editable Figma-ready design-tokens sheet.

The mock session starts authenticated to make the dashboard immediately explorable. Use **Sign out** from Profile to try the login and registration screens.
Reading preferences include self-hosted Lexend and OpenDyslexic fonts, adjustable text size and spacing, and can be changed during onboarding or later in Profile.
The shared curated interest picker is used during onboarding and in Profile. Existing free-text interest values are mapped to matching curated choices when those screens load.

## Build and test

```bash
npm run build
npm test
```
