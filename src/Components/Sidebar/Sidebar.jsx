// import {supabase} from "../../DBConnect/SupabaseClient.js";
// import {APIKey} from "../../API/ApiKey.jsx";
import "./Sidebar.css"
import {useEffect, useState} from "react";
import {fetchAsyncGenres, setSelectedGenre} from "../../Redux/GameSlice.jsx";
import {useDispatch} from "react-redux";

function Sidebar() {
    const [genres, setGenres] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getGenres = async () => {
            const data = await dispatch(fetchAsyncGenres());
            setGenres(data.payload);
        };
        getGenres();
    }, []);

    const handleGenreClick = (genre) => {
        dispatch(setSelectedGenre(genre.genre_id)); // Dispatch the selected genre
    };


    return(
        <>

            <div className="sidebar">

                <span>Genre</span>
                {
                    <ul>
                        {(genres.length === 0) ? (
                            <li>No Genre</li>
                        ) : (
                            genres.map((genre) => (
                                <li className={"genre-list"} key={genre.genre_id} onClick={() => {handleGenreClick(genre)}}>
                                    <img className={"genre-img"} src={genre.image} alt={genre.genre_name}/>
                                    {genre.genre_name}
                                </li>
                            ))
                        )}
                    </ul>
                }
            </div>
        </>
    );
}

export default Sidebar;