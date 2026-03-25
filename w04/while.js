const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("단수를 입력하세요: ", (dan) => {
  let i = 1;
  while (i <= 10) {
    console.log(dan * i);
    i++;
  }
  rl.close();
});
