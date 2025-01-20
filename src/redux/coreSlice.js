import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    "isStarted":false,
    "decks": {
        "a":{
            "isLoading":true,
            "players": []
        },
        "b":{
            "isLoading":true,
            "players": []
        }
    }
};

export const coreSlice = createSlice({
    name: "core",
    initialState,
    reducers: {
        loadPlayers: (state, action) => {
            const deck = action.payload.deck
            state.id = action.payload.id;
            state.decks[deck].players = action.payload.players;
        },
        startReduxContext: (state, action) => {
            state.context.isStarted = true;
        },
        updateButtonState: (state, action) => {
            const { deck, title, status, parent } = action.payload;
        
            // Check if the deck and players exist
            if (!state.decks[deck] || !state.decks[deck].players) return;
        
            const players = state.decks[deck].players;
        
            // Safely find the player
            const player = players.find((i) => i.title === title);
        
            if (player) {
                player.status = status;
        
                if (status === "started") {
                    // Stop other buttons in the same group
                    players
                        .filter((i) => i.parent === parent && i.title !== title)
                        .forEach((i) => (i.status = "stopped"));
                }
            }
        },
        stopPlayers: (state, action) => {
            const deck = action.payload.deck
            state.decks[deck].players
                .forEach((i) => (i.status = "stopped"))
        },
        resetPlayers: (state, action) => {
            state.decks = initialState.decks;
            state.isStarted = false;
        },
    },
});

// Action creators are generated for each case reducer function
export const {
    updateButtonState,
    startReduxContext,
    loadPlayers,
    resetPlayers,
    stopPlayers
} = coreSlice.actions;

export default coreSlice.reducer;
