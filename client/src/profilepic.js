export default function ProfilePic(props) {
    let imageUrl = props.url;
    if (imageUrl === null) {
        imageUrl = "img/placeholder.png";
    }
    return (
        <img
            onClick={props.toggleModal}
            className="profile-pic"
            src={imageUrl}
            alt={`${props.first} ${props.last}`}
        />
    );
}
