import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
    delay: {
        delayTime: "8n",
        feedback: 0.5,
        wet: 0,
        value: 0
    },
    reverb: {
        wet: 0,
        decay: 10,
        preDelay: 0.01,
        value: 0
    },
    filter: {
        frequency: 0,
        type: "highpass",
        rolloff:-96,
        value: 0
    },
    phaser: {
        frequency: 0,
        octaves: 4,
        stages: 10,
        Q: 0.5,
        baseFrequency: 1000,
        wet:1,
        value: 0
      },
};

export const effectsSlice = createSlice({
    name: "effects",
    initialState:{...initialState},
    reducers: {
        updateEffect: (state, action) => {
            state[action.payload.key] = action.payload.value
        },
        resetEffects: (state, action) => {
            state.delay = {...initialState.delay};
            state.reverb = {...initialState.reverb};
            state.filter = {...initialState.filter};
            state.phaser = {...initialState.phaser};
        },
    },
});

export const {
    updateEffect,
    resetEffects
} = effectsSlice.actions;

export default effectsSlice.reducer;