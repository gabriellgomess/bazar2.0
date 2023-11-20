import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, message } from 'antd';

const Users = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('https://amigosdacasa.org.br/bazar-amigosdacasa/api/get_users.php')
      .then(response => {
        if (response.data.status === 'success') {
          setData(response.data.data);
        } else {
          message.error(response.data.message);
        }
      })
      .catch(error => {
        message.error('An error occurred while fetching the data.');
        console.error('There was an error!', error);
      });
  }, []);

  const handleDelete = (userId) => {
    // Implement delete functionality here
    console.log('Delete user with id:', userId);
  };

  const handleEdit = (userId) => {
    // Implement edit functionality here
    console.log('Edit user with id:', userId);
  };

  const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Nome',
        dataIndex: 'nome',
        key: 'nome',

    },
    {
        title: 'Usuário',
        dataIndex: 'usuario',
        key: 'usuario',
    },
    {
        title: 'Matrícula',
        dataIndex: 'matricula',
        key: 'matricula',
    },
    {
        title: 'Nível de Acesso',
        dataIndex: 'nivel_acesso',
        key: 'nivel_acesso',
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button onClick={() => handleEdit(record.id)} type="primary">
            Editar
          </Button>
          <Button onClick={() => handleDelete(record.id)} type="danger" style={{ marginLeft: 16 }}>
            Apagar
          </Button>
        </span>
      ),
    },
  ];

  return <Table columns={columns} dataSource={data} rowKey="id" />;
};

export default Users;
