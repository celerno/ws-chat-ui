import React from 'react';
import ReactHtmlParser from 'react-html-parser'; 
import { w3cwebsocket as WS } from "websocket";
import './App.css';
import { useAuth0 } from "./react-auth0-spa";
import NavBar from "./NavBar";

const client = new WS('wss://p737omymjj.execute-api.us-east-1.amazonaws.com/dev/');
let chatArea = React.createRef();

const connect = (writeToChat) => {
    client.onopen = () => {
        writeToChat('connected');
    };
    client.onmessage = (message) => {
        writeToChat(message.data);
    };
    client.onclose = (message) => {
        writeToChat('session ended. hit refresh');
    };
}
const sendText = (e) => {
    if (e.charCode === 13) {
        client.send(JSON.stringify({ "action": "sendMessage", "data": e.target.value }));
        e.target.value = '';
    }
}

const writeToChat = (msg) => {
    const date = new Date(Date.now());
    let formatted = '<i>' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '</i> -' + msg;
    let entry = document.createElement('span');
    entry.innerHTML = formatted;
    chatArea.current.appendChild(entry);
    chatArea.current.scrollTop = chatArea.current.scrollHeight - chatArea.current.clientHeight;
}

const App = () => {
        
    const { loading } = useAuth0();

        if (loading) {
            return <div>Loading...</div>;
        }
        connect(writeToChat);
        return (
            <div className="App">
                <NavBar />
                <header className="App-header">
                    chat
                </header>
                <div id="chat" className="Chat-area" ref={chatArea}></div>
                <input id="msg" className="Chat-input" type="text" onKeyPress={sendText} />
            </div>
        );
    
}

export default App;
