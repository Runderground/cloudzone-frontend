// Importações
import Container from "../components/Container";
import Input from "../components/forms/Input";
import SubmitButton from "../components/forms/SubmitButton";
import { FaLock, FaAt } from "react-icons/fa";
import {
  BsEyeFill,
  BsEyeSlashFill,
  BsPersonFill,
  BsCheck,
  BsX,
  BsPersonVcardFill,
  BsEnvelopeAtFill
} from "react-icons/bs";
import { Link } from "react-router-dom";
import RegisterSvg from "../assets/register.svg";
import LabelInputText from "../components/forms/LabelInputText";
import style from "./Cadastro.module.css";
import { useState, useContext } from "react";
import { AuthContext } from "../contexto/AuthContext";
import axios from "axios";

export default function Cadastro() {
  // Visualizar senha / Ocultar senha
  const [viewPass, setViewPass] = useState(false);
  const [userCheck, setUserCheck] = useState(false);
  console.log(userCheck);
  const userCheckPress = async (e) => {
    let userInput = e.target.value;
    if (userInput.length < 3) {
      return setUserCheck(false);
    }
    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}api/users/${userInput}`,
    );
    if (data.error) {
      return setUserCheck(true);
    }
    return setUserCheck(false);
  };
  const viewPassword = (e) => {
    e.preventDefault();
    setViewPass(!viewPass);
  };

  // Contexto de Autenticação
  const { updateRegisterCredentials, registerCredentials, RegisterUser, loading } =
    useContext(AuthContext);

  const noSpecialCharacters = (e) => {
    const event = e.target.value;
    const textoLimpo = event.replace(/[^a-zA-Z0-9]/g, "");
    const textoFormatado = textoLimpo.toLowerCase();
    return textoFormatado;
  };

  return (
    <Container>
      <div className={style.register_container}>
        <aside className={style.register_logo}>
          <img src={RegisterSvg} alt="Register Svg" />
        </aside>
        <form className={style.form}>
          <div className={style.formContainer}>
            <h3>Criar uma conta nova</h3>
            <div className={style.InputForm}>
              <LabelInputText for="name">
                <BsPersonVcardFill />
              </LabelInputText>
              <Input
                value={registerCredentials.name}
                handleChange={(e) => {
                  updateRegisterCredentials({
                    ...registerCredentials,
                    name: e.target.value,
                  });
                }}
                type="text"
                name="name"
                placeholder="Qual o seu nome?"
                maxLength={25}
              />
            </div>
            <div className={style.InputForm}>
              <LabelInputText for="username">
                <FaAt />
              </LabelInputText>
              <Input
                handlePress={(e) => userCheckPress(e)}
                value={registerCredentials.username}
                handleChange={(e) => {
                  updateRegisterCredentials({
                    ...registerCredentials,
                    username: noSpecialCharacters(e),
                  });
                }}
                type="text"
                name="username"
                placeholder="Insira seu usuário"
                maxLength={15}
              />
              <span
                className={`${style.userCheck} ${userCheck ? style.checkyes : style.checkno}`}
              >
                {userCheck ? <BsCheck /> : <BsX />}
              </span>
            </div>
            <div className={style.InputForm}>
              <LabelInputText for="email">
                <BsEnvelopeAtFill />
              </LabelInputText>
              <Input
                value={registerCredentials.email}
                handleChange={(e) => {
                  updateRegisterCredentials({
                    ...registerCredentials,
                    email: e.target.value,
                  });
                }}
                type="email"
                name="email"
                placeholder="exemplo@gmail.com"
              />
            </div>
            <div className={style.InputForm}>
              <LabelInputText for="password">
                <FaLock />
              </LabelInputText>
              <Input
                value={registerCredentials.password}
                handleChange={(e) => {
                  updateRegisterCredentials({
                    ...registerCredentials,
                    password: e.target.value,
                  });
                }}
                type={viewPass ? "text" : "password"}
                name="password"
                placeholder="Digite sua senha"
              />
              <button onClick={viewPassword}>
                {viewPass ? <BsEyeSlashFill /> : <BsEyeFill />}
              </button>
            </div>
            <span>
              Já tem uma conta? <Link to="/login">Entrar</Link>
            </span>
            <SubmitButton
              handleSubmit={(e) => {
                RegisterUser(e);
              }}
              text={loading ? "Carregando..." : "Criar conta"}
              disablestatus={loading ? true : false}
            />
          </div>
        </form>
      </div>
    </Container>
  );
}
