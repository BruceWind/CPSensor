// it a react entrance.
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';



ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

let canvasEl = document.getElementById('canvas');//64x64
let canvas = canvasEl.getContext('2d');

canvas.font = "12px serif";

canvas.fillStyle = "#ff0000";
canvas.fillText("20C", 0, 12);

// Called when message received from main process
window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
});
// Send a message to the main process
window.api.send("onGeneratedTrayIcon", canvasEl.toDataURL("image/png"));
