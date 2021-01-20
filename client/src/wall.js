import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallPosts, addWallPost } from "./redux/actions";
import useStatefulFields from "./hooks/useStatefulFields";

export default function Wall({ edit, id }) {
    const [values, handleChange] = useStatefulFields();
    const [file, setFile] = useState();
    const [fileLabel, setFileLabel] = useState("Add a photo to your wall");
    const dispatch = useDispatch();
    const wallPosts = useSelector((state) => state.wallPosts);
    const error = useSelector((state) => state.error);

    useEffect(() => {
        dispatch(getWallPosts(id));
    }, [id]);

    if (!id || !wallPosts) {
        return <p>Loading</p>;
    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileLabel(e.target.files[0].name);
    };

    const uploadPost = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", file);
        formData.append("description", values.description);
        dispatch(addWallPost(formData));
    };

    const makePost = (
        <form
            className="post-container"
            name="upload-form"
            method="POST"
            action="/user/wall/upload"
            encType="multipart/form-data"
            autoComplete="off"
        >
            <input
                name="image"
                className="input-file"
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <label className="input-field" htmlFor="image">
                {fileLabel}
            </label>
            <input
                className="input-field"
                name="description"
                placeholder="Description"
                type="text"
                onChange={handleChange}
            />
            <button
                className="standard-button submit-button"
                onClick={uploadPost}
            >
                Submit
            </button>
        </form>
    );
    return (
        <>
            {error && <p className="error-message">Something went wrong...</p>}
            {edit && makePost}
            {wallPosts.length == 0 && <p>No posts yet</p>}
            {wallPosts && (
                <>
                    {wallPosts.map((post) => (
                        <div className="post-container" key={post.id}>
                            <img src={post.url} alt={`Image ${post.id}`} />
                            <p>{post.description}</p>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
