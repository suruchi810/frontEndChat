import React,{useState, useEffect} from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg"
import {ToastContainer,toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { loginRoute } from "../util/APIRoutes";

export default function Login() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username:"",
        password:"",
    });
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        draggable: true,
        theme:"dark", 
    }

    const handleChange = (event) => {
        setValues({...values, [event.target.name]:event.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()){
            const {password, username} = values;
            const {data} = await axios.post(loginRoute, {
                username,
                password
            });
            if(data.status===false){
                toast.error(data.msg.toastOptions);
            }
            if(data.status===true){
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))
            }
            navigate("/");
        }
    };

    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
            navigate("/");
        }
    },[])

    const handleValidation = () =>{
        const {password, username} = values;
        if(password===""){
            toast.error("Email & password is required", toastOptions);
            return false;
        }else if(username.length===""){
            toast.error("Email & password is required", toastOptions);
            return false;
        }
        return true;
    }

    return (
        <>
            <FormContainer>
                <form onSubmit={(event) => handleSubmit(event)}>
                    <div className="brand">
                        <img src={Logo} alt="logo" />
                        <h1>snappy</h1>
                    </div>
                    <input type="text" placeholder="username" name="username" onChange={(e) => handleChange(e)} min="3" required/>
                    <input type="password" placeholder="password" name="password" onChange={(e) => handleChange(e)} />
                    <button type="submit">Login</button>
                    <span>Don't have an account ? <Link to="/Register">Register</Link></span>
                </form>
            </FormContainer>
            <ToastContainer/>
        </>
    )

}

const FormContainer = styled.div`
width: 100vw;
height: 100vh;
display: flex;
flex-direction: column;
justify-content: center;
gap: 1rem;
align-items: center;
background-color: #131324;
.brand{
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
}
img{
    height: 5rem;
}
h1{
    color:white;
    text-transform:uppercase;
}
form{
    display:flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 3rem 5rem;
    input{
        background-color: transparent;
        padding: 1rem;
        border: 0.1rem solid #4e0eff;
        color: white;
        width: 100%;
        font-size: 1rem;
        &:focus{
            border: 0.1rem solid #997af0;
            outline: none
        }
    }
    button{
        background-color:#997af0;
        color:white;
        border: none;
        padding: 1rem 2rem;
        font-weight:bold;
        cursor: pointer;
        border-radius:0.4rem;
        font-size: 1rem;
        text-transform: uppercase;
        transition: 0.5s ease-in-out;
        &:hover{
            background-color: #4e0eff;
        }
    }
    span{
        color: white;
        text-transform: uppercase;
        a {
            color: #4e0eff;
            text-decoration: none;
            font-weight: bold;
        }
    }
}
`;
