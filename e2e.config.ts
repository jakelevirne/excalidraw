import { existsSync } from "node:fs";

import { web } from "@e2e-dev/web";
import { openai } from "@ai-sdk/openai";

import type { E2EConfig } from "e2e";

// Agent steps use the team's OpenAI API key, OPENAI_API_KEY: from the gitignored .env.local
// on a dev machine, or from the environment in CI (a repository secret).
if (existsSync(".env.local")) {
  process.loadEnvFile(".env.local");
}

// A typed const rather than `satisfies E2EConfig`: the repo's Prettier (2.6) can't parse `satisfies`.
const config: E2EConfig = {
  agents: {
    default: {
      model: openai("gpt-6-luna"),
      system: "You are a thorough QA agent. Verify every outcome.",
      context:
        "Excalidraw is a whiteboard app. Shapes are drawn on an HTML canvas, so they have no DOM nodes: " +
        "pick a tool in the top toolbar (Rectangle, Diamond, Ellipse, Arrow, Line, Draw, Text), then drag on the canvas. " +
        "In a text box, Enter adds a new line; press Escape to finish editing the text.",
    },
  },
  // Keep a trace page (.e2e/results/<test>/trace.md) and a video (attempt-<n>/video/video.webm) for every test, passing ones too.
  trace: "on",
  video: "on",
  targets: [
    {
      engine: web(),
      app: {
        // Port 0 takes a free port, so runs never collide with a `yarn start` already on :3001.
        url: "http://127.0.0.1:0",
        command: {
          executable: "node",
          args: [
            "../node_modules/vite/bin/vite.js",
            "--host",
            "127.0.0.1",
            "--port",
            "{port}",
            "--strictPort",
          ],
          cwd: "excalidraw-app",
          // BROWSER=none stops vite's `server.open` from launching a browser window.
          env: { BROWSER: "none" },
          startupTimeout: 120_000,
          log: ".e2e/logs/app.log",
        },
      },
    },
  ],
};

export default config;
