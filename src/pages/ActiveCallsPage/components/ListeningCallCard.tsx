import {$listeningCall} from "../model.ts";
import {useUnit} from "effector-react";

const listeningCallCard = () => {
    const listeningCall = useUnit($listeningCall)

    return (<>this is player</>)
}

export default listeningCallCard

