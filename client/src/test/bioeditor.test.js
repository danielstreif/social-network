import BioEditor from "../bioEditor";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "../axios";

jest.mock("../axios");

test("When no bio is passed to it, an 'Add Bio' button is rendered.", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector(".add-button")).toBeTruthy();
});

test("When a bio is passed to it, an 'Edit Bio' button is rendered.", () => {
    const { container } = render(<BioEditor bio="foo bar" />);

    expect(container.querySelector(".edit-button")).toBeTruthy();
});

test("Clicking either the 'Add Bio' or 'Edit Bio' button causes a textarea and a 'Save' button to be rendered.", () => {
    const { container } = render(<BioEditor />);

    fireEvent.click(container.querySelector(".add-button"));
    expect(container.querySelector(".bio-textarea")).toBeTruthy();
    expect(container.querySelector(".save-button")).toBeTruthy();
});

test(`Clicking the 'Save' button causes an ajax request. The request should not actually happen during your test. 
To prevent it from actually happening, you should mock axios.`, () => {
    const mockCall = axios.post.mockResolvedValue({});
    const { container } = render(<BioEditor bio="foo bar" />);

    fireEvent.click(container.querySelector(".edit-button"));
    fireEvent.click(container.querySelector(".save-button"));

    expect(mockCall.mock.calls.length).toBe(1);
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", async () => {
    const mockSetBio = jest.fn();

    axios.post.mockResolvedValue({
        data: {
            success: true,
        },
    });

    const { container } = render(
        <BioEditor bio="foo bar" setBio={mockSetBio} />
    );

    fireEvent.click(container.querySelector(".edit-button"));
    fireEvent.click(container.querySelector(".save-button"));

    await waitFor(() => expect(mockSetBio.mock.calls.length).toBe(1));
});
