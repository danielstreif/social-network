import { Component } from "react";
import axios from "axios";

export default class Registration extends Component {
    constructor() {
        super();
        this.state = {};
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value,
        });
    }

    handleClick() {
        const input = {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password,
        };
        const self = this;
        axios
            .post("/registration", input)
            .then(({data}) => {
                console.log(data);
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.success) {
                    location.replace("/");
                }
            })
            .catch(() => self.setState({ error: true }));
    }

    render() {
        return (
            <div>
                <h1>Registration</h1>
                {this.state.error && <p>Something went wrong.</p>}
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="first"
                    placeholder="First Name"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="last"
                    placeholder="Last Name"
                    type="text"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="email"
                    placeholder="Email"
                    type="email"
                />
                <input
                    onChange={(e) => this.handleChange(e)}
                    name="password"
                    placeholder="Password"
                    type="password"
                />
                <button onClick={() => this.handleClick()}>submit</button>
            </div>
        );
    }
}
