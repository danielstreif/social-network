import BioEditor from "../bioEditor";
import { render } from "@testing-library/react";

test("When no bio is passed to it, an 'Add Bio' button is rendered.", () => {
    const { container } = render(<BioEditor />);

    expect(container.querySelector("button").textContent).toBe("Add Bio");
});

test("When a bio is passed to it, an 'Edit Bio' button is rendered.", () => {
    const { container } = render(<BioEditor bio="foo bar" />);

    expect(container.querySelector("button").textContent).toBe("Edit Bio");
});

test("Clicking either the 'Add Bio' or 'Edit Bio' button causes a textarea and a 'Save' button to be rendered.", () => {
    const { container } = render(<BioEditor bio="foo bar" />);

    expect(container.querySelector("button").textContent).toBe("Edit Bio");
});

test(`Clicking the 'Save' button causes an ajax request. The request should not actually happen during your test. 
To prevent it from actually happening, you should mock axios.`, () => {
    const { container } = render(<BioEditor bio="foo bar" />);

    expect(container.querySelector("button").textContent).toBe("Edit Bio");
});

test("When the mock request is successful, the function that was passed as a prop to the component gets called.", () => {
    const { container } = render(<BioEditor bio="foo bar" />);

    expect(container.querySelector("button").textContent).toBe("Edit Bio");
});
