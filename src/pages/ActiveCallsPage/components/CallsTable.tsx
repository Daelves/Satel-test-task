import {useUnit} from "effector-react";
import {$calls} from "../model.ts";

const CallsTable = () => {
    const calls = useUnit($calls);

    return (<>this is Table</>)
}

export default CallsTable
