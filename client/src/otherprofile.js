import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
import ProfilePic from "./profilePic";
import FriendButton from "./friendButton";
import Wall from "./wall";

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
                <div className="profile-container-left">
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
                    <p className="bio-text standard-text">{this.state.bio}</p>
                    <FriendButton otherId={this.state.id} />
                    <Link to="/messages">
                        <button className="standard-button">Message</button>
                    </Link>
                </div>
                <div className="profile-container-right">
                    <Wall edit={false} id={this.state.id} />
                </div>
            </div>
        );
    }
}
