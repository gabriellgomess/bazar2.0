import React, { useState, useEffect } from 'react'
import Chart from "react-apexcharts";
import axios from 'axios'

const Dashboard = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        axios.get('https://amigosdacasa.org.br/bazar-amigosdacasa/api/get_data.php')
            .then((response) => {
                setData(response.data)
            })
        console.log(data)
    }, [])

    const options = {
        chart: {
            id: "basic-bar",
            toolbar: {
                show: false // Remova os botões de zoom e download
            },

        },
        xaxis: {
            categories: (data.transacoes)?.map(item => (item.data_transacao).split('-').reverse().join('/'))
        },
        fill: {
            type: "gradient",
            gradient: {
                gradientToColors: [
                    "#BC0DCC",
                    "#D384B7"
                ],
                colorStops: [
                    {
                        opacity: 1,
                        offset: 0,
                        color: "#E05297"
                    },
                    {
                        opacity: 1,
                        offset: 100,
                        color: "#EBB0CD"
                    }
                ]
            }
        },
        stroke: {
            colors: []
        },
        legend: {
            show: false
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            "show": false,
        },
    };

    const series = data.transacoes ? [
        {
            name: "Valor (R$)",
            data: data.transacoes.map(item => parseFloat(item.total_valor).toFixed(0))
        }
    ] : [];

    const optionsDonut = {
        chart: {
            type: "donut",
        },
        labels: data.formas_pagamento ? data.formas_pagamento.map(item => item.forma_pagamento) : [],
    };

    const seriesDonut = data.formas_pagamento ? data.formas_pagamento.map(item => parseInt(item.quantidade)) : [];



    return (
        <div>
            <h1>Dashboard</h1>

            <div style={{ display: 'flex', gap: '50px' }}>
                <Chart
                    options={options}
                    series={series}
                    type="area"
                    width="500"
                    height="300"
                />
                <Chart
                    options={optionsDonut}
                    series={seriesDonut}
                    type="donut"
                    width="500"
                    height="300"
                />
            </div>
        </div>

    )
}

export default Dashboard
