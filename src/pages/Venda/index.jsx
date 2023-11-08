import React, { useState, useEffect, useContext } from 'react';
import { Flex, Typography, Input, Select, AutoComplete, Button, Table, notification, Checkbox } from 'antd'; // Importe o componente Button e Table
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useForm, Controller, set } from 'react-hook-form';
import { MyContext } from '../../contexts/MyContext';



const Venda = (props) => {
    const { rootState } = useContext(MyContext);
    const { theUser } = rootState;
    const { theme } = props;
    const [funcionarios, setFuncionarios] = useState([]);
    const [showFuncionario, setShowFuncionario] = useState(false); const [code, setCode] = useState('');

    const [errorMessage, setErrorMessage] = useState('');
    const [api, contextHolder] = notification.useNotification();
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [selectedParcelOption, setSelectedParcelOption] = useState('1');
    const [parcelOptions, setParcelOptions] = useState([
        { value: '1', label: '1x' },
    ]);
    const { Text } = Typography;
    const { control, handleSubmit, setValue } = useForm();

    const [items, setItems] = useState([]); // Estado para armazenar a lista de itens
    const [quantity, setQuantity] = useState(1); // Estado para armazenar a quantidade de itens
    const [total, setTotal] = useState(0); // Estado para armazenar o total da venda
    const [billingType, setBillingType] = useState(''); // Estado para armazenar a forma de pagamento
    const [nomeFuncionario, setNomeFuncionario] = useState('')
    const [limiteTotal, setLimiteTotal] = useState(0)
    const [limiteDisponivel, setLimiteDisponivel] = useState(0)


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

                    // Verifique o valor da compra e atualize as opções de parcelamento
                    const valor_compra = total + item.valor_sugerido * quantity;
                    updateParcelOptions(valor_compra);
                } else {
                    console.error('Erro: Não foi possível encontrar a peça', res);
                    openNotificationWithIcon('warning')
                }
            })
            .catch((err) => {
                console.error('Erro na requisição:', err);
            });
    };

    const updateParcelOptions = (valor_compra) => {
        if (valor_compra > 0) {
            if (valor_compra < 150) {
                setParcelOptions([{ value: '1', label: '1x' }]);
                setSelectedParcelOption('1')
            } else {
                setParcelOptions([
                    { value: '1', label: '1x' },
                    { value: '2', label: '2x' },
                    { value: '3', label: '3x' },
                ]);
            }
        }
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
            setLimiteDisponivel(0);
            setLimiteTotal(0);
        }
        setBillingType(value)

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

        // Recalcule o valor total após a remoção
        const newTotal = updatedItems.reduce((acc, item) => acc + item.valor_sugerido * item.quantidade, 0);
        setTotal(newTotal);

        // Verifique o valor da compra e atualize as opções de parcelamento
        updateParcelOptions(newTotal);
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
        if (billingType == "Acolhido") {
            total = 0;
            setTotal(total);
        } else {
            setTotal(total);
        }

    }, [items, billingType]);

    const onChange = (e) => {
        if (e.target.checked) {
            setShowFuncionario(true);
        }
        else {
            setShowFuncionario(false);
            setLimiteDisponivel(0);
            setLimiteTotal(0);
        }
    };

    const handleSetName = (value) => {

        setNomeFuncionario(value);

        console.log("Nome do funcionário EVENT: ", value)
        checkLimit(value);
    }

    const checkLimit = (nome) => {
        console.log("Inicia busca do limite")
        console.log("Nome func_ ", nome)
        if (!nome) {
            console.log("O nome do funcionário é obrigatório.");
            return;
        }

        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/consulta_limites.php', { nome_funcionario: nome })
            .then((res) => {
                console.log("Retorno consulta limite: ", res)
                if (res.data) {
                    console.log("Limite Total: ", res.data.limite_total);
                    console.log("Limite Disponível: ", res.data.limite_disponivel);
                    setLimiteTotal(res.data.limite_total);
                    setLimiteDisponivel(res.data.limite_disponivel);
                } else {
                    console.log("Resposta recebida, mas sem dados de limite.");
                }
            })
            .catch((err) => {
                console.log("Erro: ", err);
            });
    }


    const handleViewData = () => {
        // console.log("Itens: ", items)
        // console.log("Forma de pagamento: ", billingType)
        // console.log("É funcionário: ", showFuncionario)
        // console.log("Nome do funcionário: ", nomeFuncionario)
        // console.log("Quantidade de parcelas: ", selectedParcelOption)
        // if (showFuncionario) {
        //     console.log("Total: ", total * 0.9)
        //     console.log("Valor parcela: ", total * 0.9 / selectedParcelOption)
        // } else {
        //     console.log("Total: ", total)
        //     console.log("Valor parcela: ", total / selectedParcelOption)
        // }

        const data = {
            nome_funcionario: nomeFuncionario,
            data_compra: new Date().toISOString().slice(0, 10),
            valor_compra: showFuncionario ? total * 0.9 : total,
            total_pecas: items.length,
            quantidade_parcelas: selectedParcelOption,
            valor_parcela: showFuncionario ? total * 0.9 / selectedParcelOption : total / selectedParcelOption,
            forma_pagamento: billingType,
            usuario: theUser.name,
            log_transacao: items.map((item) => {
                return {
                    codigo_peca: item.codigo,
                    quantidade: item.quantidade,
                    valor: item.valor_sugerido,
                };
            }),
            check_func: showFuncionario ? 1 : 0,
        }

        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/finaliza_venda.php', data)
            .then((res) => {
                console.log("Resposta: ", res)
            })
            .catch((err) => {
                console.log("Erro: ", err)
            })



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
                }               `

                    }
                </style>
                {contextHolder}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px' }}>

                    <div style={{ width: '48%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: '1' }}>
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
                    <div style={{ width: '48%', minWidth: '300px', paddingTop: '60px', flexGrow: '1' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                                        onSelect={(value) => handleSetName(value)}
                                    />
                                }
                            </div>
                            <div style={{ display: 'flex', gap: '10px', height: '70px' }}>
                                {showFuncionario &&
                                <>
                                    <div style={{ width: '30%' }}>
                                        <Typography.Title level={5}>Limite disponível</Typography.Title>
                                        <Input value={limiteDisponivel} style={{ background: 'lightgrey' }} readOnly />
                                    </div>
                                    <div style={{ width: '30%' }}>
                                        <Typography.Title level={5}>Limite total</Typography.Title>
                                        <Input value={limiteTotal} style={{ background: 'lightgrey' }} readOnly />
                                    </div>
                                </>
                                }

                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '20px' }}>
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
                                    id='quantidade_parcelas'
                                    className='customer-input'
                                    placeholder="Parcelas"
                                    style={{ minWidth: 200 }}
                                    options={parcelOptions}
                                    value={selectedParcelOption}
                                    onChange={(value) => setSelectedParcelOption(value)}
                                />
                                <Text italic>
                                    {total > 0 ?
                                        selectedParcelOption == '1' ? `1x ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : selectedParcelOption == '2' ? `2x ${(total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `3x ${(total / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                        : ''}
                                </Text>

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
                <Button type="primary" onClick={() => handleViewData()} style={{ marginTop: '30px' }}>
                    Finalizar Venda
                </Button>

            </form>
        </div>
    );
};

export default Venda;
