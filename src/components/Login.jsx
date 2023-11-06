import React, { useContext, useState } from "react";
import { Form, Input, Button, Typography, Card } from "antd";
import { MyContext } from "../contexts/MyContext";
import Logo from "../assets/logo_xl.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRightToBracket } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const { toggleNav, loginUser, isLoggedIn } = useContext(MyContext);

  const initialState = {
    userInfo: {
      email: "",
      password: "",
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
   <div style={{display: 'flex', gap: '50px'}}>
    <img src={Logo} alt="Logo" style={{ width: '100%', maxWidth: '300px', margin: '0 auto', display: 'block' }} />
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
            name="email"
            type="user"
            value={state.userInfo.email}
            onChange={onChangeValue}
          />
        </Form.Item>
        <Form.Item label="Senha">
          <Input.Password name="password" value={state.userInfo.password} onChange={onChangeValue} />
        </Form.Item>
        {errorMsg}
        {successMsg}
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button type="primary" htmlType="submit" style={{ display: 'flex', gap: '10px', alignItems: 'center', justifyContent: 'center',width: '50%' }}>
            Entrar <FontAwesomeIcon icon={faRightToBracket} />
          </Button>
        </div>

      </Form>
      {/* <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
        <Button onClick={toggleNav} variant="outlined" style={{ width: '50%' }}>
          Cadastrar
        </Button>
      </div> */}
    </Card>
   </div>
    
  );
}

export default Login;
