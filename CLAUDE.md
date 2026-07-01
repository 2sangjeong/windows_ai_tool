# CLAUDE.md — AI Commander 프로젝트 하네스

> 이 파일은 Claude (및 AI 에이전트)가 이 저장소를 이해하고 작업하기 위한 컨텍스트 문서입니다.

---

## 프로젝트 개요

**AI Commander**는 Electron 기반의 Windows/Linux 데스크탑 앱으로,
할 일(To-do)을 AI 적합도별로 분류하고 Claude·ChatGPT·Perplexity·Gemini를
3분할 화면으로 동시에 사용할 수 있는 멀티 AI 뷰어입니다.

| 항목 | 내용 |
|------|------|
| 언어 | JavaScript (Electron / 바닐라 JS) |
| 프레임워크 | Electron v28+ |
| 빌드 도구 | electron-builder |
| 배포 타깃 | Windows (NSIS `.exe`), Linux (AppImage / `.deb`) |
| 외부 의존성 | 없음 (npm 패키지 0개, 순수 바닐라) |

---

## 디렉터리 구조

```
ai-commander/
├── CLAUDE.md                  ← AI 에이전트용 컨텍스트 (이 파일)
├── README.md                  ← 사용자용 설치·실행 가이드
├── package.json               ← 앱 메타데이터 + 빌드 설정
│
├── src/                       ← 핵심 소스코드
│   ├── main.js                ← Electron 메인 프로세스
│   ├── preload.js             ← IPC 브릿지 (contextBridge)
│   ├── index.html             ← 메인 UI + 전체 앱 로직 (777줄)
│   └── assets/
│       ├── icon.png           ← 앱 아이콘 (Linux / 일반)
│       └── icon.ico           ← 앱 아이콘 (Windows 전용)
│
├── docs/                      ← 상세 문서
│   ├── architecture.md        ← 아키텍처 설명
│   ├── build.md               ← 빌드 방법 (Linux → Windows)
│   ├── api.md                 ← IPC API 레퍼런스
│   └── classification.md     ← 업무 분류 알고리즘 설명
│
├── .github/
│   └── workflows/
│       └── build.yml          ← GitHub Actions CI/CD (크로스 빌드)
│
└── .gitignore
```

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 실행
npm start

# Windows .exe 빌드 (Linux에서 크로스 컴파일)
npm run build:win

# Linux AppImage 빌드
npm run build:linux
```

---

## 핵심 파일 설명

### `src/main.js`
- Electron 메인 프로세스
- `BrowserWindow` 생성 (1600×950, frameless, dark)
- IPC 핸들러: `copy-to-clipboard`, `window-minimize/maximize/close`
- `webSecurity: false` — AI 사이트 webview 임베딩을 위한 CORS 우회

### `src/preload.js`
- `contextBridge`로 렌더러에 `window.electronAPI` 노출
- 노출 API: `copyToClipboard`, `minimize`, `maximize`, `close`

### `src/index.html`
- 전체 UI + 비즈니스 로직을 담은 단일 파일 (SPA)
- **주요 함수**:
  - `classify()` — 분류 실행 (규칙 or AI 프롬프트 모드)
  - `ruleClassify(task)` — 키워드 기반 즉시 분류
  - `parseAIResponse(tasks)` — AI 응답 파싱 후 분류 적용
  - `renderResults(groups, tasks)` — 결과 UI 렌더링
  - `sendToPane(text, preferAI)` — 태스크를 특정 AI 패널로 전송
  - `buildPanels()` — 3개 AI webview 패널 동적 생성
  - `changeAI(idx, newKey)` — 패널의 AI 서비스 전환

---

## 지원 AI 서비스

| 키 | 서비스 | URL |
|----|--------|-----|
| `claude` | Claude | https://claude.ai |
| `chatgpt` | ChatGPT | https://chatgpt.com |
| `perplexity` | Perplexity | https://perplexity.ai |
| `gemini` | Gemini | https://gemini.google.com |

---

## 수정 시 주의사항

1. **webview 세션**: `partition="persist:ai0"` 형태로 패널별 독립 세션 유지. 변경 시 로그인 유지 여부에 영향.
2. **IPC 채널명**: `main.js`와 `preload.js`의 채널명이 정확히 일치해야 함.
3. **webSecurity**: `false`로 설정되어 있음. 보안을 강화하려면 webview의 CSP 헤더를 별도 설정.
4. **아이콘**: Windows 빌드에는 `.ico` 파일 필요 (`src/assets/icon.ico`). Linux는 `.png` 사용.

---

## 테스트 체크리스트

- [ ] `npm start` 로 앱 정상 실행
- [ ] 왼쪽 패널: 텍스트 입력 → 분류하기 버튼 동작
- [ ] 즉시 분류 (⚡) 모드: AI/보조/사람 3단계 분류 결과 표시
- [ ] AI 분류 (🤖) 모드: 클립보드 복사 + 응답 붙여넣기 파싱
- [ ] 오른쪽 3개 webview 패널 정상 로드
- [ ] AI 드롭다운으로 서비스 전환
- [ ] 분류 결과 → AI 아이콘 클릭 → 클립보드 복사 + 패널 하이라이트
- [ ] 창 최소화/최대화/닫기 버튼 동작
- [ ] Windows .exe 빌드 후 설치·실행 확인
