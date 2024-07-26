import { Link } from 'react-router-dom'
import { BsCloudsFill, BsHouseFill, BsXLg } from 'react-icons/bs'
import { FaBars, FaUsers, FaWrench } from 'react-icons/fa'
import { useState } from 'react'
import style from './NavBar.module.css'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }
  return (
    <header className={style.NavBar}>
    <div className={style.navLogo}>
      <Link to="/"><BsCloudsFill /></Link>
      <Link className={style.logoText} to="/">CloudZone</Link>
    </div>
      <div className={style.menu}>
        <button className={style.menu_icon} onClick={toggleMenu}>{!isOpen ?<FaBars /> : <BsXLg/>}</button>
        <div className={`${style.menu_box } ${isOpen ? style.open : "" }`}>
        <nav className={style.navLinks_menu}>
          <Link onClick={toggleMenu} className={style.linkwithbar} to="/"><BsHouseFill/> Início</Link>
          <Link onClick={toggleMenu} className={style.linkwithbar} to="/equipe"><FaUsers/> Equipe</Link>
          <Link onClick={toggleMenu} className={style.linkwithbar} to="/changelogs"><FaWrench/> Changelogs</Link>
        </nav>
          <div className={style.navButtons_menu}>
            <Link onClick={toggleMenu} className={style.navBtn} to="/login">Entrar</Link>
            <Link onClick={toggleMenu} className={style.navBtn} to="/cadastro">Cadastrar</Link>
        </div>
      </div>
    </div>
    <nav className={style.navLinks}>
      <Link className={style.linkwithbar} to="/"><BsHouseFill/> Início</Link>
      <Link className={style.linkwithbar} to="/equipe"><FaUsers/> Equipe</Link>
      <Link className={style.linkwithbar} to="/changelogs"><FaWrench/> Changelogs</Link>
    </nav>
      <div className={style.navButtons}>
        <Link className={style.navBtn} to="/login">Entrar</Link>
        <Link className={style.navBtn} to="/cadastro">Cadastrar</Link>
      </div>
    </header>
  )
}