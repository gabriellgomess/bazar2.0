import React, { useState, useEffect, useContext } from 'react';
import { Flex, Typography, Input, Select, AutoComplete, Button, Table, notification, Checkbox, Badge, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faBasketShopping } from '@fortawesome/free-solid-svg-icons';

const ItemsTable = ({ items, onDelete, code, handleCodeChange, handleKeyPress, quantity, setQuantity, setItems, setTotal, updateParcelOptions, habilita_venda, theme }) => {
    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo',
            key: 'codigo',
            width: '15%'
        },
        {
            title: 'Descrição',
            dataIndex: 'descricao',
            key: 'descricao',
        },
        {
            title: 'Quant.',
            dataIndex: 'quantidade',
            key: 'quantidade',
            width: '15%'
        },
        {
            title: 'Valor',
            dataIndex: 'valor_sugerido',
            key: 'valor_sugerido',
            width: '15%'
        },
        {
            title: 'Ação',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleRemoveItem(record)}><FontAwesomeIcon color={theme.token.colorError} icon={faTrash} /></Button>
            ),
            width: '10%'
        },
    ];
    const handleRemoveItem = (item) => {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);

        const newTotal = updatedItems.reduce((acc, item) => acc + item.valor_sugerido * item.quantidade, 0);
        setTotal(newTotal);

        updateParcelOptions(newTotal);
        habilita_venda()
    };
    const quantidadeTotal = items.reduce((total, item) => total + parseInt(item.quantidade, 10), 0);
    return(
    <div style={{ width: '48%', minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '30px', flexGrow: '1'}}>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', width: '100%', alignItems: 'end' }}>
            <div style={{ width: '70%' }}>
                <Typography.Title level={5}>Código da peça</Typography.Title>
                <Input value={code} onChange={handleCodeChange} onKeyPress={handleKeyPress} className='customer-input' type="text" />
            </div>

            <div style={{ width: '30%' }}>
                <Typography.Title level={5}>Quantidade</Typography.Title>
                <Input className='input_quant customer-input' type="text" onChange={(e) => setQuantity(e.target.value)} value={quantity} onKeyPress={handleKeyPress} />
            </div>
            <Badge count={quantidadeTotal}>
          <Avatar style={{backgroundColor: '#52c41a'}} shape="square" size="large">
            <FontAwesomeIcon icon={faBasketShopping} />
                </Avatar>
            </Badge>


        </div>
        <Table columns={columns} dataSource={items} size="small" pagination={{ pageSize: 10 }} scroll={{y: 200 }}/>
    </div>
    )
}

export default ItemsTable