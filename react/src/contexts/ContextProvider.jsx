import {createContext, useContext, useEffect, useState} from "react";
import axiosClient from "../axios-client.js";

const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {},
})

export const ContextProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'))

    const setToken = (token) => {
        _setToken(token)
        if (token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }
        else {
            localStorage.removeItem('ACCESS_TOKEN');
            setUser(null);
        }
    }

    useEffect(() => {
        if (!token) {
            return;
        }

        axiosClient.get('/user')
            .then(({data}) => setUser(data))
            .catch(() => setToken(null));
    }, [token]);

    return(
        <StateContext.Provider value={{
            user,
            setUser,
            token,
            setToken,
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);
