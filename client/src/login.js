import { Link } from "react-router-dom";
import useStatefulFields from "./hooks/useStatefulFields";
import useAuthSubmit from "./hooks/useAuthSubmit";
import WelcomeLogo from "./welcomeLogo";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSubmit();
        }
    };

    return (
        <div className="welcome-container">
            <WelcomeLogo />
            <div className="auth-container">
                {error && (
                    <p className="error-message">Something went wrong...</p>
                )}
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
                <button
                    className="welcome-button submit-button"
                    onClick={() => handleSubmit()}
                >
                    Log In
                </button>
                <Link className="password-reset" to="/reset">
                    Forgot password?
                </Link>
                <div className="border-line"></div>
                <Link to="/">
                    <button className="welcome-button switch-button">
                        Create New Account
                    </button>
                </Link>
            </div>
        </div>
    );
}
