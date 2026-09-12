import { describe, test, expect } from "vitest";
import { formatEUR } from "./format.js";

describe("formatEUR", () => {
  test("formats whole euros", () => {
    expect(formatEUR(1800)).toBe("€18.00");
  });

  test("formats cents that aren't a round euro amount", () => {
    expect(formatEUR(2550)).toBe("€25.50");
  });

  test("treats missing/undefined as zero", () => {
    expect(formatEUR(undefined)).toBe("€0.00");
  });

  test("formats zero", () => {
    expect(formatEUR(0)).toBe("€0.00");
  });
});
