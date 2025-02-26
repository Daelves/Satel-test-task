import { useUnit } from 'effector-react';
import { Space } from 'antd';
import { $listeningCall } from './model';
import Toolbar from "./components/Toolbar.tsx";
import ListeningCallCard from "./components/ListeningCallCard.tsx";
import CallsTable from "./components/CallsTable.tsx";


const ActiveCallsPage = () => {
    const listeningCall = useUnit($listeningCall)

    return (
        <Space direction="vertical" size="large" style={{
            width: '100%',
            height: '100%',
            minHeight: '100%'
        }}>
            <Toolbar />

            {listeningCall && <ListeningCallCard />}

            <CallsTable />
        </Space>
    );
};

export default ActiveCallsPage;