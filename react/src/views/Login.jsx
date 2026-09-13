import {Navigate, useNavigate} from "react-router-dom";
import {useRef} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";
//import myImage from '../../../storage/app/public/pozadina.jpg';

export default function Login() {
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const {setUser, setToken} = useStateContext();
    const navigate = useNavigate();

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
                navigate("/dashboard", {replace: true});
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
        <div style={{
          //  backgroundImage: `url(${myImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
        }}>
            <div className="login-box" style={{
                    background: "rgba(255, 255, 255, 0.15)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "15px",
                    padding: "40px",
                    width: "400px",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}>
                <div className="form">
                    <form onSubmit={onSubmit}>
                        <h2
                            className="title"
                            style={{ color: "#fff", textAlign: "center", marginBottom: "30px" }}
                        >Prijava na sistem</h2>
                        <input ref={emailRef} type="email" placeholder="Email"/>
                        <input ref={passwordRef} type="password" placeholder="Lozinka"/>
                        <button className="btn btn-block">Prijavi se</button>
                        {/*<p className="message">
                            Niste registrovani? <Link to="/signup">Kreiraj nalog</Link>
                        </p>*/}
                    </form>
                </div>
            </div>
        </div>
    );
}
