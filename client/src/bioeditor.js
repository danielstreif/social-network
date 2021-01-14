import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisible: false,
            draftBio: this.props.bio,
        };
    }
    handleChange(e) {
        this.setState({
            draftBio: e.target.value,
        });
    }
    handleUpload() {
        const input = { bio: this.state.draftBio };
        const self = this;
        axios
            .post("/user/bio/edit", input)
            .then(({ data }) => {
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.success) {
                    self.props.setBio(self.state.draftBio);
                    self.toggleTextarea();
                }
            })
            .catch((err) => {
                console.log(err);
                self.setState({ error: true });
            });
    }
    toggleTextarea() {
        this.setState({
            textareaVisible: !this.state.textareaVisible,
        });
    }
    resetTextarea() {
        this.setState({
            draftBio: this.props.bio,
        });
        this.toggleTextarea();
    }
    emptyMode() {
        return (
            <div>
                <button
                    className="bio-button add-button"
                    onClick={() => this.toggleTextarea()}
                >
                    Add Bio
                </button>
            </div>
        );
    }
    displayMode() {
        return (
            <div>
                <p className="bio-text">{this.props.bio}</p>
                <button
                    className="bio-button edit-button"
                    onClick={() => this.toggleTextarea()}
                >
                    Edit Bio
                </button>
            </div>
        );
    }
    editMode() {
        return (
            <div className="bio-container">
                {this.state.error && <p>Something went wrong.</p>}
                <textarea
                    className="bio-textarea"
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.draftBio}
                />
                <button
                    className="bio-button save-button"
                    onClick={() => this.handleUpload()}
                >
                    Save
                </button>
                <button
                    className="bio-button"
                    onClick={() => this.resetTextarea()}
                >
                    Close
                </button>
            </div>
        );
    }
    render() {
        return (
            <>
                {this.state.textareaVisible && this.editMode()}
                {!this.state.textareaVisible &&
                    this.props.bio &&
                    this.displayMode()}
                {!this.state.textareaVisible &&
                    !this.props.bio &&
                    this.emptyMode()}
            </>
        );
    }
}
