import React, { useEffect } from 'react';
import {
  Form,
  Input,
  Button,
  Select,
  DatePicker,
  Checkbox,
  Typography,
} from 'antd';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { $callsTableState, applyFilters } from '../../../model/callsTable.ts';
import { ModalFC } from '../../../../../shared/modals/types.ts';
import '../styles/filter-modal.css';
import { useUnit } from 'effector-react';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { Title, Text } = Typography;

interface FilterModalProps {
  onClose: () => void;
  currentFilters?: Record<string, any>;
}

const FilterModal: ModalFC<FilterModalProps> = ({
  onClose,
  currentFilters = {},
}) => {
  const [form] = Form.useForm();
  const { calls } = useUnit($callsTableState);

  useEffect(() => {
    form.setFieldsValue(currentFilters);
  }, [form, currentFilters]);

  const handleApplyFilters = () => {
    form.validateFields().then((values) => {
      applyFilters(values);
      onClose();
    });
  };

  const handleReset = () => {
    form.resetFields();
    applyFilters({});
    onClose();
  };

  const handleAddCondition = (sectionName: string) => {
    console.log(`Добавление условия для секции: ${sectionName}`);
  };

  return (
    <div className='filter-modal-container'>
      <div className='filter-modal-header'>
        <Title level={5}>Фильтры</Title>
        <Button
          type='text'
          icon={<CloseOutlined />}
          onClick={onClose}
          className='close-button'
        />
      </div>

      <Form form={form} layout='vertical' className='filter-form'>
        <div className='filter-content'>
          <div className='filter-section'>
            <Title level={5}>Информация о звонке</Title>

            <Form.Item name='appealsId' label='ID звонка'>
              <Select placeholder='Выберите номер'>
                {calls.map((call) => (
                  <Option key={call.id} value={call.appealsId}>
                    {call.appealsId}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button
              type='dashed'
              block
              icon={<PlusOutlined />}
              onClick={() => handleAddCondition('callInfo')}
              className='add-condition-button'
            >
              Добавить условие
            </Button>
          </div>

          <div className='filter-section'>
            <Title level={5}>Участники звонка</Title>

            <Form.Item name='phoneNumber' label='Телефонный номер'>
              <Input placeholder='Введите телефонный номер участника' />
            </Form.Item>

            <Button
              type='dashed'
              block
              icon={<PlusOutlined />}
              onClick={() => handleAddCondition('participants')}
              className='add-condition-button'
            >
              Добавить условие
            </Button>
          </div>

          <Form.Item
            name='isRecording'
            valuePropName='checked'
            className='recording-checkbox'
          >
            <Checkbox>Только записываемые звонки</Checkbox>
          </Form.Item>

          <Form.Item
            name='wasListened'
            valuePropName='checked'
            className='listened-checkbox'
          >
            <Checkbox>Только прослушанные звонки</Checkbox>
          </Form.Item>
        </div>

        <div className='filter-actions'>
          <Button onClick={handleReset} className='reset-button'>
            Очистить фильтр
          </Button>
          <Button
            type='primary'
            onClick={handleApplyFilters}
            className='apply-button'
          >
            Применить фильтр
          </Button>
        </div>
      </Form>
    </div>
  );
};

FilterModal.modalConfig = {
  width: 700,
  maskClosable: true,
  closable: false,
  destroyOnClose: true,
  defaultParams: {
    currentFilters: {},
  },
};

export default FilterModal;
