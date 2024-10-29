import {configureStore} from "@reduxjs/toolkit";
import gameReducer from "./GameSlice.jsx";
import {thunk} from "redux-thunk";

export const store = configureStore({
    reducer: {
        games: gameReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});