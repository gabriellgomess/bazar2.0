import React, { useState, useEffect } from 'react';
import { Flex, Typography, Input, Select } from 'antd';
import axios from 'axios';

const Venda = (props) => {
    const { theme } = props;
    const [funcionarios, setFuncionarios] = useState([]);

    useEffect(() => {
        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/busca_funcionarios.php')
            .then((res) => {
                setFuncionarios(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [])

    return (
        <div>
            <style>
                {`input:focus {
                    box-shadow: 0 0 10px ${theme.token.colorPrimary};
                }
                
                .customer-input{
                    height: 5rem;
                    font-size: 2rem;
                    font-weight: 700;
                }
                `

                }
            </style>
            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>

                <div style={{ width: '48%', display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%' }}>
                        <div style={{ width: '70%' }}>
                            <Typography.Title level={5}>Código da peça</Typography.Title>
                            <Input className='customer-input' type="text" />
                        </div>

                        <div style={{ width: '30%' }}>
                            <Typography.Title level={5}>Quantidade</Typography.Title>
                            <Input className='input_quant customer-input' type="text" />
                        </div>

                    </div>
                    <div style={{ background: theme.token.colorTicket, width: '100%', height: '500px', fontFamily: 'Courier', padding: '30px' }}>
                        <table style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Descrição</th>
                                    <th>Quantidade</th>
                                    <th>Valor</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
                <div style={{ width: '48%', paddingTop: '60px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Select
                            placeholder="Forma de Pagamento"
                            style={{
                                minWidth: 200,
                            }}
                            // onChange={handleChange}
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
                        <Select
                            placeholder="Forma de Pagamento"
                            style={{
                                minWidth: 200,
                            }}
                            // onChange={handleChange}
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
                    </div>

                </div>

            </div>


        </div>
    )
}

export default Venda;
