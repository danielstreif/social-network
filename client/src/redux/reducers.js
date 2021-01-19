export default function reducer(state = {}, action) {
    if (action.type == "GET_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.chatMessages,
            idSelf: action.userId,
        };
    }

    if (action.type == "ADD_MESSAGE") {
        state = {
            ...state,
            chatMessages: [...state.chatMessages, action.newMessage],
        };
    }

    if (action.type == "GET_LIST") {
        state = {
            ...state,
            users: action.users,
            idSelf: action.idSelf,
        };
    }

    if (action.type == "ACCEPT_REQUEST") {
        state = {
            ...state,
            users: state.users.map((user) => {
                if (user.id == action.id) {
                    return {
                        ...user,
                        accepted: true,
                    };
                } else {
                    return user;
                }
            }),
        };
    }

    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            users: state.users.filter((user) => user.id != action.id),
        };
    }

    return state;
}
