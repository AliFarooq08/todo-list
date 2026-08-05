import "./styles.css";
let newElement = document.createElement("h2")
newElement.textContent = "Hello, World!"
let body = document.querySelector("body")
body.appendChild(newElement)