import { Component } from "react";
import axios from "./axios";

export default class Uploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileLabel: "Choose file",
        };
    }
    handleChange(e) {
        this.setState({
            file: e.target.files[0],
            fileLabel: e.target.files[0].name,
        });
    }
    uploadImage(e) {
        e.preventDefault();
        const formData = new FormData();
        const self = this;
        formData.append("image", this.state.file);
        axios
            .post("/user/image/upload", formData)
            .then(({ data }) => {
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.url) {
                    self.props.setImage(data.url);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    deleteImage(e) {
        e.preventDefault();
        const self = this;
        axios
            .get("/user/image/delete")
            .then(({ data }) => {
                if (data.success) {
                    self.props.setImage(null);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }
    closeModal(e) {
        if (e.target.className === "modal") {
            this.props.toggleModal();
        }
    }
    render() {
        return (
            <div className="modal" onClick={(e) => this.closeModal(e)}>
                <div className="modal-box">
                    <div className="modal-header">
                        <h2>Change profile picture</h2>
                        <button
                            className="close-button"
                            onClick={this.props.toggleModal}
                        >
                            X
                        </button>
                    </div>
                    {this.state.error && (
                        <p className="error-message">Something went wrong...</p>
                    )}
                    <form
                        name="upload-form"
                        method="POST"
                        action="/user/image/upload"
                        encType="multipart/form-data"
                        autoComplete="off"
                    >
                        <input
                            name="image"
                            className="input-file"
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label className="input-field" htmlFor="image">
                            {this.state.fileLabel}
                        </label>
                        <button
                            className="welcome-button submit-button"
                            onClick={(e) => this.uploadImage(e)}
                        >
                            Upload New Image
                        </button>
                        {this.props.imageUrl && (
                            <button
                                className="welcome-button switch-button"
                                onClick={(e) => this.deleteImage(e)}
                            >
                                Delete Current Image
                            </button>
                        )}
                    </form>
                </div>
            </div>
        );
    }
}
