import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Card, Image, Space } from "antd";
import { MyContext } from "../contexts/MyContext";
import Logo from "../assets/logo_xl.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

import './StyleComponents.css';

function Login() {
  const { toggleNav, loginUser, isLoggedIn } = useContext(MyContext);

  const initialState = {
    userInfo: {
      usuario: "",
      senha: "",
    },
    errorMsg: "",
    successMsg: "",
  };

  const [state, setState] = useState(initialState);

  const onChangeValue = (e) => {
    setState({
      ...state,
      userInfo: {
        ...state.userInfo,
        [e.target.name]: e.target.value,
      },
    });
  };

  const submitForm = async () => {
    const data = await loginUser(state.userInfo);
    if (data.success && data.token) {
      setState({
        ...initialState,
      });
      sessionStorage.setItem("loginToken", data.token);
      await isLoggedIn();
    } else {
      setState({
        ...state,
        successMsg: "",
        errorMsg: data.message,
      });
    }
  };

  let successMsg = "";
  let errorMsg = "";
  if (state.errorMsg) {
    errorMsg = (
      <div className="ant-form-explain error-msg">
        {state.errorMsg}
      </div>
    );
  }
  if (state.successMsg) {
    successMsg = (
      <div className="ant-form-explain success-msg">
        {state.successMsg}
      </div>
    );
  }


  return (
    <div style={{ display: 'flex', gap: '50px', flexWrap: 'wrap', justifyContent: 'center' }}>

      <img src={Logo} alt="Logo" className="responsive-image" />



      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Card
          title="Login"
          bordered={true}
          style={{
            width: 350,
          }}
        >
          <Form onFinish={submitForm} layout="vertical">
            <Form.Item label="E-mail">
              <Input
                name="usuario"
                type="user"
                value={state.userInfo.usuario}
                onChange={onChangeValue}
              />
            </Form.Item>
            <Form.Item label="Senha">
              <Input.Password name="senha" value={state.userInfo.senha} onChange={onChangeValue} />
            </Form.Item>
            {errorMsg}
            {successMsg}
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" htmlType="submit" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center', width: '50%' }}>
                Entrar <FontAwesomeIcon icon={faRightToBracket} />
              </Button>
            </div>

          </Form>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        {/* <Button onClick={toggleNav} variant="outlined" style={{ width: '50%' }}>
          Cadastrar
        </Button> */}
      </div>
        </Card>
      </div>

    </div>

  );
}

export default Login;
