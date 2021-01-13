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
                <button className="header-button">
                    <Link to="/users">Search</Link>
                </button>
                <button className="header-button">
                    <Link to="/">Home</Link>
                </button>
                <button className="header-button">
                    <Logout />
                </button>
            </div>
        </header>
    );
}
