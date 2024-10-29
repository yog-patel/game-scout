import {useEffect, useState} from "react";
import "./GamesListing.css";
import {Link, useNavigate} from "react-router-dom";
import {
    fetchAsyncGamesForGivenGenre,
    // fetchAsyncGamesThatContainsGameToSearch,
    fetchAsyncTotalGamesOfGivenGenre
} from "../../Redux/GameSlice.jsx";
import {useSelector} from "react-redux";
import GameCard from "../GameCard/GameCard.jsx";

function GamesListing() {

    const navigate = useNavigate();

    useEffect(()=> {
        const data = localStorage.getItem('session');

        if (data === null) {
            console.log("hello");
            navigate('/game-scout/home/:user');
        }

    },[]);
    useEffect(()=> {
        const data = localStorage.getItem('session');
        if (data === null) {
            console.log("hello");
            navigate('/game-scout/');
        }

    });
    const [games, setGames] = useState([]);
    const [numOfPages, setNumOfPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);


    const selectedGenre = useSelector((state) => state.games.selectedGenre);
    //const gameToSearch = useSelector((state) => state.games.gameToSearch);

    useEffect(() => {
        const getGames = async (genre_id, page = 1) => {
            const data = await fetchAsyncGamesForGivenGenre(genre_id, page);
            const totalPages = await fetchAsyncTotalGamesOfGivenGenre(genre_id);
            setGames(data);
            setNumOfPages(totalPages);
        }

        // Initial load with genre 4 as default
        getGames(4, currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (selectedGenre !== null) {
            const getGames = async (selectedGenre, page ) => {
                const data = await fetchAsyncGamesForGivenGenre(selectedGenre, page);
                const totalPages = await fetchAsyncTotalGamesOfGivenGenre(selectedGenre);
                setGames(data);
                setNumOfPages(totalPages);
            }
            getGames(selectedGenre, currentPage);
        }
    }, [selectedGenre, currentPage]);

    // useEffect(() => {
    //     const searchedGames = async (gameToSearch) => {
    //         fetchAsyncGamesThatContainsGameToSearch(gameToSearch);
    //     }
    //
    // }, [gameToSearch]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }

    // Function to split games into 4 chunks
    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const gameChunks = chunkArray(games, Math.ceil(games.length / 4));
    console.log(gameChunks);

    return (
        <>
            <div className="games-listing">
                {gameChunks.length === 0 ?
                    (
                        <div  style={{color: "White", margin: "40vh", fontSize: "72px"}}>Loading</div>
                    ):
                    (gameChunks.map((chunk, index) => (
                    <div className="games-column" key={index}>
                        <ul className="games-listing-list">
                            {chunk.length === 0 ? (
                                <li key={`no-genre-${index}`}>No Genre</li>
                            ) : (
                                chunk.map((game) => (
                                    <li key={game.game_id}>
                                        <GameCard data={game}/>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )))}
            </div>

            <nav aria-label="Page navigation example" className={"pagination-nav"}>
                <ul className="pagination">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous
                        </button>
                    </li>
                    {Array.from({length: (numOfPages / 90)}, (_, index) => (
                        <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === numOfPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </>
    )
}

export default GamesListing;
