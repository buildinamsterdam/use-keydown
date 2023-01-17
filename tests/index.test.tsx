import { fireEvent, render } from "@testing-library/react";
import React from "react";

import useKeyDown, { OnChangeEvent } from "../dist";

let onChange: OnChangeEvent;

const MockComponent = () => {
  useKeyDown("KeyG", onChange);
  return <div />;
};

describe("The hook", () => {
  beforeEach(() => {
    onChange = jest.fn();
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });

  it("adds event listeners on mount", () => {
    render(<MockComponent />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount", () => {
    const { unmount } = render(<MockComponent />);
    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("calls 'onChange' with the correct arguments on keydown", () => {
    render(<MockComponent />);

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
  });

  it("does not call 'onChange' if a different key is pressed", () => {
    render(<MockComponent />);

    fireEvent.keyDown(window, { code: "Escape" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("can be used with key modifiers", () => {
    render(<MockComponent />);

    fireEvent.keyDown(window, { code: "KeyG", ctrlKey: true });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG", ctrlKey: true })
    );
  });
});
