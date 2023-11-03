import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BarChartOutlined,
  HomeOutlined,
  UserOutlined,
  CheckOutlined
} from '@ant-design/icons';
import { Layout, Menu, Button, Typography } from 'antd';
const { Header, Sider, Content } = Layout;

import { MyContext } from '../contexts/MyContext';
import { useContext } from 'react';

import { Link, Routes, Route } from 'react-router-dom';



import Venda from './Venda/';
import Dashboard from './Dashboard/';
import Backoffice from './Backoffice';



const Template = (props) => {
  const { logoutUser } = useContext(MyContext);
  const [collapsed, setCollapsed] = useState(false);
  const { Title } = Typography;
  const { theme } = props;

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          style={{ backgroundColor: theme.token.colorBgMenus, height: '100vh', color: theme.token.colorTextBase }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
         
          <Menu.Item key="1" icon={<HomeOutlined />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/venda`}>Venda</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<BarChartOutlined />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/dashboard`}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/backoffice`}>Backoffice</Link>
          </Menu.Item>         
        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            backgroundColor: theme.token.colorBgMenus,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: '24px',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <Button onClick={logoutUser} color="primary" variant="ghost">
            Sair
          </Button>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            height: 'calc(100vh - 112px)',

          }}>
          <Routes>
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}venda`} element={<Venda theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}dashboard`} element={<Dashboard />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}backoffice`} element={<Backoffice theme={theme} />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )

}

export default Template;

