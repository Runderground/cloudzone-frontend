import style from "./Forms.module.css";

export default function Input({type, placeholder, value, name, handleChange, handlePress, maxLength}) {
  return (
    <input className={style.input} name={name} type={type} placeholder={placeholder} value={value} onChange={handleChange} onInput={handlePress} maxLength={maxLength}/>
  )
}