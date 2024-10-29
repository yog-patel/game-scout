import "./Header.css";
import user from "../../assets/user.png"
import {Link, useNavigate} from "react-router-dom";
import Search from "./Search/Search.jsx";
import {supabase} from "../../DBConnect/SupabaseClient.js";

function Header() {

    const navigate = useNavigate();

    return (
        <header>
            <div className="header">
                <Link to="/game-scout/home/" style={{textDecoration: "none"}}>
                    <div className="logo">
                        Game Scout
                    </div>
                </Link>
                <Search/>
                <div className="user-image">
                    <Link to="/game-scout/home/user" style={{textDecoration: "none"}}>
                        <img id={"user-img"} src={user} alt={"User-image"}/>
                    </Link>
                </div>
            </div>
        </header>
    );
}

export default Header;