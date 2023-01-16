export type OnChangeEvent = (
  /**
   * A boolean indicating whether the key was pressed (`keydown`) or not
   * (`keyup`).
   */
  isPressed: boolean,

  /** The original `keydown` / `keyup` event. */
  event: KeyboardEvent
) => void;
