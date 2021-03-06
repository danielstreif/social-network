import { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import axios from "./axios";
import Header from "./header";
import Footer from "./footer";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Profile from "./profile";
import BioEditor from "./bioEditor";
import OtherProfile from "./otherProfile";
import NotFound from "./notFound";
import FindPeople from "./findPeople";
import Friends from "./friends";
import Account from "./account";
import Chat from "./chat";
import Messages from "./messages";

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
                self.setState({ ...data });
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
                onClick={() => this.toggleModal()}
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
        if (!this.state.id) {
            return null;
        }
        return (
            <BrowserRouter>
                <>
                    <Header profilePic={this.profilePic()} />
                    <div className="app-container">
                        <Switch>
                            <Route
                                exact
                                path="/"
                                render={() => (
                                    <Profile
                                        id={this.state.id}
                                        first={this.state.first}
                                        last={this.state.last}
                                        profilePic={this.profilePic()}
                                        bioEditor={this.bioEditor()}
                                    />
                                )}
                            />
                            <Route
                                path="/users/:id"
                                render={(props) => (
                                    <OtherProfile
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />

                            <Route
                                path="/users"
                                render={() => <FindPeople />}
                            />

                            <Route path="/friends" render={() => <Friends />} />

                            <Route path="/chat" render={() => <Chat />} />

                            <Route
                                path="/messages/:id"
                                render={(props) => (
                                    <Messages
                                        key={props.match.url}
                                        match={props.match}
                                        history={props.history}
                                    />
                                )}
                            />

                            <Route
                                path="/account"
                                render={() => (
                                    <Account
                                        first={this.state.first}
                                        last={this.state.last}
                                        email={this.state.email}
                                    />
                                )}
                            />

                            <Route component={NotFound} />
                        </Switch>
                    </div>
                    {this.state.uploaderIsVisible && (
                        <Uploader
                            setImage={(image) => this.setImage(image)}
                            toggleModal={() => this.toggleModal()}
                            imageUrl={this.state.url}
                        />
                    )}
                    <Footer />
                </>
            </BrowserRouter>
        );
    }
}
