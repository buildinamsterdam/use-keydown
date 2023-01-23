export type OnChangeEvent = (
  /** The original `keydown` event. */
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
}

export type EventHandler = (baseEvent: Event) => void;

export interface Listener {
  keyCode: string | string[];
  onChange: OnChangeEvent;
}

export interface Query {
  eventHandler: EventHandler;
  listeners: Set<Listener>;
}
