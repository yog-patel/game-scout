import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Sidebar from "./Components/Sidebar/Sidebar.jsx";
import Header from "./Components/Header/Header.jsx";
import GamesListing from "./Components/GamesListing/GamesListing.jsx";
import GameDetails from "./Components/GameDetails/GameDetails.jsx";
import User from "./Components/User/User.jsx";
import '@fortawesome/fontawesome-free/css/all.min.css';
import LoginPage from "../src/AuthFolder/Login.jsx";
// import 'bootstrap/dist/css/bootstrap.min.css';
function App() {

  return (
      <div className="App">
        <BrowserRouter>
          {/*<Header/>*/}
          {/*<div className="container">*/}
            <Routes>
                <Route path='/game-scout/' element={<LoginPage />}></Route>
                <Route path="/game-scout/home/" element={<><Header/> <Sidebar/>  <GamesListing/></>}/>
                <Route path="/game-scout/home/game/:slug" element={<><Header/> <GameDetails/></>} />
                <Route path="/game-scout/home/:user" element={<><Header/> <User/></>} />
              {/*<Route path="*" element={}/>*/}
            </Routes>
          {/*</div>*/}
          {/*<Footer/>*/}
        </BrowserRouter>
      </div>
  )
}

export default App
