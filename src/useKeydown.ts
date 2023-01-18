import { useEffect } from "react";

import { Listener, OnChangeEvent } from "./types";

const listeners = new Set<Listener>();

let isHooked = false;

const handleKeydown = (event: KeyboardEvent) => {
  listeners.forEach((listener) => {
    if (event.code === listener.targetKeyCode) listener.onChange(event);
  });
};

/**
 * Hook for listening to window `keydown` events.
 *
 * @param targetKeyCode - The target key [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) to listen for.
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
 *
 */
const useKeydown = (targetKeyCode: string, onChange: OnChangeEvent) => {
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
