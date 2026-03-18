//grade.test.js

import { calculateGrade, calculatePercentage } from "../js/quiz.js";

// grade tests

test("Grade A for 80 percent", () => {
  expect(calculateGrade(8, 10)).toBe("A");
});

test("Grade B for 50 percent", () => {
  expect(calculateGrade(5, 10)).toBe("B");
});

test("Fail below 50 percent", () => {
  expect(calculateGrade(2, 10)).toBe("Fail");
});

// Edge Cases
test("Grade A for 100 percent", () => {
  expect(calculateGrade(10, 10)).toBe("A");
});

test("Fail for 0 score", () => {
  expect(calculateGrade(0, 10)).toBe("Fail");
});




//percentage tests

test("Percentage calculation correct", () => {
  expect(calculatePercentage(5, 10)).toBe(50);
});

// Edge Cases
test("Percentage 0 when score is 0", () => {
  expect(calculatePercentage(0, 10)).toBe(0);
});

test("Percentage 100 when full score", () => {
  expect(calculatePercentage(10, 10)).toBe(100);
});


test("Handles decimal percentage", () => {
  expect(calculatePercentage(3, 7)).toBeCloseTo(42.85, 1);
});