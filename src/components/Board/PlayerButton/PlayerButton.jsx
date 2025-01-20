import { Box, Button, Typography } from "@mui/material";
import { PauseCircle, PlayCircle } from "@mui/icons-material/";
import { useSelector } from "react-redux";
import "./PlayerButton.scss";

export const PlayerButton = ({ handleOnClick, player, deck }) => {
    // Safely fetch the players array
    const players = useSelector((state) => state.core.decks?.[deck]?.players || []);
    const button = players.find((i) => i.title === player.title) || {
        status: "stopped", // Default status for newly uploaded players
    };

    // Define styles for different statuses
    const styles = {
        status: {
            started: <PauseCircle fontSize="small" className="player-icon" />,
            stopped: <PlayCircle fontSize="small" className="player-icon" />,
            queued: <PlayCircle fontSize="small" className="player-icon" />,
        },
        backgroundColor: {
            queued: {
                WebkitAnimation: "glowing 1000ms infinite",
                animation: "glowing 1000ms infinite",
                backgroundColor: `#888 !important`,
            },
            started: { backgroundColor: `#555 !important` },
            stopped: { backgroundColor: `#333 !important` },
        },
    };

    return (
        <Button
            className={"player-button"}
            onClick={() => handleOnClick(button, player)}
            fullWidth
            size="large"
            disabled={button.status === "queued"}
            sx={styles.backgroundColor[button.status]}
            color={"inherit"}
        >
            <Box position={"relative"}>
                {styles.status[button.status] || styles.status.stopped}
            </Box>
            <Typography
                variant="caption"
                textAlign="center"
                sx={{ color: "#fff" }}
            >
                {player.title || "Untitled"}
            </Typography>
        </Button>
    );
};
