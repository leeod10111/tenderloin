import * as Tone from "tone";
import { Button, Grid } from "@mui/material";
import Effect from "./Effect";
import { RestartAltOutlined } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { resetEffects } from "../../redux/effectsSlice";
import { useEffect } from "react";
import {initialState} from "../../redux/effectsSlice"

const initialValues = {...initialState};

const delay = new Tone.FeedbackDelay({ ...initialValues.delay });
const reverb = new Tone.Reverb({ ...initialValues.reverb });
const filter = new Tone.Filter({ ...initialValues.filter });
const phaser = new Tone.Phaser({ ...initialValues.phaser });

export const effects = [delay, reverb, filter, phaser];

const handleChangeReverb = (value) => {
    reverb.wet.value = value / 100;
};

const handleChangeDelay = (value) => {
    delay.wet.value = value / 200;
};

const handleChangeFilter = (value) => {
    filter.frequency.value = value * 15;
};

const handleChangePhaser = (value) => {
    phaser.frequency.value = value / 10;
};

export const Effects = () => {
    const dispatch = useDispatch()
    
    const handleResetEffects = () => {
        delay.delayTime.value = initialValues.delay.delayTime
        delay.feedback.value = initialValues.delay.feedback
        delay.wet.value = initialValues.delay.wet
    
        reverb.wet.value = initialValues.reverb.wet
        reverb.decay = initialValues.reverb.decay
        reverb.preDelay = initialValues.reverb.wet
    
        filter.frequency.value = initialValues.filter.frequency
        
        phaser.frequency.value = initialValues.phaser.frequency

        dispatch(resetEffects())
    };

    useEffect(() => {
        return () => {
            setTimeout(() => {
                handleResetEffects()
            },[1000])
        }
    // eslint-disable-next-line
    },[dispatch])

    return (
        <Grid container spacing={1} height={"100%"} width={"100"} alignContent={"space-between"} justifyContent={"center"}>
            <Grid item xs={12} lg={7} md={10} height={"80%"}>
                <Grid container height={"100%"}  justifyContent={"space-between"}>
                    <Grid item height={"100%"}>
                        <Effect label="Delay" onChange={handleChangeDelay} effectKey={"delay"}/>
                    </Grid>
                    <Grid item height={"100%"}>
                        <Effect label="Reverb" onChange={handleChangeReverb} effectKey={"reverb"} />
                    </Grid>
                    <Grid item height={"100%"}>
                        <Effect label="Filter" onChange={handleChangeFilter} effectKey={"filter"} />
                    </Grid>
                    <Grid item height={"100%"}>
                        <Effect label="Phaser" onChange={handleChangePhaser} effectKey={"phaser"} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={7} md={10}>
                <Button
                    fullWidth
                    size="small"
                    variant="contained"
                    onClick={handleResetEffects}
                    startIcon={<RestartAltOutlined />}
                >
                    RESET EFFECTS
                </Button>
            </Grid>
        </Grid>
    );
};
