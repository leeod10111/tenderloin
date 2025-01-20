import { FiberManualRecord } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React, { useState } from "react";
import * as Tone from "tone";

// Create a global Tone.Recorder instance
export const recorder = new Tone.Recorder();

export const Recorder = () => {
    const [isRecording, setIsRecording] = useState(false);

    const handleRecord = async () => {
        // Ensure the AudioContext is running
        if (Tone.context.state !== "running") {
            await Tone.start();
        }

        if (isRecording) {
            // Stop recording
            setIsRecording(false);

            const recording = await recorder.stop(); // Stop and get recorded audio
            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            const now = new Date().toISOString();
            anchor.download = `loopbox_${now}.webm`; // File name with timestamp
            anchor.href = url;
            anchor.click();
        } else {
            // Start recording
            setIsRecording(true);

            // Connect the recorder to the destination
            recorder.start();
        }
    };

    return (
        <IconButton onClick={handleRecord} size="small">
            <FiberManualRecord color={isRecording ? "success" : "error"} />
        </IconButton>
    );
};

