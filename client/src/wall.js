import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getWallPosts, addWallPost } from "./redux/actions";
import useStatefulFields from "./hooks/useStatefulFields";

export default function Wall({ edit, id }) {
    const [values, handleChange] = useStatefulFields();
    const [imgFile, setImgFile] = useState();
    const [imgFileLabel, setImgFileLabel] = useState(
        "Add a photo to your wall"
    );
    const dispatch = useDispatch();
    const wallPosts = useSelector((state) => state.wallPosts);
    const [showModal, setModal] = useState(false);
    const [activePost, setPostActive] = useState({});
    const error = useSelector((state) => state.error);

    useEffect(() => {
        dispatch(getWallPosts(id));
    }, [id]);

    if (!id || !wallPosts) {
        return <p>Loading</p>;
    }

    const toggleModal = (post) => {
        setPostActive(post);
        setModal(!showModal);
    };

    const handleFileChange = (e) => {
        setImgFile(e.target.files[0]);
        setImgFileLabel(e.target.files[0].name);
    };

    const uploadPost = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", imgFile);
        formData.append("description", values.description);
        dispatch(addWallPost(formData));
        resetForm();
        setImgFileLabel("Add a photo to your wall");
    };

    const resetForm = () => {
        document.getElementById("wall-upload-form").reset();
    };

    const makePost = (
        <form
            className="post-container"
            name="upload-form"
            id="wall-upload-form"
            method="POST"
            action="/user/wall/upload"
            encType="multipart/form-data"
            autoComplete="off"
        >
            <input
                name="wall-image"
                className="input-file"
                id="wall-image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
            />
            <label className="input-field" htmlFor="wall-image">
                {imgFileLabel}
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

    const modal = (
        <div className="modal" onClick={toggleModal}>
            <div className="modal-img-box">
                <button className="close-button modal-close" onClick={toggleModal}>
                    X
                </button>
                <img src={activePost.url} alt={`Image ${activePost.id}`} />
                <p className="standard-text">{activePost.description}</p>
            </div>
        </div>
    );

    return (
        <>
            {error && <p className="error-message">Something went wrong...</p>}
            {showModal && modal}
            {edit && makePost}
            {wallPosts.length == 0 && (
                <p className="standard-text">No posts yet</p>
            )}
            {wallPosts && (
                <>
                    {wallPosts.map((post) => (
                        <div
                            className="post-container"
                            key={post.id}
                            onClick={() => toggleModal(post)}
                        >
                            <img src={post.url} alt={`Image ${post.id}`} />
                            <p className="standard-text">{post.description}</p>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
