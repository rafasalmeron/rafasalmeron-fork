import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../../constants/urls";



const LoginPage = () => {
    const history = useNavigate()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onChangeEmail = (event) => {
        setEmail(event.target.value)
    }

    const onChangePassword = (event) => {
        setPassword(event.target.value)
    }

    const onSubmitLogin = () => {
        console.log(email, password)
        const body = {
            email: email,
            password: password
        }
        axios.post(`${BASE_URL}/login`, body)
        .then((response) => {
        console.log('Deu certo:',response.data.token)
        localStorage.setItem('token',response.data.token)
            history('/login')

        })
        .catch((error) => {
            console.log('Deu errado:',error.response.data.message)
        })
    }   

   


    return (
        <div>
            <h1>Login</h1>
            <input
            placeholder="email"
            type="email"
            value={email}
            onChange={onChangeEmail}            />
            <input
            placeholder="senha"
            type="password"
            value={password}
            onChange={onChangePassword}
            />
            
            <button onClick={onSubmitLogin}>Entrar</button>
            
        </div>
    )
}

export default LoginPage;