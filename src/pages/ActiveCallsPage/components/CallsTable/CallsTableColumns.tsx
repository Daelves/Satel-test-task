import React from 'react';
import type { TableProps } from 'antd';
import { Button, Space, Tooltip, Typography } from 'antd';
import { AudioOutlined, AudioMutedOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import {CallRecord} from "../../model/callsTable.ts";


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
                             onDownloadCallInfo
                           }: GetColumnsProps): TableProps<CallRecord>['columns'] => {


  const formatParticipants = (participants: string[]) => {
    const visibleCount = 2;
    const hiddenCount = participants.length - visibleCount;

    return (
        <Space direction="vertical">
          {participants.slice(0, visibleCount).map((phone, idx) => (
              <Text key={idx}>{phone}</Text>
          ))}
          {hiddenCount > 0 && (
              <Tooltip
                  title={participants.slice(visibleCount).map((phone, idx) => (
                      <div key={idx}>{phone}</div>
                  ))}
              >
                <Button type="link" size="small">+{hiddenCount} еще</Button>
              </Tooltip>
          )}
        </Space>
    );
  };

  return [
    {
      title: 'Управление',
      key: 'control',
      width: 180,
      render: (_, record) => {
        const isCurrentlyListening = listeningCallId === record.id;
        const wasListened = !!listenedCalls[record.id];

        return (
            <Space>
              <Button
                  type={isCurrentlyListening ? "primary" : "default"}
                  danger={isCurrentlyListening}
                  onClick={() => {
                    if (isCurrentlyListening) {
                      onDisconnectCall();
                    } else {
                      onConnectCall(record);
                    }
                  }}
              >
                {isCurrentlyListening ? 'Отключиться' : 'Подключиться'}
              </Button>
              {wasListened && !isCurrentlyListening && (
                  <Tooltip title="Ранее прослушан">
                    <AudioOutlined style={{ color: '#1890ff' }} />
                  </Tooltip>
              )}
            </Space>
        );
      },
    },
    {
      title: 'Запись',
      key: 'recording',
      width: 80,
      align: 'center',
      render: (_, record) => {
        return record.isRecording ? (
            <Tooltip title="Ведется запись">
              <AudioOutlined style={{ color: '#52c41a' }} />
            </Tooltip>
        ) : (
            <Tooltip title="Запись не ведется">
              <AudioMutedOutlined style={{ color: '#ff4d4f' }} />
            </Tooltip>
        );
      },
      filters: [
        { text: 'Записывается', value: true },
        { text: 'Не записывается', value: false },
      ],
      onFilter: (value, record) => record.isRecording === value,
    },
    {
      title: 'Обращение',
      dataIndex: 'appealsId',
      key: 'appealsId',
      width: 150,
      render: (appealsId) => (
          <Space>
            <Text>{appealsId}</Text>
            <Button
                type="text"
                icon={<CopyOutlined />}
                size="small"
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
      render: (startTime) => new Date(startTime).toLocaleString(),
      defaultSortOrder: 'descend',
      sorter: (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
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
      render: (_, record) => (
          <Button
              icon={<DownloadOutlined />}
              onClick={() => onDownloadCallInfo(record.id)}
          >
            Скачать
          </Button>
      ),
    },
  ];
};

export default getColumns;