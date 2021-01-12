import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilePic";

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
        <div>
            <h2>Search users</h2>
            <input
                className="user-search"
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name"
            />
            {error && <p>Something went wrong.</p>}
            <ul>
                {users.map((user) => (
                    <li className="user-list" key={user.id}>
                        <Link className="user-link" to={`/users/${user.id}`}>
                            <div className="bio-image">
                                <ProfilePic
                                    first={user.first}
                                    last={user.last}
                                    url={user.url}
                                />
                            </div>
                            <p>{`${user.first} ${user.last}`}</p>
                        </Link>
                    </li>
                ))}
                {!users.length && query && <li>No Results</li>}
            </ul>
        </div>
    );
}
