import { Component } from "react";
import axios from "./axios";
import Logout from "./logout";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioeditor";

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
            .get("/user")
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
            <>
                <header>
                    <Logo />
                    <div className="navbar-image">
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.url}
                            toggleModal={() => this.toggleModal()}
                        />
                    </div>
                </header>
                <Profile
                    first={this.state.first}
                    last={this.state.last}
                    profilePic={
                        <ProfilePic
                            id={this.state.id}
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.url}
                            toggleModal={() => this.toggleModal()}
                        />
                    }
                    bioEditor={
                        <BioEditor bio={this.state.bio} setBio={(bio) => this.setBio(bio)} />
                    }
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImage={(image) => this.setImage(image)}
                        toggleModal={() => this.toggleModal()}
                    />
                )}
                <Logout />
            </>
        );
    }
}
