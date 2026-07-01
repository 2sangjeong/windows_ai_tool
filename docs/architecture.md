# 아키텍처 설명

## 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    Electron Shell                        │
│                                                         │
│  ┌──────────────────┐    IPC     ┌──────────────────┐  │
│  │   Main Process   │◄──────────►│ Renderer Process │  │
│  │   (main.js)      │            │  (index.html)    │  │
│  │                  │            │                  │  │
│  │ • BrowserWindow  │  preload   │ • 업무 분류 UI   │  │
│  │ • IPC handlers   │◄──────────►│ • webview × 3   │  │
│  │ • Clipboard API  │            │ • 분류 알고리즘  │  │
│  └──────────────────┘            └──────────────────┘  │
│                                         │               │
│                              ┌──────────┴───────────┐   │
│                              │   Webview (×3)        │  │
│                              │  claude.ai            │  │
│                              │  chatgpt.com          │  │
│                              │  perplexity.ai        │  │
│                              │  gemini.google.com    │  │
│                              └───────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## 프로세스 모델

### Main Process (`src/main.js`)
- Node.js 환경에서 실행
- OS 자원 직접 접근 (클립보드, 파일 시스템 등)
- `BrowserWindow` 생성 및 관리
- IPC 요청 처리

### Renderer Process (`src/index.html`)
- Chromium 환경에서 실행
- `contextIsolation: true` — Node.js API 직접 접근 불가
- `window.electronAPI` (preload 노출)를 통해 Main과 통신

### Preload Script (`src/preload.js`)
- `contextBridge.exposeInMainWorld()` 로 안전하게 API 노출
- 허용된 채널만 IPC 통신 가능

## 데이터 흐름

```
사용자 입력 (할 일)
    │
    ▼
classify() 호출
    │
    ├─[즉시 분류]──► ruleClassify() ──► 키워드 매칭 ──► renderResults()
    │
    └─[AI 분류]──► AI_CLASSIFY_PROMPT 생성
                        │
                        ▼
                   클립보드 복사 (electronAPI.copyToClipboard)
                        │
                        ▼
                   사용자가 AI 창에 붙여넣기 & 전송
                        │
                        ▼
                   AI 응답 입력란에 붙여넣기
                        │
                        ▼
                   parseAIResponse() ──► renderResults()
```

## Webview 세션 관리

각 AI 패널은 독립된 세션 파티션을 사용:

```
패널 0: partition="persist:ai0"  → claude.ai 세션
패널 1: partition="persist:ai1"  → chatgpt.com 세션
패널 2: partition="persist:ai2"  → perplexity.ai 세션
```

`persist:` 접두어로 앱 재시작 후에도 로그인 상태 유지.

## 보안 설정

| 설정 | 값 | 이유 |
|------|-----|------|
| `nodeIntegration` | `false` | XSS → RCE 방지 |
| `contextIsolation` | `true` | 렌더러 프로세스 격리 |
| `webSecurity` | `false` | webview CORS 우회 (AI 사이트 임베딩) |
| `no-sandbox` | on | 구형 GPU 환경 호환성 |
