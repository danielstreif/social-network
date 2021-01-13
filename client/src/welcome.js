import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Login from "./login";
import Reset from "./reset";
import Footer from "./footer";

export default function Welcome() {
    return (
        <>  
            <div></div>
            <HashRouter>
                <>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={Reset} />
                </>
            </HashRouter>
            <Footer />
        </>
    );
}
