export default function Profile(props) {
    return (
        <div>
            <h2>
                {props.first} {props.last}
            </h2>
            <div className="bio-image">{props.profilePic}</div>
            {props.bioEditor}
        </div>
    );
}
