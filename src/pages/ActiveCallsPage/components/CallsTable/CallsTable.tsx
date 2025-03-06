// src/pages/ActiveCallsPage/components/CallsTable/CallsTable.tsx
import React, { useEffect, useCallback } from 'react';
import { useUnit } from 'effector-react';
import { message, Table } from 'antd';
import type { TableProps } from 'antd';
import {
  $callsTableState,
  fetchCallsRequested,
  changePage,
  changePerPage,
  updateCallsList,
  $listenedCalls,
  CallRecord,
} from '../../model/callsTable';

import getColumns from './CallsTableColumns';
import { mockCalls } from '../../../../api/mackCallsData.ts';
import { isDevelopment } from '../../../../utils/environment.ts';
import './styles/calls-table.css';
import {
  $listeningCall, disconnectCallRequested,
  startListeningFx,
  stopListeningFx,
  switchCallRequested,
} from '../../model.ts';
import ListeningCallCard from '../ListeningCallCard.tsx';

const CallsTable: React.FC = () => {
  const { calls, isLoading, error, totalCalls, page, perPage } =
    useUnit($callsTableState);
  const listenedCalls = useUnit($listenedCalls);
  const listeningCall = useUnit($listeningCall);

  const [messageApi, contextHolder] = message.useMessage();

  // Инициализация
  useEffect(() => {
    if (isDevelopment()) {
      // Эмуляция загрузки данных с сервера во время разработки
      setTimeout(() => {
        updateCallsList(mockCalls);
      }, 500);
    } else {
      fetchCallsRequested();
    }
  }, []);

  const handleConnectCall = useCallback(
    (call: CallRecord) => {
      switchCallRequested(call.id);
      messageApi.success(`Подключение к звонку ${call.appealsId}`);
    },
    [messageApi]
  );

  const handleDisconnectCall = useCallback(() => {
    if (listeningCall) {
      disconnectCallRequested(listeningCall.id); // Используем новое событие для прямого отключения
      messageApi.success('Отключение от звонка');
    }
  }, [listeningCall, messageApi]);

  const handleCopyAppealsId = useCallback(
    (appealsId: string) => {
      navigator.clipboard.writeText(appealsId);
      messageApi.success('ID обращения скопирован в буфер обмена');
    },
    [messageApi]
  );

  const handleDownloadCallInfo = useCallback((callId: string) => {
    console.log('Скачивание информации о звонке:', callId);
  }, []);

  const columns = getColumns({
    listeningCallId: listeningCall?.id || null,
    listenedCalls,
    onConnectCall: handleConnectCall,
    onDisconnectCall: handleDisconnectCall,
    onCopyAppealsId: handleCopyAppealsId,
    onDownloadCallInfo: handleDownloadCallInfo,
  });

  const handleTableChange: TableProps<CallRecord>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    if (pagination.current) {
      changePage(pagination.current);
    }
    if (pagination.pageSize) {
      changePerPage(pagination.pageSize);
    }
  };

  const expandedRowKeys = listeningCall ? [listeningCall.id] : [];

  return (
    <div className='calls-table-container'>
      {contextHolder}
      <Table<CallRecord>
        dataSource={calls}
        columns={columns}
        rowKey='id'
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: perPage,
          total: totalCalls,
          showSizeChanger: true,
          pageSizeOptions: ['10', '20', '50'],
          showTotal: (total) => `Всего ${total} записей`,
        }}
        onChange={handleTableChange}
        rowClassName={(record) =>
          listeningCall?.id === record.id ? 'active-listening-row' : ''
        }
        expandable={{
          expandedRowKeys,
          expandRowByClick: false,
          expandIcon: () => null,
          expandedRowRender: (record) => {
            if (record.id === listeningCall?.id) {
              return <ListeningCallCard />;
            }
            return null;
          },
          rowExpandable: (record) => record.id === listeningCall?.id,
        }}
        locale={{
          emptyText: 'Нет активных звонков',
        }}
        className='active-calls-table'
      />
    </div>
  );
};

//expandIcon: () => null,
export default CallsTable;
