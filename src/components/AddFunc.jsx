import React, { useState, useContext } from 'react';
import { MyContext } from '../contexts/MyContext';
import { Input, Typography, Button, notification } from 'antd';
import axios from 'axios';

const AddFunc = () => {
    const { rootState } = useContext(MyContext);
    const { theUser } = rootState;
    const [nome, setNome] = useState('');
    const [salario, setSalario] = useState('');
    const [limiteDisponivel, setLimiteDisponivel] = useState('');
    const { Title } = Typography;

    const handleSetSalario = (salario) => {
        setSalario(salario);
        setLimiteDisponivel(salario * 0.3);
    }

    const clearForm = () => {
        setNome('');
        setSalario('');
        setLimiteDisponivel('');
    }

    const openNotificationWithIcon = (type, message, description) => {
        notification[type]({
            message: message,
            description: description,
            placement: 'bottomRight',
        });
    };

    const addFunc = () => {
        if (nome === '') {
            console.log("O nome do funcionário é obrigatório.");
            return;
        }
        if (salario === '') {
            console.log("O salário do funcionário é obrigatório.");
            return;
        }

        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/adiciona_funcionario.php', { nome: nome, salario: salario, limite: limiteDisponivel, user: theUser.name })
            .then((res) => {
                if (res.data.status === 'success') {
                    openNotificationWithIcon('success', 'Funcionário adicionado com sucesso!', '');
                    clearForm();
                } else {
                    openNotificationWithIcon('error', 'Erro ao adicionar funcionário.', '');
                }
            })
            .catch((err) => {
                console.log("Erro: ", err);
            });
    }

    return (
        <div style={{display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px'}}>
            <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flexGrow: '8'}}>
                    <Title level={5}>Nome do funcionário</Title>
                    <Input value={nome} onChange={(e)=>setNome(e.target.value)} />
                </div>
                <div style={{flexGrow: '1'}}>
                    <Title level={5}>Salário</Title>
                    <Input value={salario} onChange={(e)=>handleSetSalario(e.target.value)} />
                </div>
                <div style={{flexGrow: '1'}}>
                    <Title level={5}>Limite disponível</Title>
                    <Input value={limiteDisponivel?limiteDisponivel:'0'} readOnly />
                </div>
            </div>
            <div>
                <Button onClick={addFunc}>Salvar</Button>
            </div>
        </div>
    );
}

export default AddFunc;
