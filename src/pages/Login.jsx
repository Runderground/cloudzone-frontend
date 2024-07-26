// Importações
import Container from '../components/Container'
import Input from '../components/forms/Input'
import SubmitButton from '../components/forms/SubmitButton'
import { FaLock, FaAt } from 'react-icons/fa'
import { BsEyeFill, BsEyeSlashFill, BsEnvelopeAtFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import LoginSvg from '../assets/login.svg'
import LabelInputText from '../components/forms/LabelInputText'
import style from "./Login.module.css";
import { useState, useContext } from 'react'
import { AuthContext } from '../contexto/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  // Botão para mostrar a senha
  const [viewPass, setViewPass] = useState(false)
  const viewPassword = (e) => {
    e.preventDefault()
    setViewPass(!viewPass)
  }

  // Contexto de Autenticação
  const { updateLoginCredentials, loginCredentials, Auth } = useContext(AuthContext)
  
  return (
    <Container>
      <div className={style.login_container}>
        <aside className={style.login_logo}>
          <img src={LoginSvg} alt="Login Svg"/>
        </aside>
      <form className={style.form}>
        <div className={style.formContainer}>
          <h3>Acessar sua conta</h3>
        <div className={style.InputForm}>
          <LabelInputText for="email"><BsEnvelopeAtFill/></LabelInputText>
          <Input type="email" name="email" value={loginCredentials.email} placeholder="Digite seu email" handleChange={(e) => {updateLoginCredentials({...loginCredentials, email: e.target.value})}}/>
        </div>
        <div className={style.InputForm}>
          <LabelInputText for="password"><FaLock/></LabelInputText>
          <Input type={viewPass ? "text" : "password"} value={loginCredentials.password} name="password" placeholder="Digite sua senha" handleChange={(e) => {updateLoginCredentials({...loginCredentials, password: e.target.value})}}/>
          <button onClick={viewPassword}>{viewPass ? <BsEyeSlashFill/> : <BsEyeFill/> }</button>
        </div>
        <span>Não tem uma conta? <Link to="/cadastro">Registrar-se</Link></span>
        <SubmitButton handleSubmit={(e) => {Auth(e)}} text="Entrar"/>
        </div>
      </form>
      </div>
    </Container>
  )
}