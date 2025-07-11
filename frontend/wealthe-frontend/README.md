# Wealth Management Frontend

A React-based frontend application for wealth management with user authentication, dashboard, and navigation features.

## Features

- **User Authentication**: Login and registration with password hashing
- **Protected Routes**: Secure access to authenticated areas
- **Dashboard**: User information display and management
- **Sidebar Navigation**: Easy navigation between different sections
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Clean and professional interface with gradients and animations

## Tech Stack

- **React 19.1.0**: Frontend framework
- **React Router DOM**: Client-side routing
- **bcryptjs**: Password hashing
- **Plain CSS**: Styling with modern CSS features
- **Local Storage**: Token management

## API Integration

The frontend expects these backend endpoints:
- `POST /login` - User login
- `POST /register` - User registration  
- `GET /user_info` - Get authenticated user information



## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- A backend API with the above endpoints

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```


3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── AuthContext.js   # Authentication state management
│   ├── Layout.js        # Main layout with sidebar
│   ├── ProtectedRoute.js # Route protection
│   └── Sidebar.js       # Navigation sidebar
├── pages/               # Page components
│   ├── Login.js         # Login page
│   ├── Register.js      # Registration page
│   ├── Dashboard.js     # User dashboard
│   └── DummyPage.js     # Placeholder page
├── utils/               # Utilities
│   ├── api.js           # API calls
│   └── auth.js          # Auth utilities
└── App.js               # Main app with routing
```

## Authentication Flow

1. User registers/logs in through forms
2. Password is hashed client-side using bcryptjs
3. JWT token is stored in localStorage
4. Protected routes check authentication
5. User info is displayed in dashboard

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

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

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
