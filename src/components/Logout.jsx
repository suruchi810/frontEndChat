import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { BiPowerOff } from 'react-icons/bi'; // Corrected import statement

export default function Logout() {
    const navigate = useNavigate();

    const handleClick = async () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <Button onClick={handleClick}> {/* Added onClick handler */}
            <BiPowerOff />
        </Button>
    );
}

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    border-radius: 0.5rem;
    background-color: #9a86f3;
    border: none;
    cursor: pointer; /* Corrected typo */
    svg {
        font-size: 1.3rem;
        color: #ebe7ff;
    }
`;
