export default function Profile(props) {
    return (
        <div className="profile-container">
            <h2 className="user-name">
                {props.first} {props.last}
            </h2>
            <div className="bio-image">{props.profilePic}</div>

            {props.bioEditor}
        </div>
    );
}
