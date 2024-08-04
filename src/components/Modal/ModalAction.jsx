

export default function ModalAction({text, onClick, Icon, bgColor, textColor}) {
  return (
    <button onClick={onClick} style={{padding: '3px 8px', display: 'flex', gap: '5px', fontSize: '1.1rem', border: 'none', borderRadius: '5px', backgroundColor: `${bgColor}`, color: `${textColor}`, cursor: 'pointer', fontWeight: '600'}}>
      {Icon && <Icon style={{alignSelf: 'center'}}/>}
      {text}
    </button>
  )
}