import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { liveScene } from "./scene";

// Mermaid conversion runs in the browser (no backend), so this covers the
// Mermaid to Excalidraw dialog end to end.
test("converting a Mermaid flowchart into shapes", async ({
  app,
  agent,
  browser,
  screen,
}) => {
  const mermaid = "flowchart LR\n  Start --> Finish";

  await app.open("/");

  await agent.act(
    "open the Mermaid to Excalidraw dialog and replace its Mermaid syntax with {mermaid}",
    { params: { mermaid } },
  );
  await expect(screen.getByRole("dialog")).toContainText("Start --> Finish");

  await agent.act("insert the diagram into the canvas");
  // Not getByRole("dialog"): once shapes are selected, the side panel's color
  // pickers are dialogs too. The Mermaid dialog's Insert button is gone, and the
  // inserted shapes are selected.
  await expect(screen.getByRole("button", "Insert")).toBeHidden();
  await expect(
    screen.getByRole("heading", "Selected shape actions"),
  ).toBeVisible();
  await expect
    .poll(async () => {
      const scene = await browser.evaluate(liveScene);
      return {
        boxes: scene.filter((el) => el.type === "rectangle").length,
        arrows: scene.filter((el) => el.type === "arrow").length,
        labels: scene
          .filter((el) => el.type === "text")
          .map((el) => el.text)
          .sort(),
      };
    })
    .toEqual({ boxes: 2, arrows: 1, labels: ["Finish", "Start"] });
});
