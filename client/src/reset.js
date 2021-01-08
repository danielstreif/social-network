import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

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
            <div>
                <p>Please enter your email address to receive a reset code.</p>
                {this.state.error && <p>No account associated with this email address.</p>}
                <input
                    onChange={(e) => this.handleChange(e)}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    name="email"
                    placeholder="Email"
                    type="email"
                />
                <button onClick={() => this.handleRequest()}>Submit</button>
            </div>
        );
    }

    verify() {
        return (
            <div>
                <p>Please enter your confirmation code and a new password.</p>
                {this.state.error && <p>Something went wrong.</p>}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="code"
                    placeholder="Verification Code"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    onKeyPress={(e) => this.handleKeyPress(e)}
                    name="password"
                    placeholder="New Password"
                    type="password"
                />
                <button onClick={() => this.handleVerification()}>
                    Submit
                </button>
            </div>
        );
    }

    confirm() {
        return <p>Password reset completed.</p>;
    }

    render() {
        return (
            <>
                <h2>Reset Password</h2>
                {this.state.view === "request" && this.request()}
                {this.state.view === "verify" && this.verify()}
                {this.state.view === "confirm" && this.confirm()}
                <div>
                    <Link to="/login">Click here to Log in!</Link>
                </div>
            </>
        );
    }
}
