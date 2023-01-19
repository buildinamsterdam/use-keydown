import { Target } from "./types";

export const getEventTargetFromTarget = (target?: Target) => {
  if (target) {
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
