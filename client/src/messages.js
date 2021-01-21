import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import ProfilePic from "./profilePic";
import { getPrivateMessages, sendPrivateMessage } from "./redux/actions";

export default function Messages(props) {
    const dispatch = useDispatch();
    const chatMessages = useSelector((state) => state && state.privateMessages);
    const userId = useSelector((state) => state && state.idSelf);
    const elemRef = useRef("");
    const otherId = props.match.params.id;

    useEffect(() => {
        dispatch(getPrivateMessages(otherId));
    }, []);

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop = elemRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            dispatch(sendPrivateMessage(e.target.value, otherId));
            e.target.value = null;
        }
    };

    if (!chatMessages) {
        return <p>Loading</p>;
    }

    return (
        <>
            <h2 className="title">Private Chatroom</h2>
            <div className="outer-chat-container">
                <ul className="chat-container" ref={elemRef}>
                    {chatMessages.map((message) => (
                        <li className="chat-field" key={message.id}>
                            {message.user == userId && (
                                <div className="user-self">
                                    <span>{message.message}</span>
                                    <Link className="chat-user" to="/">
                                        <span className="user-info">
                                            <p>You</p>
                                            <p>{message.time}</p>
                                        </span>

                                        <div className="navbar-image">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                url={message.url}
                                            />
                                        </div>
                                    </Link>
                                </div>
                            )}
                            {message.user != userId && (
                                <div className="user-other">
                                    <span>{message.message}</span>
                                    <Link
                                        className="chat-user"
                                        to={`/users/${message.user}`}
                                    >
                                        <div className="navbar-image">
                                            <ProfilePic
                                                first={message.first}
                                                last={message.last}
                                                url={message.url}
                                            />
                                        </div>
                                        <span className="user-info">
                                            <p>
                                                {message.first} {message.last}
                                            </p>
                                            <p>{message.time}</p>
                                        </span>
                                    </Link>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <textarea
                className="chat-textarea"
                onKeyDown={handleKeyDown}
                placeholder="Compose Message"
            />
            <Link className="chat-user" to={`/users/${otherId}`}>
                <button className="standard-button">Back</button>
            </Link>
        </>
    );
}
