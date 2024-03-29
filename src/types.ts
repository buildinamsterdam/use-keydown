import { MutableRefObject } from "react";

export type OnChangeEvent = (
  /** The original keyboard event. */
  event: KeyboardEvent
) => void;

export interface EventTargetRef {
  current: EventTarget | null;
}

export type Target = EventTarget | EventTargetRef;

export interface Config {
  /**
   * A specify dom node or ref you want to attach the event listener to.
   * Defaults to `window`.
   */
  target?: Target;

  /**
   * This can be used to conditionally enable / disable the event listener.
   * Defaults to `true`.
   */
  isEnabled?: boolean;
}

export type EventHandler = (baseEvent: Event) => void;

export interface Listener {
  keyCode: string | string[];
  onChange: OnChangeEvent;
}

export type ListenerRef = MutableRefObject<Listener>;

export interface Query {
  eventHandler: EventHandler;
  listenerRefs: Set<ListenerRef>;
}
