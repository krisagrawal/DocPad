import React from "react";
import ReactDOM from "react-dom";
import Image from "../assets/document.png";

export default function Header() {
 return (
    <header>
        <img src={Image} alt="DocPad-Logo" />
        <h1>DocPad</h1>
    </header>
 )
}