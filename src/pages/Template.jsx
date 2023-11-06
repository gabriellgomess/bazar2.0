import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt, faChartSimple, faGears, faChevronRight, faChevronLeft, faUserGear, faBoxesStacked } from '@fortawesome/free-solid-svg-icons';

import { Layout, Menu, Button, Typography } from 'antd';
const { Header, Sider, Content } = Layout;

import { MyContext } from '../contexts/MyContext';
import { useContext } from 'react';

import { Link, Routes, Route } from 'react-router-dom';



import Venda from './Venda/';
import Dashboard from './Dashboard/';
import Estoque from './Estoque/';
import Backoffice from './Backoffice';

import Logo from '../assets/logo.png';



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
          <Menu.Item key="5" icon={<FontAwesomeIcon icon={faUserGear} />}>
            <Link to={`${import.meta.env.VITE_REACT_APP_PATH}painel/backoffice`}>Perfil</Link>
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
            margin: '24px 16px',
            padding: 24,
            height: 'calc(100vh - 112px)',

          }}>
          <Routes>
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}venda`} element={<Venda theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}dashboard`} element={<Dashboard />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}estoque`} element={<Estoque theme={theme} />} />
            <Route path={`${import.meta.env.VITE_REACT_APP_PATH}backoffice`} element={<Backoffice theme={theme} />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )

}

export default Template;

