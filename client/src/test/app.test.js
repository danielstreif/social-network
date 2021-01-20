import App from "../app";
import { render, waitForElement } from "@testing-library/react";
import axios from "../axios";

jest.mock("../axios");

// mock wall posts to fix test

axios.get.mockResolvedValue({
    data: {
        id: 1,
        first: "foo",
        last: "bar",
        url: "www.foobar.com",
        bio: "Lorem ipsum",
    },
});

test("App eventually renders the app-container div.", async () => {
    const { container } = render(<App />);

    await waitForElement(() => container.querySelector("div"));

    expect(container.querySelector(".app-container").children.length).toBe(1);
});
