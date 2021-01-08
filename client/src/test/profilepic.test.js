import ProfilePic from "../profilepic";
import { render, fireEvent } from "@testing-library/react";

test("When no url is passed a placeholder is used as src.", () => {
    const { container } = render(<ProfilePic />);

    expect(
        container.querySelector("img").src.endsWith("/img/placeholder.png")
    ).toBe(true);
});

test("When url is passed as prop, that url is set as the value of the src attribute.", () => {
    const { container } = render(<ProfilePic url="/test/test.com" />);

    expect(container.querySelector("img").src.endsWith("/test/test.com")).toBe(
        true
    );
});

test("When first and last props are passed, first and last are assigned the value of the alt attribute", () => {
    const { container } = render(<ProfilePic first="foo" last="bar" />);

    expect(container.querySelector("img").alt).toBe("foo bar");
});

test("onClick prop runs when the image is clicked.", () => {
    const mockOnClick = jest.fn();
    const { container } = render(<ProfilePic onClick={mockOnClick} />);

    fireEvent.click(container.querySelector("img"));
    expect(mockOnClick.mock.calls.length).toBe(1);
});
