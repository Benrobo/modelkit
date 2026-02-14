import ReactDOM from "react-dom/client";
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";
import "./styles/globals.css";
import { mockModelKit } from "./mock-modelkit.js";
import { createApiModelKit } from "./api-modelkit.js";

const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
const modelKit = apiUrl ? createApiModelKit(apiUrl) : mockModelKit;

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <div className="min-h-screen">
      <ModelKitStudio modelKit={modelKit} theme="dark" />
    </div>
  );
}
