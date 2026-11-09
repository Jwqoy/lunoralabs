/**
 * Golden BaZi cases aligned to 问真-style defaults:
 * - Gregorian input
 * - Month by 节气
 * - Late 子时 (23:00) advances day pillar (lunar-javascript sect=1)
 */
import { Solar } from "lunar-javascript";
import assert from "node:assert/strict";
import test from "node:test";

function pillars(y, m, d, h, mi, sect = 1) {
  const eight = Solar.fromYmdHms(y, m, d, h, mi, 0).getLunar().getEightChar();
  eight.setSect(sect);
  return {
    year: eight.getYear(),
    month: eight.getMonth(),
    day: eight.getDay(),
    hour: eight.getTime(),
  };
}

const cases = [
  {
    name: "1995-08-18 12:00 — month 甲申 (not 甲酉)",
    input: [1995, 8, 18, 12, 0],
    expect: { year: "乙亥", month: "甲申", day: "辛巳", hour: "甲午" },
  },
  {
    name: "1995-08-18 09:30 巳时",
    input: [1995, 8, 18, 9, 30],
    expect: { year: "乙亥", month: "甲申", day: "辛巳", hour: "癸巳" },
  },
  {
    name: "1995-08-18 19:30 戌时",
    input: [1995, 8, 18, 19, 30],
    expect: { year: "乙亥", month: "甲申", day: "辛巳", hour: "戊戌" },
  },
  {
    name: "1995-08-08 07:00 before 立秋 → 癸未月",
    input: [1995, 8, 8, 7, 0],
    expect: { year: "乙亥", month: "癸未", day: "辛未", hour: "壬辰" },
  },
  {
    name: "1995-08-08 08:00 after 立秋 → 甲申月",
    input: [1995, 8, 8, 8, 0],
    expect: { year: "乙亥", month: "甲申", day: "辛未", hour: "壬辰" },
  },
  {
    name: "1990-02-04 10:00 before 立春 → 己巳年丁丑月",
    input: [1990, 2, 4, 10, 0],
    expect: { year: "己巳", month: "丁丑", day: "庚子", hour: "辛巳" },
  },
  {
    name: "1990-02-04 11:00 after 立春 → 庚午年戊寅月",
    input: [1990, 2, 4, 11, 0],
    expect: { year: "庚午", month: "戊寅", day: "庚子", hour: "壬午" },
  },
  {
    name: "2000-01-01 23:30 late zi → day advances (问真)",
    input: [2000, 1, 1, 23, 30],
    expect: { year: "己卯", month: "丙子", day: "己未", hour: "甲子" },
  },
  {
    name: "2000-01-02 00:30 early zi same day pillar as late zi above",
    input: [2000, 1, 2, 0, 30],
    expect: { year: "己卯", month: "丙子", day: "己未", hour: "甲子" },
  },
];

for (const c of cases) {
  test(c.name, () => {
    const got = pillars(...c.input, 1);
    assert.deepEqual(got, c.expect);
  });
}

test("sect2 keeps calendar day for late zi (contrast)", () => {
  const got = pillars(2000, 1, 1, 23, 30, 2);
  assert.equal(got.day, "戊午");
  assert.equal(got.hour, "甲子");
});
