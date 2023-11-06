import React, { useState, useEffect } from 'react';
import { Flex, Typography, Input, Select, AutoComplete, Button, Table, notification, Checkbox } from 'antd'; // Importe o componente Button e Table
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

const Venda = (props) => {
    const { theme } = props;
    const [funcionarios, setFuncionarios] = useState([]);
    const [showFuncionario, setShowFuncionario] = useState(false);
    const [code, setCode] = useState('');
    const [items, setItems] = useState([]); // Estado para armazenar a lista de itens
    const [quantity, setQuantity] = useState(1); // Estado para armazenar a quantidade de itens
    const [total, setTotal] = useState(0); // Estado para armazenar o total da venda
    const [errorMessage, setErrorMessage] = useState('');
    const [api, contextHolder] = notification.useNotification();
    const [showCheckbox, setShowCheckbox] = useState(false);

    const openNotificationWithIcon = (type) => {
        api[type]({
            message: 'Não foi possível encontrar a peça',
            description:
                'Verifique se o código digitado está correto, em caso de dúvida, consulte a aba Estoque.',
            placement: 'bottom',
        });

    };

    useEffect(() => {
        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/busca_funcionarios.php')
            .then((res) => {
                setFuncionarios(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleGetPecas = () => {
        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/get_peca_details.php', {
            codigo: code,
        })
            .then((res) => {
                if (res.data.status === 'success') {
                    const item = res.data.peca;
                    item.quantidade = quantity; // Defina a quantidade inicial como 1
                    setItems([...items, item]); // Adicione o item à lista

                    // Limpe o código e a quantidade
                    setCode('');
                    setQuantity(1);
                } else {
                    console.error('Erro: Não foi possível encontrar a peça', res);
                    openNotificationWithIcon('warning')
                }
            })
            .catch((err) => {
                console.error('Erro na requisição:', err);
            });
    };

    const options = funcionarios.map((funcionario) => {
        return {
            value: funcionario,
        };
    });

    const handleChangeBillingType = (value) => {
        if (value === 'Desconto em Folha') {
            setShowFuncionario(true);
            setShowCheckbox(false);
        } else {
            setShowFuncionario(false);
            setShowCheckbox(true);
        }
    };

    const handleCodeChange = (event) => {
        const inputValue = event.target.value;
        const number = inputValue.replace(/[^\d]+/g, '');

        if (number.length <= 6) {
            setCode(number.padStart(6, '0'));
        } else {
            setCode(number.substring(1).padStart(6, '0'));
        }
    };

    // Defina as colunas para a tabela
    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
        },
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
        },
        {
            title: 'Quantidade',
            dataIndex: 'quantidade',
            key: 'quantidade',
        },
        {
            title: 'Valor',
            dataIndex: 'valor_sugerido',
            key: 'valor_sugerido',
        },
        {
            title: 'Ação',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleRemoveItem(record)}><FontAwesomeIcon color={theme.token.colorError} icon={faTrash} /></Button>
            ),
        },
    ];

    // Função para remover um item da lista
    const handleRemoveItem = (item) => {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);
    };

    // Função para lidar com a tecla "Enter" pressionada
    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleGetPecas();
        }
    };

    // Atualize o total sempre que a lista de itens for alterada
    useEffect(() => {
        let total = 0;
        items.forEach((item) => {
            total += item.valor_sugerido * item.quantidade;
        });
        setTotal(total);
    }, [items]);

    const onChange = (e) => {
        if (e.target.checked) {
            setShowFuncionario(true);
        }
        else {
            setShowFuncionario(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const funcionario = document.querySelector('#nome_funcionario').value;
        const total = document.querySelector('#total').value;
        const total_desconto = document.querySelector('#total_desconto').value;
        const items = document.querySelector('.ant-table-tbody').textContent;
        const billingType = document.querySelector('.ant-select-selection-item').textContent;
        const data = {
            funcionario,
            total,
            total_desconto,
            items,
            billingType,
        };

        console.log(data);

        // axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/venda.php', data)
        //     .then((res) => {
        //         if (res.data.status === 'success') {
        //             console.log(res.data);
        //             window.location.reload();
        //         } else {
        //             console.error('Erro: Não foi possível finalizar a venda', res);
        //         }
        //     })
        //     .catch((err) => {
        //         console.error
        //     }
        //     );
    }

    return (
        <div>
            <form>


                <style>
                    {`
                
                .customer-input{
                    height: 5rem;
                    font-size: 2rem !important;
                    font-weight: 700;
                }
                .customer-input>div>span{
                    font-size: 2rem !important;
                }
                `

                    }
                </style>
                {contextHolder}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>

                    <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
                            <div style={{ width: '70%' }}>
                                <Typography.Title level={5}>Código da peça</Typography.Title>
                                <Input value={code} onChange={handleCodeChange} onKeyPress={handleKeyPress} className='customer-input' type="text" />
                            </div>

                            <div style={{ width: '30%' }}>
                                <Typography.Title level={5}>Quantidade</Typography.Title>
                                <Input className='input_quant customer-input' type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity} onKeyPress={handleKeyPress} />
                            </div>


                        </div>
                        <Table columns={columns} dataSource={items} size="small" pagination={{ pageSize: 10 }} />
                    </div>
                    <div style={{ width: '48%', paddingTop: '60px' }}>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <Select                                
                                    placeholder="Forma de Pagamento"
                                    style={{
                                        minWidth: 200,
                                    }}
                                    onChange={handleChangeBillingType}
                                    options={[
                                        {
                                            value: 'Credito',
                                            label: 'Crédito',
                                        },
                                        {
                                            value: 'Debito',
                                            label: 'Débito',
                                        },
                                        {
                                            value: 'Desconto em Folha',
                                            label: 'Desconto em Folha',
                                        },
                                        {
                                            value: 'Dinheiro',
                                            label: 'Dinheiro',
                                        },
                                        {
                                            value: 'Pix',
                                            label: 'PIX',
                                        },
                                        {
                                            value: 'Acolhido',
                                            label: 'Acolhido',
                                        },
                                    ]}
                                />
                                {showCheckbox &&
                                    <Checkbox onChange={onChange}>Funcionário</Checkbox>
                                }
                            </div>

                            {showFuncionario &&
                                <AutoComplete
                                    style={{
                                        width: 200,
                                    }}
                                    options={options}
                                    id='nome_funcionario'
                                    placeholder="Funcionário"
                                    filterOption={(inputValue, option) =>
                                        option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                    }

                                />
                            }
                        </div>
                        <div style={{display: 'flex', gap: '20px'}}>
                            <div style={{ width: '50%' }}>
                                <Typography.Title level={5}>Valor <FontAwesomeIcon icon={faDollarSign} /></Typography.Title>
                                <input type="hidden" id="total" value={total} />
                                <Input disabled style={{ color: theme.token.colorTextBase }} className='customer-input' type="text" value={total.toLocaleString(
                                    'pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })} />
                            </div>
                            <div style={{ width: '20%' }}>
                                <Typography.Title level={5}>Parcelas</Typography.Title>
                                <Select
                                className='customer-input'
                                    placeholder="Parcelas"
                                    style={{
                                        minWidth: 200,
                                    }}
                                    options={[
                                        {
                                            value: '1',
                                            label: '1x',
                                        },
                                        {
                                            value: '2',
                                            label: '2x',
                                        },
                                        {
                                            value: '3',
                                            label: '3x',
                                        }
                                    ]}
                                />
                            </div>
                        </div>

                        {showFuncionario &&
                            <div style={{ width: '50%' }}>
                                <Typography.Title level={5}>Valor com desconto <FontAwesomeIcon icon={faPercent} /></Typography.Title>
                                <input type="hidden" id="total_desconto" value={total * 0.9} />
                                <Input disabled style={{ color: theme.token.colorSuccess }} className='customer-input' type="text" value={(total * 0.9).toLocaleString(
                                    'pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                })} />
                            </div>
                        }
                    </div>

                </div>
                <Button type="primary" onClick={handleSubmit} style={{ marginTop: '30px' }}>
                    Finalizar Venda
                </Button>

            </form>
        </div>
    );
};

export default Venda;
