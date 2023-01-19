import { useEffect } from "react";

import { Config, Listener, OnChangeEvent } from "./types";
import { getTargetFromConfig } from "./utils";

const targets = new Map<EventTarget, Set<Listener>>();

const addListener = (
  target: EventTarget,
  listener: Listener,
  handleKeydown: (baseEvent: Event) => void
) => {
  const listeners = targets.get(target);

  // If target already exists, add this listener to existing set of listeners
  if (listeners) listeners.add(listener);
  // Else, target is new, so create new event listener
  else {
    targets.set(target, new Set([listener]));
    target.addEventListener("keydown", handleKeydown);
  }
};

const removeListener = (
  target: EventTarget,
  listener: Listener,
  handleKeydown: (baseEvent: Event) => void
) => {
  const listeners = targets.get(target);
  if (!listeners) return;

  // Remove this listener from existing set of listeners
  listeners.delete(listener);

  // If there are no more listeners, remove the event listener
  if (listeners.size === 0) {
    targets.delete(target);
    target.removeEventListener("keydown", handleKeydown);
  }
};

const handleTargetKeydown = (target: EventTarget, event: KeyboardEvent) => {
  const listeners = targets.get(target);
  if (!listeners) return;

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
 * @param config - Optional configuration object.
 * @param config.target - Lets you specify a dom node or ref you want to attach the event listener to. By default, this is `window`.
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
  onChange: OnChangeEvent,
  config?: Config
) => {
  useEffect(() => {
    const target = getTargetFromConfig(config);
    const listener: Listener = { targetKeyCode, onChange };

    const handleKeydown = (baseEvent: Event) => {
      // As user can pass in a custom 'target', we need to check if the event is
      // a KeyboardEvent before we can safely access the 'event.code' property
      const event = baseEvent as KeyboardEvent;
      if (event.code) handleTargetKeydown(target, event);
    };

    addListener(target, listener, handleKeydown);

    return () => {
      removeListener(target, listener, handleKeydown);
    };
  }, [config, onChange, targetKeyCode]);
};

export default useKeydown;
