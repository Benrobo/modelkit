# Changelog - modelkit

All notable changes to the ModelKit SDK will be documented in this file.

## [0.0.3] - 2026-02-15

### Breaking Changes

- **Router exports moved to subpath exports** to prevent importing unused peer dependencies
  - `createModelKitRouter` renamed to `createModelKitHonoRouter` and moved to `@benrobo/modelkit/hono`
  - `createModelKitExpressRouter` moved to `@benrobo/modelkit/express`
  - Main export no longer includes router functions

### Migration Guide

**Before:**
```typescript
import { createModelKit, createRedisAdapter, createModelKitRouter } from "@benrobo/modelkit";
```

**After (Hono):**
```typescript
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";
```

**After (Express):**
```typescript
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitExpressRouter } from "@benrobo/modelkit/express";
```

### Fixed

- Fixed peer dependency errors when using the SDK without installing both Express and Hono
- Users can now install only the framework they need (Hono or Express)

## [0.1.0] - 2026-02-14

### Added

- Initial release of ModelKit SDK
- Core configuration management system
- `defineConfig()` helper for type-safe configuration
- `createModelKit()` factory function
- `ModelKit` interface with comprehensive API
  - `getModel()` - Get current model ID
  - `getConfig()` - Get configuration with overrides
  - `setOverride()` - Set runtime overrides
  - `clearOverride()` - Remove overrides
  - `listOverrides()` - List all active overrides
  - `listFeatures()` - List all features
- Redis storage adapter with:
  - Automatic reconnection
  - Configurable key prefix
  - Support for Redis URLs with authentication
- Memory storage adapter for development
- Custom storage adapter interface
- Two-tier caching strategy:
  - In-memory cache with configurable TTL
  - Automatic cache invalidation on override changes
- Graceful fallback to static config when Redis unavailable
- Full TypeScript type definitions
- Comprehensive error handling

### Features

**Type Safety:**
- `FeatureConfig` - Base feature definition interface
- `ModelOverride` - Runtime override structure
- `StorageAdapter` - Storage backend interface
- `ModelKit` - Main client interface
- `ModelKitConfig` - Configuration interface

**Storage:**
- Redis adapter with ioredis
- Memory adapter with node-cache
- Pluggable storage system

**Caching:**
- Default 60-second TTL
- Configurable cache duration
- Automatic invalidation on updates

---

[0.1.0]: https://github.com/benaiah/modelkit/releases/tag/v0.1.0
