import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";

export default class OtherProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const self = this;
        axios
            .get(`/user/profile/${this.props.match.params.id}`)
            .then(({ data }) => {
                if (data.error || data.invalid) {
                    return this.props.history.push("/");
                } else {
                    return self.setState({ ...data });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    render() {
        return (
            <div>
                <h2>
                    {this.state.first} {this.state.last}&apos;s Profile
                </h2>
                <div className="bio-image">
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.url}
                    />
                </div>
                {this.state.bio}
            </div>
        );
    }
}
