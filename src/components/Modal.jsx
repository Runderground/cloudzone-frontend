import style from './Modal.module.css'
import { useState, createContext, useContext } from 'react'
import { BsX } from 'react-icons/bs'
export default function Modal({isOpen, children, setClose}) {  
  if(isOpen) {
    return (
      <div className={style.modal}>
        <BsX id={style.close} onClick={setClose}/>
        <div className={style.modal_content}>
          {children}
        </div>
      </div>
    )
  }
  return null
}