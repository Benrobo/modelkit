# Release Notes

## v0.0.6 — Studio auto-serve, UI redesign, mobile support

### What's new

#### Studio served automatically by the SDK router

Studio no longer requires a separate React app or any additional packages. Mount the Hono or Express router and Studio is available immediately at `/studio` — no extra config, no installs.

```typescript
app.route("/api/modelkit", createModelKitHonoRouter(modelKit));
// Studio → http://localhost:3000/api/modelkit/studio
```

**How it works:** The Studio UI (React + all dependencies) is compiled to a self-contained IIFE bundle at SDK build time (`bun scripts/bundle-studio.ts`) and baked into the SDK as a TypeScript string constant. At runtime the router injects the API URL and returns the complete HTML. No filesystem reads, no CDN, no React install required in your app.

#### New router options

Both `createModelKitHonoRouter` and `createModelKitExpressRouter` now accept:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `studio` | `boolean` | `true` | Serve the Studio UI |
| `studioPath` | `string` | `"/studio"` | Path to serve Studio at, relative to mount point |
| `cors` | `boolean \| CorsOptions` | — | CORS config (Hono only) |

```typescript
createModelKitHonoRouter(modelKit, { studio: false })           // disable
createModelKitHonoRouter(modelKit, { studioPath: "/admin/ui" }) // custom path
```

#### Studio UI redesign

The Studio UI has been fully redesigned with a minimalist, Linear-inspired aesthetic:

- Replaced cyan sci-fi palette with violet primary (`#7c3aed`) on a near-black background
- Removed grid backgrounds, glow effects, and sharp corners
- Switched to Inter Variable as the body font; JetBrains Mono now used only for code and IDs
- Consistent 4–8px border radius throughout
- Custom icon set (HugeIcons Pro duotone-rounded) replacing all inline SVGs

#### Mobile responsiveness

Studio now works on mobile. The sidebar becomes a slide-in drawer on small screens, triggered by a menu icon in the header. A backdrop overlay closes it when you tap outside.

#### React component still available

`@benrobo/modelkit-studio` (`v0.0.6`) is still published for teams that want to embed Studio inside an existing React application:

```tsx
import { ModelKitStudio } from "@benrobo/modelkit-studio";
import "@benrobo/modelkit-studio/styles";

<ModelKitStudio apiUrl="http://localhost:3000/api/modelkit" theme="dark" />
```

### Migration guide

No breaking changes. If you were previously running a separate Studio frontend, you can remove it — just visit `/<your-mount-path>/studio` and the SDK router serves it directly.

---

## v0.0.5 and earlier

Core SDK, Redis/in-memory adapters, Hono and Express routers, type-safe feature IDs, `modelkit-generate` CLI, Studio React component.
