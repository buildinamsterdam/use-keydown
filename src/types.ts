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

export interface Config {
  /**
   * Lets you specify a dom node or ref you want to attach the event listener
   * to. By default, this is `window`.
   */
  target?: EventTarget | EventTargetRef;
}
