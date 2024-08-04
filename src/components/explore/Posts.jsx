import style from "./Posts.module.css";
import { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import {
  BsThreeDots,
  BsHeartFill,
  BsHeart,
  BsChat,
  BsThreeDotsVertical,
  BsPencilFill,
  BsTrash2Fill
} from "react-icons/bs";
import { AuthContext } from "../../contexto/AuthContext";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import "moment/locale/pt";
import nothingHere from '../../assets/nothing-where.png'
import ImageSlider from "../ImageSlider";
import Loading from "../Loading";
import ReadMore from "../ReadMore";
const baseURL = `${import.meta.env.VITE_API_URL}api/`;

export default function Posts() {
  moment.locale("pt");
  const [posts, setPosts] = useState([]);
  const [liked, setLiked] = useState([]);
  const { user } = useContext(AuthContext);
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`${baseURL}posts/`);
      setPosts(data);
    }
    fetchData();
  }, []);
  useEffect(() => {
    posts.map((p) => {
      if (p.likes.includes(user.id)) {
        return setLiked((prev) => [...prev, p._id]);
      } else {
        return false;
      }
    });
  }, [posts]);

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
        <br />
      </span>
    ))

    return formattedText;
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

  const navigate = useNavigate();
  const gotopostpage = async (postid) => {
    navigate(`/post/${postid}`);
    console.log(postid);
  };

  return (
    <>
      {posts.length > 0 ? (posts.map((p, index) => (
        <div className={style.post} key={index}>
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
                <span style={{fontSize: ".7rem", color: 'rgba(114, 120, 255, .4)', display: "inline-block", alignSelf: "center"}}>* {moment(p.createdAt).calendar()}</span>
              </div>
              {user.id === p.author._id && (
                <div className={style.info_end}>
                  <BsThreeDotsVertical id={style.dot} />
                </div>
              )}
            </div>
            <ReadMore className={style.content} text={p.text}/>
            {p.images.length === 1 && (
              <img
                className={style.postsMidia}
                src={`${import.meta.env.VITE_API_URL}posts/${p.images[0]?.filename}`}
              />
            )}
            {p.images.length > 1 && (
          <ImageSlider images={p.images}/>
            )}
            <div className={style.options}>
              <div className={style.likesInfo}>
                {liked.includes(p._id) ? (
                  <BsHeartFill
                    onClick={() => {
                      likePost(p._id);
                      if (likecountref.current[index]) {
                        likecountref.current[index].innerHTML =
                          parseFloat(likecountref.current[index].textContent) -
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
                      if (likecountref.current[index]) {
                        likecountref.current[index].innerHTML =
                          parseFloat(likecountref.current[index].textContent) +
                          1;
                      }
                    }}
                    id={style.like}
                    className={style.icon}
                  />
                )}
                <span
                  ref={(el) => (likecountref.current[index] = el)}
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
                <BsChat id={style.comments} className={style.icon} />
                <span className={style.commentscount}>{p.replies.length}</span>
              </div>
              {user.id === p.author._id ? (<>
              <BsTrash2Fill style={{color: "rgba(255, 80, 100)", cursor: "pointer"}}/>
              <BsPencilFill style={{color: "rgba(100 , 90, 220)", cursor: "pointer"}}/>
              </>) : ''}
            </div>
          </div>
        </div>
      ))) : (<div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '1rem'}}>
        <Loading size={"50"} color={"rgba(150, 90, 255)"} speed={"2"}/>
      </div>)}
    </>
  );
}

// || p.likes.includes(user.id)
