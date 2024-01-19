const robot = require("robotjs");
const fs = require('fs');
const { execSync } = require('child_process');
const { createWorker, recognize } = require('tesseract.js');
const jimp = require("jimp");
const { sleep } = require('sleep'); 

const getScreen = () => {
  const screenshot = robot.screen.capture(517, 77, 100, 50);
  const filePath = 'screenshot.png';
  fs.writeFileSync(filePath, screenshot.image);
};

const getMouse = () => {
  var screenSize = robot.getScreenSize();
  var mouse = robot.getMousePos();
  console.log(mouse,'mouse');
};
getMouse();

const getImgText = (path) => {
  if(!path) return;
  recognize(path,'chi_sim').then(({ data: { text } }) => {
    console.log('识别结果：', text.replace(/\s/g, ''));
  }).catch(error => {
    console.error('识别失败：', error.message);
  });
};

// 使用 Windows 的命令行工具 taskkill 关闭所有实例并重新启动
// execSync(`taskkill /IM ${targetAppName}.exe /F && start ${targetAppName}.exe`);

const isRunning = () => {
  const runningProcesses = execSync('tasklist', { encoding: 'utf-8' });
  const isGameRunning = runningProcesses.includes('怀旧天龙八部的进程名称');
}

const swapRedAndBlueChannel = bmp => {
  for (let i = 0; i < (bmp.width * bmp.height) * 4; i += 4) { // swap red and blue channel
      [bmp.image[i], bmp.image[i + 2]] = [bmp.image[i + 2], bmp.image[i]]; // red channel;
  }
};

const test = () => {
  const targetAppName = 'Wechat';
  execSync(`open -a "${targetAppName}"`);
  const screenshot = robot.screen.capture(516, 66, 200, 50);
  swapRedAndBlueChannel(screenshot);
  const screenJimp = new jimp({ data: screenshot.image, width: screenshot.width, height: screenshot.height });
  screenJimp.write('screenshot.png',(err) => {
    if(err) return;
    getImgText('screenshot.png');
  });
};
test();

const switchTarget = () => {
  // 模拟按下 Alt 键
  robot.keyToggle('alt', 'down');
  
  // 模拟按下 Tab 键
  robot.keyTap('tab');
  
  // 等待一段时间，确保窗口切换完成
  sleep(1);  // 1秒，根据实际情况调整
  
  // 松开 Alt 键
  robot.keyToggle('alt', 'up');
};
switchTarget();