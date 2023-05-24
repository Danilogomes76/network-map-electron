const { exec } = require("child_process");
const { ipcMain } = require("electron");

const cmdCommand = `cmd.exe`;

const mapNetwork = (serverid, path, win) => {
  let fail = false;
  let showCredentials = false
  let unitToAlocation;
  let command = `net use * \\\\${serverid}\\${path}`;

  const cmdProcessMap = exec(cmdCommand, { detached: true });

  cmdProcessMap.stdin.write(`${command}\r\n`);
  cmdProcessMap.stdin.end();

  cmdProcessMap.stdout.on("data", (data) => {
    // console.log(data.toString());
    const outPutText = data.toString();
    const regex = /unidade ([A-Z])/i;
    const result = regex.exec(outPutText);

    if (result && result.length > 1) {
      unitToAlocation = result.slice(1);
    }
  });

  cmdProcessMap.stderr.on("data", (data) => {
    const messageOutPut = data.toString();
    
    if (messageOutPut.includes("Erro de sistema 67")) {
      fail = true;
    }
    if (messageOutPut.includes('Erro de sistema 1223.')) {
      showCredentials = true

    }
  });

  cmdProcessMap.on("close", (code) => {
    if (!fail) {
      win.webContents.send("sucessOrFailMessage", ["success", unitToAlocation]);
      win.webContents.send('showCredentialsPage')
      return
    }
      console.log(`Código de saída do processo: ${code}`);
      win.webContents.send("sucessOrFailMessage", ["fail"]);
  });
};

const clearCredentials = (win) => {
  let fail = false;
  const command = `net use * /delete /y`;

  const cmdRemoveProcess = exec(cmdCommand, { detached: true });

  cmdRemoveProcess.stdin.write(`${command}\r\n`);
  cmdRemoveProcess.stdin.end();

  cmdRemoveProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  cmdRemoveProcess.stderr.on("data", (data) => {
    console.log(data.toString());
    const messageOutPut = data.toString();
    if (messageOutPut.includes("localizar")) {
      fail = true;
    }
  });

  cmdRemoveProcess.on("close", (code) => {
    if (!fail) {
      win.webContents.send("sucessOrFailClearCrenditials", "sucess");
      return;
    }
    win.webContents.send("sucessOrFailClearCrenditials", "fail");
  });
};

const removeNetwork = (optionToRemove, win) => {
  let fail = false;
  const command = `net use ${optionToRemove}: /delete`;

  const cmdRemoveProcess = exec(cmdCommand, { detached: true });

  cmdRemoveProcess.stdin.write(`${command}\r\n`);
  cmdRemoveProcess.stdin.end();

  cmdRemoveProcess.stdout.on("data", (data) => {
    console.log(data.toString());
  });

  cmdRemoveProcess.stderr.on("data", (data) => {
    console.log(data.toString());
    const messageOutPut = data.toString();
    if (messageOutPut.includes("localizar")) {
      fail = true;
    }
  });

  cmdRemoveProcess.on("close", (code) => {
    if (!fail) {
      win.webContents.send("sucessOrFailRemove", "sucess");
      return;
    }
    win.webContents.send("sucessOrFailRemove", "fail");
  });
};

// const pastasMapeadas = (win) => {
//   const cmdCommand = `cmd.exe`;
//   const command = `net use`;

//   const cmdProcessMap = exec(cmdCommand, { detached: true });

//   let output = "";

//   cmdProcessMap.stdin.write(`${command}\r\n`);
//   cmdProcessMap.stdin.end();

//   cmdProcessMap.stdout.on("data", (data) => {
//     output += data.toString();
//   });

//   cmdProcessMap.on("close", (code) => {
//     const regex = /\\\\[^\\]+\\([^\s]+)/;
//     if (code === 0) {
//       const mappedDrives = output
//         .split("\r\n")
//         .map((line) => line.trim())
//         .filter((line) => line.startsWith("OK"))
//         .map((line) => line.match(regex)[1]);
//       // ipcMain.emit("drivesNetwork", mappedDrives);
//       win.webContents.send('pastasmapeadasserra', mappedDrives)
//     } else {
//       console.error("Erro ao executar o comando 'net use'");
//     }
//   });
// };
const pastasMapeadas = (win) => {
  const cmdCommand = `cmd.exe`;
  const command = `net use`;

  const cmdProcessMap = exec(cmdCommand, { detached: true });

  let output = "";

  cmdProcessMap.stdin.write(`${command}\r\n`);
  cmdProcessMap.stdin.end();

  cmdProcessMap.stdout.on("data", (data) => {
    output += data.toString();
  });

  cmdProcessMap.on("close", (code) => {
    const regex = /\\\\[^\\]+\\([^\s]+)/;
    if (code === 0) {
      const mappedDrives = output
        .split("\r\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("OK"))
        .map((line) => line.match(regex)[1]);
      // ipcMain.emit("drivesNetwork", mappedDrives);
      win.webContents.send('pastasmapeadasserra', mappedDrives)
    } else {
      console.error("Erro ao executar o comando 'net use'");
    }
  });
};

module.exports = {
  mapNetwork,
  removeNetwork,
  pastasMapeadas,
  clearCredentials,
};
