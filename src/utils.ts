import { Config } from "./types";

/** Get the target element from the config object. */
export const getTargetFromConfig = (config?: Config) => {
  if (config?.target) {
    const { target } = config;

    // If the target is a ref...
    if ("current" in target) {
      // ...and the ref has a value, return the ref value
      if (target.current) return target.current;
    }

    // Otherwise, return the target
    else return target;
  }

  // If no target is specified, or it's null, return window
  return window;
};
