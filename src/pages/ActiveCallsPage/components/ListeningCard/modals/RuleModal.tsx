import React, { useEffect } from 'react';
import { Form, Input, Button } from 'antd';
import useModal from '../../../../../shared/modals/useModal.ts';

interface RuleModalProps {
  onClose: () => void;
  phoneNumber: string;
}

const RuleModal: React.FC<RuleModalProps> = ({ onClose, phoneNumber }) => {
  const [form] = Form.useForm();
  const { open: openSuccessModal } = useModal('successRule');

  useEffect(() => {
    if (phoneNumber) {
      form.setFieldsValue({
        phoneNumber,
      });
    }
  }, [phoneNumber, form]);

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      console.log('Rule submitted:', values);
      onClose();
      openSuccessModal({ phoneNumber });
      form.resetFields();
    });
  };

  return (
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

      <Form.Item>
        <div
          style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}
        >
          <Button onClick={onClose}>Отмена</Button>
          <Button type='primary' onClick={handleSubmit}>
            Сохранить
          </Button>
        </div>
      </Form.Item>
    </Form>
  );
};

export default RuleModal;
