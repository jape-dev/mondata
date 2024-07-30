import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker";
import { PostHogProvider } from "posthog-js/react";

const options = {
  api_host: process.env.REACT_APP_PUBLIC_POSTHOG_HOST,
};

const root = createRoot(document.getElementById("root"));
root.render(
  <PostHogProvider
    apiKey={process.env.REACT_APP_PUBLIC_POSTHOG_KEY}
    options={options}
  >
    <App />
  </PostHogProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
