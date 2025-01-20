import * as React from "react";
import { Box, Typography } from "@mui/material";
import Slider from "@mui/material/Slider";
import "./Effect.scss";
import { useDispatch, useSelector } from "react-redux";
import { updateEffect } from "../../redux/effectsSlice";

export default function Effect({ onChange, label, effectKey }) {
    const effect = useSelector((state) => state.effects[effectKey]);
    const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        dispatch(
            updateEffect({
                key: effectKey,
                value: {
                    ...effect,
                    value: newValue,
                },
            })
        );
        onChange(newValue);
    };

    return (
        <Box
            height={"100%"}
            flexDirection={"column"}
            display={"flex"}
            justifyContent={"center"}
            alignContent={"center"}
        >
            <Box pb={2} height={"80%"}>
                <Slider
                    className="effect-slider"
                    orientation="vertical"
                    aria-label="Volume"
                    value={effect ? effect.value : 0}
                    onChange={handleChange}
                />
            </Box>
            <Box height={"20%"}>
                <Typography className="effect-slider-text" variant="subtitle2">
                    {label}
                </Typography>
            </Box>
        </Box>
    );
}
