import { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import axios from "./axios";
import Logout from "./logout";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioeditor";
import OtherProfile from "./otherprofile";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        const self = this;
        axios
            .get("/user/profile")
            .then(({ data }) => {
                self.setState({ ...data[0] });
            })
            .catch((err) => console.log(err));
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    profilePic() {
        return (
            <ProfilePic
                first={this.state.first}
                last={this.state.last}
                url={this.state.url}
                toggleModal={() => this.toggleModal()}
            />
        );
    }
    bioEditor() {
        return (
            <BioEditor
                bio={this.state.bio}
                setBio={(bio) => this.setBio(bio)}
            />
        );
    }
    setImage(newProfilePicUrl) {
        this.setState({
            url: newProfilePicUrl,
            uploaderIsVisible: false,
        });
    }
    setBio(newBioText) {
        this.setState({
            bio: newBioText,
        });
    }
    render() {
        return (
            <BrowserRouter>
                <>
                    <header>
                        <Logo />
                        <div className="navbar-image">
                            {this.profilePic()}
                        </div>
                    </header>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                profilePic={this.profilePic()}
                                bioEditor={this.bioEditor()}
                            />
                        )}
                    />

                    <Route
                        path="/user/:id"
                        render={(props) => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />

                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={(image) => this.setImage(image)}
                            toggleModal={() => this.toggleModal()}
                        />
                    )}
                    <Logout />
                </>
            </BrowserRouter>
        );
    }
}
