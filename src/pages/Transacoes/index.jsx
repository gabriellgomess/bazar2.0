import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Space, Table } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-solid-svg-icons';

const ExportToExcel = ({ apiData, fileName }) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const exportToCSV = (apiData, fileName) => {
        const ws = XLSX.utils.json_to_sheet(apiData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    }

    return (
        <Button icon={<FontAwesomeIcon icon={faFileExcel} />} onClick={(e) => exportToCSV(apiData, fileName)}>Exportar</Button>
    );
};

const Transacoes = () => {
    const [dataSource, setDataSource] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    useEffect(() => {
        axios.post('https://amigosdacasa.org.br/bazar-amigosdacasa/api/busca_transacoes.php')
            .then((response) => {
                setDataSource(response.data);
                setFilteredData(response.data); // Inicializa filteredData com os dados recebidos
            })
            .catch((error) => {
                // Handle error
                console.error("There was an error!", error);
            });
    }, []);

    const expandedRowRender = (record) => {
        const subColumns = [
            // Sub colunas para os detalhes de log_transacao
            { title: 'ID', dataIndex: 'id', key: 'id' },
            { title: 'Código', dataIndex: 'codigo', key: 'codigo' },
            { title: 'Descrição', dataIndex: 'descricao', key: 'descricao' },
            { title: 'Quantidade', dataIndex: 'quantidade', key: 'quantidade' },
            { title: 'Tag', dataIndex: 'tag', key: 'tag' },
            { title: 'Valor sugerido', dataIndex: 'valor_sugerido', key: 'valor_sugerido' },
            { title: 'Valor desc 10%', dataIndex: 'desc_func_10', key: 'desc_func_10' },

        ];


        // Se log_transacao esttiver vazio, data será um array vazio
        if (record.log_transacao === '') {
            return <p>Não há detalhes para esta transação</p>;
        } else {
            const data = JSON.parse(record.log_transacao);
            return <Table columns={subColumns} dataSource={data} pagination={false} />;
        }


    };

    const columns = [
        {
            id: 'id',
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            width: '5%'
        },
        {
            nome: 'nome',
            title: 'Nome',
            dataIndex: 'nome',
            key: 'nome',
            ...getColumnSearchProps('nome'),
            width: '25%'
        },
        {
            total_pecas: 'total_pecas',
            title: 'Total de Peças',
            dataIndex: 'total_pecas',
            key: 'total_pecas',
            width: '10%'
        },
        {
            parcelas: 'parcelas',
            title: 'Parcelas',
            dataIndex: 'parcelas',
            key: 'parcelas',
            width: '8%'
        },
        {
            forma_pagamento: 'forma_pagamento',
            title: 'Forma de Pagamento',
            dataIndex: 'forma_pagamento',
            key: 'forma_pagamento',
            filters: [
                { text: 'Débito', value: 'Debito' },
                { text: 'Crédito', value: 'Credito' },
                { text: 'Dinheiro', value: 'Dinheiro' },
                { text: 'Pix', value: 'Pix' },
                { text: 'Desconto em Folha', value: 'Desconto em Folha' },
            ],
            onFilter: (value, record) => record.forma_pagamento.indexOf(value) === 0,
        },
        {
            tipo: 'tipo',
            title: 'Tipo',
            dataIndex: 'tipo',
            key: 'tipo',
            filters: [
                { text: 'Funcionário', value: 'funcionario' },
                { text: 'Venda Externa', value: 'externo' },
                { text: 'Venda Externa Promo', value: 'externo promo' },
            ],
            onFilter: (value, record) => record.tipo.indexOf(value) === 0,
        },
        {
            usuario: 'usuario',
            title: 'Usuário',
            dataIndex: 'usuario',
            key: 'usuario'
        },
        {
            valor_compra: 'valor_compra',
            title: 'Valor da Compra',
            dataIndex: 'valor_compra',
            key: 'valor_compra',
            sortDirections: ['descend', 'ascend']
        },
        {
            data: 'data',
            title: 'Data',
            dataIndex: 'data',
            key: 'data',
            sorter: (a, b) => a.data.localeCompare(b.data),
            sortDirections: ['descend', 'ascend']
        }

    ];



    const handleTableChange = (pagination, filters, sorter, extra) => {
        if (extra.action === 'filter') {
            // Aqui você pode querer usar extra.currentDataSource para obter os dados já filtrados
            setFilteredData(extra.currentDataSource);
        }
    };

    return (
        <>
            <Table
                dataSource={dataSource}
                columns={columns}
                onChange={handleTableChange}
                rowKey="id"
                expandable={{ expandedRowRender }}
                scroll={{y: 440 }}
            />
            <ExportToExcel apiData={filteredData} fileName="nome_do_arquivo_filtrado" />
        </>
    );
};

export default Transacoes;
