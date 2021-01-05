import ReactDOM from "react-dom";
import Welcome from "./welcome";
import Logout from "./logout";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = (
        <div>
            <h1>Home</h1>
            <Logout />
        </div>
    );
}

ReactDOM.render(elem, document.querySelector("main"));
