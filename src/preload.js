const { contextBridge, ipcRenderer } = require('electron');

/**
 * 렌더러(index.html)에서 window.electronAPI.* 로 접근 가능한 API
 * contextIsolation: true 환경에서 안전하게 노출
 */
contextBridge.exposeInMainWorld('electronAPI', {
  // 클립보드에 텍스트 복사
  copyToClipboard: (text) => ipcRenderer.invoke('copy-to-clipboard', text),

  // 창 제어
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close:    () => ipcRenderer.send('window-close'),
});
