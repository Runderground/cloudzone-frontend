import {useEffect, useState} from 'react'
import style from '../pages/authPages/Post.module.css'

export default function ReadMore({text, charLimit = 100, paragraphLimit = 2}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showButton, setShowButton] = useState(false)
  useEffect(() => {
    const paragraphs = text.split('\n').length
    if(text.length > charLimit || paragraphs > paragraphLimit) {
      setShowButton(true)
    }
  },[text, charLimit, paragraphLimit])
  const renderTextWithMentions = (text) => {
    const mentionRegex = /(@\w+)/gi;
    let lastIndex = 0;
    const parts = [];
    let match;
    while ((match = mentionRegex.exec(text)) !== null) {
      const mention = match[0];
      const mentionStart = match.index;
      const mentionEnd = mentionStart + mention.length;
      const mentionText = text.substring(lastIndex, mentionStart);
      if (mentionText) {
        parts.push(mentionText);
      }
      parts.push(
        <span key={mention} className={style.mention}>
          {mention}
        </span>,
      );
      lastIndex = mentionEnd;
    }
    const rest = text.substring(lastIndex);
    if (rest) {
      parts.push(<span key={"text_rest"}>{rest}</span>);
    }

    const formattedText = text.split('\n').map((item, index) => (
      <span key={index}>
        {item}
        <br/>
      </span>))
    return parts
  };
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

    const visibleText = text?.split('').slice(0, charLimit).join('').split('\n').slice(0, paragraphLimit).join('\n') + '...'
    return visibleText
  }
  return (
    <div>
      <p dangerouslySetInnerHTML={{__html: TextoFormatado(renderText())}}>
      </p>
      {showButton && (
      <button onClick={toggleReadMore}>{isExpanded ? 'Leia menos' : 'Leia mais'}</button>
      )}
    </div>
  )
}