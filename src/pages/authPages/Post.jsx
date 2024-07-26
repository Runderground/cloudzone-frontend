import style from './Post.module.css'
import { useState, useEffect, useContext, useRef } from 'react'
import {useParams} from 'react-router-dom'
import Container from '../../components/Container'
import axios from 'axios'
import {toast} from 'react-hot-toast'
import { AuthContext } from '../../contexto/AuthContext'
import {
  BsCircleFill,
  BsHeartFill,
  BsHeart,
  BsChatFill,
  BsThreeDotsVertical,
  BsPencilFill,
  BsFlagFill,
  BsArrow90DegDown,
  BsSendFill,
  BsTrash2Fill
} from "react-icons/bs";
import moment from 'moment'
moment.locale('pt-br')

import {FaCrown} from 'react-icons/fa'

export default function Post() {
  const { user, userProfile } = useContext(AuthContext)
  const { postId } = useParams()
  const [p, setPost] = useState(null)
  const [loading, setLoading] = useState(false)
  const [replies, setReplies] = useState([])
  const [liked, setLiked] = useState([])
  const [RTRText, setRTRText] = useState({
    text: ''
  })
  const [comment, setComment] = useState({
    text: ''
  })
  const [cooldown, setCooldown] = useState(false)
  
  console.log(postId)
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/posts/${postId}`)
      console.log(data)
      setPost(data)
      setLoading(false)
    }
    fetchData()
  },[])
  useEffect(() => {
    async function getReplies() {
      if(p) {
        if(p.replies.length > 0 && loading === false) {
          const { data } = await axios.get(`${import.meta.env.VITE_API_URL}api/posts/replies/${postId}`)
          if(data.error) return toast.error(data.error)
          setReplies(data)
        }
      }
    }
    getReplies()
  },[loading])
  useEffect(() => {
      if(p) {
        if (p.likes.includes(user.id)) {
          return setLiked((prev) => [...prev, p._id]);
        }
      }
  }, [loading]);


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

    return parts;
  };

  const likecountref = useRef([]);
  const likePost = async (postid) => {
    const token = localStorage.getItem("User");
    const parse = JSON.parse(token);
    const jwt = parse.token;
    if (liked.includes(postid)) {
      const remove = liked.filter((like) => like !== postid);
      setLiked(remove);
      console.log(likecountref.current.innerText);
    } else {
      setLiked((prev) => [...prev, postid]);
      console.log(likecountref.current.innerText);
    }
    try {
      await axios.patch(`${baseURL}posts/like/${postid}/${user.id}`, null, {
        headers: { authorization: jwt },
      });
    } catch (err) {
      console.log(err);
    }
  };
  const comentar = async () => {
    console.log(cooldown)
    if(comment.text === "" || comment.text.length < 2) {
      toast.error("O comentário deve ter pelo menos 2 caracteres!")
      return
    }
    const token = localStorage.getItem("User");
    const parse = JSON.parse(token);
    const jwt = parse.token;
    if (cooldown === true) {
      toast.error("Você acabou de comentar, espere alguns segundos!");
      return
    } else {
    try {
    setCooldown(true)
    const { data } = await axios.post(`${import.meta.env.VITE_API_URL}api/posts/comentar/${p._id}`, comment, {headers: {authorization: jwt}})

      if(data.error) return toast.error(data.error)

      setComment({
        text: ''
      })

      setReplies((prev) => [...prev, data])
      setTimeout(() => {
        setCooldown(false)
      }, 10000)
      return toast.success("Seu comentário foi adicionado :)")
    } catch (err) {
      
    console.error(err)

    }
  }
    
  }
  
  return (
    <>
      <Container>
        <div className={style.post_container}>
        {p ? (
          <div className={style.post}>
            <img
              src={`${import.meta.env.VITE_API_URL}profile/${p.author.profilePicture}`}
              alt="Profile Image"
              className={style.author_image}
            />
            <div className={style.content_box}>
              <div className={style.user_info}>
                <div className={style.info_start}>
                  <h3 className={style.user_name}>{p.author.name}</h3>
                  <span className={style.user_username}>
                    @{p.author.username}
                  </span>
                  <p style={{fontSize: ".7rem", color: 'rgba(114, 120, 255, .4)', display: "inline-block", alignSelf: "center"}}>* {moment(p.createdAt).calendar()}</p>
                </div>
                {user.id === p.author._id && (
                  <div className={style.info_end}>
                    <BsThreeDotsVertical id={style.dot} />
                  </div>
                )}
              </div>
              <p className={style.content}>{renderTextWithMentions(p.text)}</p>
              {p.images.length > 0 && (
                <img
                  className={style.postsMidia}
                  src={`${import.meta.env.VITE_API_URL}posts/${p.images[0].filename}`}
                />
              )}
              <div className={style.options}>
                <div className={style.likesInfo}>
                  {liked.includes(p._id) ? (
                    <BsHeartFill
                      onClick={() => {
                        likePost(p._id);
                        if (likecountref.current[0]) {
                          likecountref.current[0].innerHTML =
                            parseFloat(likecountref.current[0].textContent) -
                            1;
                        }
                      }}
                      id={style.like}
                      className={style.icon}
                    />
                  ) : (
                    <BsHeart
                      onClick={() => {
                        likePost(p._id);
                        if (likecountref.current[0]) {
                          likecountref.current[0].innerHTML =
                            parseFloat(likecountref.current[0].textContent) +
                            1;
                        }
                      }}
                      id={style.like}
                      className={style.icon}
                    />
                  )}
                  <span
                    ref={(el) => (likecountref.current[0] = el)}
                    className={style.likecount}
                  >
                    {p.likescount}
                  </span>
                </div>
                <div
                  onClick={() => {
                    gotopostpage(p._id);
                  }}
                  className={style.commentsInfo}
                >
                  <BsChatFill id={style.comments} className={style.icon} />
                  <span className={style.commentscount}>{p.replies.length}</span>
                </div>
                {user.id === p.author._id ? (<>
                  <BsTrash2Fill style={{color: "rgba(255, 80, 100)", cursor: "pointer"}}/>
                  <BsPencilFill style={{color: "rgba(100 , 90, 220)", cursor: "pointer"}}/>
                  </>) : ''}
              </div>
              <div className={style.create_comment}>
                <img
                  src={`${import.meta.env.VITE_API_URL}profile/${userProfile}`}
                  alt="Profile Image"
                  className={style.author_image}
                />
                <div className={style.comment_input}>
                  <textarea onInput={(e) => setComment({text: e.target.value})} value={comment.text} maxLength={280} className={style.Comment_input} placeholder={`Faça um comentário`} />
                  <BsSendFill onClick={comentar}className={style.send_Comment}/>
                </div>
              </div>
            </div>
          </div>) : (<p>Carregando...</p>)}
          <h2 className={style.commentTitle}>Comentários</h2>
          <div className={style.replies_section}>
            {replies.length > 0 ? (
              replies.map(r => (
                <div className={style.reply} key={r._id}>
                <img src={`${import.meta.env.VITE_API_URL}profile/${r.author.profilePicture}`} alt={r.author.username} className={style.replyAP_image}/>
                <div className={style.reply_contentbox}>
                <div className={style.replyAP_userinfo}>
                  <div className={style.user_info_start}>
                  <h3 className={style.replyAP_username}>@{r.author.username}</h3>
                  {r.author.roles === 'admin' ? (<span id={style.admintag}><FaCrown/> ADM</span>) : ''}
                  {p.author._id === r.author._id ? (<span id={style.postauthortag}><BsPencilFill/> AP</span>) : '' }
                    <strong style={{color: 'rgba(114, 120, 255, .2)', fontSize: '.3rem', display: 'inline-block', alignSelf: 'center'}}><BsCircleFill/></strong>
                    <span style={{fontSize: ".7rem", color: 'rgba(114, 120, 255, .4)', display: "inline-block", alignSelf: "center"}}>{moment(r.createdAt).calendar()}</span>
                    </div>
                  </div>
                  <div className={style.reply_main}>
                    <p>{renderTextWithMentions(r.text)}</p>
                    <div className={style.reply_likes}>
                    <BsHeart className={style.likeIcon}/>
                    <span id={style.likecounter}>{r.likescount}</span>
                    </div>
                  </div>
                  <div className={style.replyAP_options}>
                    <span id={style.reply_the_reply}><BsArrow90DegDown/> Responder</span>
                    <span id={style.report}><BsFlagFill/> Denunciar</span>
                    {user.id === r.author._id ? (<strong style={{color: 'rgba(114, 120, 255, .2)', fontSize: '.3rem', display: 'inline-block', alignSelf: 'center'}}><BsCircleFill/></strong>) : ''}
                    {user.id === r.author._id ? (<>
                  <span id={style.edit_reply}><BsPencilFill/> Editar</span>
                  <span id={style.delete_reply}><BsTrash2Fill/> Deletar</span>
                      </>) : ''}
                  </div>
                  <div className={style.reply_the_reply_box}>
                    <textarea onInput={(e) => setRTRText({text: e.target.value})} value={RTRText.text} maxLength={280} className={style.RTR_input} placeholder={`Responder @${r.author.username}`} />
                    <BsSendFill className={style.send_RTR}/>
                  </div>
                  {r.replies.length > 0 ? (<p id={style.seemore}>Ver respostas</p>) : ''}
                </div>
                </div>
              ))
            ) : (<p className={style.no_comments}>Nenhum comentário ainda</p>)}
          </div>
        </div>
      </Container>
    </>
  )
}