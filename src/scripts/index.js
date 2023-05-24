const { ipcRenderer } = require("electron");
const inputIP = document.querySelector("#inputip");
const inputPath = document.querySelector("#inputPath");
const form = document.querySelectorAll("form");
const buttonMapNetwork = document.querySelector("#buttonMapNetwork");
const removeUnitButton = document.querySelector("#removeUnitButton");
const clearCredentialsButton = document.querySelector(
  "#clearCredentialsButton"
);
const messageBox = document.querySelector("#messageBox");
const mappedPaths = document.querySelector("#mappedPaths");
const modal = document.querySelector('#modal')
const closeButton = document.querySelector('#closeButton')

form.forEach(form => form.addEventListener("submit", (e) => {
  e.preventDefault();
}))

closeButton.addEventListener('click', ()=>{
  modal.setAttribute('style', 'display: none;');
})


buttonMapNetwork.addEventListener("click", () => {
  const serverid = inputIP.value;
  const path = inputPath.value;
  ipcRenderer.send("map_network", [serverid, path]);

  ipcRenderer.once("sucessOrFailMessage", (e, response) => {
    if (response[0] == "fail") {
      errorMapMessage();
    }


    if (response[0] == 'sucess') {
      sucessMapMessage(response[1]);
    }
    ipcRenderer.send("mapped_paths");
    ipcRenderer.once('showCredentialsPage', () => {
      modal.setAttribute('style', 'display: block;');
    })
    
    // ipcRenderer.once("pastasmapeadasserra", (event, value)=>{
    //   console.log(value);
    // })

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
  messageConstructor(
    "Pasta Mapeada com sucesso",
    ` na unidade ${unitToAlocation}`
  );
};

const errorMapMessage = () => {
  messageConstructor("Houve um erro ao mapear sua pasta");
};

const failToRemoveNetwork = () => {
  messageConstructor("Houve um erro ao remover sua pasta");
};

const sucessToRemoveNetwork = () => {
  messageConstructor("Pasta removida com sucesso");
};

const failToClearCredentials = () => {
  messageConstructor("Falha ao apagar credenciais");
};
const sucessToClearCredentials = () => {
  messageConstructor("Credenciais apagadas");
};

const messageConstructor = (messageTosent, complement = null) => {
  const messageInText = complement
    ? `${messageTosent}${complement}!`
    : `${messageTosent}!`;

  const message = document.createElement("p");
  messageBox.classList.remove("msgBox");

  message.innerText = messageInText;

  if (messageBox.offsetHeight >= 362) {
    while (messageBox.firstChild) {
      messageBox.removeChild(messageBox.firstChild);
    }
  }

  messageBox.classList.add("messageBox");
  messageBox.appendChild(message);
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
