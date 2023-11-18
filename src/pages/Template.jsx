import React, { useState, useContext } from 'react';
import { MyContext } from '../contexts/MyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faChartSimple, faGears, faChevronRight, faChevronLeft, faUserGear, faBoxesStacked, faCartShopping } from '@fortawesome/free-solid-svg-icons';

import { Layout, Menu, Button, Typography, Avatar } from 'antd';
const { Header, Sider, Content } = Layout;


import { Link, Routes, Route } from 'react-router-dom';



import Venda from './Venda/';
import Dashboard from './Dashboard/';
import Estoque from './Estoque/';
import Backoffice from './Backoffice';
import Perfil from './Perfil';

import Logo from '../assets/logo.png';
import Transacoes from './Transacoes';



const Template = (props) => {
  const { logoutUser, rootState } = useContext(MyContext);
  const { theUser } = rootState;
  const [collapsed, setCollapsed] = useState(false);
  const { Title } = Typography;
  const { theme } = props;

  // Função auxiliar para extrair as iniciais
  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`;
    }
    return parts[0][0];
  }

  // Função auxiliar para extrair o primeiro e último nome
  const getFirstAndLastName = (name) => {
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[0]} ${parts[parts.length - 1]}`;
    }
    return name;
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <Menu
          style={{ backgroundColor: theme.token.colorBgMenus, height: '100vh', color: theme.token.colorTextBase }}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
        >
          {!collapsed &&
            <Title level={5} style={{ color: theme.token.colorTextBase, textAlign: 'center', marginTop: '24px', marginBottom: '24px' }}>Olá, {getFirstAndLastName(theUser.name)} </Title>
          }
          {collapsed &&
            <div style={{ width: '100%', height: '66px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Avatar
                style={{
                  backgroundColor: '#fde3cf',
                  color: '#f56a00',
                }}
              >
                {getInitials(theUser.name)}
              </Avatar>
            </div>
          }
          <Menu.Item key="1" icon={<FontAwesomeIcon icon={faShirt} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/venda`}>Venda</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<FontAwesomeIcon icon={faChartSimple} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/dashboard`}>Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<FontAwesomeIcon icon={faGears} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/backoffice`}>Gerenciamento</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<FontAwesomeIcon icon={faBoxesStacked} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/estoque`}>Estoque</Link>
          </Menu.Item>
          <Menu.Item key="5" icon={<FontAwesomeIcon icon={faCartShopping} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/transacoes`}>Transações</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<FontAwesomeIcon icon={faUserGear} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/perfil`}>Perfil</Link>
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
            icon={collapsed ? <FontAwesomeIcon icon={faChevronRight} /> : <FontAwesomeIcon icon={faChevronLeft} />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <img src={Logo} alt="Logo" style={{ width: '100%', maxWidth: '200px', margin: '0 auto', display: 'block' }} />
          <Button onClick={logoutUser} color="primary" variant="ghost">
            Sair
          </Button>
        </Header>
        <Content
          style={{
            margin: '10px 16px',
            padding: '0px 16px',
            height: 'calc(100vh - 112px)',

          }}>
          <Routes>
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}venda`} element={<Venda theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}dashboard`} element={<Dashboard />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}estoque`} element={<Estoque theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}transacoes`} element={<Transacoes theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}backoffice`} element={<Backoffice theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}perfil`} element={<Perfil theme={theme} />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )

}

export default Template;

