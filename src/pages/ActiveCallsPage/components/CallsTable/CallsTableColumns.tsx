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
                  style={{
                    marginLeft: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
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
      width: 120,
      align: 'center',
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
      width: 250,
      render: (appealsId, record) => {
        const isCurrentlyListening = listeningCallId === record.id;

        return (
          <Space>
            <Text>{appealsId}</Text>
            <Button
              type='text'
              icon={<CopyOutlined />}
              size='small'
              onClick={() => onCopyAppealsId(appealsId)}
            />
          </Space>
        );
      },
      sorter: (a, b) => a.appealsId.localeCompare(b.appealsId),
    },
    {
      title: 'Время начала',
      dataIndex: 'startTime',
      key: 'startTime',
      width: 180,
      render: (startTime) =>
        new Date(startTime).toLocaleString('ru', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
      defaultSortOrder: 'descend',
      sorter: (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
    },
    {
      title: 'Участники',
      dataIndex: 'participants',
      key: 'participants',
      render: (participants) => formatParticipants(participants),
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 100,
      align: 'center',
      render: (_, record) => {
        const isCurrentlyListening = listeningCallId === record.id;

        return (
          <Space>
            {!isCurrentlyListening ? (
              <Tooltip title='Подключиться к звонку'>
                <Button
                  type='text'
                  icon={<PhoneOutlined className='connect-icon' size={24} />}
                  onClick={() => onConnectCall(record)}
                />
              </Tooltip>
            ) : (
              <Tooltip title='Отключиться от звонка'>
                <Button
                  type='text'
                  danger
                  icon={<PhoneOutlined className='disconnect-icon' size={24} />}
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
