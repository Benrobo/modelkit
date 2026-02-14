import ReactDOM from "react-dom/client";
import { ModelKitStudio, type StudioThemeOverride } from "@benrobo/modelkit-studio";
import "@benrobo/modelkit-studio/styles";
import "./styles/globals.css";

const apiUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3456/api/modelkit";

// Define custom theme with type-safe autocomplete
const customTheme: StudioThemeOverride = {
  colors: {
    primary: "#ff00ff",
    background: "#000000",
  },
};

const rootEl = document.getElementById("root");
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <div className="min-h-screen">
      <ModelKitStudio apiUrl={apiUrl} theme={"choco"} />
    </div>
  );
}
