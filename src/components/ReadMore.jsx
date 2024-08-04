import {useEffect, useState} from 'react'
import style from '../pages/authPages/Post.module.css'

export default function ReadMore({text, charLimit = 100, paragraphLimit = 4, className}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    const paragraphs = text.split('\n').length
    if(text.length > charLimit || paragraphs > paragraphLimit) {
      setShowButton(true)
    }
  },[text, charLimit, paragraphLimit])
  const TextoFormatado = (text) => {
    const mentionRegex = /(@\w+)/gi;
    const regexQuebraDeLinhas = /\n/g;

    const textoformatado = text.replace(regexQuebraDeLinhas, '<br/>').replace(mentionRegex, (match) => {
      return `<a href="/profile/${match.split('@')[1]}" class="mention">${match}</a>`
    })
    return textoformatado
  }
  const toggleReadMore = () => {
    setIsExpanded(!isExpanded)
  }

  const renderText = () => {
    if(!showButton) {
      return text
    }

    if(isExpanded) {
      return text
    }

    const visibleText = text?.split('').slice(0, charLimit).join('').split('\n').slice(0, paragraphLimit).join('\n')
    return visibleText
  }
  return (
    <div className={className}>
      <p dangerouslySetInnerHTML={{__html: TextoFormatado(renderText())}}>
      </p>
      {showButton && (
      <button style={{
        border: 'none',
        background: 'transparent',
        cursor: 'pointer',
        color: 'rgba(150, 130, 255)',
        fontWeight: 'bold',
        letterSpacing: '.05rem',
        padding: '1rem 0',
        textDecoration: 'underline'
      }}
        onClick={toggleReadMore}>
        {isExpanded ? 'Ler menos' : 'Ler mais'}
      </button>
      )}
    </div>
  )
}