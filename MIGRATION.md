# Migration Guide: v0.0.2 → v0.0.3

## Breaking Changes

Version 0.0.3 introduces a breaking change to how routers are imported to fix peer dependency issues.

### Problem in v0.0.2

When importing `@benrobo/modelkit`, both Express and Hono were being loaded even if you only used one framework. This caused errors like:

```
Error: Cannot find package 'express' imported from node_modules/@benrobo/modelkit/dist/index.js
```

or

```
Error: Cannot find package 'hono' imported from node_modules/@benrobo/modelkit/dist/index.js
```

### Solution in v0.0.3

Routers are now exported as **subpath exports**, meaning they're only loaded when explicitly imported.

---

## How to Migrate

### For Hono Users

**Before (v0.0.2):**
```typescript
import {
  createModelKit,
  createRedisAdapter,
  createModelKitRouter
} from "@benrobo/modelkit";

const app = new Hono();
app.route("/api/modelkit", createModelKitRouter(modelKit));
```

**After (v0.0.3):**
```typescript
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitHonoRouter } from "@benrobo/modelkit/hono";

const app = new Hono();
app.route("/api/modelkit", createModelKitHonoRouter(modelKit));
```

**Changes:**
1. Remove `createModelKitRouter` from main import
2. Add new import: `import { createModelKitHonoRouter } from "@benrobo/modelkit/hono"`
3. Rename function call: `createModelKitRouter` → `createModelKitHonoRouter`

---

### For Express Users

**Before (v0.0.2):**
```typescript
import {
  createModelKit,
  createRedisAdapter,
  createModelKitExpressRouter
} from "@benrobo/modelkit";

const app = express();
app.use("/api/modelkit", createModelKitExpressRouter(modelKit));
```

**After (v0.0.3):**
```typescript
import { createModelKit, createRedisAdapter } from "@benrobo/modelkit";
import { createModelKitExpressRouter } from "@benrobo/modelkit/express";

const app = express();
app.use("/api/modelkit", createModelKitExpressRouter(modelKit));
```

**Changes:**
1. Remove `createModelKitExpressRouter` from main import
2. Add new import: `import { createModelKitExpressRouter } from "@benrobo/modelkit/express"`
3. Function name stays the same: `createModelKitExpressRouter`

---

## What's Not Affected

These imports remain **unchanged**:

```typescript
// Core functionality - no changes needed ✅
import {
  createModelKit,
  createRedisAdapter,
  createInMemoryAdapter
} from "@benrobo/modelkit";

// Types - no changes needed ✅
import type {
  ModelKit,
  ModelOverride,
  StorageAdapter,
  ModelId,
  OpenRouterModelId
} from "@benrobo/modelkit";
```

---

## Benefits of This Change

1. **No more peer dependency errors** - Only install the framework you actually use
2. **Smaller bundle size** - Unused routers aren't bundled into your app
3. **Clearer separation** - Router implementations are framework-specific
4. **Better naming** - `createModelKitHonoRouter` is more explicit than `createModelKitRouter`

---

## Installation Notes

After upgrading to v0.0.3:

**For Hono users:**
```bash
npm install @benrobo/modelkit hono
# Express is NOT needed ✅
```

**For Express users:**
```bash
npm install @benrobo/modelkit express
# Hono is NOT needed ✅
```

Both frameworks remain **optional peer dependencies**, so you only install what you need.

---

## Need Help?

- [GitHub Issues](https://github.com/benrobo/modelkit/issues)
- [Documentation](https://github.com/benrobo/modelkit#readme)
- [API Reference](./packages/sdk/README.md)
