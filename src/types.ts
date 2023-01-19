export type OnChangeEvent = (
  /** The original `keydown` event. */
  event: KeyboardEvent
) => void;

export interface Listener {
  targetKeyCode: string | string[];
  onChange: OnChangeEvent;
}
