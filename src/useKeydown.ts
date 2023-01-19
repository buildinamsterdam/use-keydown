import { useEffect } from "react";

import { Listener, OnChangeEvent, Target } from "./types";
import { getEventTargetFromTarget } from "./utils";

const targets = new Map<EventTarget, Set<Listener>>();

const addListener = (
  eventTarget: EventTarget,
  listener: Listener,
  handleKeydown: (baseEvent: Event) => void
) => {
  const listeners = targets.get(eventTarget);

  // If target already exists, add this listener to existing set of listeners
  if (listeners) listeners.add(listener);
  // Else, target is new, so create new event listener
  else {
    targets.set(eventTarget, new Set([listener]));
    eventTarget.addEventListener("keydown", handleKeydown);
  }
};

const removeListener = (
  eventTarget: EventTarget,
  listener: Listener,
  handleKeydown: (baseEvent: Event) => void
) => {
  const listeners = targets.get(eventTarget);
  if (!listeners) return;

  // Remove this listener from existing set of listeners
  listeners.delete(listener);

  // If there are no more listeners, remove the event listener
  if (listeners.size === 0) {
    targets.delete(eventTarget);
    eventTarget.removeEventListener("keydown", handleKeydown);
  }
};

const handleTargetKeydown = (
  eventTarget: EventTarget,
  event: KeyboardEvent
) => {
  const listeners = targets.get(eventTarget);
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
 * @param target - Lets you specify a dom node or ref you want to attach the event listener to. Defaults to `window`.
 *
 * @example
 * useKeydown("KeyA", (event) => console.log(event));
 *
 * @example
 * useKeydown("KeyG", (event) => {
 *   if (event.ctrlKey) console.log("Ctrl + G Pressed!");
 * });
 *
 * @example
 * useKeydown(["Escape", "Escape"], () => console.log("Escape + Escape Pressed!"));
 *
 * @example
 * useKeydown(["Escape"], () => {}, document);
 */
const useKeydown = (
  targetKeyCode: string | string[],
  onChange: OnChangeEvent,
  target?: Target
) => {
  useEffect(() => {
    const eventTarget = getEventTargetFromTarget(target);
    const listener: Listener = { targetKeyCode, onChange };

    const handleKeydown = (baseEvent: Event) => {
      // As user can pass in a custom 'target', we need to check if the event is
      // a KeyboardEvent before we can safely access the 'event.code' property
      const event = baseEvent as KeyboardEvent;
      if (event.code) handleTargetKeydown(eventTarget, event);
    };

    addListener(eventTarget, listener, handleKeydown);

    return () => {
      removeListener(eventTarget, listener, handleKeydown);
    };
  }, [onChange, target, targetKeyCode]);
};

export default useKeydown;
