import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilePic";
import FriendButton from "./friendButton";

export default function FindPeople() {
    const [query, setQuery] = useState();
    const [users, setUser] = useState([]);
    const [error, setError] = useState(false);

    useEffect(() => {
        let abort;
        (async () => {
            const { data } = await axios.get(`/user/search/?q=${query}`);
            if (!abort) {
                if (data.error) {
                    return setError(true);
                } else {
                    setUser(data);
                }
            }
        })();
        return () => {
            abort = true;
        };
    }, [query]);

    return (
        <>
            <div className="user-search-container">
                <h2>Search users</h2>
                <input
                    className="input-field user-search"
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by name"
                />
                {error && <p>Something went wrong.</p>}
            </div>
            <ul className="user-list">
                {users.map((user) => (
                    <li className="user-container" key={user.id}>
                        <Link className="user-link" to={`/users/${user.id}`}>
                            <div className="bio-image">
                                <ProfilePic
                                    first={user.first}
                                    last={user.last}
                                    url={user.url}
                                />
                            </div>
                            <p>{`${user.first} ${user.last}`}</p>
                            <FriendButton otherId={user.id} />
                        </Link>
                    </li>
                ))}
                {!users.length && query && <li>No Results</li>}
            </ul>
        </>
    );
}
