import { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton({ otherId }) {
    const [buttonText, setButtonText] = useState();
    const [error, setError] = useState(false);

    useEffect(() => {
        if (otherId !== undefined) {
            let abort;
            (async () => {
                const { data } = await axios.get(
                    `/friendship-status/${otherId}`
                );
                if (!abort) {
                    if (data.error) {
                        return setError(true);
                    }
                    if (data.success) {
                        return setButtonText(data.success);
                    }
                }
            })();
            return () => {
                abort = true;
            };
        }
    }, [otherId]);

    const handleClick = (e) => {
        const action = e.target.value;
        axios
            .post(`/friendship-action/${action}/${otherId}`)
            .then(({ data }) => {
                if (data.success) {
                    setButtonText(data.success);
                }
                if (data.error) {
                    setError(true);
                }
            })
            .catch((err) => {
                console.log(err);
                setError(true);
            });
    };

    return (
        <div>
            {error && <p>Something went wrong.</p>}
            <button
                className="friend-button"
                value={buttonText}
                onClick={handleClick}
            >
                {buttonText}
            </button>
            {buttonText === "Accept Request" && (
                <button
                    className="friend-button"
                    value="Decline Request"
                    onClick={handleClick}
                >
                    Decline Request
                </button>
            )}
        </div>
    );
}
