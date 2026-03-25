import "./i18n.js";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase.js";

// const auth = getAuth(app);

// Wait for anonymous auth to complete before rendering anything
signInAnonymously(auth)
  .then(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        ReactDOM.createRoot(document.getElementById("root")).render(
          <React.StrictMode>
            <App />
          </React.StrictMode>,
        );
      }
    });
  })
  .catch((err) => console.error("Auth failed:", err));
