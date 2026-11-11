// Page functions for `browser.evaluate`: they run in the page, so they must not
// use anything from this module's scope.

export type SceneElement = {
  type: string;
  text?: string;
  strokeColor: string;
  strokeStyle: string;
};

// The editor's live scene. `window.h` is Excalidraw's test hook, present in dev builds.
export function liveScene(): SceneElement[] {
  return ((window as any).h?.elements ?? [])
    .filter((el: { isDeleted?: boolean }) => !el.isDeleted)
    .map(({ type, text, strokeColor, strokeStyle }: SceneElement) => ({
      type,
      // only text elements have text; undefined is not JSON-safe for evaluate
      ...(text === undefined ? {} : { text }),
      strokeColor,
      strokeStyle,
    }));
}

// What the app has saved to localStorage, which is what a reload restores.
export function savedScene(): SceneElement[] {
  return JSON.parse(localStorage.getItem("excalidraw") ?? "[]")
    .filter((el: { isDeleted?: boolean }) => !el.isDeleted)
    .map(({ type, text, strokeColor, strokeStyle }: SceneElement) => ({
      type,
      // only text elements have text; undefined is not JSON-safe for evaluate
      ...(text === undefined ? {} : { text }),
      strokeColor,
      strokeStyle,
    }));
}

// A compact, order-preserving summary for exact checks: "rectangle", "text:Hello".
export const kinds = (scene: SceneElement[]) =>
  scene.map((el) => (el.type === "text" ? `text:${el.text}` : el.type));
