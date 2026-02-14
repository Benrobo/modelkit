import ReactDOM from "react-dom/client";
import { ModelKitStudio } from "@modelkit/studio";
import "@modelkit/studio/styles";
import "./styles/globals.css";

const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3456/api/modelkit";

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <div className="min-h-screen">
      <ModelKitStudio apiUrl={apiUrl} theme={"light"} />
    </div>
  );
}
