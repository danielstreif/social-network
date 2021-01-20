import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import WelcomeLogo from "./welcomeLogo";

export default class Reset extends Component {
    constructor() {
        super();
        this.state = {
            view: "request",
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleKeyPress(e) {
        if (e.key === "Enter" && this.state.view === "request") {
            this.handleRequest();
        }
        if (e.key === "Enter" && this.state.view === "verify") {
            this.handleVerification();
        }
    }

    handleRequest() {
        const input = {
            email: this.state.email,
        };
        const self = this;
        axios
            .post("/password/reset/start", input)
            .then(({ data }) => {
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.success) {
                    self.setState({ view: "verify", error: false });
                }
            })
            .catch(() => self.setState({ error: true }));
    }

    handleVerification() {
        const input = {
            code: this.state.code,
            email: this.state.email,
            password: this.state.password,
        };
        const self = this;
        axios
            .post("/password/reset/verify", input)
            .then(({ data }) => {
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.success) {
                    self.setState({ view: "confirm", error: false });
                }
            })
            .catch(() => self.setState({ error: true }));
    }

    request() {
        return (
            <>
                {this.state.error && (
                    <p className="error-message">
                        No account associated with this email address...
                    </p>
                )}
                <input
                    className="input-field"
                    onChange={(e) => this.handleChange(e)}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    name="email"
                    placeholder="Recovery Email"
                    type="email"
                />
                <button
                    className="welcome-button submit-button"
                    onClick={() => this.handleRequest()}
                >
                    Submit
                </button>
            </>
        );
    }

    verify() {
        return (
            <>
                {this.state.error && (
                    <p className="error-message">Something went wrong...</p>
                )}
                <input
                    className="input-field"
                    onChange={(e) => this.handleChange(e)}
                    name="code"
                    placeholder="Verification Code"
                    type="text"
                />
                <input
                    className="input-field"
                    onChange={(e) => this.handleChange(e)}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    name="password"
                    placeholder="New Password"
                    type="password"
                />
                <button
                    className="welcome-button submit-button"
                    onClick={() => this.handleVerification()}
                >
                    Submit
                </button>
            </>
        );
    }

    confirm() {
        return <p>Password reset completed</p>;
    }

    render() {
        return (
            <div className="welcome-container">
                <WelcomeLogo />
                <div className="auth-container">
                    {this.state.view === "request" && this.request()}
                    {this.state.view === "verify" && this.verify()}
                    {this.state.view === "confirm" && this.confirm()}
                    <div className="border-line"></div>
                    <Link to="/login">
                        <button className="welcome-button switch-button">
                            Remember Your Password?
                        </button>
                    </Link>
                </div>
            </div>
        );
    }
}
