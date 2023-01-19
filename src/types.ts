export type OnChangeEvent = (
  /** The original `keydown` event. */
  event: KeyboardEvent
) => void;

export interface Listener {
  targetKeyCode: string | string[];
  onChange: OnChangeEvent;
}

export interface EventTargetRef {
  current: EventTarget | null;
}

/**
 * A specify dom node or ref you want to attach the event listener to.
 * Defaults to `window`.
 */
export type Target = EventTarget | EventTargetRef;
