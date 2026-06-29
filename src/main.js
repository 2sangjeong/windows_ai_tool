const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const path = require('path');

// ── GPU / Sandbox 설정 ──────────────────────────────────
// 구형 GPU 및 가상 환경에서의 렌더링 오류 방지
// 배포 시 필요에 따라 주석 처리 가능
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-gpu-compositing');
app.commandLine.appendSwitch('disable-gpu-rasterization');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('no-sandbox');

// ── 윈도우 생성 ──────────────────────────────────────────
function createWindow() {
  const win = new BrowserWindow({
    width: 1600,
    height: 950,
    minWidth: 1200,
    minHeight: 700,
    frame: false,
    titleBarStyle: 'hidden',
    backgroundColor: '#0f1117',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,       // XSS → RCE 방지
      contextIsolation: true,       // 렌더러 격리
      webviewTag: true,             // AI 사이트 임베딩에 필요
      webSecurity: false,           // AI 사이트 CORS 우회 (webview용)
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
  });

  win.loadFile(path.join(__dirname, 'index.html'));

  // 개발 시 DevTools 열기 (필요 시 주석 해제)
  // win.webContents.openDevTools();
}

// ── 앱 초기화 ──────────────────────────────────────────
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC 핸들러 ──────────────────────────────────────────

// 클립보드 복사
ipcMain.handle('copy-to-clipboard', (event, text) => {
  clipboard.writeText(text);
  return true;
});

// 창 컨트롤
ipcMain.on('window-minimize', () => {
  BrowserWindow.getFocusedWindow()?.minimize();
});

ipcMain.on('window-maximize', () => {
  const win = BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});

ipcMain.on('window-close', () => {
  BrowserWindow.getFocusedWindow()?.close();
});
