const { ipcRenderer } = require("electron");
const inputIP = document.querySelector("#inputip");
const inputPath = document.querySelector("#inputPath");
const form = document.querySelector("#form");
const buttonMapNetwork = document.querySelector("#buttonMapNetwork");
const removeUnitButton = document.querySelector("#removeUnitButton");
const clearCredentialsButton = document.querySelector(
  "#clearCredentialsButton"
);
const messageBox = document.querySelector("#messageBox");
const mappedPaths = document.querySelector("#mappedPaths");

form.addEventListener("submit", (e) => {
  e.preventDefault();
});

buttonMapNetwork.addEventListener("click", () => {
  const serverid = inputIP.value;
  const path = inputPath.value;
  ipcRenderer.send("map_network", [serverid, path]);

  ipcRenderer.once("sucessOrFailMessage", (e, response) => {
    if (response[0] == "fail") {
      errorMapMessage();
      return;
    } else {
      sucessMapMessage(response[1]);
      // createPath(path)
      ipcRenderer.send("mapped_paths");
    }
  });
});

removeUnitButton.addEventListener("click", () => {
  const selection = document.querySelector("#unitSelected").value;

  ipcRenderer.send("remove_network", [selection]);

  ipcRenderer.once("sucessOrFailRemove", (e, message) => {
    if (message == "fail") {
      failToRemoveNetwork();
      return;
    } else {
      sucessToRemoveNetwork();
    }
  });
});
console.log(clearCredentialsButton);
clearCredentialsButton.addEventListener("click", () => {
  ipcRenderer.send("removeCredentials");

  ipcRenderer.once("sucessOrFailClearCrenditials", (e, message) => {
    if (message == "fail") {
      failToClearCredentials();
      return;
    } else {
      sucessToClearCredentials();
    }
  });
});

const sucessMapMessage = (unitToAlocation) => {
  const message = document.createElement("p");
  message.innerText = "Pasta Mapeada com sucesso!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = `Pasta Mapeada com sucesso na unidade ${unitToAlocation}:!`;
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};

const errorMapMessage = () => {
  const message = document.createElement("p");
  message.innerText = "Houve um erro ao mapear sua pasta!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = "Houve um erro ao mapear sua pasta!";
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};

const failToRemoveNetwork = () => {
  const message = document.createElement("p");
  message.innerText = "Houve um erro ao remover sua pasta!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = "Houve um erro ao remover sua pasta!";
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};

const sucessToRemoveNetwork = () => {
  const message = document.createElement("p");
  message.innerText = "Pasta removida com sucesso!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = "Pasta removida com sucesso!";
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};

const failToClearCredentials = () => {
  const message = document.createElement("p");
  message.innerText = "Falha ao apagar credenciais!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = "Falha ao apagar credenciais!";
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};
const sucessToClearCredentials = () => {
  const message = document.createElement("p");
  message.innerText = "Credenciais apagadas!";
  if (messageBox.children.length > 0) {
    const p = document.querySelector("p");
    p.innerText = "Credenciais apagadas!";
  } else {
    messageBox.classList.add("messageBox");
    messageBox.appendChild(message);
  }
};

const createPath = (pathName) => {
  const div = document.createElement("div");
  const img = document.createElement("img");
  const p = document.createElement("p");

  div.classList.add("paths");
  img.src = "../assets/icons/pasta.png";
  p.innerText = pathName;

  div.append(img, p);

  mappedPaths.append(div);
};
