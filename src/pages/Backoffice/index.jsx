import React from 'react';
import { Tabs } from 'antd';
import LimitManager from '../../components/LimitManager';
import AddFunc from '../../components/AddFunc';

const { TabPane } = Tabs;

const Backoffice = () => {
    return(
        <div>
            <h1>Gerenciamento</h1>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Gerenciar Limites" key="1">
                    <LimitManager />
                </TabPane>
                <TabPane tab="Adicionar Funcionário" key="2">
                    <AddFunc />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default Backoffice;
