import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col } from 'antd';
import dayjs from 'dayjs';
import TaskForm from './TaskForm';
import { Modal, Input, DatePicker, Form } from 'antd';
import moment from 'moment';

interface Task {
  key: string;
  text: string;
  deadline: string;
}

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visible, setVisible] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  // const handleSubmit = (values: { text: string; deadline: dayjs.Dayjs | string }) => {
  //   const formattedDeadline =
  //     typeof values.deadline === 'string' ? values.deadline : values.deadline.format('YYYY-MM-DD HH:mm');

  //   if (editingTask) {
  //     const updatedTasks = tasks.map((task) =>
  //       task.key === editingTask.key ? { ...task, text: values.text, deadline: formattedDeadline } : task
  //     );
  //     saveTasks(updatedTasks);
  //   } else {
  //     const newTask: Task = { key: Date.now().toString(), text: values.text, deadline: formattedDeadline };
  //     saveTasks([newTask, ...tasks]);
  //   }

  //   setVisible(false);
  //   setEditingTask(null);
  // };
  const handleSubmit = (values: { text: string; deadline: moment.Moment | string }) => {
    const formattedDeadline =
      typeof values.deadline === 'string' ? values.deadline : values.deadline.format('YYYY-MM-DD HH:mm');
  
    if (editingTask) {
      const updatedTasks = tasks.map((task) =>
        task.key === editingTask.key ? { ...task, text: values.text, deadline: formattedDeadline } : task
      );
      saveTasks(updatedTasks);
    } else {
      const newTask: Task = { key: Date.now().toString(), text: values.text, deadline: formattedDeadline };
      saveTasks([newTask, ...tasks]);
    }
  
    setVisible(false);
    setEditingTask(null);
  };

  const openModalToEdit = (task: Task) => {
    setEditingTask(task);
    setVisible(true);
  };

  const openModalToAdd = () => {
    setEditingTask(null);
    setVisible(true);
  };

  const deleteTask = (key: string) => {
    saveTasks(tasks.filter((task) => task.key !== key));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>To-Do List</h2>

      <Button type="primary" onClick={openModalToAdd} style={{ marginBottom: '20px' }}>
        Thêm công việc
      </Button>

      <Row gutter={[16, 16]}>
        {tasks.map((task) => (
          <Col xs={24} sm={12} md={8} lg={6} key={task.key}>
            <Card
              title={task.text}
              extra={
                <>
                  <Button type="link" onClick={() => openModalToEdit(task)}>
                    Sửa
                  </Button>
                  <Button type="link" danger onClick={() => deleteTask(task.key)}>
                    Xóa
                  </Button>
                </>
              }
            >
              <p><strong>Deadline:</strong> {task.deadline}</p>
            </Card>
          </Col>
        ))}
      </Row>

      <TaskForm visible={visible} onClose={() => setVisible(false)} onSubmit={handleSubmit} editingTask={editingTask} />
    </div>
  );
}
