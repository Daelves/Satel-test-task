import { Space } from 'antd';
import Toolbar from './components/Toolbar.tsx';
import CallsTable from './components/CallsTable/CallsTable.tsx';
import { useEffect } from 'react';
import { createWebSocketConnection } from '../../api/websocket.ts';
import { updateCallsList } from './model/callsTable.ts';
import ListeningCallCard from './components/ListeningCallCard.tsx';
import {useUnit} from "effector-react";
import {$listeningCall} from "./model.ts";

const ActiveCallsPage = () => {
    const listeningCall = useUnit($listeningCall);
  useEffect(() => {
    const wsConnection = createWebSocketConnection();

    wsConnection.onCallsList = (callsList) => {
      updateCallsList(callsList);
    };

    wsConnection.onCallUpdate = (callUpdate) => {};

    return () => {
      wsConnection.disconnect();
    };
  }, []);

  return (
    <Space
      direction='vertical'
      size='large'
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100%',
      }}
    >
      <Toolbar />
      <CallsTable />
    </Space>
  );
};

export default ActiveCallsPage;
