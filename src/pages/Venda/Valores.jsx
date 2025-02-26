import { Typography, Input, Select, AutoComplete, Checkbox, Button } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faDollarSign, faGift } from '@fortawesome/free-solid-svg-icons';

const Valores = ({ theme, handleChangeBillingType, showCheckbox, onChange, showFuncionario, options, handleSetName, limiteDisponivel, limiteTotal, total, parcelOptions, setSelectedParcelOption, selectedParcelOption, billingType, id_card, show_gift_card, setId_card, onChangeGiftCard,consultaIdCartaoPresente, valueGiftCard }) => {

    const { Text } = Typography;

    function valorTotalComCartaoPresente(total){
        return total - valueGiftCard;
    }

    return (
        <div style={{ width: '48%', minWidth: '300px', paddingTop: '25px', flexGrow: '1' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '18px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' , minWidth: "275px" }}>
                        <Typography.Title style={{ margin: 0 }} level={5}>Forma de Pagamento</Typography.Title>
                        <Select
                            placeholder="Forma de Pagamento"
                            style={{
                                minWidth: 200,
                                height: 50,
                            }}
                            value={billingType === "" ? "" : billingType}
                            onChange={handleChangeBillingType}
                            options={[
                                {
                                    value: "",
                                    label: "Forma de pagamento",
                                },
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
                        <div style={{display: "flex", alignItems: "center",  width: "120%"}}>
                        {billingType === 'Desconto em Folha' &&
                            <Checkbox onChange={onChange} style={{ fontSize: "20px" }} checked={billingType === "Desconto em Folha" ? "checked" : ""} disabled={billingType === "Desconto em Folha" ? "disable" : ""}>Funcionário</Checkbox>
                        }
                        {showCheckbox &&
                            // eslint-disable-next-line no-undef
                            <Checkbox onChange={onChange} style={{ fontSize: "18px" }} disabled={billingType === "" ? "disable" : "" }>Funcionário</Checkbox>
                        }
                            <Checkbox onChange={onChangeGiftCard} style={{ fontSize: "18px" }} disabled={billingType === "" ? "disable" : ""}>Cartão presente</Checkbox>
                         </div>
                    </div>

                    {showFuncionario &&
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px',  width: "290px" }}>
                            <Typography.Title style={{ margin: 0,}} level={5}>Funcionário</Typography.Title>
                            <AutoComplete
                                style={{
                                    width: 200,
                                    height: 50,
                                }}
                                options={options}
                                id='nome_funcionario'
                                placeholder="Funcionário"
                                filterOption={(inputValue, option) =>
                                    option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                }
                                onSelect={(value) => handleSetName(value)}
                            />
                        </div>

                    }
                </div>
                <div style={{ display: 'flex', gap: '10px', height: '70px'}}>
                    {billingType == 'Desconto em Folha' &&
                        <div style={{ width: '100%', display: "flex", gap: "10px", height: "100%"}}>
                            <div style={{ width: '25%', maxWidth: "125px"}}>
                                <Typography.Title level={5}>Limite disponível</Typography.Title>
                                <Input value={limiteDisponivel} style={{ background: 'lightgrey' }} readOnly />
                            </div>
                            <div style={{ width: '25%', maxWidth: "125px" }}>
                                <Typography.Title level={5}>Limite total</Typography.Title>
                                <Input value={limiteTotal} style={{ background: 'lightgrey' }} readOnly />
                            </div>

                            {show_gift_card && 
                             <div style={{ width: '25%', maxWidth: "125px" }}>
                                <Typography.Title level={5}>Cartão presente</Typography.Title>
                                <Input type="number" style={{ background: 'white' }}  value="" onChange={(e) => {setId_card(Number(e.target.value))}}/>
                             </div>
                            }
                            
                            {show_gift_card &&
                                <Button
                                style={{ marginTop: "60px", width: '25%', maxWidth: "125px" }}
                                type="primary"
                                onClick={() => consultaIdCartaoPresente(id_card)}
                                >
                                Consultar cartão 
                                </Button>
                            }
                        </div>
                        
                    }
                    {show_gift_card && billingType !== 'Desconto em Folha' &&
                             <div style={{ width: '30%',display: "flex", flexDirection: "column", gap: "5px", maxWidth: "125px"}}>
                                <Typography.Title level={5}>Cartão presente</Typography.Title>
                                <Input type="number" min="0" value={id_card} style={{ background: 'white' }} placeholder='0' onChange={(e) => {setId_card(Number(e.target.value))}}/>
                                
                             </div>

                            }
                    {show_gift_card && billingType !== 'Desconto em Folha' &&
                        <Button
                        style={{ marginTop: "65px", maxWidth: "125px"}}
                        type="primary"
                        onClick={() => consultaIdCartaoPresente(id_card)}
                        >
                        Consultar cartão 
                        </Button>
                    }
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', maxWidth: "550px" }}>
                {!showFuncionario && !show_gift_card &&
                    <div style={{ width: '50%' }}>
                        <Typography.Title level={5}>Valor <FontAwesomeIcon icon={faDollarSign} /></Typography.Title>
                        <input type="hidden" id="total" value={total} />
                        <Input disabled style={{ color: theme.token.colorTextBase }} className='customer-input' type="text" value={total.toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })} />
                        <Text italic>
                            {total > 0 ?
                                selectedParcelOption == '1' ? `1x ${total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : selectedParcelOption == '2' ? `2x ${(total / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `3x ${(total / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                : ''}
                        </Text>
                    </div>
                }
                {showFuncionario && !show_gift_card &&
                    <div style={{ width: '50%', maxWidth: "550px" }}>
                        <Typography.Title level={5}>Valor com desconto <FontAwesomeIcon icon={faPercent} /></Typography.Title>
                        <input type="hidden" id="total_desconto" value={total * 0.9} />
                        <Input disabled style={{ color: theme.token.colorSuccess }} className='customer-input' type="text" value={(total).toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })} />
                        <Text italic>
                            {total > 0 ?
                                selectedParcelOption == '1' ? `1x ${(total * 0.9).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : selectedParcelOption == '2' ? `2x ${((total * 0.9) / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `3x ${((total * 0.9) / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                : ''}
                        </Text>
                    </div>
                }


                {showFuncionario && show_gift_card &&
                    <div style={{ width: '75%', maxWidth: "550px" }}>
                        <Typography.Title level={5}>Valor com desconto <FontAwesomeIcon icon={faPercent} /> e cartão presente de {(valueGiftCard).toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })}</Typography.Title>
                        <input type="hidden" id="total_desconto" value={total * 0.9} />
                        <Input disabled style={{ color: theme.token.colorSuccess }} className='customer-input' type="text" value={valorTotalComCartaoPresente(total).toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })} />
                        <Text italic>
                            {total > 0 ?
                                selectedParcelOption == '1' ? `1x ${(valorTotalComCartaoPresente(total * 0.9)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : selectedParcelOption == '2' ? `2x ${(valorTotalComCartaoPresente(total * 0.9) / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `3x ${(valorTotalComCartaoPresente(total * 0.9) / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                : ''}
                        </Text>
                    </div>
                }

                {show_gift_card && !showFuncionario &&  
                    <div style={{ width: '70%' }}>
                        <Typography.Title level={5}>Valor com cartão presente  <FontAwesomeIcon icon={faGift} />  de {(valueGiftCard).toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })} </Typography.Title>
                        <input type="hidden" id="total" value={valorTotalComCartaoPresente(total)} />
                        <Input disabled style={{ color: theme.token.colorSuccess }} className='customer-input' type="text" value={valorTotalComCartaoPresente(total).toLocaleString(
                            'pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        })} />
                        <Text italic>
                            {total > 0 ?
                                selectedParcelOption == '1' ? `1x ${valorTotalComCartaoPresente(total).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : selectedParcelOption == '2' ? `2x ${(valorTotalComCartaoPresente(total) / 2).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}` : `3x ${(valorTotalComCartaoPresente(total) / 3).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                                : ''}
                        </Text>
                    </div>
                }



                <div style={{ width: '20%' }}>
                    <Typography.Title level={5}>Parcelas</Typography.Title>
                    <Select
                        id='quantidade_parcelas'
                        className='customer-input'
                        placeholder="Parcelas"
                        style={{ minWidth: 100 }}
                        options={parcelOptions}
                        value={selectedParcelOption}
                        onChange={(value) => setSelectedParcelOption(value)}
                    />

                </div>
            </div>


        </div>
    )
}

export default Valores