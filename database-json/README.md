# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Configuration

Before running the application, you need to configure the backend API URL:

1. Copy the environment template:

   ```bash
   cp .env.example .env
   ```

2. Edit the `.env` file and update the `REACT_APP_API_BASE_URL` with your backend server URL:
   ```
   REACT_APP_API_BASE_URL=http://129.74.154.215:8000
   ```

The application will use the environment variable if available, or fall back to the default URL configured in `src/config/config.ts`.

## Recent Updates

### Schema Management Migration (SQL Format)

The application has been updated to work with the new backend schema storage format:

- **Schema Storage**: Schemas are now stored as SQL CREATE TABLE statements instead of JSON objects
- **Dual Input Modes**: Form Builder for guided creation and SQL DDL for direct SQL input
- **DDL Templates**: Pre-built templates for common table types (Patient Data, User Profiles, Transactions, Event Logs)
- **Backward Compatibility**: The frontend handles both new SQL format and legacy JSON format
- **Enhanced UI**: Added "View SQL" button to see raw SQL schemas
- **Simplified Interface**: Removed edit functionality - schemas are create-only for better data integrity
- **Collapsed by Default**: Table cards start collapsed for cleaner interface
- **New Utilities**: Added SQL parsing and generation utilities in `src/utils/schemaUtils.ts`

For detailed migration information, see [SCHEMA_MIGRATION.md](./SCHEMA_MIGRATION.md).

### Recent UI/UX Improvements

- **Tabbed Interface**: Clean separation between Form Builder and SQL DDL modes
- **Template Selection**: Quick-start templates with one-click selection
- **Accordion Behavior**: Tables start collapsed for better overview
- **Streamlined Forms**: Removed indexes field for simplified schema creation
- **Enhanced Validation**: Real-time SQL syntax validation and parsing
- **Monospace Editor**: Improved DDL input with syntax-friendly formatting

## Features

- **Query Interface**: Execute SQL queries against Web3DB with index-based optimization
- **Schema Management**:
  - **Form Builder**: User-friendly interface for creating table schemas
  - **SQL DDL Input**: Direct SQL CREATE TABLE statement input with validation
  - **Template Library**: Pre-built templates for common use cases
  - **View-Only**: Browse existing schemas with detailed column information
  - **Delete Capability**: Remove unwanted schemas
- **Policy Management**: Manage data access policies with wallet-based authentication
- **Web3 Integration**: Connect with MetaMask and other Web3 wallets
- **Responsive Design**: Works on desktop and mobile devices
- **Smart Contract Storage**: All schemas stored securely in blockchain smart contracts

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
