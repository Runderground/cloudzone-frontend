import style from "./SideBar.module.css";
import {
  BsCloudsFill,
  BsSearch,
  BsBinocularsFill,
  BsCloudPlusFill,
  BsTelephoneFill,
  BsGearWideConnected,
  BsXSquare,
  BsBellFill,
  BsGrid,
  BsCloudUploadFill,
  BsPersonVcardFill,
  BsPersonFill,
  BsX,
  BsPaperclip,
  BsEmojiSmileFill
} from "react-icons/bs";
import { RiMenu2Fill, RiLogoutBoxLine } from "react-icons/ri";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexto/AuthContext";
import { Modal } from "./Modal/index.jsx";
import axios from "axios";
import Picker from '@emoji-mart/react'
import EmojiPicker from 'emoji-picker-react'
import toast from "react-hot-toast";
const baseURL = `${import.meta.env.VITE_API_URL}api/`;

export default function SideBar() {
  // Variáveis
  const { user, isAdmin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState();
  const [images, setImages] = useState([])
  const [postContent, setPostContent] = useState("");
  const [userProfile, setUserProfile] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [midiaOpen, setMidiaOpen] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  useEffect(() => {
    async function fetchData() {
      const { data } = await axios.get(`${baseURL}users/${user.username}`);
      setUserProfile(data.success.profilePicture);
    }
    fetchData();
  }, [userProfile]);
  //Funçoes para abrir e fechar os menus

  const openSideBar = () => {
    setIsOpen(!isOpen);
  };
  const openUserBar = () => {
    setIsUserOpen(!isUserOpen);
  };
  const openModal = () => {
    setIsOpen(false);
    setIsUserOpen(false);
    setIsModalOpen(!isModalOpen);
  };

  const openEmoji = (openorclose) => {
    setMidiaOpen(false)
    setEmojiOpen(!emojiOpen)
    if (openorclose === false) {
      setEmojiOpen(openorclose)
    }
  }

  const openMidia = () => {
    setEmojiOpen(false)
    setMidiaOpen(!midiaOpen)
  }

  // Funcionalidade do Logout
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("User");
    setIsUserOpen(!isUserOpen);
    navigate("/");
    location.reload();
  };

  const handleImageChange = (e) => {
    const files = e.target.files
    setFiles(e.target.files)
    if(files.length > 4) {
      toast.error("Você não pode enviar mais de 4 imagens")
      return
    }
    for (let i = 0; i < files?.length; i++) {
      setImages(prev => [...prev, URL.createObjectURL(files[i])])
    }
  }

  const handleFileClick = () => {
      setImages([])
      setFiles(null)
      console.log("Cleaned")
  }

  const createPost = async () => {
    const token = localStorage.getItem("User");
    const parse = JSON.parse(token);
    const jwt = parse.token;
    const formData = new FormData();
    for (let i = 0; i < files?.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("text", postContent);
    try {
      const {data} = await axios.post(`${baseURL}posts/createpost`, formData, {
        headers: { authorization: jwt },
        onUploadProgress: (progress) => {
          setUploadProgress(Math.round((progress.loaded / progress.total) * 100))
        }
      })
      navigate(`/post/${data._id}`)
      toast.success("Post criado com sucesso")
      location.reload()
    } catch (err) {
      console.log(err);
    }
  };

  const removeImage = (index) => {
    if(index < 0) return
    
    const filterImages = images.filter((_, i) => i !== index);
    const filterFiles = Array.from(files).filter((_, i) => i !== index)
    setImages(filterImages)
    setFiles(filterFiles)
    
    toast.success("Imagem removida ;)")
  }
  return (
    <>
      {/* Modal para realizar posts ( Sujeito a mudanças )*/}
      <Modal.Root isOpen={isModalOpen}  setClose={() => setIsModalOpen(!isModalOpen)}>
        <Modal.Icon Icon={BsCloudPlusFill}/>
        <Modal.Content text="Criar um Post"/>
        <Modal.ModalTextArea placeholder="O que está pensando hoje?" value={postContent} onChange={(e) => setPostContent(e.target.value)} onFocus={() => openEmoji(false)}/>
        <div>
          <div style={{display: 'flex'}}>
          <div onClick={openEmoji} className={`${style.modalBtn} ${emojiOpen ? style.activeBtn : ''}`} style={{borderTopLeftRadius: '6px', borderBottomLeftRadius: '6px', marginRight: '1px'}}>
            <BsEmojiSmileFill style={{alignSelf: 'center'}}/>
          </div>
          <div onClick={openMidia} className={`${style.modalBtn} ${midiaOpen ? style.activeBtn : ''}`} style={{borderTopRightRadius: '6px', borderBottomRightRadius: '6px'}}>
            <BsPaperclip style={{alignSelf: 'center'}}/>
          </div>
          </div>
          {emojiOpen && <Picker
            locale={'pt'} 
            onEmojiSelect={(e) => {
            setPostContent(postContent + e.native)
          }}
            />}
          {midiaOpen && (
      <>
      <div onClick={() => document.querySelector('#inputfile').click()} className={style.midiaUpload_Container}>
            <input id="inputfile" className={style.inputFile} type="file" onClick={handleFileClick} onChange={(e) => handleImageChange(e)} multiple hidden/>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              <BsCloudUploadFill style={{alignSelf: 'center', fontSize: '3rem', color: 'rgba(114, 120, 255, .3)'}}/>
              <label style={{color: 'rgba(114, 120, 255, .3)'}}>Clique aqui para dar <strong style={{color: 'rgba(150, 130, 255, .5)'}}>upload</strong></label>
              <span style={{fontSize: '.8rem', color: 'rgba(120,100,200,.2)'}}>Max 4 imagens * 5MB</span>
            </div>
          </div>
        <div>
          {images.length > 0 && (<div className={style.image_preview_container}>
            {images.map((img,index) => (
          <div className={style.image_preview_box}>
            <img key={index} className={style.image_preview} src={img} alt={img}/>
            <BsX onClick={() => removeImage(index)} className={style.deleteImage}/>
          </div>
          ))}
          </div>)}
        </div>
        </>
    )}
        </div>
        <div className={style.progress_bg} style={{backgroundColor: 'rgba(0,0,0,.1)', width: '100%', height: '8px', marginBottom: '5px', borderRadius: '8px'}}>
          <div className={style.progress}
            role='progressbar'
            aria-valuenow={uploadProgress}
            aria-valuemin={0}
            aria-valuemax={100}
            style={{width: `${uploadProgress}%`, height: '8px', backgroundColor: 'seagreen', borderRadius: '8px', transition: '.4s ease-in-out'}}>

          </div>
          </div>
        <Modal.Actions>
          <Modal.Action text="Cancelar" onClick={() => {}} bgColor="rgba(0,0,0,.2)" textColor="#DEE0D7"/>
          <Modal.Action text="Criar" onClick={createPost} bgColor="#529F4B" textColor="#DEE0D7"/>
        </Modal.Actions>
      </Modal.Root>
      {/* Modal para realizar posts ( Sujeito a mudanças )*/}

      {/* HEADER ( Universal para todos os dispositivos ) */}
      <header className={style.header}>
        
        
        <div className={style.header_container}>
          <Link to="" className={style.header_logo}>
            CloudZone
          </Link>
          <RiMenu2Fill onClick={openSideBar} className={style.header_toggle} />

          
          <div className={style.header_search}>
            <input
              type="search"
              placeholder="Procurar"
              className={style.header_input}
            />
            <BsSearch className={style.header_searchBtn} />
          </div>
          
          
          <div className={style.profile}>
            <div className={style.icon_options}>
              <div className={style.icon_option}>
                <BsBellFill className={style.profile_notification} />
              </div>
            </div>
            <img
              src={`${import.meta.env.VITE_API_URL}profile/${userProfile}`}
              alt="Profile Image"
              className={style.profile_icon}
              onClick={openUserBar}
            />
            <div
              className={`${style.profile_container} ${isUserOpen ? style.profile_active : ""}`}
            >
              <div className={style.profile_container_info}>
                <img
                  src={`${import.meta.env.VITE_API_URL}profile/${userProfile}`}
                  alt="Profile Image"
                  className={style.user_image}
                />

                <div className={style.usernames}>
                  <span className={style.user_name}><BsPersonVcardFill/> {user.name}</span>
                  <span className={style.user_username}>@{user.username}</span>
                </div>
              </div>
              <div className={style.user_buttons}>
                <button className={style.profile_buttons}>
                  <BsPersonFill /> Ver Perfil
                </button>
                <button className={style.profile_buttons}>
                  <BsGearWideConnected /> Configurações
                </button>
                <button onClick={handleLogout} className={style.logout}>
                  <RiLogoutBoxLine /> Sair
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* HEADER ( Universal para todos os dispositivos ) */}

      {
        /*

        Sidebar 
        -> Para dispositivos pequenos ( celular, tablet, etc)  

        */
        }

      <nav className={`${style.navSmallDevices} ${isOpen ? style.active : ""}`}>
        <div className={style.nav_container}>
          <div>
            <div className={style.nav_header}>
              <Link to="/" className={`${style.nav_link} ${style.nav_logo}`}>
                <BsCloudsFill />
                <span>CloudZone</span>
              </Link>
              <BsXSquare className={style.close} onClick={openSideBar} />
            </div>

            {/* Lista de navegação */}

            <div className={style.nav_list}>
              <div className={style.nav_items}>
                <h3 className={style.nav_subtitle}>Comunidade</h3>
                <Link onClick={() => {
      setIsOpen(false)
      setIsUserOpen(false)
                }} to="/explore" className={style.nav_link}>
                  <BsBinocularsFill className={style.nav_icon} />
                  <span className={style.nav_name}>Explorar</span>
                </Link>

                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
      openModal()
                              }} to="#createpost" className={style.nav_link}>
                  <BsCloudPlusFill className={style.nav_icon} />
                  <span className={style.nav_name}>Criar post</span>
                </Link>

                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
                              }} to="/contact" className={style.nav_link}>
                  <BsTelephoneFill className={style.nav_icon} />
                  <span className={style.nav_name}>Suporte</span>
                </Link>
              </div>

              {/* Sessão para acessar painel de administração, etc */}

              {isAdmin ? (
                  <div className={style.nav_items}>
                  <h3 className={style.nav_subtitle}>Administração</h3>
                  <Link onClick={() => {
                      setIsOpen(false)
                      setIsUserOpen(false)
                                }} to="/admin/dashboard" className={style.nav_link}>
                    <BsGrid className={style.nav_icon} />
                    <span className={style.nav_name}>Painel</span>
                  </Link>
                </div>
              ) : ''}
            </div>
          </div>
        </div>
      </nav>

      
      {
      /*
      
      Sidebar 
      -> Para dispositivos grandes ( Computador, Notebook, etc)  
      
      */
      }

      <nav className={`${style.navLargeDevices} ${isOpen ? style.active : ""}`}>
        <div className={style.nav_container}>
          <div>
            <div className={style.nav_header}>
              <Link onClick={() => {
                  setIsOpen(false)
                  setIsUserOpen(false)
                            }} to="/" className={`${style.nav_link} ${style.nav_logo}`}>
                <BsCloudsFill />
                <span>CloudZone</span>
              </Link>
            </div>

            {/* Lista de navegação */}

            <div className={style.nav_list}>
              <div className={style.nav_items}>
                <h3 className={style.nav_subtitle}>Comunidade</h3>
                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
                              }} to="/explore" className={style.nav_link}>
                  <BsBinocularsFill className={style.nav_icon} />
                  <span className={style.nav_name}>Explorar</span>
                </Link>

                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
      openModal()
                              }} to="/createpost" className={style.nav_link}>
                  <BsCloudPlusFill className={style.nav_icon} />
                  <span className={style.nav_name}>Criar post</span>
                </Link>

                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
                              }} to="/contact" className={style.nav_link}>
                  <BsTelephoneFill className={style.nav_icon} />
                  <span className={style.nav_name}>
                    Suporte
                  </span>
                </Link>
              </div>

              {/* Sessão para acessar painel de administração, etc */}
              {isAdmin ? (
                <div className={style.nav_items}>
                <h3 className={style.nav_subtitle}>Administração</h3>
                <Link onClick={() => {
                    setIsOpen(false)
                    setIsUserOpen(false)
                              }} to="/admin/dashboard" className={style.nav_link}>
                  <BsGrid className={style.nav_icon} />
                  <span className={style.nav_name}>Painel</span>
                </Link>
              </div>
            ) : ''}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
