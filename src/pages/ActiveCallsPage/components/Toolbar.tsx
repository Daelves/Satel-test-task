import { Button, Space } from 'antd';

const Toolbar = () => {
  return (
    <Space className='w-full justify-between'>
      <Space>
        <h3>Активные звонки</h3>
        <span>Всего: {/* количество */}</span>
      </Space>

      <Button onClick={() => console.log('Modal open')}>Фильтры</Button>

      {/* Модальное окно с фильтрами */}
    </Space>
  );
};

export default Toolbar;
