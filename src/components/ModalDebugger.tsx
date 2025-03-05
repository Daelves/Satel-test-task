import React, { useEffect, useState } from 'react';
import { Button, Space, Typography, Alert } from 'antd';
import { useUnit } from 'effector-react';
import { $modalsState, $registeredModals, openModal, registerModal } from '../shared/modals/model';
import { testModalRegistration } from '../debug/modalTest';


import FilterModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/FilterModal';
import PhoneSelectModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/PhoneSelectModal';
import RuleModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/RuleModal';
import DownloadModal from '../pages/ActiveCallsPage/components/ListeningCard/modals/DownloadModal';

const { Text, Title } = Typography;

const ModalDebugger: React.FC = () => {
    const modalState = useUnit($modalsState);
    const registeredModals = useUnit($registeredModals);
    const [logMessages, setLogMessages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Выводим информацию в консоль при изменении состояния
    useEffect(() => {
        const message = `Modal state: ${JSON.stringify(modalState)}, Registered modals: ${JSON.stringify(Object.keys(registeredModals))}`;
        console.log(message);
        setLogMessages(prev => [...prev, message].slice(-5));
    }, [modalState, registeredModals]);

    // Тестирование импорта модальных компонентов
    const testModuleImports = () => {
        setError(null);
        try {
            console.log('Testing imports:');
            console.log('FilterModal:', FilterModal);
            console.log('PhoneSelectModal:', PhoneSelectModal);
            console.log('RuleModal:', RuleModal);
            console.log('DownloadModal:', DownloadModal);

            setLogMessages(prev => [...prev, 'All modals imported successfully!'].slice(-5));
        } catch (e) {
            const errorMsg = `Import error: ${e instanceof Error ? e.message : String(e)}`;
            console.error(errorMsg);
            setError(errorMsg);
            setLogMessages(prev => [...prev, errorMsg].slice(-5));
        }
    };

    // Проверка каждого зарегистрированного модального окна
    const testAllModals = () => {
        const keys = Object.keys(registeredModals);
        if (keys.length === 0) {
            const errorMsg = 'No registered modals found! Check registration code.';
            console.error(errorMsg);
            setError(errorMsg);
            setLogMessages(prev => [...prev, `ERROR: ${errorMsg}`].slice(-5));
            return;
        }

        setError(null);
        keys.forEach((key) => {
            console.log(`Testing modal: ${key}`);
            openModal({ key, params: { test: true } });
        });
    };

    // Проверка конкретного модального окна
    const testDownloadModal = () => {
        console.log('Testing download modal directly');
        openModal({ key: 'download', params: { callId: 'test-id' } });
    };

    // Форсированная регистрация одного модального окна
    const registerSingleModal = () => {
        try {
            setError(null);
            console.log('Direct registration of DownloadModal');
            registerModal('download', DownloadModal);
            setLogMessages(prev => [...prev, 'Registered DownloadModal directly'].slice(-5));
        } catch (e) {
            const errorMsg = `Registration error: ${e instanceof Error ? e.message : String(e)}`;
            console.error(errorMsg);
            setError(errorMsg);
            setLogMessages(prev => [...prev, errorMsg].slice(-5));
        }
    };

    // Выполняем полное тестирование регистрации
    const runFullTest = () => {
        try {
            setError(null);
            const count = testModalRegistration();
            setLogMessages(prev => [...prev, `Test completed: ${count} modals registered`].slice(-5));
        } catch (e) {
            const errorMsg = `Test error: ${e instanceof Error ? e.message : String(e)}`;
            console.error(errorMsg);
            setError(errorMsg);
            setLogMessages(prev => [...prev, errorMsg].slice(-5));
        }
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #f0f0f0', margin: '20px' }}>
            <Title level={4}>Modal Debugger</Title>

            {error && <Alert message={error} type="error" style={{ marginBottom: '16px' }} />}

            <div style={{ marginBottom: '20px' }}>
                <Text>Current State: </Text>
                <pre>{JSON.stringify(modalState, null, 2)}</pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Text>Registered Modals: </Text>
                <pre>{JSON.stringify(Object.keys(registeredModals), null, 2)}</pre>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <Text>Log: </Text>
                <pre>{logMessages.join('\n')}</pre>
            </div>

            <Space wrap>
                <Button onClick={testModuleImports}>Test Imports</Button>
                <Button onClick={registerSingleModal}>Register Download Modal</Button>
                <Button onClick={runFullTest}>Run Full Test</Button>
                <Button onClick={testAllModals}>Test All Modals</Button>
                <Button onClick={testDownloadModal}>Test Download Modal</Button>
            </Space>
        </div>
    );
};

export default ModalDebugger;