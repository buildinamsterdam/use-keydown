import { useEffect } from "react";

import { Listener, OnChangeEvent } from "./types";

const listeners = new Set<Listener>();

let isHooked = false;

const handleKeydown = (event: KeyboardEvent) => {
  listeners.forEach((listener) => {
    const { targetKeyCode, onChange } = listener;

    // If the targetKeyCode is an array of keys, check if event.code matches any
    if (Array.isArray(targetKeyCode)) {
      if (targetKeyCode.includes(event.code)) onChange(event);
    }

    // Otherwise, just check if event.code matches the targetKeyCode
    else if (event.code === targetKeyCode) onChange(event);
  });
};

/**
 * Hook for listening to window `keydown` events.
 *
 * @param targetKeyCode - The target key [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) to listen for. Can also be an array of key codes.
 *
 * @param onChange - The callback to invoke when window `keydown` event is fired and the target key is pressed.
 *
 * @example
 * useKeydown("KeyA", (event) => console.log(event));
 *
 * @example
 * useKeydown("KeyG", (event) => {
 *   if (event.ctrlKey) console.log("Ctrl + G Pressed!");
 * });
 */
const useKeydown = (
  targetKeyCode: string | string[],
  onChange: OnChangeEvent
) => {
  useEffect(() => {
    const listener: Listener = { targetKeyCode, onChange };
    listeners.add(listener);

    if (!isHooked) {
      window.addEventListener("keydown", handleKeydown);
      isHooked = true;
    }

    return () => {
      listeners.delete(listener);

      if (listeners.size === 0) {
        window.removeEventListener("keydown", handleKeydown);
        isHooked = false;
      }
    };
  }, [onChange, targetKeyCode]);
};

export default useKeydown;
