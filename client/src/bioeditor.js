import { Component } from "react";
import axios from "./axios";

export default class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textareaVisible: false,
            draftBio: "",
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
                <button onClick={() => this.toggleTextarea()}>Add Bio</button>
            </div>
        );
    }
    displayMode() {
        return (
            <div>
                <p>{this.props.bio}</p>
                <button onClick={() => this.toggleTextarea()}>Edit Bio</button>
            </div>
        );
    }
    editMode() {
        return (
            <div>
                {this.state.error && <p>Something went wrong.</p>}
                <textarea
                    onChange={(e) => this.handleChange(e)}
                    value={this.state.draftBio}
                />
                <button onClick={() => this.resetTextarea()}>Close</button>
                <button onClick={() => this.handleUpload()}>Save</button>
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
