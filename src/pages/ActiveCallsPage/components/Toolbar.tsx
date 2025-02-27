import { $callsTableState } from '../model/callsTable.ts';
import { useUnit } from 'effector-react';
import { Button, Card, Divider, Space, Statistic, Typography } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import useModal from '../../../shared/modals/useModal.ts';

const { Title } = Typography;

const Toolbar = () => {
  const { totalCalls } = useUnit($callsTableState);
  const { open: openFilterModal } = useModal('filter');

  const handleOpenFilters = () => {
    openFilterModal({ currentFilters: {} });
  };

  return (
    <Card style={{ marginBottom: 16 }} bodyStyle={{ padding: '12px 24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Активные звонки
          </Title>
        </div>

        <Space size='large'>
          <Statistic
            title='Всего активных звонков'
            value={totalCalls}
            style={{ marginBottom: 0 }}
          />
          <Divider type='vertical' style={{ height: 40 }} />
          <Button
            type='primary'
            icon={<FilterOutlined />}
            onClick={handleOpenFilters}
          >
            Фильтры
          </Button>
        </Space>
      </div>
    </Card>
  );
};

export default Toolbar;
