export default function Profile(props) {
    return (
        <div>
            <h2>Your Profile</h2>
            {props.first} {props.last}
            <div className="bio-image">{props.profilePic}</div>
            {props.bioEditor}
        </div>
    );
}
