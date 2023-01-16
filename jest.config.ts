import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  verbose: true,
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
};

export default config;
