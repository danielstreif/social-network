import { Component } from "react";
import axios from "./axios";

export default class Logout extends Component {
    constructor() {
        super();
        this.state = {};
    }

    handleClick() {
        axios
            .get("/logout")
            .then(({ data }) => {
                if (data.logout) {
                    location.replace("/");
                }
            })
            .catch((err) => console.log("Logout error: ", err));
    }

    render() {
        return (
            <div onClick={() => this.handleClick()}>
                Logout
            </div>
        );
    }
}
