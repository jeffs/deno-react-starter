import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./App.tsx";

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
