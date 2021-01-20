import { Link } from "react-router-dom";
import Wall from "./wall";

export default function Profile(props) {
    return (
        <div className="profile-container">
            <div className="profile-container-left">
                <h2 className="title">
                    {props.first} {props.last}
                </h2>
                <div className="bio-image">{props.profilePic}</div>

                {props.bioEditor}

                <Link to="/account">
                    <button className="welcome-button submit-button">
                        Account Settings
                    </button>
                </Link>
            </div>
            <div className="profile-container-right">
                <Wall edit={true} id={props.id}/>
            </div>
        </div>
    );
}
