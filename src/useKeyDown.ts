import { useEffect } from "react";

import { OnChangeEvent } from "./types";

const listeners = new Map<string, OnChangeEvent>();

let isHooked = false;

const handleKeyDown = (event: KeyboardEvent) => {
  listeners.forEach((onChange, targetKeyCode) => {
    if (event.code === targetKeyCode) onChange(event);
  });
};

/**
 * Hook for listening to window `keydown` events.
 *
 * @param targetKeyCode - The target key [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) to listen for.
 *
 * @param onChange - The callback to invoke when window `keydown` event is
 * fired and the target key is pressed.
 *
 * @example
 * useKeyDown("KeyA", (event) => console.log(event));
 *
 * @example
 * useKeyDown("KeyG", (event) => {
 *   if (event.ctrlKey) console.log("Ctrl + G Pressed!");
 * });
 *
 */
const useKeyDown = (targetKeyCode: string, onChange: OnChangeEvent) => {
  useEffect(() => {
    listeners.set(targetKeyCode, onChange);

    if (!isHooked) {
      window.addEventListener("keydown", handleKeyDown);
      isHooked = true;
    }

    return () => {
      listeners.delete(targetKeyCode);

      if (listeners.size === 0) {
        window.removeEventListener("keydown", handleKeyDown);
        isHooked = false;
      }
    };
  }, [onChange, targetKeyCode]);
};

export default useKeyDown;
