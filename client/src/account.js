import { Link } from "react-router-dom";
import { useState } from "react";
import useAuthSubmit from "./hooks/useAuthSubmit";

export default function Account({ first, last, email }) {
    const [values, setValues] = useState({
        first: first,
        last: last,
        email: email,
        deleteAcc: false,
    });
    const [confirmDelete, setDelete] = useState(false);
    const [error, handleSubmit] = useAuthSubmit("/user/profile/edit", values);

    const toggleDelete = () => {
        setValues({
            ...values,
            deleteAcc: !values.deleteAcc,
        });
        setDelete(!confirmDelete);
    };

    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]: e.target.value,
        });
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    const confirmModal = (
        <div className="modal" onClick={toggleDelete}>
            <div className="modal-box">
                <div className="modal-header">
                    <h2>Confirm Account Deletion</h2>
                    <button className="close-button" onClick={toggleDelete}>
                        X
                    </button>
                </div>
                <button
                    className="welcome-button switch-button"
                    onClick={handleSubmit}
                >
                    Delete Account
                </button>
                <button
                    className="welcome-button submit-button"
                    onClick={toggleDelete}
                >
                    Cancel
                </button>
            </div>
        </div>
    );

    return (
        <>
            {confirmDelete && confirmModal}
            <h2 className="title">Account Settings</h2>
            <div className="auth-container">
                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="first"
                    placeholder="First Name"
                    type="text"
                    value={values.first}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                    value={values.last}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={values.email}
                />
                <input
                    className="input-field"
                    onChange={handleChange}
                    onKeyPress={handleKeyPress}
                    name="password"
                    placeholder="Change Password"
                    type="password"
                />
                <div>
                    <button
                        className="standard-button submit-button"
                        onClick={handleSubmit}
                    >
                        Submit Changes
                    </button>
                    <Link to="/">
                        <button className="standard-button">Cancel</button>
                    </Link>
                </div>
                <div>
                    <button
                        className="standard-button switch-button"
                        onClick={toggleDelete}
                    >
                        Delete Account
                    </button>
                </div>
            </div>
        </>
    );
}
