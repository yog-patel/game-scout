import "./User.css";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../DBConnect/SupabaseClient.js";
import { fetchLikedGames, fetchAsyncGamesFromGameId } from "../../Redux/GameSlice.jsx";
import { useEffect, useState } from "react";
import GameCard from "../GameCard/GameCard.jsx";

function User() {

    useEffect(()=> {
        const data = localStorage.getItem('session');

        if (data === null) {
            console.log("hello");
            navigate('/game-scout/:user');
        }

    },[]);
    useEffect(()=> {
        const data = localStorage.getItem('session');
        if (data === null) {
            console.log("hello");
            navigate('/');
        }

    });

    const navigate = useNavigate();
    const [likedGames, setLikedGames] = useState([]);

    // Retrieve user ID and metadata from session storage
    const session = JSON.parse(localStorage.getItem("session"));
    const user_id = session?.user?.id;
    const userName = session?.user?.user_metadata?.userName;
    const userEmail = session?.user?.email;

    useEffect(() => {
        const getFav = async () => {
            try {
                // Fetch liked games and detailed information for each
                const favGames = await fetchLikedGames(user_id);
                const gamesInfo = await Promise.all(
                    favGames.map(async (game) => {
                        const gameInfo = await fetchAsyncGamesFromGameId(game.game_id);
                        return gameInfo;
                    })
                );

                setLikedGames(gamesInfo);
            } catch (error) {
                console.error("Error fetching liked games:", error);
            }
        };

        if (user_id) {
            getFav();
        }
    }, [user_id]);

    // Handle user logout
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            navigate("/");
        } else {
            console.error("Error during logout:", error);
        }
    };

    return (
        <div className="user-container">
            <a className="log-out-button" onClick={handleLogout}>
                Log-out
            </a>
            <h1>{userName}</h1>
            <div className="user-info">
                <span>{userEmail}</span>
            </div>
            <h1>Liked Games:</h1>
            <div className="liked-games">
                <ul className="games-listing-list liked-games">
                    {likedGames.length > 0 ? (
                        likedGames.map((game, index) => (
                            <li key={index}>
                                <GameCard data={game[0]}/>
                            </li>
                        ))
                    ) : (
                        <li>No Liked Games</li>
                    )}
                </ul>
            </div>
        </div>
);
}

export default User;
