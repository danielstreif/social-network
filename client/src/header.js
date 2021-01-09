import { Link } from "react-router-dom";
import Logo from "./logo";
import Logout from "./logout";

export default function Header(props) {
    return (
        <header>
            <div>
                <Logo />
            </div>
            <div className="navbar-menu">
                <div className="navbar-image">{props.profilePic}</div>
                <button>
                    <Link to="/">Home</Link>
                </button>
                <Logout />
            </div>
        </header>
    );
}
