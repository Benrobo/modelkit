/**
 * Standalone IIFE entry — bundles React + everything.
 * Exposes a single mount() function on window.ModelKitStudioLib.
 */
import React from "react";
import { createRoot } from "react-dom/client";
import { ModelKitStudio } from "./index";

(window as any).ModelKitStudioLib = {
  mount(el: HTMLElement, apiUrl: string) {
    createRoot(el).render(React.createElement(ModelKitStudio, { apiUrl }));
  },
};
