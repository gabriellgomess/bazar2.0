import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

const TabelaLocatarios = ({ locatarios, handleEdit, handleDelete, theme }) => {
    const text = 'Tem certeza que deseja excluir este locatário?';
    const description = 'Esta ação não poderá ser desfeita.';
    const confirm = (locatario) => {
        handleDelete(locatario);
        message.success('Locatário excluído com sucesso!');
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: '5%',
        },
        {
            title: 'Nome',
            dataIndex: 'nome',
            width: '15%',
        },
        {
            title: 'CPF',
            dataIndex: 'cpf',
            width: '10%',
        },
        {
            title: 'RG',
            dataIndex: 'rg',
            width: '10%',
        },
        {
            title: 'E-mail',
            dataIndex: 'email',
            width: '15%',
        },
        {
            title: 'Telefone',
            dataIndex: 'telefone',
            width: '10%',
        },
        {
            title: 'Nome Contato Adicional',
            dataIndex: 'nome_contato_adicional',
            width: '15%',
        },
        {
            title: 'Telefone Contato Adicional',
            dataIndex: 'telefone_contato_adicional',
            width: '10%',
        },
        {
            title: 'Data Cadastro',
            dataIndex: 'data_cadastro',
            width: '10%',
            render: (data) => {
                if (data) {
                    const dateObject = new Date(data);
                    const day = String(dateObject.getDate()).padStart(2, '0');
                    const month = String(dateObject.getMonth() + 1).padStart(2, '0');
                    const year = dateObject.getFullYear();
                    return `${day}/${month}/${year}`;
                }
                return "N/A";
            }
        },
        {
            title: 'Ações',
            dataIndex: '',
            width: '5%',
            render: (_, locatario) => (
                <div style={{ display: 'flex' }}>
                    <Button onClick={() => handleEdit(locatario)} type='text' icon={<EditOutlined />} style={{ color: theme.token.colorPrimary }} />
                    <Popconfirm
                        placement="topLeft"
                        title={text}
                        description={description}
                        onConfirm={() => confirm(locatario)}  // Note a mudança aqui
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button type='text' icon={<DeleteOutlined />} style={{ color: theme.token.colorError }} />
                    </Popconfirm>
                </div>
            ),
        },
    ];



    return (
        <Table columns={columns} dataSource={locatarios} />
    );
};

export default TabelaLocatarios;
