# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-02-14

### Added

- Initial release of ModelKit
- Core SDK (`modelkit`) for type-safe AI model configuration management
- React Studio UI (`@modelkit/studio`) for visual configuration management
- Redis and in-memory storage adapters
- Runtime override system with zero-downtime updates
- Two-tier caching strategy (in-memory + Redis)
- Comprehensive TypeScript type definitions
- Theme system with light, dark, and custom themes
- OpenRouter integration for 200+ AI model catalog
- Model parameter editor (temperature, maxTokens, topP, topK)
- Feature list and detail views
- Override indicator system
- Graceful fallback when Redis unavailable
- Full documentation and examples

### Features

**SDK (`modelkit`):**
- `defineConfig()` - Type-safe configuration helper
- `createModelKit()` - Factory function for ModelKit instances
- `getModel()` - Retrieve current model ID with overrides
- `getConfig()` - Get full configuration with overrides applied
- `setOverride()` - Set runtime overrides for any parameter
- `clearOverride()` - Remove overrides and revert to base config
- `listOverrides()` - List all active overrides
- `listFeatures()` - List all configured features
- Redis storage adapter with automatic reconnection
- Memory storage adapter for development
- Custom storage adapter support

**Studio (`@modelkit/studio`):**
- `<ModelKitStudio />` - Main React component
- Light and dark theme presets
- Custom theme override system with deep partial support
- OpenRouter model selector with search and grouping
- Parameter editor with validation
- Live updates via TanStack Query
- Keyboard navigation support
- Responsive design
- className override system for customization
- CSS variable-based theming

### Changed

- N/A (initial release)

### Deprecated

- N/A (initial release)

### Removed

- N/A (initial release)

### Fixed

- N/A (initial release)

### Security

- N/A (initial release)

---

## [Unreleased]

### Planned

- Webhook support for configuration change notifications
- Audit log for override history
- Role-based access control for Studio UI
- GraphQL API adapter
- PostgreSQL storage adapter
- Metrics and analytics dashboard
- Import/export configuration feature
- Bulk override operations
- Configuration versioning and rollback

---

[0.1.0]: https://github.com/benaiah/modelkit/releases/tag/v0.1.0
[Unreleased]: https://github.com/benaiah/modelkit/compare/v0.1.0...HEAD
