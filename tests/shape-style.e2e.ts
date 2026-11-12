import { test } from "@e2e-dev/web";
import { expect } from "e2e";

import { liveScene } from "./scene";

// The scene checks pin the exact values. The pressed swatch and checked radio checks
// read the accessible state a screen reader gets, and they confirm each step for the
// replay cache, which expect.poll alone does not.
test("changing a rectangle's stroke color and style", async ({
  app,
  agent,
  browser,
  screen,
}) => {
  const rectangle = async () =>
    (await browser.evaluate(liveScene)).find((el) => el.type === "rectangle");

  await app.open("/");

  await agent.act("draw a rectangle on the canvas");
  await expect.poll(rectangle).toMatchObject({ strokeStyle: "solid" });
  await expect(screen.getByRole("radio", "Solid")).toBeChecked();

  await agent.act("make the rectangle's stroke red");
  // #e03131 is the red in Excalidraw's stroke color palette; swatches are named by color.
  await expect.poll(rectangle).toMatchObject({ strokeColor: "#e03131" });
  await expect(
    screen.getByRole("button", "#e03131", { pressed: true }),
  ).toBeVisible();

  await agent.act("set the rectangle's stroke style to Dashed");
  await expect
    .poll(rectangle)
    .toMatchObject({ strokeColor: "#e03131", strokeStyle: "dashed" });
  await expect(screen.getByRole("radio", "Dashed")).toBeChecked();
});
