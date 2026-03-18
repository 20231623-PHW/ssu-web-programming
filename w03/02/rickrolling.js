import { exec } from "child_process";

function openBrowser(url) {
  const platform = process.platform;
  let command;
  if (platform === "darwin") {
    command = `open "${url}"`;
  } else if (platform === "win32") {
    command = `start "" "${url}"`;
  } else {
    command = `xdg-open "${url}"`;
  }
  exec(command);
}

openBrowser("https://youtu.be/dQw4w9WgXcQ");
