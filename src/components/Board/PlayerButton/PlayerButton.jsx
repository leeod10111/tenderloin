import { Box, Button, Typography } from "@mui/material";
import { PauseCircle, PlayCircle, DeleteOutline} from "@mui/icons-material/";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./PlayerButton.scss";

export const PlayerButton = ({
    handleOnClick,
    player,
    isPlaying,
    deck,
    setPlayingState,
    handleDelete,
}) => {
    // Safely fetch the players array
    const players = useSelector((state) => state.core.decks?.[deck]?.players || []);
    const button = players.find((i) => i.title === player.title) || {
        status: "stopped", // Default status for newly uploaded players
    };

    const handleClick = () => {
        console.log(setPlayingState)
        const newIsPlaying = !isPlaying;
        setPlayingState(newIsPlaying); // Update parent state
        handleOnClick(player); // Trigger parent handler
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
        <button
            className={"player-button"}
            onClick={handleClick}
            fullWidth
            size="large"
            disabled={button.status === "queued"}
            sx={styles.backgroundColor[button.status]}
            color={"inherit"}
        >
            <div position={"relative"}>
            {isPlaying ? (
                    <PauseCircle fontSize="large" className="player-icon" />
                ) : (
                    <PlayCircle fontSize="large" className="player-icon" />
                )}
            </div>
            <p
                sx={{ color: "#fff" }}
            >
                {player.title || "Untitled"}
            </p>
            <span
                color="error"
                onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering the play/pause handler
                    handleDelete(player);
                }}
            >
                <DeleteOutline fontSize="large" />
            </span>
        </button>
    );
};
