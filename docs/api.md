# IPC API 레퍼런스

렌더러 프로세스(`index.html`)에서 `window.electronAPI.*` 로 호출 가능한 API 목록입니다.

---

## `window.electronAPI.copyToClipboard(text)`

시스템 클립보드에 텍스트를 복사합니다.

| 파라미터 | 타입 | 설명 |
|---------|------|------|
| `text` | `string` | 복사할 텍스트 |

**반환값:** `Promise<true>`

**사용 예:**
```js
await window.electronAPI.copyToClipboard('복사할 텍스트');
```

**내부 동작:**
```
renderer: ipcRenderer.invoke('copy-to-clipboard', text)
    └─► main: clipboard.writeText(text)
```

---

## `window.electronAPI.minimize()`

앱 창을 최소화합니다.

**반환값:** `void`

```js
window.electronAPI.minimize();
```

---

## `window.electronAPI.maximize()`

앱 창을 최대화하거나, 이미 최대화된 경우 원래 크기로 복원합니다.

**반환값:** `void`

```js
window.electronAPI.maximize();
```

---

## `window.electronAPI.close()`

앱 창을 닫습니다.

**반환값:** `void`

```js
window.electronAPI.close();
```

---

## IPC 채널 목록

| 채널명 | 방향 | 메서드 | 설명 |
|--------|------|--------|------|
| `copy-to-clipboard` | renderer → main | `invoke` | 클립보드 복사 |
| `window-minimize` | renderer → main | `send` | 창 최소화 |
| `window-maximize` | renderer → main | `send` | 창 최대화/복원 |
| `window-close` | renderer → main | `send` | 창 닫기 |

---

## API 확장 방법

새로운 IPC 채널 추가 시 3곳 수정이 필요합니다:

### 1. `src/main.js` — 핸들러 등록
```js
// 단방향 (fire-and-forget)
ipcMain.on('my-new-channel', (event, arg) => {
  // 처리 로직
});

// 양방향 (응답 필요)
ipcMain.handle('my-new-channel', async (event, arg) => {
  // 처리 로직
  return result;
});
```

### 2. `src/preload.js` — 렌더러에 노출
```js
contextBridge.exposeInMainWorld('electronAPI', {
  // 기존 API...
  myNewFunction: (arg) => ipcRenderer.invoke('my-new-channel', arg),
});
```

### 3. `src/index.html` — 렌더러에서 호출
```js
const result = await window.electronAPI.myNewFunction(arg);
```
