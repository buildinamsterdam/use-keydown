import { useEffect, useRef } from "react";

import { Config, EventHandler, Listener, OnChangeEvent, Query } from "./types";
import { getEventTargetFromTarget } from "./utils";

const queries = new Map<EventTarget, Query>();

const addListener = (
  eventTarget: EventTarget,
  listener: Listener,
  eventHandler: EventHandler
) => {
  const query = queries.get(eventTarget);

  // If query already exists, add this listener to existing set
  if (query?.listeners) query.listeners.add(listener);
  // Else, target is new, so create new event listener
  else {
    queries.set(eventTarget, { eventHandler, listeners: new Set([listener]) });
    eventTarget.addEventListener("keydown", eventHandler);
  }
};

const removeListener = (eventTarget: EventTarget, listener: Listener) => {
  const query = queries.get(eventTarget);
  if (!query) return;

  const { eventHandler, listeners } = query;

  // Remove this listener from existing set of listeners
  listeners.delete(listener);

  // If there are no more listeners, remove the event listener
  if (listeners.size === 0) {
    queries.delete(eventTarget);
    eventTarget.removeEventListener("keydown", eventHandler);
  }
};

const handleEventTargetKeydown = (
  eventTarget: EventTarget,
  event: KeyboardEvent
) => {
  const query = queries.get(eventTarget);
  if (!query) return;

  // Note: While looping listeners here isn't ideal, it's still more
  // performant than initializing a new event listener for each target
  query.listeners.forEach((listener) => {
    const { keyCode, onChange } = listener;

    // If the event code matches the target key code, invoke the callback
    if (
      Array.isArray(keyCode)
        ? keyCode.includes(event.code)
        : event.code === keyCode
    ) {
      onChange(event);
    }
  });
};

/**
 * Hook for listening to window `keydown` events.
 *
 * @param keyCode - The target key [code](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code) to listen for. Can also be an array of key codes.
 *
 * @param onChange - The callback to invoke when window `keydown` event is fired and the target key is pressed.
 *
 * @param config - Optional configuration object.
 * @param config.target - Lets you specify a dom node or ref you want to attach the event listener to. Defaults to `window`.
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
 * useKeydown("Escape", () => {}, { target: document });
 */
const useKeydown = (
  keyCode: string | string[],
  onChange: OnChangeEvent,
  config?: Config
) => {
  const listenerRef = useRef<Listener>({ keyCode, onChange });

  useEffect(() => {
    listenerRef.current = { keyCode, onChange };
  }, [keyCode, onChange]);

  useEffect(() => {
    const eventTarget = getEventTargetFromTarget(config?.target);

    const listener = listenerRef.current;

    const eventHandler = (baseEvent: Event) => {
      // As user can pass in a custom 'target', we need to check if the event is
      // a 'KeyboardEvent' before we can safely access the 'event.code' property
      const event = baseEvent as KeyboardEvent;
      if (event.code) handleEventTargetKeydown(eventTarget, event);
    };

    addListener(eventTarget, listener, eventHandler);

    return () => {
      removeListener(eventTarget, listener);
    };
  }, [config?.target]);
};

export default useKeydown;
