import { Grid } from "@mui/material"
import { Recorder } from "./Recorder"
import { StopButton } from "./StopButton"
import { BackButton } from "./BackButton"

export const DesktopToolbar = ({
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
        </Grid>
    )
}