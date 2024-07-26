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
} from "react-icons/bs";
import { RiMenu2Fill, RiLogoutBoxLine } from "react-icons/ri";
import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexto/AuthContext";
import Modal from "./Modal.jsx";
import axios from "axios";
import Input from "./forms/Input.jsx";
const baseURL = `${import.meta.env.VITE_API_URL}api/`;

export default function SideBar() {
  // Variáveis
  const { user, isAdmin } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [files, setFiles] = useState();
  const [postContent, setPostContent] = useState("");
  const [userProfile, setUserProfile] = useState("");
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
    console.log("OIOI");
    setIsUserOpen(!isUserOpen);
  };
  const openModal = () => {
    setIsOpen(false);
    setIsUserOpen(false);
    setIsModalOpen(!isModalOpen);
  };

  // Funcionalidade do Logout
  const navigate = useNavigate();
  const handleLogout = async () => {
    localStorage.removeItem("User");
    setIsUserOpen(!isUserOpen);
    navigate("/");
    location.reload();
  };

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
      await axios.post(`${baseURL}posts/createpost`, formData, {
        headers: { authorization: jwt },
      });
      navigate("/");
      location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {/* Modal para realizar posts ( Sujeito a mudanças )*/}
      
      <Modal isOpen={isModalOpen} setClose={() => setIsModalOpen(!isModalOpen)}>
        <h2>Criar um post</h2>
        <Input
          handleChange={(e) => setPostContent(e.target.value)}
          type="text"
          placeholder="O que você está pensando?"
        />
        <input
          onChange={(e) => setFiles(e.target.files)}
          type="file"
          multiple
        />
        <button id={style.createPostBtn} onClick={createPost}>
          Enviar
        </button>
      </Modal>
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
                  <p className={style.user_name}>{user.name}</p>
                  <p className={style.user_username}>@{user.username}</p>
                </div>
              </div>
              <div className={style.user_buttons}>
                <button className={style.settings}>
                  <BsGearWideConnected /> Configurações
                </button>
                <button onClick={handleLogout} className={style.logout}>
                  <RiLogoutBoxLine /> Logout
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
