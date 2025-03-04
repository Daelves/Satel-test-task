// src/pages/ActiveCallsPage/components/CallsTable/CallsTable.tsx
import React, { useEffect, useCallback, useState } from 'react';
import { useUnit } from 'effector-react';
import { message, Table } from 'antd';
import type { TableProps } from 'antd';
import {
  $callsTableState,
  fetchCallsRequested,
  changePage,
  changePerPage,
  updateCallsList,
} from '../../model/callsTable';
import { $listenedCalls } from '../../model/callsTable';

import getColumns from './CallsTableColumns';
import { CallRecord } from '../../model/callsTable';
import { mockCalls } from '../../../../api/mackCallsData.ts';
import { isDevelopment } from '../../../../utils/environment.ts';
import './styles/calls-table.css';
import {
  $listeningCall,
  switchCallRequested,
  stopListeningFx,
} from '../../model.ts';
import ListeningCallCard from '../ListeningCallCard.tsx';

const CallsTable: React.FC = () => {
  const { calls, isLoading, error, totalCalls, page, perPage } =
      useUnit($callsTableState);
  const listenedCalls = useUnit($listenedCalls);
  const listeningCall = useUnit($listeningCall);

  // Состояние для анимации переходов между звонками
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

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

  // Обновляем expandedRowKeys при изменении прослушиваемого звонка
  useEffect(() => {
    if (listeningCall) {
      setExpandedRowKeys([listeningCall.id]);
    } else {
      // Даем небольшую задержку перед закрытием карточки для плавной анимации
      setTimeout(() => {
        setExpandedRowKeys([]);
      }, 200);
    }
  }, [listeningCall]);

  // Упрощенная функция подключения к звонку, использующая switchCallRequested
  const handleConnectCall = useCallback(
      (call: CallRecord) => {
        // Теперь вся логика переключения звонков находится в модели
        switchCallRequested(call.id);
        messageApi.success(`Подключение к звонку ${call.appealsId}`);
      },
      [messageApi]
  );

  const handleDisconnectCall = useCallback(() => {
    if (listeningCall) {
      messageApi.success('Отключение от звонка');
      stopListeningFx(listeningCall.id);
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
                expandedRowKeys: expandedRowKeys,
                expandIcon: () => null, // Скрываем стандартную иконку разворачивания
                expandRowByClick: false, // Запрещаем раскрытие по клику на строку
                expandedRowRender: (record) => {
                    if (record.id === listeningCall?.id) {
                        return (
                            <div className="expanded-call-card" style={{ transition: 'all 0.3s ease' }}>
                                <ListeningCallCard />
                            </div>
                        );
                    }
                    return null;
                },
                rowExpandable: (record) => record.id === listeningCall?.id
            }}
            locale={{
              emptyText: 'Нет активных звонков',
            }}
            scroll={{ x: 1000 }}
        />
      </div>
  );
};

export default CallsTable;