import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useUnit } from 'effector-react';
import { $listeningCall } from '../pages/ActiveCallsPage/model.ts';
import { $isRecording } from '../pages/ActiveCallsPage/model/listeningCall.ts';
import {
  navigationRequested,
  setNavigateFunction,
} from '../pages/ActiveCallsPage/model/navigationWarning.ts';
import BackgroundRecordingIndicator from '../pages/ActiveCallsPage/components/BackgroundRecordingIndicator.tsx';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const listeningCall = useUnit($listeningCall);
  const isRecording = useUnit($isRecording);

  useEffect(() => {
    setNavigateFunction(navigate);
    console.log('Navigation function set in MainLayout');
  }, [navigate]);

  const menuItems = useMemo(
    () => [
      {
        key: '/employeeSessions',
        label: 'Журнал сессий сотрудников',
        disabled: true,
      },
      {
        key: '/userRequests',
        label: 'Журнал обращений',
        disabled: false,
      },
      {
        key: '/',
        label: 'Активные звонки',
      },
      {
        key: '/securityEvents',
        label: 'Журнал событий ИБ',
        disabled: true,
      },
      {
        key: '/settings',
        label: 'Настройки',
        disabled: true,
      },
    ],
    []
  );

  const selectedKeys = useMemo(() => {
    return [location.pathname === '/' ? '/' : location.pathname];
  }, [location.pathname]);

  const handleMenuClick = useCallback(
    ({ key }: { key: string }) => {
      if (location.pathname === key) return;

      if (listeningCall) {
        navigationRequested(key);
      } else {
        navigate(key);
      }
    },
    [location.pathname, listeningCall, navigate]
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme='light' breakpoint='lg' collapsedWidth='0'>
        <div
          style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }}
        />
        <Menu
          mode='inline'
          selectedKeys={selectedKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: '#fff' }} />
        <Content style={{ margin: '24px 16px' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            <Outlet />
          </div>
        </Content>
        <BackgroundRecordingIndicator />
      </Layout>
    </Layout>
  );
};

export default MainLayout;
