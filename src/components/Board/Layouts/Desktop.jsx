import { Box, Grid } from "@mui/material";
import { Board } from '../Board'
import "./Desktop.scss"

export const Desktop = ({ board1}) => {
    return (
       <div class="loopbox-container">
            <Board {...board1} />
       </div>
    );
};
