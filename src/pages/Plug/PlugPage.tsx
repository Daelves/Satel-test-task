import { Button, Result } from 'antd';
import Title from 'antd/es/typography/Title';
import { Link } from 'react-router-dom';

const PlugPage = () => {
  return (
    <Result
      status='info'
      title='Страница в разработке'
      subTitle='Заглушка для демонстрации фоновой записи.'
      extra={
        <Link to='/'>
          <Button type='primary'>Вернуться на главную</Button>
        </Link>
      }
    />
  );
};

export default PlugPage;
