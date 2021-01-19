import axios from "../axios";

export function getMessages({ result }, id) {
    return {
        type: "GET_MESSAGES",
        chatMessages: result,
        userId: id
    };
}

export function newMessage(message) {
    return {
        type: "ADD_MESSAGE",
        newMessage: message,
    };
}

export async function getList() {
    const { data } = await axios.get("/friendships");
    return {
        type: "GET_LIST",
        users: data.users,
        idSelf: data.idSelf,
    };
}

export async function acceptRequest(otherId) {
    const { data } = await axios.post(`/friendship-action/Accept/${otherId}`);
    if (data.success) {
        return {
            type: "ACCEPT_REQUEST",
            id: otherId,
        };
    }
}

export async function unfriend(otherId) {
    const { data } = await axios.post(`/friendship-action/Cancel/${otherId}`);
    if (data.success) {
        return {
            type: "UNFRIEND",
            id: otherId,
        };
    }
}
