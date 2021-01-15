import axios from "../axios";

export async function getList() {
    const { data } = await axios.get("/friendships");
    return {
        type: "GET_LIST",
        users: data.users,
        idSelf: data.idSelf,
    };
}

export async function acceptRequest(otherId) {
    const { data } = await axios.post(
        `/friendship-action/Accept/${otherId}`
    );
    if (data.success) {
        return {
            type: "ACCEPT_REQUEST",
            id: otherId,
        };
    }
}

export async function unfriend(otherId) {
    const { data } = await axios.post(
        `/friendship-action/Cancel/${otherId}`
    );
    if (data.success) {
        return {
            type: "UNFRIEND",
            id: otherId,
        };
    }
}
