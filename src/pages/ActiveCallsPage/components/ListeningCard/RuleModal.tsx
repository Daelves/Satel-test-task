// src/pages/ActiveCallsPage/components/ListeningCard/RuleModal.tsx
import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';
import { useUnit } from 'effector-react';
import {
  $ruleModalVisible,
  closeRuleModal,
  $selectedPhoneNumber,
} from '../../model/listeningСard.ts';

const RuleModal: React.FC = () => {
  const visible = useUnit($ruleModalVisible);
  const selectedPhone = useUnit($selectedPhoneNumber);
  const [form] = Form.useForm();

  // Автозаполнение формы при выборе номера
  useEffect(() => {
    if (selectedPhone && visible) {
      form.setFieldsValue({
        phoneNumber: selectedPhone,
      });
    }
  }, [selectedPhone, visible, form]);

  const handleCancel = () => {
    closeRuleModal();
    form.resetFields();
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Rule submitted:', values);
      closeRuleModal();
      form.resetFields();
    });
  };

  return (
    <Modal
      title='Новое правило'
      open={visible}
      onCancel={handleCancel}
      onOk={handleSubmit}
      okText='Сохранить'
      cancelText='Отмена'
    >
      <Form form={form} layout='vertical'>
        <Form.Item
          name='phoneNumber'
          label='Номер телефона'
          rules={[
            { required: true, message: 'Пожалуйста, укажите номер телефона' },
          ]}
        >
          <Input disabled />
        </Form.Item>

        <Form.Item
          name='ruleName'
          label='Название правила'
          rules={[
            { required: true, message: 'Пожалуйста, введите название правила' },
          ]}
        >
          <Input placeholder='Введите название правила' />
        </Form.Item>

        <Form.Item name='comment' label='Комментарий'>
          <Input.TextArea
            rows={4}
            placeholder='Введите комментарий (необязательно)'
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RuleModal;
