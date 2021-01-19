import { Link } from "react-router-dom";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Logo from "./logo";
import Logout from "./logout";

export default function Header(props) {
    const matches = useMediaQuery("(max-width: 720px)");

    return (
        <header>
            <Logo />
            {matches && (
                <img
                    className="mobile-menu"
                    src="/img/hamburgermenu.svg"
                    alt="menu"
                />
            )}
            {!matches && (
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
                        <Link className="header-link" to="/friends">
                            Friends
                        </Link>
                    </button>
                    <button className="header-button">
                        <Link className="header-link" to="/chat">
                            Messages
                        </Link>
                    </button>
                    <button className="header-button">
                        <Logout />
                    </button>
                </div>
            )}
        </header>
    );
}
