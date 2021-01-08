import App from "../app";
import { render, waitFor, waitForElement } from "@testing-library/react";
import axios from "../axios";

jest.mock("../axios");

axios.get.mockResolvedValue({
    data: {
        id: 1,
        first: "foo",
        last: "bar",
        url: "www.foobar.com",
        bio: "Lorem ipsum"
    },
});

test("App eventually renders the div.", async () => {
    const { container } = render(<App />);

    console.log("container.innerHTML 1: ", container.innerHTML);

    await waitForElement(() => container.querySelector("div"));

    console.log("container.innerHTML 2: ", container.innerHTML);

    expect(container.querySelector("div").children.length).toBe(1);
});
