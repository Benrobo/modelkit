# ModelKit Studio Preview

Dev app for the Studio component. Uses mock or the example API server.

## See studio changes without restarting

1. **From repo root**, run both in one go:
   ```bash
   bun run dev
   ```
   This starts the **studio** in watch mode (rebuilds on change) and the **preview** dev server.

2. Or run in two terminals:
   - Terminal 1: `cd packages/studio && bun run dev` (watch build)
   - Terminal 2: `cd packages/studio-preview && bun run dev`

When you edit files in `packages/studio`, the studio rebuilds and the preview **reloads automatically** (no need to stop/restart the preview). The preview is configured to watch the linked `@modelkit/studio` package.

## With real API

```bash
# Terminal 1: example API server
bun run --filter modelkit-api-server dev

# Terminal 2: preview pointed at API
VITE_API_URL=http://localhost:3456 bun run --filter @modelkit/studio-preview dev
```

Then open http://localhost:3480.
