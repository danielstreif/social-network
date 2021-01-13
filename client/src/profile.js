export default function Profile(props) {
    return (
        <div>
            <div className="bio-image">{props.profilePic}</div>
            <h2>
                {props.first} {props.last}
            </h2>
            {props.bioEditor}
        </div>
    );
}
