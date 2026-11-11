import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { kinds, liveScene, savedScene } from "./scene";

// Excalidraw's core flow: draw on the canvas, and the drawing survives a reload
// because the app saves the scene to localStorage["excalidraw"].
// The title names the flow, not the verdict: every agent judgment reads it, and a
// judge asked to confirm "survives a reload" from one screenshot answers inconclusive.
// The reload itself is pinned by the exact `saved`/`loaded` checks.
test("drawing a rectangle and a text label", async ({
  app,
  agent,
  browser,
  screen,
}) => {
  const saved = async () => kinds(await browser.evaluate(savedScene));
  const loaded = async () => kinds(await browser.evaluate(liveScene));

  await app.open("/");

  await agent.act("draw a rectangle on the canvas");
  await expect.poll(saved).toEqual(["rectangle"]);

  // Deselect the new rectangle first. While it is selected, Excalidraw shows a hint
  // that names Cmd on a Mac and Ctrl on Linux, and a recording anchored on that hint
  // would not replay in CI.
  await browser.keyboard.press("Escape");
  await expect(
    screen.getByRole("heading", "Selected shape actions"),
  ).toBeHidden();

  await agent.act("add the text {text} on the canvas, below the rectangle", {
    params: { text: "Hello e2e" },
  });
  await expect.poll(saved).toEqual(["rectangle", "text:Hello e2e"]);

  await browser.reload();
  await expect.poll(loaded).toEqual(["rectangle", "text:Hello e2e"]);
  await agent.assert('the canvas shows a rectangle and the text "Hello e2e"', {
    vision: "only",
  });
});
