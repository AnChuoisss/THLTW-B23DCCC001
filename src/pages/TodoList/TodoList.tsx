import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Input, DatePicker, Form } from 'antd';
import dayjs from 'dayjs';

interface Task {
  key: string;
  text: string;
  deadline: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  };

  const handleSubmit = (values: { text: string; deadline: dayjs.Dayjs | string }) => {
    const formattedDeadline =
      typeof values.deadline === 'string'
        ? values.deadline
        : values.deadline.format('YYYY-MM-DD HH:mm');

    const newTask: Task = { key: Date.now().toString(), text: values.text, deadline: formattedDeadline };

    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.key === editingTask.key ? { ...task, ...newTask } : task
      );
      saveTasks(updatedTasks);
    } else {
      saveTasks([newTask, ...tasks]);
    }

    setIsModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  const editTask = (task: Task) => {
    setEditingTask(task);
    form.setFieldsValue({
      text: task.text,
      deadline: dayjs(task.deadline, 'YYYY-MM-DD HH:mm').isValid()
        ? dayjs(task.deadline, 'YYYY-MM-DD HH:mm')
        : null,
    });
    setIsModalOpen(true);
  };

  const deleteTask = (key: string) => {
    saveTasks(tasks.filter((task) => task.key !== key));
  };

  const disabledDate = (current: dayjs.Dayjs) => {
    return current && current.isBefore(dayjs().startOf('day'));
  };

  const disabledTime = (current: dayjs.Dayjs | null) => {
    if (!current) return {};
    if (current.isSame(dayjs(), 'day')) {
      return {
        disabledHours: () => Array.from({ length: dayjs().hour() }, (_, i) => i),
        disabledMinutes: (hour: number) =>
          hour === dayjs().hour() ? Array.from({ length: dayjs().minute() }, (_, i) => i) : [],
      };
    }
    return {};
  };

  const columns = [
    { title: 'Công việc', dataIndex: 'text', key: 'text' },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
    {
      title: 'Hành động',
      align: 'center',
      key: 'actions',
      render: (_: any, record: Task) => (
        <>
          <Button type="link" onClick={() => editTask(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => deleteTask(record.key)}>
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h2>To-Do List</h2>
      <Form onFinish={handleSubmit} layout="inline" form={form}>
        <Form.Item name="text" rules={[{ required: true, message: 'Vui lòng nhập công việc' }]}>
          <Input placeholder="Nhập công việc..." />
        </Form.Item>
        <Form.Item name="deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm"
            inputReadOnly
            disabledDate={disabledDate}
            disabledTime={disabledTime}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Thêm
          </Button>
        </Form.Item>
      </Form>
      <Table columns={columns} dataSource={tasks} style={{ marginTop: '20px' }} />

      <Modal
        title={editingTask ? 'Chỉnh sửa công việc' : 'Thêm công việc'}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={() => {
          setIsModalOpen(false);
          setEditingTask(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="text" label="Công việc" rules={[{ required: true, message: 'Vui lòng nhập công việc' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="deadline" label="Deadline" rules={[{ required: true, message: 'Chọn deadline' }]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              inputReadOnly
              disabledDate={disabledDate}
              disabledTime={disabledTime}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}