import style from './DropContainer.module.css'

export default function DropContainer({children}) {
  return (
    <div className={style.dropzone}>
      {children}
    </div>
  )
}