import { fireEvent, render } from "@testing-library/react";
import React from "react";

import useKey, { OnChangeEvent } from "../dist";

let onChange: OnChangeEvent;

const MockComponent = () => {
  useKey("KeyG", onChange);
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
    expect(window.addEventListener).toHaveBeenCalledWith(
      "keyup",
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
    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keyup",
      expect.any(Function)
    );
  });

  it("calls 'onChange' with the correct arguments on keydown", () => {
    render(<MockComponent />);

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      true,
      expect.objectContaining({ code: "KeyG" })
    );
  });

  it("calls 'onChange' with the correct arguments on keyup", () => {
    render(<MockComponent />);

    fireEvent.keyUp(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      false,
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
      true,
      expect.objectContaining({ code: "KeyG", ctrlKey: true })
    );
  });
});
