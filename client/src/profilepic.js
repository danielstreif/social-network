export default function ProfilePic({ toggleUploader, first, last, imageUrl }) {
    return (
        <div>
            <h2>Profile Picture</h2>
            <img
                onClick={() => toggleUploader()}
                className="profile-pic"
                src={imageUrl}
                alt={`${first} ${last}`}
            />
        </div>
    );
}
