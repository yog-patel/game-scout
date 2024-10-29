import { useParams } from "react-router-dom";
import {useEffect, useState} from "react";
import {supabase} from "../../DBConnect/SupabaseClient.js";
import "./GameDetails.css"
import data from "bootstrap/js/src/dom/data.js";

function GameDetails() {

    const fetchGameDetails = async (name) => {
        const { data } = await supabase.from("game_details").select('*').eq('game_slug', name).limit(1);
        console.log("game_details",data);
        return data[0];
    }
    const fetchGameName = async (name) => {
        const { data } = await supabase.from("Games").select('name').eq('slug', name).limit(1);
        console.log("game_details",data);
        return data[0];
    }

    const [gameDetails, setGameDetails] = useState([]);
    const [name, setName] = useState("");
    const { slug } = useParams();

    useEffect(() => {
        const gameInfo = async () => {
            const data = await fetchGameDetails(slug);
            //const name = fetchGameName(slug);
            console.log(data);
            setGameDetails(data);
            //setName(name);
        }
        const gameName = async () => {
            const name = await fetchGameName(slug);
            setName(name);
            console.log("name",name);
        }
        gameName();
        gameInfo();
    },[]);
    const returnInfo = (arrayOfString) => {
        let tempArray = [];
        for(let i = 0; i < arrayOfString.length; i ++) {
            tempArray.push(arrayOfString[i]);
        }
        return tempArray[0];
    }
    // console.log(gameDetails);
    return (
        <>
            <div className="movie-section">
                <div className="section-left">
                    <div className="movie-title">
                        {name.name}
                    </div>
                    <div className="movie-rating">
                        <span>
                            Game Rating <i className="fa-solid fa-star"></i> : {gameDetails.rating}
                        </span>
                        <span>
                            Released <i className="fa fa-calendar"></i> : {gameDetails.released}
                        </span>
                    </div>

                    <div className="movie-info">
                        <div>
                            <span>Platforms</span>
                            <span>{(gameDetails.platforms)}</span>
                        </div>
                        <div>
                            <span>Publishers</span>
                            <span>{gameDetails.publishers}</span>
                        </div>
                        <div>
                            <span>Website</span>
                            <span>{<a href={gameDetails.website}>{gameDetails.website}</a>}</span>
                        </div>
                        <div>
                            <span>Tags</span>
                            <span>{gameDetails.tags}</span>
                        </div>

                    </div>

                </div>
                <div className="section-right">
                    <img id={"gd-img"} src={gameDetails.image} alt={gameDetails.name}/>
                </div>
            </div>
            <h2 className={"game-description-title"}><span>Game Description</span></h2>
            <div className="movie-plot"><span>{gameDetails.description}</span></div>
        </>
    )
}

export default GameDetails;