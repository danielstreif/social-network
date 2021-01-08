export default function ProfilePic(props) {
    let imageUrl = props.url;
    if (imageUrl === null || imageUrl === undefined) {
        imageUrl = "/img/placeholder.png";
    }
    return (
        <img
            onClick={props.onClick}
            className="profile-pic"
            src={imageUrl}
            alt={`${props.first} ${props.last}`}
        />
    );
}
