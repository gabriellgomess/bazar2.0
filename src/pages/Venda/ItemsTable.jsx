import React, { useState, useEffect, useContext } from 'react';
import { Flex, Typography, Input, Select, AutoComplete, Button, Table, notification, Checkbox } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ItemsTable = ({ items, onDelete, code, handleCodeChange, handleKeyPress, quantity, setQuantity, setItems, setTotal, updateParcelOptions, habilita_venda, theme }) => {
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
    const handleRemoveItem = (item) => {
        const updatedItems = items.filter((i) => i.id !== item.id);
        setItems(updatedItems);

        const newTotal = updatedItems.reduce((acc, item) => acc + item.valor_sugerido * item.quantidade, 0);
        setTotal(newTotal);

        updateParcelOptions(newTotal);
        habilita_venda()
    };
    return(
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
    )
}

export default ItemsTable