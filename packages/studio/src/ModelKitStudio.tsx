import type { ReactElement } from "react";
import type { ModelKit } from "modelkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cn } from "./utils/cn";
import { ModelKitProvider } from "./hooks/useModelKit";
import { useNavigation } from "./hooks/useNavigation";
import { Navigation } from "./components/Navigation";
import { FeatureList } from "./components/FeatureList";
import { FeatureDetail } from "./components/FeatureDetail";
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
  modelKit: ModelKit;
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
}: Omit<ModelKitStudioProps, "modelKit">): ReactElement {
  const { view, selectedFeatureId, goToList, goToDetail } = useNavigation();
  const resolvedTheme = resolveTheme(theme, themeBase);
  const themeVars = themeToCssVars(resolvedTheme);

  return (
    <div
      className={cn(
        "modelkit-studio min-h-screen bg-mk-background text-mk-text selection:bg-mk-primary/30",
        className,
      )}
      style={themeVars}
      data-theme={typeof theme === "string" ? theme : "custom"}
    >
      <Navigation
        showBack={view === "detail"}
        onBack={view === "detail" ? goToList : undefined}
        className={classNames.header}
      />
      <main
        className={cn(
          "max-w-5xl mx-auto px-mk-lg pb-mk-xl space-y-mk-xl transition-all duration-300 relative z-10",
          classNames.container,
        )}
      >
        {view === "list" && (
          <FeatureList
            onSelectFeature={goToDetail}
            className={classNames.featureList}
          />
        )}
        {view === "detail" && selectedFeatureId && (
          <FeatureDetail
            featureId={selectedFeatureId}
            onBack={goToList}
            className={classNames.featureCard}
          />
        )}
      </main>
    </div>
  );
}

/** ModelKit Studio root component. Props are type-safe; use IDE autocomplete for theme, classNames, etc. */
export function ModelKitStudio({
  modelKit,
  theme = "dark",
  themeBase = "dark",
  className,
  classNames = {},
  queryClient,
}: ModelKitStudioProps): ReactElement {
  const client = queryClient ?? defaultQueryClient;
  return (
    <QueryClientProvider client={client}>
      <ModelKitProvider modelKit={modelKit}>
        <ModelKitStudioInner
          theme={theme}
          themeBase={themeBase}
          className={className}
          classNames={classNames}
        />
      </ModelKitProvider>
    </QueryClientProvider>
  );
}
