import { Link } from "react-router-dom";

export default function Logo() {
    return (
        <Link to={"/"}>
            <h1 className="logo">the network</h1>
        </Link>
    );
}
