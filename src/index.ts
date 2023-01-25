import { useEffect, useRef } from "react";

import {
  Config,
  EventHandler,
  Listener,
  ListenerRef,
  OnChangeEvent,
  Query,
} from "./types";
import { getEventTargetFromTarget } from "./utils";

const queries = new Map<EventTarget, Query>();

const addListener = (
  eventTarget: EventTarget,
  listenerRef: ListenerRef,
  eventHandler: EventHandler
) => {
  const query = queries.get(eventTarget);

  // If query already exists, add this listener to existing set
  if (query?.listenerRefs) query.listenerRefs.add(listenerRef);
  // Else, target is new, so create new event listener
  else {
    queries.set(eventTarget, {
      eventHandler,
      listenerRefs: new Set([listenerRef]),
    });
    eventTarget.addEventListener("keydown", eventHandler);
  }
};

const removeListener = (eventTarget: EventTarget, listenerRef: ListenerRef) => {
  const query = queries.get(eventTarget);
  if (!query) return;

  const { eventHandler, listenerRefs } = query;

  // Remove this listener from existing set of listenerRefs
  listenerRefs.delete(listenerRef);

  // If there are no more listenerRefs, remove the event listener
  if (listenerRefs.size === 0) {
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

  // Note: While looping listenerRefs here isn't ideal, it's still more
  // performant than initializing a new event listener for each target
  query.listenerRefs.forEach((listenerRef) => {
    const { keyCode, onChange } = listenerRef.current;

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

  // Note: We store these values as refs so that we don't re-run the effect
  // when they change. Also, as we're using a ref, whenever 'eventHandler'
  // fires it will always have access to the latest values
  useEffect(() => {
    listenerRef.current = { keyCode, onChange };
  }, [keyCode, onChange]);

  useEffect(() => {
    const eventTarget = getEventTargetFromTarget(config?.target);

    const eventHandler = (baseEvent: Event) => {
      // As user can pass in a custom 'target', we need to check if the event is
      // a 'KeyboardEvent' before we can safely access the 'event.code' property
      const event = baseEvent as KeyboardEvent;
      if (event.code) handleEventTargetKeydown(eventTarget, event);
    };

    addListener(eventTarget, listenerRef, eventHandler);

    return () => {
      removeListener(eventTarget, listenerRef);
    };
  }, [config?.target]);
};

export default useKeydown;

export type { Config, EventTargetRef, OnChangeEvent, Target } from "./types";
