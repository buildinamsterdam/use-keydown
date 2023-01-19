import React from "react";
import { fireEvent, render } from "@testing-library/react";

import useKeydown, { OnChangeEvent } from "../dist";

interface MockComponentProps {
  targetKeyCode: string | string[];
  onChange: OnChangeEvent;
}

const MockComponent = ({ targetKeyCode, onChange }: MockComponentProps) => {
  useKeydown(targetKeyCode, onChange);
  return <div />;
};

describe("The hook", () => {
  beforeEach(() => {
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });

  it("adds event listeners on mount", () => {
    render(<MockComponent targetKeyCode="KeyG" onChange={jest.fn()} />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount", () => {
    const { unmount } = render(
      <MockComponent targetKeyCode="KeyG" onChange={jest.fn()} />
    );
    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("calls 'onChange' with the correct arguments on keydown", () => {
    const onChange = jest.fn();
    render(<MockComponent targetKeyCode="KeyG" onChange={onChange} />);

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
  });

  it("does not call 'onChange' if a different key is pressed", () => {
    const onChange = jest.fn();
    render(<MockComponent targetKeyCode="KeyG" onChange={onChange} />);

    fireEvent.keyDown(window, { code: "Escape" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("can be used with key modifiers", () => {
    const onChange = jest.fn();
    render(<MockComponent targetKeyCode="KeyG" onChange={onChange} />);

    fireEvent.keyDown(window, { code: "KeyG", ctrlKey: true });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG", ctrlKey: true })
    );
  });

  it("if called multiple times with same target key, all with the matching key are called", () => {
    const onChangeOne = jest.fn();
    const onChangeTwo = jest.fn();

    render(
      <>
        <MockComponent targetKeyCode="KeyG" onChange={onChangeOne} />
        <MockComponent targetKeyCode="KeyG" onChange={onChangeTwo} />
      </>
    );

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChangeOne).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
    expect(onChangeTwo).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
  });

  it("if called multiple times with different target keys, only the ones with the matching keys are called", () => {
    const onChangeOne = jest.fn();
    const onChangeTwo = jest.fn();

    render(
      <>
        <MockComponent targetKeyCode="KeyG" onChange={onChangeOne} />
        <MockComponent targetKeyCode="Escape" onChange={onChangeTwo} />
      </>
    );

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChangeOne).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
    expect(onChangeTwo).not.toHaveBeenCalled();
  });

  it("calls 'onChange' if any key matches in a list of keys", () => {
    const onChange = jest.fn();
    render(
      <MockComponent targetKeyCode={["KeyA", "KeyG"]} onChange={onChange} />
    );

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyA" })
    );
  });
});
