const { exec } = require("child_process");

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

    console.log("Pastas mapeadas:", mappedDrives);
  } else {
    console.error("Erro ao executar o comando 'net use'");
  }
});
