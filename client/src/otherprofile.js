import { Component } from "react";
import axios from "./axios";
import ProfilePic from "./profilePic";
import FriendButton from "./friendButton";

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
            <div className="profile-container">
                <h2 className="title">
                    {this.state.first} {this.state.last}
                </h2>
                <div className="bio-image">
                    <ProfilePic
                        first={this.state.first}
                        last={this.state.last}
                        url={this.state.url}
                    />
                </div>
                <FriendButton otherId={this.state.id} />
                <p className="bio-text">{this.state.bio}</p>
            </div>
        );
    }
}
