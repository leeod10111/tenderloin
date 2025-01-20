import * as Tone from "tone";
import loopkits from "../data/loopkits.json";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
    loadPlayers,
    resetPlayers,
    stopPlayers,
    updateButtonState,
} from "../redux/coreSlice";
import { recorder } from "../components/Toolbar/Recorder";

let playerQueue = [];
const Transport = Tone.Transport;

export const usePlayers = ({ id, deck }) => {
    const [loadedLoops, setLoadedLoops] = useState(0);
    const loopkit = loopkits.list.find((i) => i.id === id);
    const loadingProgress = Math.round(
        (loadedLoops * 100) / loopkit.loops[deck].length
    );
    const dispatch = useDispatch();

    Transport.bpm.value = loopkit ? loopkit.bpm : "124";

    // Create a shared gain node for routing
    const gainNode = useMemo(() => new Tone.Gain().toDestination(), []);

    // Connect the recorder to the gain node
    useEffect(() => {
        gainNode.connect(recorder); // Recorder now gets input from gainNode
        console.log("Gain node connected to recorder");
    }, [gainNode]);

    const players = useMemo(() => {
        return (
            loopkit &&
            loopkit.loops[deck].map((i) => {
                const player = new Tone.Player({
                    url: process.env.PUBLIC_URL + `${i.url}`,
                    onload: () => setLoadedLoops((state) => state + 1),
                    volume: -2,
                });

                // Route the player through the gain node
                player.connect(gainNode);

                return {
                    ...i,
                    loop: player,
                };
            })
        );
    }, [loopkit, deck, gainNode]);

    const startContext = async () => {
        await Tone.start();
        Transport.start();
    };

    const startPlayer = async (player) => {
        const group = players.filter((i) => i.parent === player.parent);
        const music = players.find((i) => i.title === player.title).loop;
        const otherPlayersInGroup = group.filter((i) => i.title !== player.title);

        // Start the player
        music.loop = true;
        music.loopStart = "00:00";
        music.loopEnd = player.loopEnd;
        music
            .sync()
            .start(Transport.blockTime);
        music.volume.value = -2;

        console.log(`${player.title} started, routed through recorder`);

        // Stop other players in the group
        otherPlayersInGroup.forEach((i) => {
            i.loop.volume.value = 0;
            i.loop.unsync().stop();
        });

        dispatch(
            updateButtonState({
                deck: deck,
                parent: player.parent,
                title: player.title,
                status: "started",
            })
        );
    };

    const stopPlayer = (player) => {
        const music = player.loop;
        music.volume.value = 0;
        music.unsync().stop();
        console.log(`${player.title} stopped`);
        dispatch(
            updateButtonState({
                deck: deck,
                title: player.title,
                status: "stopped",
            })
        );
    };

    const stopBoard = () => {
        Transport.stop();
        players.forEach((i) => i.loop.unsync().stop());
        playerQueue = [];
        dispatch(stopPlayers({ deck: deck }));
    };

    const addToQueue = (callback, title) => {
        callback && playerQueue.push(callback);
        dispatch(updateButtonState({ title: title, status: "queued", deck: deck }));
    };

    const handleOnClick = async (button, player) => {
        if (Tone.context.state !== "started") {
            await startContext();
        }

        if (button.status === "started") {
            addToQueue(() => stopPlayer(player), player.title);
            return;
        }

        if (button.status === "stopped") {
            addToQueue(() => startPlayer(player), player.title);
            return;
        }
    };

    useEffect(() => {
        dispatch(loadPlayers({ id: id, players: loopkit.loops[deck], deck: deck }));

        return () => dispatch(resetPlayers());
    }, [loopkit, dispatch]);

    useEffect(() => {
        Transport.scheduleRepeat(() => {
            if (playerQueue.length > 0) {
                playerQueue.forEach((i) => {
                    i();
                });
            }
            playerQueue = [];
        }, "1m");

        return () => {
            Transport.stop();
            Transport.cancel();
            players.forEach((i) => i.loop.unsync().stop());
            playerQueue = [];
        };
    }, [id]);

    return [players, loopkit.bpm, loadingProgress, handleOnClick, stopBoard];
};
