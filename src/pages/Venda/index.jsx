import React, { useState, useEffect, useContext } from "react";
import { Button, notification, Alert, Select } from "antd";
import axios from "axios";
import { MyContext } from "../../contexts/MyContext";
import ItemsTable from "./ItemsTable";
import Valores from "./Valores";

const Venda = ({ theme }) => {
  const { rootState } = useContext(MyContext);
  const { theUser } = rootState;

  // Estados para funcionários e venda
  const [funcionarios, setFuncionarios] = useState([]);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [billingType, setBillingType] = useState("");
  const [nomeFuncionario, setNomeFuncionario] = useState("");
  const [limiteTotal, setLimiteTotal] = useState(0);
  const [limiteDisponivel, setLimiteDisponivel] = useState(0);
  const [desabilitaVenda, setDesabilitaVenda] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(true);
  const [quantity, setQuantity] = useState("1");

  // Estados para UI
  const [code, setCode] = useState("");
  const [showFuncionario, setShowFuncionario] = useState(false);
  const [parcelOptions, setParcelOptions] = useState([
    { value: "1", label: "1x" },
  ]);
  const [selectedParcelOption, setSelectedParcelOption] = useState("1");
  const [roundingValue, setRoundingValue] = useState(null); // Novo estado para valor de arredondamento
  // Implatação dos cartões presentes
  const [show_gift_card, setShow_gift_card] = useState(false);
  const [id_card, setId_card] = useState(0);
  const [valueGiftCard, setValueGiftCard] = useState(0);
  // API de notificação
  const [api, contextHolder] = notification.useNotification();

  const openNotificationWithIcon = (type, message, description) => {
    api[type]({
      message: message,
      description: description,
      placement: "bottomRight",
    });
  };

  function valorTotalComCartaoPresente(total) {
    return total - valueGiftCard;
  }

  useEffect(() => {
    axios
      .post(
        "https://amigosdacasa.org.br/bazar-amigosdacasa/api/busca_funcionarios.php"
      )
      .then((res) => {
        setFuncionarios(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleGetPecas = () => {
    axios
      .post(
        "https://amigosdacasa.org.br/bazar-amigosdacasa/api/get_peca_details.php",
        {
          codigo: code,
        }
      )
      .then((res) => {
        if (res.data.status === "success") {
          const item = res.data.peca;
          item.quantidade = quantity;
          setItems([...items, item]);
          setCode("");
          setQuantity(1);
        } else {
          console.error("Erro: Não foi possível encontrar a peça", res);
          openNotificationWithIcon(
            "error",
            "Erro ao buscar peça",
            "Não foi possível encontrar a peça. Por favor, verifique o código e tente novamente."
          );
        }
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
      });
  };

  const updateParcelOptions = (valor_compra) => {
    if (valorTotalComCartaoPresente(valor_compra) > 0) {
      if (valorTotalComCartaoPresente(valor_compra) < 150) {
        setParcelOptions([{ value: "1", label: "1x" }]);
        setSelectedParcelOption("1");
      } else {
        setParcelOptions([
          { value: "1", label: "1x" },
          { value: "2", label: "2x" },
          { value: "3", label: "3x" },
        ]);
      }
    }
  };

  const options = funcionarios.map((funcionario) => {
    return {
      value: funcionario,
    };
  });

  const handleChangeBillingType = (value) => {
    if (value === "Desconto em Folha") {
      setShowFuncionario(true);
      setShowCheckbox(false);
    } else {
      setShowFuncionario(false);
      setShowCheckbox(true);
      setLimiteDisponivel(0);
      setLimiteTotal(0);
    }
    setBillingType(value);
  };

  const handleCodeChange = (event) => {
    const inputValue = event.target.value;
    const number = inputValue.replace(/[^\d]+/g, "");

    if (number.length <= 6) {
      setCode(number.padStart(6, "0"));
    } else {
      setCode(number.substring(1).padStart(6, "0"));
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleGetPecas();
    }
  };

  function formatarValor(valor) {
    if (valor) {
      let valorSemPonto = valor.replace(/\./g, "");
      let valorFormatado = valorSemPonto.replace(/,/, ".");
      return parseFloat(valorFormatado);
    }
  }

  const calculateTotal = () => {
    let newTotal = items.reduce(
      (acc, item) => acc + item.valor_sugerido * item.quantidade,
      0
    );
    if (billingType === "Acolhido") {
      newTotal = 0;
    }
    if (billingType === "Desconto em Folha" || showFuncionario) {
      newTotal = newTotal * 0.9; // Aplicar desconto de 10%
    }
    return newTotal;
  };

  useEffect(() => {
    let newTotal = calculateTotal();
    if (roundingValue !== null) {
      const remainder = newTotal % roundingValue;
      newTotal =
        remainder === 0 ? newTotal : newTotal + roundingValue - remainder;
    }
    setTotal(newTotal);
    updateParcelOptions(newTotal);
  }, [items, billingType, roundingValue, showFuncionario]);

  const habilita_venda = () => {
    if (billingType === "Desconto em Folha") {
      const habilitar_venda = formatarValor(limiteDisponivel) - total * 0.9;
      setDesabilitaVenda(habilitar_venda <= 0);
    } else {
      setDesabilitaVenda(false);
    }
  };

  // consulta se o id_card tem na tabela de cartões de presentes e retorna o valor dele.
  async function consultaIdCartaoPresente(id_card) {
    if (id_card !== 0 && id_card !== "") {
      const { data } = await axios.post(
        "https://amigosdacasa.org.br/bazar-amigosdacasa/api/busca_cartao_presente.php",
        { id_card }
      );

      if (data.success) {
        
        if(data.cartao_presente.usado === 1){
            openNotificationWithIcon(
                "error",
                "Erro ao buscar cartão presente",
                `${data.message}, tente novamente outro código.`
              );    
        }

        setValueGiftCard(data.cartao_presente.valor);
      } else {
        setValueGiftCard(0);
        openNotificationWithIcon(
          "error",
          "Erro ao buscar cartão presente",
          `${data.message}, tente novamente outro código.`
        );
      }
    }
  }

  // UseEffect para habilitar a venda
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    habilita_venda();
  }, [total, limiteDisponivel, billingType, nomeFuncionario]);


  function resetWindow() {
    window.location.reload();
  }

  const onChangeGiftCard = (e) => {
    if (e.target.checked) {
      setShow_gift_card(true);
    } else {
      setShow_gift_card(false);
    }
  };

  const onChange = (e) => {
    if (e.target.checked) {
      setShowFuncionario(true);
    } else {
      setShowFuncionario(false);
      setLimiteDisponivel(0);
      setLimiteTotal(0);
    }
  };

  const handleSetName = (value) => {
    setNomeFuncionario(value);
    checkLimit(value);
  };

  const checkLimit = (nome) => {
    if (!nome) {
      console.log("O nome do funcionário é obrigatório.");
      return;
    }

    axios
      .post(
        "https://amigosdacasa.org.br/bazar-amigosdacasa/api/consulta_limites.php",
        { nome_funcionario: nome }
      )
      .then((res) => {
        if (res.data) {
          setLimiteTotal(res.data.limite_total);
          setLimiteDisponivel(res.data.limite_disponivel);
        } else {
          console.log("Resposta recebida, mas sem dados de limite.");
        }
      })
      .catch((err) => {
        console.log("Erro: ", err);
      });
  };

  const handleViewData = () => {
    const totalPecas = items.reduce(
      (acc, item) => acc + Number(item.quantidade),
      0
    );

    const data = {
      nome_funcionario: nomeFuncionario,
      data_compra: new Date().toISOString().slice(0, 10),
      valor_compra: showFuncionario ? valorTotalComCartaoPresente(total).toFixed(2) : valorTotalComCartaoPresente(total),
      total_pecas: totalPecas,
      quantidade_parcelas: selectedParcelOption,
      valor_parcela: showFuncionario
        ? (total * 0.9) / selectedParcelOption
        : total / selectedParcelOption,
      forma_pagamento: billingType,
      id_cartao_presente: id_card,
      usuario: theUser.nome,
      log_transacao: items.map((item) => {
        return {
          id: item.id,
          codigo: item.codigo,
          descricao: item.descricao,
          tag: item.tag,
          tipo: item.tipo,
          valor_loja: item.valor_loja,
          valor_50: item.valor_50,
          valor_sugerido: item.valor_sugerido,
          desc_func_10: item.desc_func_10,
          quantidade: item.quantidade,
          valor_pago: showFuncionario
            ? item.valor_sugerido * 0.9
            : item.valor_sugerido,
        };
      }),
      check_func: showFuncionario ? 1 : 0,
      //id cartão presente para desabilitar o cartão e cadastrar na venda
    };

    if (data.check_func === 1 || data.forma_pagamento === "Desconto em Folha") {
      if (!data.nome_funcionario) {
        openNotificationWithIcon(
          "error",
          "Erro ao finalizar a venda",
          "Selecione o funcionário."
        );
        return;
      }
    }

    if (data.total_pecas <= 0) {
      openNotificationWithIcon(
        "error",
        "Erro ao finalizar a venda",
        "Não há peças na venda."
      );
      return;
    }

    if (!data.forma_pagamento) {
      openNotificationWithIcon(
        "error",
        "Erro ao finalizar a venda",
        "Selecione a forma de pagamento"
      );
      return;
    }

    
    if (data.valor_compra < 0) {
      data.valor_compra = 0;
    }

    axios
      .post(
        "https://amigosdacasa.org.br/bazar-amigosdacasa/api/finaliza_venda.php",
        data
      )
      .then((res) => {
        console.log("Resposta: ", res);
        if (res.data && res.data.success) {
          openNotificationWithIcon(
            "success",
            "Venda finalizada com sucesso",
            "Sua venda foi processada e finalizada."
          );
          console.log("Resposta: ", res);
          setItems([]);
          setTotal(0);
          setCode("");
          setQuantity(1);
          setBillingType("");
          setNomeFuncionario("");
          setLimiteTotal(0);
          setLimiteDisponivel(0);
          setDesabilitaVenda(false);
          setShowFuncionario(false);
          setShowCheckbox(true);
          setSelectedParcelOption("1");
          setParcelOptions([{ value: "1", label: "1x" }]);
          setId_card("");
          setValueGiftCard(0);
          setShow_gift_card(false);
        } else {
          openNotificationWithIcon(
            "error",
            "Erro ao finalizar a venda",
            "Não foi possível processar a venda. Por favor, tente novamente."
          );
        }
      })
      .catch((err) => {
        openNotificationWithIcon(
          "error",
          "Erro ao finalizar a venda",
          "Houve um problema ao conectar ao servidor. Por favor, verifique sua conexão."
        );
        console.log("Erro: ", err);
      });
      
      setTimeout(resetWindow, 1500);
  };

  const handleRoundingChange = (value) => {
    setRoundingValue(parseInt(value, 10));
  };

  return (
    <div>
      <form>
        <style>
          {`
                    .customer-input {
                        height: 5rem;
                        font-size: 2rem !important;
                        font-weight: 700;
                    }
                    .customer-input > div > span {
                        font-size: 2rem !important;
                    }
                    `}
        </style>
        {contextHolder}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "30px",
            paddingTop: "0",
          }}
        >
          <ItemsTable
            code={code}
            handleCodeChange={handleCodeChange}
            handleKeyPress={handleKeyPress}
            quantity={quantity}
            setQuantity={setQuantity}
            items={items}
            theme={theme}
            setItems={setItems}
            setTotal={setTotal}
            updateParcelOptions={updateParcelOptions}
            habilita_venda={habilita_venda}
          />
          <Valores
            handleChangeBillingType={handleChangeBillingType}
            showCheckbox={showCheckbox}
            onChange={onChange}
            showFuncionario={showFuncionario}
            options={options}
            handleSetName={handleSetName}
            limiteDisponivel={limiteDisponivel}
            limiteTotal={limiteTotal}
            total={total}
            theme={theme}
            parcelOptions={parcelOptions}
            setSelectedParcelOption={setSelectedParcelOption}
            selectedParcelOption={selectedParcelOption}
            billingType={billingType}
            id_card={id_card}
            setId_card={setId_card}
            show_gift_card={show_gift_card}
            setShow_gift_card={setShow_gift_card}
            onChangeGiftCard={onChangeGiftCard}
            consultaIdCartaoPresente={consultaIdCartaoPresente}
            valueGiftCard={valueGiftCard}
            // Pegando os estados do cartão e passando para valores TODO
          />
        </div>
        {/* Valor troco comentado caso queiram implementar pode se tornar arredondamento
                <Select
                    placeholder="Selecione um valor"
                    style={{ width: 200, marginTop: '30px' }}
                    options={[
                        { value: '5', label: '5' },
                        { value: '10', label: '10' },
                        { value: '50', label: '50' },
                        { value: '100', label: '100' },
                    ]}
                    onChange={handleRoundingChange}
                /> */}
        <Button
          type="primary"
          onClick={handleViewData}
          style={{ marginTop: "30px" }}
          disabled={desabilitaVenda}
        >
          Finalizar Venda
        </Button>
      </form>
      {desabilitaVenda && (
        <Alert
          style={{ marginTop: "30px" }}
          message="Limite excedido!"
          description="Não há limite disponível para o funcionário selecionado."
          type="warning"
          showIcon
        />
      )}
    </div>
  );
};

export default Venda;
