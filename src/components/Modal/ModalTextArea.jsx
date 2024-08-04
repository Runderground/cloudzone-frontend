

export default function ModalTextArea({placeholder, value, onChange, onFocus}) {
  return (
    <div className="modal_content">
      <textarea style={{
        width: '100%',
        minHeight: '40px',
        backgroundColor: 'rgba(0, 0, 0, .3)', 
        resize: 'vertical',
        border: 'none',
        borderRadius: '5px',
        color: '#DEE0D7',
        padding: '5px',
        margin: '1rem auto',
        fontSize: '1.1rem'
      }} 
        value={value} 
        placeholder={placeholder} 
        onChange={onChange}
        onFocus={onFocus}
        >
        
      </textarea>
    </div>
  )
}