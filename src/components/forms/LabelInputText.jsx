import styles from './Forms.module.css'

export default function LabelInputText({name, value, children }) {
  return (
    <label className={styles.labelText} name={name} value={value}>
      {children}
    </label>
  )
}