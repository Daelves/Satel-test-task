// src/layouts/MainLayout.tsx
import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import React, { useMemo } from 'react';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = useMemo(() => [
        {
            key: '/employeeSessions',
            label: 'Журнал сессий сотрудников',
            disabled: true,
        },
        {
            key: '/userRequests',
            label: 'Журнал обращений',
            disabled: true,
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
    ], []);

    const selectedKeys = useMemo(() => {
        return [location.pathname === '/' ? '/' : location.pathname];
    }, [location.pathname]);

    const handleMenuClick = ({ key }: { key: string }) => {
        navigate(key);
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme="light"
                breakpoint="lg"
                collapsedWidth="0"
            >
                <div style={{ height: 32, margin: 16, background: 'rgba(0, 0, 0, 0.2)' }} />
                <Menu
                    mode="inline"
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
            </Layout>
        </Layout>
    );
};

export default MainLayout;