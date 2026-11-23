import { describe, expect, it } from "vitest";
import { bentoSpans } from "./bento";

const s = (...styles: string[]) => styles.map((style) => ({ style }) as { style: "featured" | "standard" | "compact" | "image" });

describe("bentoSpans", () => {
  it("featured e image ocupan 2 columnas; dos standard seguidos, 1 cada uno", () => {
    expect(bentoSpans(s("featured", "image", "standard", "standard"))).toEqual([2, 2, 1, 1]);
  });
  it("una tanda impar de standard estira el último para no dejar huecos", () => {
    expect(bentoSpans(s("featured", "standard"))).toEqual([2, 2]);
    expect(bentoSpans(s("standard", "standard", "standard"))).toEqual([1, 1, 2]);
  });
  it("una tanda de standard interrumpida se evalúa por separado", () => {
    expect(bentoSpans(s("standard", "image", "standard", "standard"))).toEqual([2, 2, 1, 1]);
  });
});
