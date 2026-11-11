import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { kinds, liveScene } from "./scene";

// Goals name the on-screen Undo/Redo buttons, not shortcuts: recordings made on a Mac
// replay on Linux in CI, where a recorded Cmd+Z would not undo.
// The exact scene checks pin each outcome; the Undo/Redo button checks also confirm
// each step for the replay cache, which expect.poll alone does not.
test("undoing and redoing a drawing", async ({
  app,
  agent,
  browser,
  screen,
}) => {
  const scene = async () => kinds(await browser.evaluate(liveScene));

  await app.open("/");

  await agent.act("draw an ellipse on the canvas");
  await expect.poll(scene).toEqual(["ellipse"]);
  await expect(screen.getByTestId("button-undo")).toBeEnabled();

  await agent.act("undo the last change with the Undo button");
  await expect.poll(scene).toEqual([]);
  await expect(screen.getByTestId("button-undo")).toBeDisabled();

  await agent.act("redo the change with the Redo button");
  await expect.poll(scene).toEqual(["ellipse"]);
  await expect(screen.getByTestId("button-redo")).toBeDisabled();
});
