import { useState, useEffect, type ReactElement } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { Toaster } from "sonner";
import { cn } from "./utils/cn";
import { ModelKitApiProvider } from "./hooks/useModelKitApi";
import { useNavigation } from "./hooks/useNavigation";
import { Navigation } from "./components/Navigation";
import { FeatureList } from "./components/FeatureList";
import { FeatureDetail } from "./components/FeatureDetail";
import { ThemeSelector } from "./components/ThemeSelector";
import { resolveTheme, themeToCssVars } from "./themes/themeUtils";
import { SparklesIcon, LayersIcon } from "./components/Icons";
import type { StudioThemeOverride } from "./themes";

const THEME_STORAGE_KEY = "modelkit-studio-theme";

const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export type ThemeMode =
  | "light"
  | "dark"
  | "choco"
  | "ocean"
  | "sunset"
  | "forest"
  | "purple"
  | "crimson"
  | "cyan"
  | "amber";

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
  apiUrl: string;
  theme?: ThemeMode | StudioThemeOverride;
  themeBase?: ThemeMode;
  className?: string;
  classNames?: ClassNameOverrides;
  queryClient?: QueryClient;
}

function ModelKitStudioInner({
  theme: initialTheme = "dark",
  themeBase = "dark",
  className,
  classNames = {},
}: Omit<ModelKitStudioProps, "apiUrl">): ReactElement {
  const isThemeMode = typeof initialTheme === "string";
  const { selectedFeatureId, goToList, goToDetail } = useNavigation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [currentTheme, setCurrentTheme] = useState<ThemeMode>(() => {
    if (!isThemeMode) return "dark";
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved && (saved as ThemeMode)) return saved as ThemeMode;
    } catch (e) {}
    return initialTheme;
  });

  useEffect(() => {
    if (isThemeMode) {
      try { localStorage.setItem(THEME_STORAGE_KEY, currentTheme); } catch (e) {}
    }
  }, [currentTheme, isThemeMode]);

  // Close sidebar drawer when a feature is selected on mobile
  useEffect(() => {
    if (selectedFeatureId) setSidebarOpen(false);
  }, [selectedFeatureId]);

  const theme = isThemeMode ? currentTheme : initialTheme;
  const resolvedTheme = resolveTheme(theme, themeBase);
  const themeVars = themeToCssVars(resolvedTheme);

  return (
    <div
      className={cn(
        "modelkit-studio mk:h-screen mk:overflow-hidden mk:bg-mk-background mk:text-mk-text mk:selection:bg-mk-primary/20 mk:selection:text-mk-text mk:flex mk:flex-col",
        className
      )}
      style={themeVars}
      data-theme={typeof theme === "string" ? theme : "custom"}
    >
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "var(--mk-color-surface-raised)",
            color: "var(--mk-color-text)",
            border: "1px solid var(--mk-color-border)",
            fontFamily: "var(--mk-font-body)",
            fontSize: "13px",
            borderRadius: "var(--mk-border-radius-md)",
          },
        }}
      />

      <Navigation
        showBack={false}
        className={classNames.header}
        title="ModelKit Studio"
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        actions={
          isThemeMode ? (
            <ThemeSelector
              currentTheme={currentTheme}
              onThemeChange={setCurrentTheme}
            />
          ) : undefined
        }
      />

      <div className="mk:flex-1 mk:min-h-0 mk:flex mk:overflow-hidden mk:relative">
        {/* Mobile backdrop */}
        {sidebarOpen && (
          <div
            className="mk:fixed mk:inset-0 mk:z-30 mk:bg-black/50 mk:md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — drawer on mobile, fixed on desktop */}
        <aside
          className={cn(
            "mk:flex mk:flex-col mk:border-r mk:border-mk-border mk:bg-mk-surface mk:overflow-hidden mk:shrink-0",
            // Desktop: always visible
            "mk:hidden mk:md:flex mk:w-64",
            // Mobile: fixed drawer, slides in
            sidebarOpen &&
              "mk:flex! mk:fixed mk:inset-y-0 mk:left-0 mk:w-72 mk:z-40 mk:top-12"
          )}
        >
          <FeatureList
            onSelectFeature={goToDetail}
            className={classNames.featureList}
          />
        </aside>

        {/* Main panel */}
        <main className="mk:flex-1 mk:min-w-0 mk:overflow-hidden mk:bg-mk-background">
          {selectedFeatureId ? (
            <div
              key={selectedFeatureId}
              className="mk:h-full mk:animate-in mk:fade-in mk:duration-200"
            >
              <FeatureDetail
                featureId={selectedFeatureId}
                onBack={goToList}
                className={classNames.featureCard}
              />
            </div>
          ) : (
            <div className="mk:h-full mk:flex mk:flex-col mk:items-center mk:justify-center mk:gap-4 mk:select-none mk:px-6">
              <div className="mk:flex mk:flex-col mk:items-center mk:gap-3 mk:text-center">
                <div className="mk:w-12 mk:h-12 mk:rounded-xl mk:border mk:border-mk-border mk:flex mk:items-center mk:justify-center mk:bg-mk-surface">
                  <LayersIcon size={20} className="mk:text-mk-text-muted" />
                </div>
                <div>
                  <p className="mk:text-sm mk:font-medium mk:text-mk-text-secondary mk:mb-1">
                    No override selected
                  </p>
                  <p className="mk:text-xs mk:text-mk-text-muted mk:max-w-xs">
                    Select an override from the sidebar to inspect and edit its configuration.
                  </p>
                </div>
                {/* Mobile hint */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="mk:md:hidden mk:flex mk:items-center mk:gap-2 mk:px-4 mk:py-2 mk:rounded-md mk:text-sm mk:text-mk-text-secondary mk:border mk:border-mk-border mk:hover:bg-mk-surface mk:transition-colors mk:mt-1"
                >
                  <SparklesIcon size={14} className="mk:text-mk-primary" />
                  View overrides
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

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
