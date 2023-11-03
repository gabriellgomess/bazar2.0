import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Input, Row, Col, message } from 'antd';
import axios from 'axios';

const ModalCadastroLocatario = ({ theme, updateTable, setUpdateTable, isModalCadOpen, setIsModalCadOpen }) => {
    const formRef = useRef();

    const [messageApi] = message.useMessage();

    const handleOkModalCad = () => {
        formRef.current.submit();
    };

    const handleCancelModalCad = () => {
        setIsModalCadOpen(false);
        formRef.current.resetFields();
    };

    const onFinish = (values) => {
        axios.post('https://alugafacil.tech/api/gera_locatario.php', values)
            .then(response => {
                setUpdateTable(!updateTable);
                messageApi.open({
                    type: 'success',
                    content: response.data.message,
                });
                handleCancelModalCad();
            })
            .catch(error => {
                console.log('Failed:', error);
            });
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };



    return(
        <Modal
            width={1000}
            title="Cadastrar Locatário"
            open={isModalCadOpen} 
            onOk={handleOkModalCad}
            onCancel={handleCancelModalCad}
            style={{ top: 40 }}
        >
        <Form
            ref={formRef}
            name="basic"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            layout='vertical'
        >
            <Row gutter={8}>
                <Col span={24}>
                    <Form.Item
                        label="Nome"
                        name="nome"
                        rules={[{ required: true, message: 'Por favor, insira o nome do locatário!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>

            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        label="CPF"
                        name="cpf"
                        rules={[{ required: true, message: 'Por favor, insira o CPF do locatário!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="RG"
                        name="rg"
                        rules={[{ required: true, message: 'Por favor, insira o RG do locatário!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        label="E-mail"
                        name="email"
                        rules={[{ required: true, message: 'Por favor, insira o E-mail do locatário!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Telefone"
                        name="telefone"
                        rules={[{ required: true, message: 'Por favor, insira o Telefone do locatário!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={8}>
                <Col span={12}>
                    <Form.Item
                        label="Nome Contato Adicional"
                        name="nome_contato_adicional"
                        rules={[{ required: true, message: 'Por favor, insira o nome do contato adicional!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item
                        label="Telefone Contato Adicional"
                        name="telefone_contato_adicional"
                        rules={[{ required: true, message: 'Por favor, insira o telefone do contato adicional!' }]}
                    >
                        <Input />
                    </Form.Item>
                </Col>
            </Row>
        </Form>
    </Modal>
    )

}

export default ModalCadastroLocatario