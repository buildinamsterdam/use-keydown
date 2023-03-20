import React from "react";
import { fireEvent, render } from "@testing-library/react";

import useKeydown, { OnChangeEvent, Target } from "../dist";

interface MockComponentProps {
  keyCode: string | string[];
  onChange: OnChangeEvent;
  target?: Target;
  isEnabled?: boolean;
}

const MockComponent = ({
  keyCode,
  onChange,
  target,
  isEnabled,
}: MockComponentProps) => {
  useKeydown(keyCode, onChange, { target, isEnabled });
  return <div />;
};

describe("The hook", () => {
  beforeEach(() => {
    jest.spyOn(window, "addEventListener");
    jest.spyOn(window, "removeEventListener");
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("adds event listener on mount", () => {
    render(<MockComponent keyCode="KeyG" onChange={jest.fn()} />);

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount", () => {
    const { unmount } = render(
      <MockComponent keyCode="KeyG" onChange={jest.fn()} />
    );

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("adds event listeners on mount with different targets", () => {
    jest.spyOn(document, "addEventListener");

    render(
      <>
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={window} />
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={document} />
      </>
    );

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(document.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes event listener on unmount with different targets", () => {
    jest.spyOn(document, "removeEventListener");

    const { unmount } = render(
      <>
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={window} />
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={document} />
      </>
    );

    unmount();

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
    expect(document.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("only adds event listeners once if called multiple times with same target", () => {
    let documentKeydownCalled = 0;
    jest.spyOn(document, "addEventListener").mockImplementation(
      jest.fn((event) => {
        if (event === "keydown") documentKeydownCalled++;
      })
    );

    render(
      <>
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={window} />
        <MockComponent keyCode="KeyA" onChange={jest.fn()} target={document} />
        <MockComponent keyCode="KeyG" onChange={jest.fn()} target={document} />
      </>
    );

    expect(documentKeydownCalled).toBe(1);
  });

  it("calls 'onChange' with the correct arguments on keydown", () => {
    const onChange = jest.fn();

    render(<MockComponent keyCode="KeyG" onChange={onChange} />);

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
  });

  it("does not call 'onChange' if a different key is pressed", () => {
    const onChange = jest.fn();

    render(<MockComponent keyCode="KeyG" onChange={onChange} />);

    fireEvent.keyDown(window, { code: "Escape" });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("can be used with key modifiers", () => {
    const onChange = jest.fn();

    render(<MockComponent keyCode="KeyG" onChange={onChange} />);

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
        <MockComponent keyCode="KeyG" onChange={onChangeOne} />
        <MockComponent keyCode="KeyG" onChange={onChangeTwo} />
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
        <MockComponent keyCode="KeyG" onChange={onChangeOne} />
        <MockComponent keyCode="Escape" onChange={onChangeTwo} />
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

    render(<MockComponent keyCode={["KeyA", "KeyG"]} onChange={onChange} />);

    fireEvent.keyDown(window, { code: "KeyG" });

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyG" })
    );
    expect(onChange).not.toHaveBeenCalledWith(
      expect.objectContaining({ code: "KeyA" })
    );
  });

  it("doesn't add event listener if listen is set to 'false' on mount", () => {
    render(
      <MockComponent keyCode="KeyG" onChange={jest.fn()} isEnabled={false} />
    );

    expect(window.addEventListener).not.toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });

  it("removes event listener if listen set to 'false' after mount", () => {
    const { rerender } = render(
      <MockComponent keyCode="KeyG" onChange={jest.fn()} />
    );

    expect(window.addEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );

    rerender(
      <MockComponent keyCode="KeyG" onChange={jest.fn()} isEnabled={false} />
    );

    expect(window.removeEventListener).toHaveBeenCalledWith(
      "keydown",
      expect.any(Function)
    );
  });
});
