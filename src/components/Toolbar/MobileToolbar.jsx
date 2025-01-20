import { Grid, IconButton } from "@mui/material"
import { Recorder } from "./Recorder"
import { StopButton } from "./StopButton"
import { BackButton } from "./BackButton"

export const MobileToolbar = ({
    board,
    handleSetBoard,
    handleStopBoards
}) => {
    return (
        <Grid container justifyContent={"center"} alignItems={"center"} >
            <Grid display={"flex"} justifyContent={"center"} item xs={3}>
                <BackButton />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={3}>
                <Recorder />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={3}>
                <StopButton handleStop={handleStopBoards} />
            </Grid>
            <Grid display={"flex"} justifyContent={"center"} item xs={3}>
                <IconButton
                    onClick={handleSetBoard}
                    size="small"
                    style={{"color":"wheat"}}
                    variant="text"
                >
                    {board}
                </IconButton>
            </Grid>
        </Grid>
    )
}