import loopkits from "../../data/loopkits.json";
import { useHistory, useParams } from "react-router-dom";
import { usePlayers } from "../../utils/usePlayers";
import { Desktop } from "./Layouts/Desktop";

export const BoardWrapper = () => {
    const history = useHistory();
    const { id } = useParams();
    const loopkit = loopkits.list.find((i) => i.id === id);
    // return to the homepage if there is no loopkit with that id
    !loopkit && history.push("/");

    const [players_1, bpm_1, loadingProgress_1, handleOnClick_1, stopBoard_1] =
        usePlayers({
            id: id,
            deck: "a",
        });
    const [players_2, bpm_2, loadingProgress_2, handleOnClick_2, stopBoard_2] =
        usePlayers({
            id: id,
            deck: "b",
        });

    const handleStopBoards = () => {
        stopBoard_1();
        stopBoard_2();
    };

    return (
        <Desktop
        board1={{
            id: id,
            deck: "a",
            className: "board",
            bpm: bpm_1,
            players: players_1,
            loadingProgress: loadingProgress_1,
            handleOnClick: (button, player) =>
                handleOnClick_1(button, player),
        }}
        board2={{
            id: id,
            deck: "b",
            bpm: bpm_2,
            className: "board",
            players: players_2,
            loadingProgress: loadingProgress_2,
            handleOnClick: (button, player) =>
                handleOnClick_2(button, player),
        }}
        handleStopBoards={handleStopBoards}
    />
    );

};
