import React, { useEffect, useRef, useState } from 'react';
import { Modal, Form, Input, Col, Row } from 'antd';
import axios from 'axios';

const ModalEdicaoLocatario = ({ theme, isModalEditOpen, setIsModalEditOpen, editLocatario, setEditLocatario, setUpdateTable, updateTable }) => {

    const [localEditLocatario, setLocalEditLocatario] = useState(null);

    const formRefEdit = useRef();

    useEffect(() => {
        if (isModalEditOpen && formRefEdit.current) {
            formRefEdit.current.setFieldsValue(editLocatario);
        }
    }, [isModalEditOpen]);

    const handleEditSubmit = () => {
        console.log('Enviar os dados editados:', editLocatario);

        // Coloque aqui o endereço do seu servidor e o caminho do arquivo PHP
        const apiUrl = "https://alugafacil.tech/api/edita_locatario.php";

        axios({
            method: 'post',
            url: apiUrl,
            data: {
                id: editLocatario.id, // Certifique-se de enviar o ID para atualizar o registro correto
                nome: editLocatario.nome,
                cpf: editLocatario.cpf,
                rg: editLocatario.rg,
                email: editLocatario.email,
                telefone: editLocatario.telefone,
                nome_contato_adicional: editLocatario.nome_contato_adicional,
                telefone_contato_adicional: editLocatario.telefone_contato_adicional
            },
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                console.log(response.data);
                if (response.data.status === 'success') {
                    setIsModalEditOpen(false);
                    setUpdateTable(!updateTable);
                } else {
                    alert('Falha ao atualizar o locatário.');
                }
            })
            .catch(error => {
                console.log(error);
                alert('Ocorreu um erro ao enviar os dados.');
            });
    };

    const handleLocalFieldChange = (e, fieldName) => {
        setLocalEditLocatario({ ...localEditLocatario, [fieldName]: e.target.value });
    };

    return (
        <Modal
            width={1000}
            title="Editar Locatário"
            open={isModalEditOpen}
            onOk={handleEditSubmit}
            onCancel={() => setIsModalEditOpen(false)}
        >
            <Form
                ref={formRefEdit}
                name="edit"
                initialValues={editLocatario}
                onValuesChange={(changedValues, allValues) => {
                    setEditLocatario(allValues);
                }}
                autoComplete="off"
                layout='vertical'
            >
                <Row gutter={8}>
                    <Col span={6}>
                        <Form.Item
                            label="ID"
                            name="id"
                            rules={[{ required: true, message: 'Por favor, insira o nome do locatário!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.id : ''}
                                disabled={true}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={18}>
                        <Form.Item
                            label="Nome"
                            name="nome"
                            rules={[{ required: true, message: 'Por favor, insira o nome do locatário!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.nome : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'nome')}
                            />
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
                            <Input
                                value={localEditLocatario ? localEditLocatario.cpf : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'cpf')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="RG"
                            name="rg"
                            rules={[{ required: true, message: 'Por favor, insira o RG do locatário!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.rg : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'rg')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={16}>
                        <Form.Item
                            label="E-mail"
                            name="email"
                            rules={[{ required: true, message: 'Por favor, insira o E-mail do locatário!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.email : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'email')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item
                            label="Telefone"
                            name="telefone"
                            rules={[{ required: true, message: 'Por favor, insira o Telefone do locatário!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.telefone : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'telefone')}
                            />
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
                            <Input
                                value={localEditLocatario ? localEditLocatario.nome_contato_adicional : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'nome_contato_adicional')}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Telefone Contato Adicional"
                            name="telefone_contato_adicional"
                            rules={[{ required: true, message: 'Por favor, insira o telefone do contato adicional!' }]}
                        >
                            <Input
                                value={localEditLocatario ? localEditLocatario.telefone_contato_adicional : ''}
                                onChange={(e) => handleLocalFieldChange(e, 'telefone_contato_adicional')}
                            />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )

}

export default ModalEdicaoLocatario;