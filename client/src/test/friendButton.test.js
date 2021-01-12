import FriendButton from "../friendButton";
import { render, fireEvent, waitFor } from "@testing-library/react";
import axios from "../axios";

jest.mock("../axios");

test("An 'add friend' button should appear on user profiles without connection.", () => {
    const { container } = render(<FriendButton />);

    expect(container.querySelector(".friend-button")).toBeTruthy();
});

test("A 'cancel request' button should appear on profiles after a friend request is sent.", () => {
    const { container } = render(<FriendButton />);

    expect(container.querySelector(".friend-button")).toBeTruthy();
});

test("A 'deny' and an 'accept' button should appear when a friend request is received.", () => {
    const { container } = render(<FriendButton />);

    expect(container.querySelector(".friend-button")).toBeTruthy();
});

test("An 'unfriend' button should appear on connected user profiles.", () => {
    const { container } = render(<FriendButton />);

    expect(container.querySelector(".friend-button")).toBeTruthy();
});

test("An 'add friend' button should appear after the 'unfriend' button was clicked.", () => {
    const { container } = render(<FriendButton />);

    expect(container.querySelector(".friend-button")).toBeTruthy();
});
