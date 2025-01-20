import { Box, Grid } from "@mui/material";
import { Board } from '../Board'
import { DesktopToolbar } from "../../Toolbar/DesktopToolbar";
import "./Desktop.scss"

export const Desktop = ({ board1, board2, handleStopBoards}) => {
    return (
        <Box
            display="flex"
            alignItems={"center"}
            justifyContent={"center"}
            height={"100%"}
        >
            <Grid
                container
                className="board-container"
            >   <div className="board-container-2">
                    <Grid className="item" height={"100%"} item xs={12}>
                        <Board {...board1} />
                    </Grid>
                </div>
                <Grid className="item" height={"100%"} item xs={4}>
                    <Grid height={"100%"} container direction={"column"}>
                        <Grid item xs={2}>
                            <DesktopToolbar handleStopBoards={handleStopBoards} />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};
