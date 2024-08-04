import {BsX} from 'react-icons/bs'
import style from '../Modal.module.css'

export default function ModalRoot({isOpen, children, setClose}) {
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