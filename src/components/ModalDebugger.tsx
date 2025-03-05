// src/components/ModalDebugger.tsx
import React, { useEffect } from 'react';
import { Button, Space, Typography } from 'antd';
import { useUnit } from 'effector-react';
import { $modalsState, $registeredModals, openModal } from '../shared/modals/model';

const { Text, Title } = Typography;

const ModalDebugger: React.FC = () => {
    const modalState = useUnit($modalsState);
    const registeredModals = useUnit($registeredModals);

    // Выводим информацию в консоль при изменении состояния
    useEffect(() => {
        console.log('Modal state changed:', modalState);
        console.log('Registered modals:', Object.keys(registeredModals));
    }, [modalState, registeredModals]);

    // Проверка каждого зарегистрированного модального окна
    const testAllModals = () => {
        Object.keys(registeredModals).forEach((key) => {
            console.log(`Testing modal: ${key}`);
            openModal({ key, params: { test: true } });
        });
    };

    // Проверка конкретного модального окна
    const testDownloadModal = () => {
        console.log('Testing download modal directly');
        openModal({ key: 'download', params: { callId: 'test-id' } });
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #f0f0f0', margin: '20px' }}>
            <Title level={4}>Modal Debugger</Title>

            <div style={{ marginBottom: '20px' }}>
                <Text>Current State: </Text>
                <pre>{JSON.stringify(modalState, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Text>Registered Modals: </Text>
                <pre>{JSON.stringify(Object.keys(registeredModals), null, 2)}</pre>
            </div>

            <Space>
                <Button onClick={testAllModals}>Test All Modals</Button>
                <Button onClick={testDownloadModal}>Test Download Modal</Button>
            </Space>
        </div>
    );
};

export default ModalDebugger;