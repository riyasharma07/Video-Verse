/* eslint-disable prettier/prettier */
import type { Config } from "jest";

export default function (): Config {
  return {
    moduleFileExtensions: ["js", "json", "ts"],
    rootDir: ".",
    testEnvironment: "node",
    testRegex: ".e2e-spec.ts$",
    transform: {
      "^.+\\.(t|j)s$": "ts-jest",
    },
    testTimeout: 200000,
  };
}