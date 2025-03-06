import React, { useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, Space, Checkbox } from 'antd';
import { applyFilters } from '../../../model/callsTable.ts';
import { ModalFC } from '../../../../../shared/modals/types.ts';

const { Option } = Select;
const { RangePicker } = DatePicker;

interface FilterModalProps {
  onClose: () => void;
  currentFilters?: Record<string, any>;
}

const FilterModal: ModalFC<FilterModalProps> = ({
  onClose,
  currentFilters = {},
}) => {
  const [form] = Form.useForm();

  // Заполняем форму текущими фильтрами при открытии
  useEffect(() => {
    form.setFieldsValue(currentFilters);
  }, [form, currentFilters]);

  const handleApplyFilters = () => {
    form.validateFields().then((values) => {
      // Применяем фильтры через effector
      applyFilters(values);
      onClose();
    });
  };

  const handleReset = () => {
    form.resetFields();
    applyFilters({});
    onClose();
  };

  return (
    <Form form={form} layout='vertical'>
      <Form.Item name='appealsId' label='Номер обращения'>
        <Input placeholder='Введите номер обращения' />
      </Form.Item>

      <Form.Item name='isRecording' label='Статус записи'>
        <Select placeholder='Выберите статус записи' allowClear>
          <Option value={true}>Записывается</Option>
          <Option value={false}>Не записывается</Option>
        </Select>
      </Form.Item>

      <Form.Item name='phoneNumber' label='Номер телефона участника'>
        <Input placeholder='Введите номер телефона' />
      </Form.Item>

      <Form.Item name='dateRange' label='Период начала звонка'>
        <RangePicker showTime format='DD.MM.YYYY HH:mm:ss' />
      </Form.Item>

      <Form.Item name='wasListened' valuePropName='checked'>
        <Checkbox>Только прослушанные звонки</Checkbox>
      </Form.Item>

      <Form.Item>
        <Space style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleReset}>Сбросить</Button>
          <Button type='primary' onClick={handleApplyFilters}>
            Применить
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

FilterModal.modalConfig = {
  width: 700,
  title: 'Фильтры',
  maskClosable: true,
  defaultParams: {
    currentFilters: {},
  },
};

export default FilterModal;
