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



// Called when message received from main process
window.api.receive("fromMain", (data) => {
  console.log(`Received ${data} from main process`);
});


window.api.receive("toGenerateImg", (data) => {
  console.log(`toGenerateImg ${data.text}`);

  canvas.clearRect(0, 0, canvasEl.width, canvasEl.height);
  canvas.fillStyle = "black";
  canvas.fillRect(0, 0, canvas.width, canvas.height);

  canvas.fillStyle = data.color || 'white';
  canvas.font = "12px serif";
  canvas.fillText(data.text, 0, 12);
  window.api.send("onGeneratedTrayIcon", canvasEl.toDataURL("image/png"));

});

