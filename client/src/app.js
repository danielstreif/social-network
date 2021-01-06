import { Component } from "react";
import axios from "./axios";
import Logout from "./logout";
import Logo from "./logo";
import ProfilePic from "./profilepic";
import Uploader from "./uploader";

export default class App extends Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
    }
    componentDidMount() {
        axios
            .post("/user")
            .then(({ data }) => {
                let { first, last, url } = data[0];
                if (!url) {
                    url = "img/placeholder.png";
                }
                this.setState({
                    first: first,
                    last: last,
                    imageUrl: url,
                });
            })
            .catch((err) => console.log(err));
    }
    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    setImage(newProfilePicUrl) {
        this.setState({
            imageUrl: newProfilePicUrl,
            uploaderIsVisible: false,
        });
    }
    render() {
        return (
            <div>
                <Logo />
                <ProfilePic
                    toggleUploader={() => this.toggleUploader()}
                    first={this.state.first}
                    last={this.state.last}
                    imageUrl={this.state.imageUrl}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImage={(image) => this.setImage(image)}
                        toggleUploader={() => this.toggleUploader()}
                    />
                )}
                <Logout />
            </div>
        );
    }
}
