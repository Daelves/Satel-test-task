// src/pages/ActiveCallsPage/components/CallsTable/CallsTableColumns.tsx
import React from 'react';
import type { TableProps } from 'antd';
import { Button, Space, Tooltip, Typography } from 'antd';
import {
  AudioOutlined,
  AudioMutedOutlined,
  CustomerServiceOutlined,
  CopyOutlined,
  PhoneOutlined,
} from '@ant-design/icons';
import { CallRecord } from '../../model/callsTable.ts';

const { Text } = Typography;

export interface GetColumnsProps {
  listeningCallId: string | null;
  listenedCalls: Record<string, any>;
  onConnectCall: (call: CallRecord) => void;
  onDisconnectCall: () => void;
  onCopyAppealsId: (appealsId: string) => void;
  onDownloadCallInfo: (callId: string) => void;
}

export const getColumns = ({
  listeningCallId,
  listenedCalls,
  onConnectCall,
  onDisconnectCall,
  onCopyAppealsId,
  onDownloadCallInfo,
}: GetColumnsProps): TableProps<CallRecord>['columns'] => {
  const formatParticipants = (participants: string[]) => {
    const visibleCount = 2;
    const hiddenCount = participants.length - visibleCount;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {participants.slice(0, visibleCount).map((phone, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center' }}>
            <Text>{phone}</Text>
            {idx === 0 && hiddenCount > 0 && (
              <Tooltip
                title={participants.slice(visibleCount).map((phone, idx) => (
                  <div key={idx}>{phone}</div>
                ))}
              >
                <Button
                  type='text'
                  size='small'
                  className='participant-count-badge'
                >
                  +{hiddenCount}
                </Button>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    );
  };

  return [
    {
      title: '',
      key: 'status',
      width: 80,
      align: 'center',
      className: 'status-column',
      render: (_, record) => {
        const wasListened = !!listenedCalls[record.id];
        const isCurrentlyListening = listeningCallId === record.id;

        return (
          <Space size={8}>
            {wasListened && !isCurrentlyListening && (
              <Tooltip title='Ранее совершенное подключение'>
                <CustomerServiceOutlined className='was-listened-icon' />
              </Tooltip>
            )}
            {!record.isRecording && (
              <Tooltip title='Автоматическая запись звонка не ведется'>
                <AudioMutedOutlined className='not-recording-icon' />
              </Tooltip>
            )}
          </Space>
        );
      },
      filters: [
        { text: 'Записывается', value: true },
        { text: 'Не записывается', value: false },
      ],
      onFilter: (value, record) => record.isRecording === value,
    },
    {
      title: 'ID звонка',
      dataIndex: 'appealsId',
      key: 'appealsId',
      width: 180,
      className: 'appeals-id-column',
      render: (appealsId, record) => (
        <Space>
          <Text>{appealsId}</Text>
          <Button
            type='text'
            icon={<CopyOutlined />}
            size='small'
            onClick={() => onCopyAppealsId(appealsId)}
          />
        </Space>
      ),
      sorter: (a, b) => a.appealsId.localeCompare(b.appealsId),
    },
    {
      title: 'Время начала',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      className: 'start-time-column',
      render: (startTime) =>
        new Date(startTime).toLocaleString('ru', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      // defaultSortOrder: 'descend',
      // sorter: (a, b) =>
      //     new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    },
    {
      title: 'Участники',
      dataIndex: 'participants',
      key: 'participants',
      className: 'participants-column',
      render: (participants) => formatParticipants(participants),
      ellipsis: true,
      width: '40%',
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      align: 'center',
      className: 'actions-column',
      render: (_, record) => {
        const isCurrentlyListening = listeningCallId === record.id;

        return (
          <Space>
            {!isCurrentlyListening ? (
              <Tooltip title='Подключиться к звонку'>
                <Button
                  type='text'
                  className='connect-call-button'
                  icon={<PhoneOutlined />}
                  onClick={() => onConnectCall(record)}
                />
              </Tooltip>
            ) : (
              <Tooltip title='Отключиться от звонка'>
                <Button
                  type='text'
                  className='disconnect-call-button'
                  danger
                  icon={<PhoneOutlined />}
                  onClick={() => onDisconnectCall()}
                />
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];
};

export default getColumns;
