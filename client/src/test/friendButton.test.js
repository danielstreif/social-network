import FriendButton from "../friendButton";
import { render, waitForElement } from "@testing-library/react";
import axios from "../axios";

jest.mock("../axios");

axios.get.mockResolvedValue({
    data: {
        success: "Add Friend",
    },
});

// test("An 'add friend' button should appear on user profiles without connection.", async () => {
//     const { container } = render(<FriendButton />);

//     await waitForElement(() =>
//         expect(container.querySelector(".friend-button").innerHTML)
//     );

//     expect(container.querySelector(".friend-button").innerHTML).toBe(
//         "Add Friend"
//     );
// });

// test("A 'cancel request' button should appear on profiles after a friend request is sent.", () => {
//     const { container } = render(<FriendButton />);

//     expect(container.querySelector(".friend-button")).toBeTruthy();
// });

// test("A 'deny' and an 'accept' button should appear when a friend request is received.", () => {
//     const { container } = render(<FriendButton />);

//     expect(container.querySelector(".friend-button")).toBeTruthy();
// });

// test("An 'unfriend' button should appear on connected user profiles.", () => {
//     const { container } = render(<FriendButton />);

//     expect(container.querySelector(".friend-button")).toBeTruthy();
// });

// test("An 'add friend' button should appear after the 'unfriend' button was clicked.", () => {
//     const { container } = render(<FriendButton />);

//     expect(container.querySelector(".friend-button")).toBeTruthy();
// });
