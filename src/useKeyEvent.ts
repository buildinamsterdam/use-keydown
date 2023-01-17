import { useEffect } from "react";

import { OnChangeEvent } from "./types";

const listeners = new Map<string, OnChangeEvent[]>();

let isHooked = false;

const addListener = (targetKeyCode: string, onChange: OnChangeEvent) => {
  const matchedListener = listeners.get(targetKeyCode);

  // Add the new callback to the existing array of callbacks, if any, or create
  // new listener array
  if (matchedListener) matchedListener.push(onChange);
  else listeners.set(targetKeyCode, [onChange]);
};

const removeListener = (targetKeyCode: string, onChange: OnChangeEvent) => {
  const matchedListener = listeners.get(targetKeyCode);

  if (matchedListener) {
    const newListeners = matchedListener.filter(
      (callback) => callback !== onChange
    );

    // If is the last listener, remove it
    if (newListeners.length === 0) {
      listeners.delete(targetKeyCode);
    }

    // Otherwise, update the array of listeners
    else {
      listeners.set(targetKeyCode, newListeners);
    }
  }
};

const handleKeyDown = (event: KeyboardEvent) => {
  const matchedListener = listeners.get(event.code);

  // If this matches, invoke the callback for each callback in the array
  if (matchedListener) {
    matchedListener.forEach((callback) => callback(true, event));
  }
};

const handleKeyUp = (event: KeyboardEvent) => {
  const matchedListener = listeners.get(event.code);

  // If this matches, invoke the callback for each callback in the array
  if (matchedListener) {
    matchedListener.forEach((callback) => callback(false, event));
  }
};

/**
 * Hook for listening to custom keyboard events.
 *
 * @param targetKeyCode - The target key [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) to listen for.
 *
 * @param onChange - The callback to invoke when window `keydown` or `keyup`
 * events are fired and the target key is pressed or released. The callback
 * returns two arguments:
 * - `isPressed` - A `boolean` indicating whether the key was pressed
 *   (`keydown`) or not (`keyup`).
 * - `event` - The original `KeyboardEvent` for `keydown` or `keyup`.
 *
 * @example
 * useKey("KeyA", (isPressed, event) => console.log(isPressed, event));
 *
 * @example
 * useKey("KeyG", (pressed, event) => {
 *   if (pressed && event.ctrlKey) console.log("Ctrl + G Pressed!");
 * });
 *
 */
const useKeyEvent = (targetKeyCode: string, onChange: OnChangeEvent) => {
  useEffect(() => {
    addListener(targetKeyCode, onChange);

    if (!isHooked) {
      window.addEventListener("keydown", handleKeyDown);
      window.addEventListener("keyup", handleKeyUp);
      isHooked = true;
    }

    return () => {
      removeListener(targetKeyCode, onChange);

      if (listeners.size === 0) {
        window.removeEventListener("keydown", handleKeyDown);
        window.removeEventListener("keyup", handleKeyUp);
        isHooked = false;
      }
    };
  }, [targetKeyCode, onChange]);
};

export default useKeyEvent;
