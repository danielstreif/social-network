import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getList, acceptRequest, unfriend } from "./redux/actions";
import ProfilePic from "./profilePic";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        (state) => state.users && state.users.filter((user) => user.accepted)
    );
    const requests = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => !user.accepted && user.sender_id != state.idSelf
            )
    );
    const pending = useSelector(
        (state) =>
            state.users &&
            state.users.filter(
                (user) => !user.accepted && user.sender_id == state.idSelf
            )
    );

    useEffect(() => {
        dispatch(getList());
    }, []);

    if (!friends || !requests || !pending) {
        return <p>Loading</p>;
    }

    const userList = (group, buttonArr) => (
        <ul className="user-list">
            {group.map((user) => (
                <li className="user-container" key={user.id}>
                    <Link className="user-link" to={`/users/${user.id}`}>
                        <div className="friend-image">
                            <ProfilePic
                                first={user.first}
                                last={user.last}
                                url={user.url}
                            />
                        </div>
                        <p>{`${user.first} ${user.last}`}</p>
                        {buttonArr.map((button, index) => (
                            <button
                                key={index}
                                className="friend-button"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(button.action(user.id));
                                }}
                            >
                                {button.text}
                            </button>
                        ))}
                    </Link>
                </li>
            ))}
        </ul>
    );

    return (
        <>
            <h2 className="title">Open Friend Requests</h2>
            <div className="user-group-container">
                {!requests.length && <p>No open requests</p>}
                {!!requests.length &&
                    userList(requests, [
                        { action: acceptRequest, text: "Accept" },
                        { action: unfriend, text: "Decline" },
                    ])}
            </div>
            <h2 className="title">Friends</h2>
            <div className="user-group-container">
                {!friends.length && (
                    <p>Send out friend requests to connect with people!</p>
                )}
                {!!friends.length &&
                    userList(friends, [{ action: unfriend, text: "Unfriend" }])}
            </div>
            <h2 className="title">Pending Friend Requests</h2>
            <div className="user-group-container">
                {!pending.length && <p>No pending requests</p>}
                {!!pending.length &&
                    userList(pending, [{ action: unfriend, text: "Cancel" }])}
            </div>
        </>
    );
}
