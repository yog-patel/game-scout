import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import GameAPI from '../API/GameAPI.jsx';
// import { APIKey } from "../API/ApiKey.jsx";
import {supabase} from "../DBConnect/SupabaseClient";
// import {APIKey} from "../API/ApiKey.jsx";

const initialState = {
    games: [],
    genre: [],
    selectedGenre: null,
    // gameToSearch: null,
    likedGames:[],
    wishList:[],
};

export const fetchAsyncGenres = createAsyncThunk('games/fetchAsyncGenres', async () => {
    const { data } = await supabase.from("genres").select();
    // console.log("genres",data);
    return data; // Returning fetched data
});
export const fetchAsyncGamesForGivenGenre = async (genre_id, page) => {

    const pageStart = (page-1) * 40 + 1;
    const pageEnd = page * 40;
    const { data } = await supabase.from("Games").select('*').eq('genre', genre_id).range(pageStart, pageEnd);
    localStorage.setItem("games", JSON.stringify(data));
    return data;
}
export const fetchAsyncGamesThatContainsGameToSearch = async(name)=>{
    const { data } = await supabase.from("Games").select().ilike('name', `%${name}%`);
    localStorage.setItem("likedGames", JSON.stringify(data));
    console.log("data", data);
    return data;

}

export const fetchAsyncGamesFromGameId = async (game_id) => {
    const { data } = await supabase.from("Games").select('*').eq('game_id', game_id);
    return data;
}

export const fetchLikedGames = async(user_id)=>{
    const { data } = await supabase.from("liked_games").select().eq('user_id', user_id);
    console.log("data", data);
    return data; // Returning fetched data
}


export const fetchAsyncTotalGamesOfGivenGenre =  async (genre_id) => {
    const { data } = await supabase.from("Games").select().eq('genre', genre_id);
     console.log("length",data.length);
    return data.length; // Returning fetched data
};

const insertLogin = async (email, u_id, name) => {
    const { data, error } = await supabase
        .from('Users')
        .select()
        .eq('u_id', u_id);

    if (error) {
        console.error("Error checking user existence:", error.message);
        return;
    }

    if (data.length > 0) {
        console.log("User already exists");
    } else {
        const { error: insertError } = await supabase
            .from('Users')
            .insert({
                firstName: name,
                lastName: "unknown",
                email: email,
                u_id: u_id,
                access: true,
                role_id: 1,
            });

        if (insertError) {
            console.error("Error inserting user:", insertError.message);
        } else {
            console.log("User inserted successfully");
        }
    }
};

const gameSlice = createSlice({
    name: "games",
    initialState,
    reducers: {
        addLogin(state, action){
            console.log(action.payload);
            insertLogin(action.payload.email, action.payload.u_id,  action.payload.userName );
        },
        gamesForGivenGenre(state, action) {
            const data = fetchAsyncGamesForGivenGenre(action.payload.genre_id);
            state.games.push(data);
            console.log(data);
            console.log(action);
            console.log("state.games",state.games);
        },
        setSelectedGenre: (state, action) => {
            console.log("state.setSelectedGenre action.payload", action);
            state.selectedGenre = action.payload;
        },
        setGameToSearch: (state, action) => {
            console.log("state.setGameToSearch action.payload", action);
            state.gameToSearch= action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAsyncGenres.pending, () => {
                //state.loading = true;
            })
            .addCase(fetchAsyncGenres.fulfilled, (state, action) => {
                //state.loading = false;
                state.genres = action.payload;
            })
            .addCase(fetchAsyncGenres.rejected, () => {
                //state.loading = false;
                //state.error = action.error.message;
            })

    }
})
export default gameSlice.reducer;
export const { addLogin, setGameToSearch,gamesForGivenGenre, setSelectedGenre } = gameSlice.actions;
