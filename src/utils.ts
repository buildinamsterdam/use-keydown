import { Config } from "./types";

export const getEventTargetFromConfig = (config?: Config) => {
  if (config?.target) {
    const { target } = config;

    // If the target is a ref...
    if ("current" in target) {
      // ...and the ref has a value, return it
      if (target.current) return target.current;
    }

    // Otherwise, return the target
    else return target;
  }

  // If no target is specified, or it's null, return window
  return window;
};
