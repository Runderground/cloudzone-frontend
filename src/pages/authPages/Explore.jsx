import { useContext } from 'react'
import { AuthContext } from '../../contexto/AuthContext'
import Container from '../../components/Container'
import style from './Explore.module.css'
import Posts from '../../components/explore/Posts'

export default function Explore() {
  const { user } = useContext(AuthContext)
  return (
    <Container>
      <div className={style.explore_container}>
        <div className={style.explore_box}>
          <div id={style.explore}>
            <Posts/>
          </div>
          <div id={style.sugestao}>
            <p>Sugestões</p>
          </div>
        </div>
      </div>
    </Container>
  )
}