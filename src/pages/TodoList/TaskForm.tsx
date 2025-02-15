import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker } from 'antd';
import moment from 'moment';

interface Task {
  key: string;
  text: string;
  deadline: string;
}

interface TaskFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: { text: string; deadline: moment.Moment | string }) => void;
  editingTask: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ visible, onClose, onSubmit, editingTask }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (editingTask) {
      form.setFieldsValue({
        text: editingTask.text,
        deadline: moment(editingTask.deadline, 'YYYY-MM-DD HH:mm'),
      });
    } else {
      form.resetFields();
    }
  }, [editingTask, form]);

  const disabledDate = (current: moment.Moment) => {
    return current && current < moment().startOf('day'); // Chặn ngày quá khứ
  };

  return (
    <Modal
      title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
      visible={visible}
      onOk={() => form.submit()}
      onCancel={onClose}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item name="text" label="Công việc" rules={[{ required: true, message: 'Vui lòng nhập công việc' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            inputReadOnly
            disabledDate={disabledDate}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskForm;
