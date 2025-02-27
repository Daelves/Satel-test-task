import React, { useEffect, useCallback } from 'react';
import { useUnit } from 'effector-react';
import { Table } from 'antd';
import type { TableProps } from 'antd';
import {
  $callsTableState,
  fetchCallsRequested,
  changePage,
  changePerPage,
  updateCallsList,
} from '../../model/callsTable';
import { $listenedCalls } from '../../model/callsTable';
import {
  $listeningCall,
  connectToCall,
  disconnectFromCall,
} from '../../model/listeningCall';
import getColumns from './CallsTableColumns';
import { CallRecord } from '../../model/callsTable';
import { mockCalls } from '../../../../api/mackCallsData.ts';
import { isDevelopment } from '../../../../utils/environment.ts';

const CallsTable: React.FC = () => {
  const { calls, isLoading, error, totalCalls, page, perPage } =
    useUnit($callsTableState);
  const listenedCalls = useUnit($listenedCalls);
  const listeningCall = useUnit($listeningCall);

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

  // Обработчики действий
  const handleConnectCall = useCallback((call: CallRecord) => {
    connectToCall({
      id: call.id,
      startTime: call.startTime,
      participants: call.participants,
      appealsId: call.appealsId,
    });
  }, []);

  const handleCopyAppealsId = useCallback((appealsId: string) => {
    navigator.clipboard.writeText(appealsId);
  }, []);

  const handleDownloadCallInfo = useCallback((callId: string) => {
    console.log('Скачивание информации о звонке:', callId);
  }, []);

  const columns = getColumns({
    listeningCallId: listeningCall?.id || null,
    listenedCalls,
    onConnectCall: handleConnectCall,
    onDisconnectCall: disconnectFromCall,
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

  return (
    <div className='calls-table-container'>
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
        locale={{
          emptyText: 'Нет активных звонков',
        }}
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default CallsTable;
