# Changelog - @modelkit/studio

All notable changes to the ModelKit Studio UI will be documented in this file.

## [0.1.0] - 2026-02-14

### Added

- Initial release of ModelKit Studio
- `<ModelKitStudio />` main component
- Theme system:
  - Dark theme (default)
  - Light theme
  - Custom theme override support with deep partial
  - CSS variable-based theming (`--mk-*` prefix)
- Feature list view:
  - Grid layout of all features
  - Override indicators
  - "Add feature config" button (when supported)
- Feature detail view:
  - Model selector with OpenRouter integration
  - Parameter editor (temperature, maxTokens)
  - Save and clear override actions
  - Loading states
- Model selector component:
  - Search functionality
  - Group by provider
  - 200+ models from OpenRouter
  - Context length display
  - Custom model ID support
- Navigation component:
  - Back button for detail view
  - Dynamic title
- OpenRouter API integration:
  - Live model catalog fetching
  - Model metadata (name, provider, context length, pricing)
- TanStack Query integration:
  - Real-time updates
  - Optimistic updates
  - Query invalidation
- Hooks system:
  - `useModelKit` - Access ModelKit instance
  - `useFeatures` - List features
  - `useOverrides` - Manage overrides
  - `useNavigation` - Client-side routing
  - `useAvailableModels` - OpenRouter model catalog
- Customization:
  - `className` prop for root container
  - `classNames` prop for per-component styling
  - Custom QueryClient support
- Accessibility:
  - Keyboard navigation
  - ARIA labels
  - Semantic HTML
- Type safety:
  - Full TypeScript support
  - Exported prop types
  - Theme type definitions
  - Fixed FC pattern issue for better IDE autocomplete

### Features

**Components:**
- ModelKitStudio - Root component
- Navigation - Header with back button
- FeatureList - Grid of features
- FeatureCard - Individual feature card
- FeatureDetail - Edit feature view
- ModelSelector - Searchable model dropdown
- ParameterEditor - Temperature and maxTokens inputs
- OverrideIndicator - Visual override status
- CreateFeatureForm - Add new features (optional)

**Styling:**
- Tailwind CSS v4 integration
- PostCSS processing
- Inter Variable font
- JetBrains Mono Variable font
- Responsive design
- Dark mode optimized

---

[0.1.0]: https://github.com/benaiah/modelkit/releases/tag/v0.1.0
