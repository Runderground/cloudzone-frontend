// Importações
import Container from '../components/Container'
import Start from '../assets/start.svg'
import style from './Home.module.css'
import { Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../contexto/AuthContext'

export default function Home() {
  const { user } = useContext(AuthContext)
  return (
    <Container>
      <main className={style.home}>
      <aside className={style.welcomeSvg}>
        <img src={Start} alt="Start"/>
      </aside>
        <section className={style.saudacao}>
          <h1>Saudações!</h1>
          <p>Bem vindo(a) ao <strong>CloudZone</strong>, aqui você poderá interagir com usuários através de posts e muito mais.</p>
          <Link to="/cadastro">Cadastrar</Link>
        </section>
      </main>
    </Container>
  )
}