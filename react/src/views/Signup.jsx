import {Link} from "react-router-dom";
import {useRef} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Signup() {

    const nameRef = useRef();
    const surnameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmationRef = useRef();
    const {setUser, setToken} = useStateContext();

    const onSubmit = (ev) => {
        ev.preventDefault()

        const payload = {
            name: nameRef.current.value,
            surname: surnameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
            password_confirmation: passwordConfirmationRef.current.value
        }
        console.log(payload);
        axiosClient.post('/signup', payload)
            .then(({data}) => {
                setUser(data.user)
                setToken(data.token)
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 442) {
                    console.log(response.data.errors);
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <h1 className="title">Kreiraj nalog</h1>
                <form onSubmit={onSubmit}>
                    <input ref={nameRef} placeholder="Ime"/>
                    <input ref={surnameRef} placeholder="Prezime"/>
                    <input ref={emailRef} type="email" placeholder="Email Adresa"/>
                    <input ref={passwordRef} type="password" placeholder="Lozinka"/>
                    <input ref={passwordConfirmationRef} type="password" placeholder="Potvrdi lozinku"/>
                    <button className="btn btn-block">Kreiraj nalog</button>
                    <p className="message">
                        Imate kreiran nalog? <Link to="/login">Prijavi se</Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
