import style from "./Forms.module.css";

export default function SubmitButton({ text, handleSubmit, disablestatus }) {
  return (
    <input
      disabled={disablestatus}
      className={style.submitBtn}
      onClick={handleSubmit}
      type="submit"
      value={text}
    />
  );
}
