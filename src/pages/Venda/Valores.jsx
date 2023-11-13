import { Typography, Input, Select, AutoComplete, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const Valores = ({ theme, handleChangeBillingType, showCheckbox, onChange, showFuncionario, options, handleSetName, limiteDisponivel, limiteTotal, total, parcelOptions, setSelectedParcelOption, selectedParcelOption, billingType }) => {

    const { Text } = Typography;

    return (
        <div style={{ width: '48%', minWidth: '300px', paddingTop: '60px', flexGrow: '1' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Typography.Title style={{margin: 0}}  level={5}>Forma de Pagamento</Typography.Title>
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
                         <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Typography.Title style={{margin: 0}} level={5}>Funcionário</Typography.Title>
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
                        </div>

                    }
                </div>
                <div style={{ display: 'flex', gap: '10px', height: '70px' }}>
                    {billingType == 'Desconto em Folha' &&
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
                {!showFuncionario &&
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
                {showFuncionario &&
                    <div style={{ width: '50%' }}>
                        <Typography.Title level={5}>Valor com desconto <FontAwesomeIcon icon={faPercent} /></Typography.Title>
                        <input type="hidden" id="total_desconto" value={total * 0.9} />
                        <Input disabled style={{ color: theme.token.colorSuccess }} className='customer-input' type="text" value={(total * 0.9).toLocaleString(
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

                </div>
            </div>


        </div>
    )
}

export default Valores