import { Link } from "react-router-dom";
import useStatefulFields from "./hooks/useStatefulFields";
import useAuthSubmit from "./hooks/useAuthSubmit";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p>Something went wrong.</p>}
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
                <Link to="/">Click here to Register!</Link>
            </div>
            <div>
                <Link to="/reset">Reset password</Link>
            </div>
        </div>
    );
}
