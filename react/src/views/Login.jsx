import {Link} from "react-router-dom";
import {useRef} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Login() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault();

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value
        }
        axiosClient.post('/login', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
                }
            )
            .catch(err => {
                const response = err.response;
                if(response && response.status === 442){
                    console.log(response.data.errors);
                }
            })
    }
    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Prijava na stranicu</h1>
                    <input ref={emailRef} type="email" placeholder="Email"/>
                    <input ref={passwordRef} type="password" placeholder="Lozinka"/>
                    <button className="btn btn-block">Prijavi se</button>
                    {/*<p className="message">
                        Niste registrovani? <Link to="/signup">Kreiraj nalog</Link>
                    </p>*/}
                </form>
            </div>
        </div>
    );
}
