import { Link } from "react-router-dom";
import useStatefulFields from "./hooks/useStatefulFields";
import useAuthSubmit from "./hooks/useAuthSubmit";

export default function Registration() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/registration", values);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div>
            <h2>Registration</h2>
            {error && <p>Something went wrong.</p>}
            <input
                className="input-field"
                onChange={(e) => handleChange(e)}
                name="first"
                placeholder="First Name"
                type="text"
            />
            <input
                className="input-field"
                onChange={(e) => handleChange(e)}
                name="last"
                placeholder="Last Name"
                type="text"
            />
            <input
                className="input-field"
                onChange={(e) => handleChange(e)}
                name="email"
                placeholder="Email"
                type="email"
            />
            <input
                className="input-field"
                onChange={(e) => handleChange(e)}
                onKeyPress={(e) => handleKeyPress(e)}
                name="password"
                placeholder="Password"
                type="password"
            />
            <button onClick={() => handleSubmit()}>Submit</button>
            <div>
                <Link to="/login">Click here to Log in!</Link>
            </div>
        </div>
    );
}
