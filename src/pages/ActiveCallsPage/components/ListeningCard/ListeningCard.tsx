// src/pages/ActiveCallsPage/components/ListeningCard/index.tsx
import React from 'react';
import { Card, Space, Typography, Badge } from 'antd';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../../model.ts';
import {
  useListeningTimer,
  useRecordingTimer,
  useInitializeListeningTime,
} from '../../hooks/useListeningCardHooks';
import TimerDisplay from './TimerDisplay';
import ControlButtons from './ControlButtons';
import PhoneSelectModal from './PhoneSelectModal';
import RuleModal from './RuleModal';
import DownloadModal from './DownloadModal';

const { Title } = Typography;

const ListeningCard: React.FC = () => {
  const listeningCall = useUnit($listeningCall);

  // Используем кастомные хуки для управления таймерами
  useListeningTimer();
  useRecordingTimer();
  useInitializeListeningTime(listeningCall?.id || null);

  if (!listeningCall) return null;

  return (
    <>
      <Card
        title={
          <Space>
            <Title level={5}>Прослушиваемый звонок</Title>
            {listeningCall.isRecording && (
              <Badge status='processing' text='Запись' />
            )}
          </Space>
        }
      >
        <Space direction='vertical' style={{ width: '100%' }}>
          <TimerDisplay />
          <ControlButtons />
        </Space>
      </Card>

      {/* Модальные окна */}
      <PhoneSelectModal />
      <RuleModal />
      <DownloadModal />
    </>
  );
};

export default ListeningCard;
