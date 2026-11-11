import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { liveScene } from "./scene";

// The color and dash-style steps run live on every run: Excalidraw's color swatches
// expose no pressed state and its stroke-style radios have no accessible name, so the
// replay cache sees nothing it could check after them ("nothing recorded").
test("changing a rectangle's stroke color and style", async ({
  app,
  agent,
  browser,
}) => {
  // The stroke style radios have no test id; their label's title names the option.
  const strokeStyle = (name: string) =>
    browser.locator(`label[title="${name}"] input[type="radio"]`);
  const rectangle = async () =>
    (await browser.evaluate(liveScene)).find((el) => el.type === "rectangle");

  await app.open("/");

  await agent.act("draw a rectangle on the canvas");
  await expect.poll(rectangle).toMatchObject({ strokeStyle: "solid" });
  await expect(strokeStyle("Solid")).toBeChecked();

  await agent.act("make the rectangle's stroke red");
  // #e03131 is the red in Excalidraw's stroke color palette.
  await expect.poll(rectangle).toMatchObject({ strokeColor: "#e03131" });

  await agent.act("set the rectangle's stroke style to Dashed");
  await expect
    .poll(rectangle)
    .toMatchObject({ strokeColor: "#e03131", strokeStyle: "dashed" });
  await expect(strokeStyle("Dashed")).toBeChecked();
});
