import type { ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { cn } from "./utils/cn";
import { ModelKitApiProvider } from "./hooks/useModelKitApi";
import { useNavigation } from "./hooks/useNavigation";
import { Navigation } from "./components/Navigation";
import { FeatureList } from "./components/FeatureList";
import { FeatureDetail } from "./components/FeatureDetail";
import { TacticalPanel } from "./components/TacticalPanel";
import { resolveTheme, themeToCssVars } from "./themes/themeUtils";
import type { StudioThemeOverride } from "./themes";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
    },
  },
});

export type ThemeMode = "light" | "dark";

export interface ClassNameOverrides {
  container?: string;
  header?: string;
  featureList?: string;
  featureCard?: string;
  featureHeader?: string;
  defaultBadge?: string;
  overrideBadge?: string;
  modelSelector?: string;
  parameterInput?: string;
  button?: string;
  buttonPrimary?: string;
  buttonSecondary?: string;
  overrideIndicator?: string;
}

export interface ModelKitStudioProps {
  /** API base URL for ModelKit router (e.g. "/api/modelkit" or "http://localhost:3456/api/modelkit") */
  apiUrl: string;
  /**
   * Theme: preset "dark" | "light", or a type-safe partial override.
   * Override only what you need (e.g. { colors: { primary: "#ff00ff" } } or
   * { interactive: { primaryHover: "..." } }). Merged with the "dark" preset by default.
   */
  theme?: ThemeMode | StudioThemeOverride;
  /** Base preset to merge onto when theme is a custom object. Default "dark". */
  themeBase?: ThemeMode;
  className?: string;
  classNames?: ClassNameOverrides;
  /** Optional: provide your own QueryClient (e.g. for SSR or shared cache). */
  queryClient?: QueryClient;
}

function ModelKitStudioInner({
  theme = "dark",
  themeBase = "dark",
  className,
  classNames = {},
}: Omit<ModelKitStudioProps, "apiUrl">): ReactElement {
  const { selectedFeatureId, goToList, goToDetail } = useNavigation();
  const resolvedTheme = resolveTheme(theme, themeBase);
  const themeVars = themeToCssVars(resolvedTheme);

  return (
    <div
      className={cn(
        "modelkit-studio min-h-screen bg-mk-background text-mk-text selection:bg-mk-primary/30 flex flex-col",
        className,
      )}
      style={themeVars}
      data-theme={typeof theme === "string" ? theme : "custom"}
    >
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "var(--mk-color-surface)",
            color: "var(--mk-color-text)",
            border: "1px solid var(--mk-color-border)",
            fontFamily: "JetBrains Mono, monospace",
          },
        }}
      />
      <Navigation
        showBack={false}
        className={classNames.header}
        title="ModelKit Studio"
      />

      <main className="flex-1 flex flex-col md:flex-row max-w-screen-2xl mx-auto w-full px-mk-lg pb-mk-xl gap-mk-xl overflow-hidden">
        {/* Sidebar: Feature List */}
        <TacticalPanel className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col border border-mk-border bg-mk-surface overflow-hidden">
          <FeatureList
            onSelectFeature={goToDetail}
            className={cn("p-4", classNames.featureList)}
          />
        </TacticalPanel>

        {/* Main Content: Feature Detail */}
        <section className="flex-1 min-w-0 relative">
          {selectedFeatureId ? (
            <div
              key={selectedFeatureId}
              className="animate-in fade-in slide-in-from-right-4 duration-500 h-full"
            >
              <FeatureDetail
                featureId={selectedFeatureId}
                onBack={goToList}
                className={classNames.featureCard}
              />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-mk-text-muted border border-mk-border border-dashed p-mk-xl">
              <div className="text-sm uppercase tracking-wider text-center">
                Select a configuration from the registry
                <br />
                to begin editing
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

/** ModelKit Studio root component. Props are type-safe; use IDE autocomplete for theme, classNames, etc. */
export function ModelKitStudio({
  apiUrl,
  theme = "dark",
  themeBase = "dark",
  className,
  classNames = {},
  queryClient,
}: ModelKitStudioProps): ReactElement {
  const client = queryClient ?? defaultQueryClient;
  return (
    <QueryClientProvider client={client}>
      <ModelKitApiProvider apiUrl={apiUrl}>
        <NuqsAdapter>
          <ModelKitStudioInner
            theme={theme}
            themeBase={themeBase}
            className={className}
            classNames={classNames}
          />
        </NuqsAdapter>
      </ModelKitApiProvider>
    </QueryClientProvider>
  );
}
