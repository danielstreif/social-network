import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useRef, useEffect } from "react";
import { socket } from "./socket";
import ProfilePic from "./profilePic";

export default function Messages() {
    const chatMessages = useSelector((state) => state && state.privateMessages);
    const userId = useSelector((state) => state && state.idSelf);
    const elemRef = useRef("");

    useEffect(() => {
        if (elemRef.current) {
            elemRef.current.scrollTop = elemRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("post message", e.target.value);
            e.target.value = null;
        }
    };

    if (!chatMessages) {
        return <p>Loading</p>;
    }

    return (
        <>
            <h2 className="title">Chatroom</h2>
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
        </>
    );
}
