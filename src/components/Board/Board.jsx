import { Grid, Box, Typography, Button } from "@mui/material";
import { PlayerButton } from "./PlayerButton/PlayerButton";
import React, { useState, useEffect, debounce } from "react";
import { recorder } from "../../components/Toolbar/Recorder";
import detect from 'bpm-detective'
import * as Tone from "tone";
import { use } from "react";

// Predefined group names
const GROUP_HEADINGS = ["Drums", "Kick", "Snare", "Tops", "Bass", "Chords", "Melodic"];

export const Board = () => {
    const [playerGroups, setPlayerGroups] = useState(
        GROUP_HEADINGS.map(() => Array(4).fill(null)) // Initialize 4 slots per group as null
    );
    const [playerInstances, setPlayerInstances] = useState({});
    const [toneBeats, setBeats] = useState(8);
    const [toneTempo, setTempo] = useState(120);
    const [tempoInput, setTempoInput] = useState(120); // Immediate input value
    const [beatsInput, setBeatsInput] = useState(8); // Immediate input value
    const [setupComplete, setSetupComplete] = useState(false);

    useEffect(() => {
        console.log("Updating Tone.js settings:", { toneTempo, toneBeats });
        // Logic for handling changes in tempo or beats
        // (e.g., stopping loops, recalculating playback rates, etc.)
    }, [toneTempo, toneBeats]);

    const debounce = (callback, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => {
                callback(...args);
            }, delay);
        };
    };

    const handleTempoChange = debounce((value) => {
        setTempo(value); // Update toneTempo after 3 seconds of inactivity
    }, 3000);

    const handleBeatsChange = debounce((value) => {
        setBeats(value); // Update toneBeats after 3 seconds of inactivity
    }, 3000);

    useEffect(() => {
        if (setupComplete) {
            Tone.Transport.start();
            console.log("Transport started with tempo:", toneTempo, "beats:", toneBeats);
        }
    }, [setupComplete]);

    const handleSetupSubmit = () => {
        setTempo(tempoInput); // Update the debounced tempo state
        setBeats(beatsInput); // Update the debounced beats state
        setSetupComplete(true); // Mark setup as complete
    };

    useEffect(() => {
        const updateTempoAndBeats = async () => {
            console.log("Updating tempo and beats...");
            
            // Stop the Transport and all playing loops
            Tone.Transport.stop();
            Tone.Transport.cancel(); // Clear all scheduled events
    
            // Update the Transport tempo
            Tone.Transport.bpm.value = toneTempo;
    
            // Reinitialize all players with the new tempo and beats
            playerGroups.forEach((group, groupIndex) => {
                group.forEach((player, slotIndex) => {
                    if (player && player.player) {
                        const { player: playerInstance } = player;
    
                        // Recalculate playback rate
                        const playbackRate = toneTempo / player.playbackRate;
    
                        // Calculate new loop duration
                        const secondsPerBeat = 60 / toneTempo;
                        const newLoopDuration = toneBeats * secondsPerBeat;
    
                        // Update player settings
                        playerInstance.playbackRate = playbackRate;
                        playerInstance.loopEnd = newLoopDuration;
    
                        // Update the playerGroups state
                        setPlayerGroups((prevGroups) => {
                            const updatedGroups = [...prevGroups];
                            updatedGroups[groupIndex][slotIndex] = {
                                ...player,
                                loopEnd: newLoopDuration.toFixed(2),
                                playbackRate: playbackRate.toFixed(2),
                            };
                            return updatedGroups;
                        });
                    }
                });
            });
    
            // Restart the Transport
            Tone.Transport.start();
        };
        window.setTimeout(() => {
        updateTempoAndBeats();
        }, 1000);
    }, [toneTempo, toneBeats]);

    Tone.Transport.bpm.value = toneTempo;

    const handleFileUpload = async (file, groupIndex, slotIndex, sourcePPQ = 192) => {
        const url = URL.createObjectURL(file);
    
        // Extract BPM using music-metadata-browser or another method
        let fileBPM = 120; // Default BPM if detection fails
    
        try {
            const audioContext = new AudioContext();
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            fileBPM = detect(audioBuffer); // Assume `detect` is a function to detect BPM
            console.log("Detected BPM using bpm-detective:", fileBPM);
        } catch (error) {
            console.error("Error analyzing audio BPM. Using default BPM of 120.", error);
        }
    
        const globalBPM = Tone.Transport.bpm.value; // Global tempo (e.g., 120 BPM)
        
        // Calculate playback rate to match global BPM
        const playbackRate = globalBPM / fileBPM;
        console.log("Playback rate:", playbackRate);
        // Align PPQ
        const ppqRatio = sourcePPQ / Tone.Transport.PPQ; // Ratio of source PPQ to Tone's PPQ
    
        // Set the global BPM explicitly at the current transport time
        Tone.Transport.bpm.setValueAtTime(globalBPM, Tone.Transport.seconds);
    
        // Calculate loop duration adjusted for PPQ
        const beats = toneBeats; // Number of beats in a bar
        const secondsPerBeat = 60 / globalBPM; // Duration of one beat in seconds
        const loopDuration = beats * secondsPerBeat * ppqRatio; // Adjusted loop duration
    
        // Safety buffer to prevent premature cut-offs
        const bufferOffset = 0.17;
    
        // Generate a dynamic title for the uploaded file
        const groupName = GROUP_HEADINGS[groupIndex]; // e.g., "Drums", "Bass"
        const slotNumber = slotIndex + 1; // Adjust to start from 1
        const title = `${groupName.toUpperCase()} ${slotNumber}`; // e.g., "DRUMS 1"
    
        // Load the audio buffer
        const playerBuffer = new Tone.Buffer(url, () => {
            const adjustedLoopDuration = loopDuration / playbackRate;
    
            // Ensure loop duration doesn't exceed the buffer's total duration
            const finalLoopDuration = Math.min(
                adjustedLoopDuration + bufferOffset,
                playerBuffer.duration
            );
    
            // Create a new Tone.Player instance
            const playerInstance = new Tone.Player({
                url,
                volume: -2,
                loop: true,
                playbackRate: playbackRate, // Adjust playback rate to match tempo
            });
    
            // Route the player through the gain node to the recorder
            const gainNode = new Tone.Gain().toDestination(); // Shared gain node for routing
            gainNode.connect(recorder); // Connect gain node to the recorder
            playerInstance.connect(gainNode); // Connect player to gain node
    
            // Configure the player with loop boundaries
            playerInstance.loopStart = 0;
            playerInstance.loopEnd = finalLoopDuration;
    
            // Update playerGroups state
            setPlayerGroups((prevGroups) => {
                const updatedGroups = [...prevGroups];
                updatedGroups[groupIndex][slotIndex] = {
                    title: title,
                    status: "stopped",
                    loopEnd: `${finalLoopDuration.toFixed(2)}`,
                    url,
                    playbackRate: playbackRate.toFixed(2),
                    player: playerInstance, // Attach the player instance for later use
                };
                return updatedGroups;
            });
    
            // Update playerInstances state
            setPlayerInstances((prev) => ({
                ...prev,
                [`${groupIndex}-${slotIndex}`]: playerInstance,
            }));
    
            console.log(`Player for ${title} created with BPM adjustment and connected to recorder.`);
        });
    };
    
    const startAudioContext = async () => {
        if (Tone.context.state !== "running") {
            await Tone.start();
            console.log("AudioContext started.");
        }
    };

    const handlePlay = async (groupIndex, slotIndex) => {
        await startAudioContext();

        const playerKey = `${groupIndex}-${slotIndex}`;
        const playerInstance = playerInstances[playerKey];

        if (playerInstance) {
            if (playerInstance.state === "started") {
                playerInstance.stop();
                Tone.Transport.clear(playerInstance._scheduledEvent); // Clear scheduled events
                console.log(`Stopped loop: ${playerGroups[groupIndex][slotIndex].title}`);
            } else {
                const secondsPerBeat = 60 / toneTempo;
                const loopDuration = toneBeats * secondsPerBeat; // Adjusted loop duration
                const startTime = Tone.Transport.nextSubdivision("1m");

                // Schedule repeat to ensure sync
                const eventId = Tone.Transport.scheduleRepeat(
                    (time) => {
                        playerInstance.start(time);
                    },
                    loopDuration,
                    startTime
                );

                // Store the scheduled event ID for later cancellation
                playerInstance._scheduledEvent = eventId;

                console.log(`Starting loop: ${playerGroups[groupIndex][slotIndex].title} at ${startTime}`);
            }
        }
    };
    

    return (
        <Box>
            {!setupComplete ? (
                <Box mb={4} textAlign="center">
                    <Typography variant="h5" mb={2}>Set Tempo and Beats</Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={2}>
                        <div className="input-adjust">
                            <Typography variant="body1">Tempo (BPM):</Typography>
                            <input
                                type="number"
                                value={tempoInput}
                                onChange={(e) => setTempoInput(parseInt(e.target.value, 10) || 120)}
                                min="40"
                                max="240"
                            />
                        </div>
                        <div className="input-adjust">
                            <Typography variant="body1">Beats per Measure:</Typography>
                            <input
                                type="number"
                                value={beatsInput}
                                onChange={(e) => setBeatsInput(parseInt(e.target.value, 10) || 4)}
                                min="1"
                                max="16"
                            />
                        </div>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSetupSubmit}
                        sx={{ mt: 3 }}
                    >
                        Start Loop Board
                    </Button>
                </Box>
            ) : (
                <Box>
                    
            {/* Display groups with slots */}
            <Grid container spacing={3}>
                {GROUP_HEADINGS.map((groupName, groupIndex) => (
                    <Grid item xs={12} key={groupIndex}>
                        {/* Group Heading */}
                        <Typography variant="h6" textAlign="center" mb={1}>
                            {groupName}
                        </Typography>

                        {/* Group Slots */}
                        <Grid container width={"100%"} height={"100%"} spacing={2}>
                            {playerGroups[groupIndex].map((player, slotIndex) => (
                                <Grid className="group" item xs={12} sm={6} md={3} key={slotIndex}>
                                    {player ? (
                                        <PlayerButton
                                            player={player}
                                            deck={"custom"}
                                            handleOnClick={() => handlePlay(groupIndex, slotIndex)}
                                        />
                                    ) : (
                                        <Box
                                            height={100}
                                            display="flex"
                                            justifyContent="center"
                                            alignItems="center"
                                            border="1px dashed gray"
                                            borderRadius={2}
                                            flexDirection="column"
                                        >
                                            <input
                                                type="file"
                                                accept="audio/*"
                                                style={{ display: "none" }}
                                                id={`file-upload-${groupIndex}-${slotIndex}`}
                                                onChange={(e) =>
                                                    handleFileUpload(
                                                        e.target.files[0],
                                                        groupIndex,
                                                        slotIndex
                                                    )
                                                }
                                            />
                                            <label htmlFor={`file-upload-${groupIndex}-${slotIndex}`}>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    component="span"
                                                    size="small"
                                                >
                                                    Upload
                                                </Button>
                                            </label>
                                            <Typography variant="body2" color="gray" mt={1}>
                                                Empty Slot
                                            </Typography>
                                        </Box>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                ))}
            </Grid>
                </Box>
            )}
        </Box>
    );
};
