import {useState} from "react";
import {fetchAsyncGamesThatContainsGameToSearch} from "../../../Redux/GameSlice.jsx";
import "./Search.css";
import {Link} from "react-router-dom";


function Search() {
    const [search, setSearch] = useState("");
    const [results, setResults] = useState([]);


    const handleSearch = (search, e) => {
        e.preventDefault();
        window.addEventListener('mouseup',function(event){
            let pol = document.getElementById('search__results');
            if(event.target !== pol && event.target.parentNode !== pol){
                pol.style.display = 'none';
            }
        });
        if(search.trim().length > 0){
            const searched = async (search) => {
                const res = await fetchAsyncGamesThatContainsGameToSearch(search);
                await setResults(res);
                console.log(res);
            }
            // const res = searched(search);
            searched(search);
            document.getElementById("search__results").style.display = "block";
        }
        else{
            document.getElementById("search__results").style.display = "none";
        }

    };

    return (
        <>
            <form>
                <input id={"header__search__input"} className={"header__search__input header__search__input_with-results"} type={"text"}
                       placeholder={"Search any games..."} onChange={(e) => (setSearch(e.target.value), handleSearch(search, e))}
                       />
                {/*<button id={"search-btn"} onClick={(e) => handleSearch(search, e)}>Search</button>*/}
                <div id={"search__results"} className="search__results" style={{display:"none"}} >
                    {
                        results.length === 0 ? (
                            <li></li>
                        ) : (
                        results.map((game) => (

                            <li key={game.game_id} className={"result"}>
                                <Link to={`/game-scout/home/game/${game.slug}`} style={{ textDecoration: "none" }}>
                                <div className="result-item">
                                    {/*<div className="result-item-img">*/}
                                        <img className={"result-img"} src={game.image} alt={game.name}/>
                                        <span className="result-item-name">{game.name}</span>
                                    {/*</div>*/}
                                </div>
                                </Link>
                            </li>

                        ))
                        )
                    }

                </div>
            </form>
        </>
    )
}

export default Search