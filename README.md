# Web3DB Frontend

React + TypeScript UI for the Web3DB backend.

## Run

```bash
cp .env.example .env        # set REACT_APP_API_BASE_URL to your backend
npm install
npm start                   # http://localhost:3000
npm run build               # production build
```

## Structure

```
src/
  Components/
    Atoms/          shared small components
    Organisms/      composed UI (NavBar, SideBar, WalletModal, ...)
    Pages/          DataUpload, LandingPage, PolicyManagement, RunQuery, SeeTables
  context/          PolicyContext, SqlContext, Web3Context
  services/         PolicyService, SchemaService
  config/           API base URL + endpoints
  utils/            schemaUtils
  styles/           global styles
```
