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
    handleClick(e) {
        e.preventDefault();
        const formData = new FormData();
        const self = this;
        formData.append("image", this.state.file);
        axios
            .post("/upload", formData)
            .then(function ({ data }) {
                if (data.error) {
                    self.setState({ error: true });
                }
                if (data.url) {
                    self.props.setImage(data.url);
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    }
    render() {
        return (
            <div>
                <h2>Change profile picture</h2>
                {this.state.error && <p>Something went wrong.</p>}
                <form
                    name="upload-form"
                    method="POST"
                    action="/upload"
                    encType="multipart/form-data"
                    autoComplete="off"
                >
                    <div>
                        File
                        <input
                            name="image"
                            className="input-file"
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={(e) => this.handleChange(e)}
                        />
                        <label htmlFor="image">{this.state.fileLabel}</label>
                        <button onClick={(e) => this.handleClick(e)}>
                            Upload
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
