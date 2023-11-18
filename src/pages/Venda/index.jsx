import React, { useState, useEffect, useContext } from 'react';
import { Button, notification, Alert } from 'antd';
import axios from 'axios';
import { MyContext } from '../../contexts/MyContext';
import ItemsTable from './ItemsTable';
import Valores from './Valores';

const Venda = ({ theme }) => {
    const { rootState } = useContext(MyContext);
    const { theUser } = rootState;

    // Estados para funcionários e venda
    const [funcionarios, setFuncionarios] = useState([]);
    const [items, setItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [billingType, setBillingType] = useState('');
    const [nomeFuncionario, setNomeFuncionario] = useState('');
    const [limiteTotal, setLimiteTotal] = useState(0);
    const [limiteDisponivel, setLimiteDisponivel] = useState(0);
    const [desabilitaVenda, setDesabilitaVenda] = useState(false);
    const [showCheckbox, setShowCheckbox] = useState(true);
    const [quantity, setQuantity] = useState('1');

    // Estados para UI
    const [code, setCode] = useState('');
    const [showFuncionario, setShowFuncionario] = useState(false);
    const [parcelOptions, setParcelOptions] = useState([{ value: '1', label: '1x' }]);
    const [selectedParcelOption, setSelectedParcelOption] = useState('1');

    // API de notificação
    const [api, contextHolder] = notification.useNotification();

    const openNotificationWithIcon = (type, message, description) => {
        api[type]({
            message: message,
            description: description,
            placement: 'bottomRight',
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
                    item.quantidade = quantity;
                    setItems([...items, item]);
                    setCode('');
                    setQuantity(1);

                    const valor_compra = total + item.valor_sugerido * quantity;
                    updateParcelOptions(valor_compra);


                } else {
                    console.error('Erro: Não foi possível encontrar a peça', res);
                    openNotificationWithIcon('error', 'Erro ao buscar peça', 'Não foi possível encontrar a peça. Por favor, verifique o código e tente novamente.')
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
        setBillingType(value);
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

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            handleGetPecas();

        }

    };

    function formatarValor(valor) {
        if (valor) {
            let valorSemPonto = valor.replace(/\./g, '');
            let valorFormatado = valorSemPonto.replace(/,/, '.');
            return parseFloat(valorFormatado);
        }
    }

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

    const habilita_venda = () => {
        if (billingType == "Desconto em Folha") {
            const habilitar_venda = formatarValor(limiteDisponivel) - (total * 0.9)
            if (habilitar_venda <= 0) {
                setDesabilitaVenda(true)
            } else {
                setDesabilitaVenda(false)
            }
        } else {
            setDesabilitaVenda(false)
        }

    }

    // UseEffect para habilitar a venda
    useEffect(() => {
        habilita_venda()
    }, [total, limiteDisponivel, billingType, nomeFuncionario])

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
        checkLimit(value);

    }

    const checkLimit = (nome) => {
        if (!nome) {
            console.log("O nome do funcionário é obrigatório.");
            return;
        }

        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/consulta_limites.php', { nome_funcionario: nome })
            .then((res) => {
                if (res.data) {
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
                    id: item.id,
                    codigo: item.codigo,
                    descricao: item.descricao,
                    tag: item.tag,
                    tipo: item.tipo,
                    valor_loja: item.valor_loja,
                    valor_50: item.valor_50,
                    valor_sugerido: item.valor_sugerido,
                    desc_func_10: item.desc_func_10,
                    quantidade: item.quantidade,
                    valor_pago: showFuncionario ? item.valor_sugerido * 0.9 : item.valor_sugerido,
                }
            }),
            check_func: showFuncionario ? 1 : 0,
        }
        if (data.check_func === 1 || data.forma_pagamento === 'Desconto em Folha') {
            if (!data.nome_funcionario) {
                openNotificationWithIcon('error', 'Erro ao finalizar a venda', 'Selecione o funcionário.')
                return;
            }
        }
        if (data.total_pecas <= 0) {
            openNotificationWithIcon('error', 'Erro ao finalizar a venda', 'Não há peças na venda.')
            return;
        }
        if (!data.forma_pagamento) {
            openNotificationWithIcon('error', 'Erro ao finalizar a venda', 'Selecione a forma de pagamento')
            return;
        }

        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/finaliza_venda.php', data)
            .then((res) => {
                console.log("Resposta: ", res);
                // Verifica se a venda foi finalizada com sucesso e exibe uma notificação de sucesso
                if (res.data && res.data.success) {
                    openNotificationWithIcon('success', 'Venda finalizada com sucesso', 'Sua venda foi processada e finalizada.');
                    console.log("Resposta: ", res);
                    // Aqui você pode limpar o estado do formulário ou redirecionar o usuário
                    setItems([]);
                    setTotal(0);
                    setCode('');
                    setQuantity(1);
                    setBillingType('');
                    setNomeFuncionario('');
                    setLimiteTotal(0);
                    setLimiteDisponivel(0);
                    setDesabilitaVenda(false);
                    setShowFuncionario(false);
                    setShowCheckbox(true);
                    setSelectedParcelOption('1');
                    setParcelOptions([{ value: '1', label: '1x' }]);

                } else {
                    // Se a resposta não for sucesso, exibe uma notificação de erro
                    openNotificationWithIcon('error', 'Erro ao finalizar a venda', 'Não foi possível processar a venda. Por favor, tente novamente.');
                }
            })
            .catch((err) => {
                // Se houver um erro na requisição, exibe uma notificação de erro
                openNotificationWithIcon('error', 'Erro ao finalizar a venda', 'Houve um problema ao conectar ao servidor. Por favor, verifique sua conexão.');
                console.log("Erro: ", err);
            });

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
                <div style={{ width: '100%', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', paddingTop: '0' }}>

                    <ItemsTable
                        code={code}
                        handleCodeChange={handleCodeChange}
                        handleKeyPress={handleKeyPress}
                        quantity={quantity}
                        setQuantity={setQuantity}
                        items={items}
                        theme={theme}
                        setItems={setItems}
                        setTotal={setTotal}
                        updateParcelOptions={updateParcelOptions}
                        habilita_venda={habilita_venda}
                    />
                    <Valores
                        handleChangeBillingType={handleChangeBillingType}
                        showCheckbox={showCheckbox}
                        onChange={onChange}
                        showFuncionario={showFuncionario}
                        options={options}
                        handleSetName={handleSetName}
                        limiteDisponivel={limiteDisponivel}
                        limiteTotal={limiteTotal}
                        total={total}
                        theme={theme}
                        parcelOptions={parcelOptions}
                        setSelectedParcelOption={setSelectedParcelOption}
                        selectedParcelOption={selectedParcelOption}
                        billingType={billingType}
                    />
                </div>
                <Button type="primary" onClick={() => handleViewData()} style={{ marginTop: '30px' }} disabled={desabilitaVenda} >
                    Finalizar Venda
                </Button>

            </form>
            {desabilitaVenda &&
                <Alert
                    style={{ marginTop: '30px' }}
                    message="Limite excedido!"
                    description="Não há limite disponível para o funcionário selecionado."
                    type="warning"
                    showIcon
                />
            }

        </div>
    );
};

export default Venda;
