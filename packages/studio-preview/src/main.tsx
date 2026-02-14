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
    <div className="min-h-screen bg-gray-950 p-8">
      <h1 className="text-3xl font-bold text-white mb-8">
        ModelKit Studio Preview
        {apiUrl ? " (API)" : " (mock)"}
      </h1>
      <ModelKitStudio modelKit={modelKit} theme="dark" />
    </div>
  );
}
