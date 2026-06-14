import { describe, it, expect } from "vitest";
import { parseBingoInput } from "../core/parser";

describe("Bingo Pasted Text Parser", () => {
  it("should parse 25 standard comma-separated numbers correctly", () => {
    const input = Array.from({ length: 25 }, (_, i) => String(i + 1)).join(",");
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(false);
    expect(result.count).toBe(25);
    expect(result.parsed[0]).toBe("01");
    expect(result.parsed[9]).toBe("10");
    expect(result.parsed[24]).toBe("25");
  });

  it("should parse tab, space, and newline separated numbers", () => {
    const input =
      "1\t2  3\n4,5 6;7.8/9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25";
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(false);
    expect(result.count).toBe(25);
    expect(result.parsed[0]).toBe("01");
    expect(result.parsed[24]).toBe("25");
  });

  it("should prepends single-digits with a zero and convert negative to positive", () => {
    const input =
      "-5 -9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 -1";
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(false);
    expect(result.parsed[0]).toBe("05");
    expect(result.parsed[1]).toBe("09");
    expect(result.parsed[24]).toBe("01");
  });

  it("should handle underflow: less than 25 numbers", () => {
    const input = "1 2 3 4 5";
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(true);
    expect(result.count).toBe(5);
    expect(result.parsed[0]).toBe("01");
    expect(result.parsed[4]).toBe("05");
    // remaining should be empty strings
    expect(result.parsed[5]).toBe("");
    expect(result.parsed[24]).toBe("");
  });

  it("should handle overflow: more than 25 numbers", () => {
    const input = Array.from({ length: 30 }, (_, i) => String(i + 1)).join(" ");
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(true);
    expect(result.count).toBe(30);
    expect(result.parsed.length).toBe(25);
    expect(result.parsed[24]).toBe("25");
  });

  it("should handle completely empty or invalid text", () => {
    const input = "abc def ghi";
    const result = parseBingoInput(input);
    expect(result.hasWarning).toBe(true);
    expect(result.count).toBe(0);
    expect(result.parsed).toEqual(Array(25).fill(""));
  });
});
