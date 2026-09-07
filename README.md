# ManaRythu Mobile

Expo/React Native customer app for ManaRythu — Cultivating Organic Goodness.

## Run

```sh
cp .env.example .env
npm install
npm start
```

Set `EXPO_PUBLIC_API_URL` to the backend origin (the client appends `/api/v1`). Local demo data is available only when `EXPO_PUBLIC_ENABLE_MOCKS=true`; the app never falls back to mocks after an API error or in an unconfigured production environment.

## Structure

- `app/` — Expo Router screens and navigation
- `src/api/` — typed API contract, client, endpoints, explicit mock adapter
- `src/auth/` — Expo SecureStore token abstraction
- `src/components/` — reusable accessible UI and product components
- `src/i18n/` — English/Telugu resource translations
- `src/store/` — lightweight local interaction state
