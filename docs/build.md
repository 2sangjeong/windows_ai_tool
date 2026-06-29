# 빌드 가이드 — Linux에서 Windows .exe 크로스 컴파일

## 사전 요구사항

```bash
# Node.js 18+ 확인
node --version   # v18.x 이상

# npm 확인
npm --version    # 9.x 이상

# Wine 설치 (Windows 아이콘 변환에 필요)
sudo apt-get install wine64

# 또는 필요 없는 경우 스킵 가능
```

---

## 1단계 — 저장소 클론 및 의존성 설치

```bash
git clone http://mod.lge.com/hub/sangjeong.lee/window_tools.git
cd window_tools
npm install
```

---

## 2단계 — 아이콘 준비 (Windows 빌드용)

Windows 빌드에는 `.ico` 파일이 필요합니다.

```bash
# ImageMagick으로 PNG → ICO 변환
sudo apt-get install imagemagick

convert src/assets/icon.png \
  -define icon:auto-resize=256,128,64,48,32,16 \
  src/assets/icon.ico

echo "icon.ico 생성 완료"
```

아이콘이 없는 경우 `package.json`의 `build.win.icon` 항목을 제거하면 기본 아이콘으로 빌드됩니다.

---

## 3단계 — Windows 빌드 (크로스 컴파일)

```bash
npm run build:win
```

electron-builder가 자동으로:
1. Electron Windows 바이너리 다운로드
2. 소스코드를 `.asar`로 패키징
3. NSIS 인스톨러 생성

**결과물:**
```
dist/
├── AI-Commander Setup 1.0.0.exe   ← Windows 설치 파일
└── win-unpacked/                  ← 압축 해제된 앱 (테스트용)
```

---

## 4단계 — Linux 빌드

```bash
npm run build:linux
```

**결과물:**
```
dist/
├── AI-Commander-1.0.0.AppImage    ← 단독 실행 가능 (권장)
└── ai-commander_1.0.0_amd64.deb  ← Debian/Ubuntu 패키지
```

---

## 두 플랫폼 동시 빌드

```bash
npm run build:all
```

---

## GitHub Actions 자동 빌드

`.github/workflows/build.yml`이 포함되어 있어 푸시 시 자동 빌드됩니다.

```bash
# 태그 푸시로 릴리즈 빌드 트리거
git tag v1.0.1
git push origin v1.0.1
```

Actions 탭에서 빌드 결과물(`.exe`, `.AppImage`)을 다운로드할 수 있습니다.

---

## 문제 해결

### `Error: Cannot find module 'electron'`
```bash
npm install
```

### `NSIS error` / 아이콘 오류
- `src/assets/icon.ico` 파일이 없는 경우
- `package.json`에서 `"icon"` 항목 제거 후 재빌드

### `Error: spawn wine ENOENT`
```bash
sudo apt-get install wine64 wine32
```

### 빌드 캐시 초기화
```bash
rm -rf dist/ node_modules/.cache/
npm run build:win
```

---

## 버전 업데이트 방법

`package.json`의 `version` 필드를 수정하면 빌드 파일명에 자동 반영됩니다.

```json
{
  "version": "1.1.0"
}
```
