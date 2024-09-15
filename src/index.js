import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as serviceWorker from "./serviceWorker";
import * as Sentry from "@sentry/react";

const dsn = process.env.REACT_APP_SENTRY_DSN;

Sentry.init({
  dsn: dsn,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.browserProfilingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", process.env.REACT_APP_DOMAIN_URL],
  // Set profilesSampleRate to 1.0 to profile every transaction.
  // Since profilesSampleRate is relative to tracesSampleRate,
  // the final profiling rate can be computed as tracesSampleRate * profilesSampleRate
  // For example, a tracesSampleRate of 0.5 and profilesSampleRate of 0.5 would
  // results in 25% of transactions being profiled (0.5*0.5=0.25)
  profilesSampleRate: 1.0,
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});


const root = createRoot(document.getElementById("root"));
root.render(<App />);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
