import { Link } from "react-router-dom";
import Logo from "./logo";
import Logout from "./logout";

export default function Header(props) {
    return (
        <header>
            <Logo />
            <img className="mobile-menu" src="/img/hamburgermenu.svg" alt="menu" />
            <div className="navbar-menu">
                <button className="header-button">
                    <Link className="header-link" to="/users">
                        Search
                    </Link>
                </button>
                <div className="navbar-image">{props.profilePic}</div>
                <button className="header-button">
                    <Link className="header-link" to="/">
                        Profile
                    </Link>
                </button>
                <button className="header-button">
                    <Logout />
                </button>
            </div>
        </header>
    );
}
