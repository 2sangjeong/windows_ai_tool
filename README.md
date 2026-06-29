# AI Commander

> 업무 분류 + 멀티 AI 뷰어 데스크탑 앱

Claude, ChatGPT, Perplexity, Gemini를 한 화면에서 3분할로 사용하고,
할 일 목록을 AI 적합도별로 자동 분류해주는 Electron 앱입니다.

---

## 스크린샷

```
┌──────────────┬──────────────┬──────────────┬──────────────┐
│  업무 분류기  │   Claude     │   ChatGPT    │   Gemini     │
│              │              │              │              │
│ [할 일 입력] │  (웹뷰)      │  (웹뷰)      │  (웹뷰)      │
│ [분류하기]   │              │              │              │
│              │              │              │              │
│ 🟢 AI 가능   │              │              │              │
│ 🟡 AI 보조   │              │              │              │
│ 🔴 사람 필요 │              │              │              │
└──────────────┴──────────────┴──────────────┴──────────────┘
```

---

## 설치 및 실행

### 사전 요구사항

- [Node.js](https://nodejs.org) 18 이상 (LTS 권장)
- npm 9 이상

### 개발 환경 실행

```bash
git clone http://mod.lge.com/hub/sangjeong.lee/window_tools.git
cd window_tools
npm install
npm start
```

### Windows 배포 파일 빌드 (Linux에서 크로스 컴파일)

```bash
npm run build:win
# 결과물: dist/AI-Commander-Setup-1.0.0.exe
```

### Linux 배포 파일 빌드

```bash
npm run build:linux
# 결과물: dist/AI-Commander-1.0.0.AppImage
#         dist/AI-Commander_1.0.0_amd64.deb
```

자세한 빌드 가이드는 [docs/build.md](docs/build.md)를 참고하세요.

---

## 사용법

### 업무 분류기 (왼쪽 패널)

1. 할 일을 **한 줄씩** 입력합니다.
2. 분류 방식을 선택합니다:
   - **⚡ 즉시 분류**: 키워드 기반으로 즉각 분류 (오프라인 가능)
   - **🤖 AI에게 물어보기**: 프롬프트 자동 생성 → 클립보드 복사 → AI 창에 붙여넣기
3. `✦ 분류하기`를 클릭합니다.

**분류 결과:**
| 색상 | 의미 |
|------|------|
| 🟢 초록 | AI가 잘 처리할 수 있는 업무 |
| 🟡 노랑 | AI 도움을 받으면 좋은 업무 |
| 🔴 빨강 | 사람이 직접 해야 하는 업무 |

### AI 뷰어 (오른쪽 3개 패널)

- 각 패널 상단 드롭다운에서 AI 서비스 선택 (Claude / ChatGPT / Perplexity / Gemini)
- AI 사이트에서 직접 로그인 → 세션 자동 유지
- 분류된 항목에 마우스를 올리면 AI 아이콘 버튼 표시 → 클릭하면 클립보드 복사 + 해당 패널 하이라이트

---

## 기술 스택

- **Electron** v28+ (Chromium 기반)
- **바닐라 JavaScript** (외부 라이브러리 없음)
- **electron-builder** (크로스 플랫폼 패키징)

---

## 라이선스

MIT © shinhye
