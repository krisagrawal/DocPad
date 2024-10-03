import React from "react";
import ReactDOM from "react-dom";
import Header from "./components/Header";
import DocList from "./components/DocList";

export default function Dashboard() {
     return (<div>
        <Header />
        <DocList />
        {/* <Footer /> */}
     </div>)
}