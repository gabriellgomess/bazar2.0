import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import axios from 'axios';

const AddUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Substitua 'your-backend-endpoint' pelo endpoint correto
      const response = await axios.post('your-backend-endpoint', values);
      message.success('Registro realizado com sucesso!');
      form.resetFields();
    } catch (error) {
      message.error('Ocorreu um erro no registro!');
      console.error('Erro no registro:', error);
    }
    setLoading(false);
  };

  return (
    <Form
      form={form}
      name="register"
      onFinish={onFinish}
      scrollToFirstError
    >
      <Form.Item
        name="nome"
        rules={[{ required: true, message: 'Por favor, insira seu nome!' }]}
      >
        <Input placeholder="Nome" />
      </Form.Item>

      <Form.Item
        name="matricula"
        rules={[{ required: true, message: 'Por favor, insira sua matrícula!' }]}
      >
        <Input placeholder="Matrícula" />
      </Form.Item>

      <Form.Item
        name="usuario"
        rules={[{ required: true, message: 'Por favor, insira um usuário!' }]}
      >
        <Input placeholder="Usuário" />
      </Form.Item>

      <Form.Item
        name="senha"
        rules={[{ required: true, message: 'Por favor, insira uma senha!' }]}
      >
        <Input.Password placeholder="Senha" />
      </Form.Item>

      <Form.Item
        name="nivel_acesso"
        rules={[{ required: true, message: 'Por favor, insira o nível de acesso!' }]}
      >
        <Input placeholder="Nível de Acesso" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Registrar
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddUser;
