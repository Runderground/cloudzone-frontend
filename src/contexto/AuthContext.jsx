import {
  useState,
  useCallback,
  useContext,
  createContext,
  useEffect,
} from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
const baseURL = `${import.meta.env.VITE_API_URL}api/`;

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({
    email: "",
    password: "",
  });
  const [registerCredentials, setRegisterCredentials] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [userProfile, setUserProfile] = useState('')
  
  useEffect(() => {
    if(user == null) {
      setUser(JSON.parse(localStorage.getItem("User")));
    }
  },[])
  console.log(isAdmin)
  useEffect(() => {
    async function isAdmin() {
      if(user) {
        const { data } = await axios.get(`${baseURL}users/${user.username}`)
        if(data.error) return
        if(data.success.roles === "admin") return setIsAdmin(true)
      }
    }
    isAdmin()
  }, [user])
  useEffect(() => {
    async function fetchData() {
      if(user) {
      const { data } = await axios.get(`${baseURL}users/${user.username}`)
      if(data.error) return
      setUserProfile(data.success.profilePicture)
    }}
    fetchData()
  },[user])

  const updateLoginCredentials = useCallback((c) => {
    setLoginCredentials(c);
  });

  const updateRegisterCredentials = useCallback((cr) => {
    setRegisterCredentials(cr);
  });

  const Auth = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { email, password } = loginCredentials;
      setLoading(true);
      const { data } = await axios.post(baseURL + "users/auth", {
        email,
        password,
      });
      setLoading(false);
      if (data.error) {
        return toast.error(data.error);
      }
      localStorage.setItem("User", JSON.stringify(data));
      setUser(data);
      toast.success(`Olá ${data.name}`);
    } catch (error) {
      console.log(error);
    }
  });

  const RegisterUser = useCallback(async (e) => {
    e.preventDefault();
    try {
      const { name, username, email, password } = registerCredentials;
      setLoading(true);
      const { data } = await axios.post(baseURL + "users/register", {
        name,
        username,
        email,
        password,
      });
      setLoading(false);
      if (data.error) {
        return toast.error(data.error);
      }
      localStorage.setItem("User", JSON.stringify(data));
      setUser(data);
      return toast.success(
        `Saudações ${data.name}, você foi registrado com sucesso!`,
      );
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <AuthContext.Provider
      value={{
        user,
        Auth,
        updateLoginCredentials,
        loginCredentials,
        RegisterUser,
        registerCredentials,
        updateRegisterCredentials,
        loading,
        userProfile,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
