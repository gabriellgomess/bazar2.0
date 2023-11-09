import React, { useState, useEffect, useContext } from 'react';
import { Button, notification } from 'antd';
import axios from 'axios';
import { MyContext } from '../../contexts/MyContext';
import ItemsTable from './ItemsTable';
import Valores from './Valores';

const Venda = (props) => {
    const { rootState } = useContext(MyContext);
    const { theUser } = rootState;
    const { theme } = props;
    const [funcionarios, setFuncionarios] = useState([]);
    const [showFuncionario, setShowFuncionario] = useState(false); const [code, setCode] = useState('')

    
    const [api, contextHolder] = notification.useNotification();
    const [showCheckbox, setShowCheckbox] = useState(false);
    const [selectedParcelOption, setSelectedParcelOption] = useState('1');
    const [parcelOptions, setParcelOptions] = useState([
        { value: '1', label: '1x' },
    ]);

    const [items, setItems] = useState([]);
    const [quantity, setQuantity] = useState(1);
    const [total, setTotal] = useState(0);
    const [billingType, setBillingType] = useState('');
    const [nomeFuncionario, setNomeFuncionario] = useState('')
    const [limiteTotal, setLimiteTotal] = useState(0)
    const [limiteDisponivel, setLimiteDisponivel] = useState(0)
    const [desabilitaVenda, setDesabilitaVenda] = useState(false)

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
                    item.quantidade = quantity;
                    setItems([...items, item]);
                    setCode('');
                    setQuantity(1);

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
        habilita_venda()
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
        habilita_venda()

    }, [items, billingType]);

    const habilita_venda = () => {
        if (billingType == "Desconto em Folha") {
            const habilita_venda = formatarValor(limiteDisponivel) - total
            if (habilita_venda <= 0) {
                setDesabilitaVenda(true)
            } else {
                setDesabilitaVenda(false)
            }
        }
    }

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
        habilita_venda()
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
                    habilita_venda()
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
                    />
                </div>
                <Button type="primary" onClick={() => handleViewData()} style={{ marginTop: '30px' }} disabled={desabilitaVenda} >
                    Finalizar Venda
                </Button>

            </form>
        </div>
    );
};

export default Venda;
