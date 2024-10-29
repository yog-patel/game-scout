import "./GameCard.css"
import {Link} from "react-router-dom";
import HeartIcon from "../../assets/Heart.jsx";
import {useEffect, useState} from "react";
import {supabase} from "../../DBConnect/SupabaseClient.js";

// eslint-disable-next-line react/prop-types
function GameCard({ data: game }) {


    const info = localStorage.getItem("session");
    const parsedInfo = JSON.parse(info);
    const user_id = parsedInfo.user?.id;

    const [liked, setLiked] = useState(false); // State to track if the game is liked



    useEffect(() => {
        const isLiked = async(game_id, user_id) => {
            let { data, error } = await supabase
                .from('liked_games')
                .select("*")
                .eq('game_id', game_id)
                .eq('user_id', user_id);
            if(data.length>0){
                setLiked(true);
            }
        }
        isLiked(game.game_id, user_id);
    }, [])
    const addLikedGame = async(game_id, user_id)=>{
        const { data, error } = await supabase
            .from('liked_games')
            .insert([
                { game_id: game_id, user_id: user_id},
            ])
            .select();
    }
    const removeLikedGame = async(game_id, user_id)=>{
        const { data, error } = await supabase
            .from('liked_games')
            .delete()
            .eq('game_id', game_id)
            .eq('user_id', user_id)
            .select();
    }

    const handleLikeClick = () => {
        setLiked(!liked);
        // Call the function to like the game (insert logic here)
        if (!liked) {
            // Add logic to insert liked game in the database
            console.log(`Liked game: ${game.name}`);
            console.log(game);
            addLikedGame(game.game_id, user_id);
        } else {
            // Add logic to remove liked game from the database
            console.log(`Unliked game: ${game.name}`);
            removeLikedGame(game.game_id, user_id);
        }
    };
    return (
        //<Link to={`/game-scout/game/${game.slug}`} style={{ textDecoration: "none" }}>
            <div className={"card-item"}>
                <div className={"card-inner"}>
                    <Link to={`/game-scout/game/${game.slug}`} style={{ textDecoration: "none" }}>
                        <div className={"card-top"}>

                            <img src={game.image} alt={game.game_name}></img>

                        </div>
                    </Link>
                    <HeartIcon className={"heart"} onClick={handleLikeClick} liked={liked} />
                    <div className={"card-bottom"}>
                        <div className={"card-info"}>
                            <h4 id={"game-title"}>{game.name}</h4>

                            </div>

                    </div>

                </div>
            </div>
        //</Link>
    );
}

export default GameCard;