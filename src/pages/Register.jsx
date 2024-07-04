import React,{useState, useEffect} from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/logo.svg"
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";
import { registerRoute } from "../util/APIRoutes";

export default function Register() {

    const navigate = useNavigate();

    const [values, setValues] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
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

    useEffect(()=>{
        if(localStorage.getItem('chat-app-user')){
            navigate("/");
        }
    },[])

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(handleValidation()){
            const {password, email, username} = values;
            const {data} = await axios.post(registerRoute, {
                username,
                email,
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


    const handleValidation = () =>{
        const {password, confirmPassword, email, username} = values;
        alert("hello")
        if(password!=confirmPassword){
            toast.error("password and confirm password should be same.", toastOptions);
            return false;
        }else if(email===""){
            toast.error("Email is required", toastOptions);
            return false;
        }else if(username.length<3){
            toast.error("username should greater than 3 characters.", toastOptions);
            return false;
        }else if(password.length<8){
            toast.error("password should greater than 8 characters.", toastOptions);
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
                    <input type="text" placeholder="username" name="username" onChange={(e) => handleChange(e)} required/>
                    <input type="email" placeholder="email" name="email" onChange={(e) => handleChange(e)} required/>
                    <input type="password" placeholder="password" name="password" onChange={(e) => handleChange(e)} />
                    <input type="password" placeholder="confirm-password" name="confirmPassword" onChange={(e) => handleChange(e)} />
                    <button type="submit">Register</button>
                    <span>Already have an account ? <Link to="/Login">Login</Link></span>
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
