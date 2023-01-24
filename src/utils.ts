import { Target } from "./types";

export const getEventTargetFromTarget = (target?: Target) => {
  return (target && "current" in target ? target.current : target) || window;
};
