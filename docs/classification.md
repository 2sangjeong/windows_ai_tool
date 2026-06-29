# 업무 분류 알고리즘

## 개요

AI Commander는 두 가지 분류 모드를 제공합니다:

1. **⚡ 즉시 분류** — 키워드 기반 규칙 엔진 (오프라인, 즉각)
2. **🤖 AI 분류** — LLM 프롬프트 기반 분류 (정확, 클립보드 경유)

---

## 모드 1: 규칙 기반 즉시 분류

### 알고리즘

```
입력: task (문자열)
출력: 'ai' | 'assist' | 'human'

1. task를 소문자로 변환
2. AI_KEYWORDS 중 포함된 개수 → aiScore
3. HUMAN_KEYWORDS 중 포함된 개수 → humanScore

4. 분류 결정:
   if humanScore > 0 AND aiScore == 0  → 'human'
   if aiScore > 0 AND humanScore == 0  → 'ai'
   if humanScore > aiScore             → 'human'
   if aiScore > humanScore             → 'ai'
   if task.length > 20                 → 'assist'
   else                                → 'assist'
```

### AI_KEYWORDS (31개)

```js
const AI_KEYWORDS = [
  // 한국어
  '요약', '번역', '초안', '작성', '정리', '검색', '데이터', '분석',
  '코드', '코딩', '이메일', '문서', '보고서', '리스트', '표',
  '아이디어', '브레인스토밍', '조사', '일정', '계획', '템플릿',
  '편집', '교정', '수정', '답변', '설명', '비교',
  // 영어
  'summary', 'translate', 'draft', 'write', 'code', 'report', 'email',
];
```

### HUMAN_KEYWORDS (29개)

```js
const HUMAN_KEYWORDS = [
  // 대인관계 / 감정
  '협상', '설득', '감정', '공감', '신뢰', '관계', '면담', '면접',
  // 판단 / 책임
  '결정', '판단', '책임', '윤리', '비밀', '개인',
  // 대화 / 지원
  '사과', '위로', '격려', '갈등',
  // 인사
  '해고', '채용',
  // 법무 / 의료
  '계약', '법적', '소송', '의료', '진단', '상담',
  // 금융 / 비즈니스
  '투자결정', '협력', '네트워킹',
];
```

### 분류 예시

| 할 일 | aiScore | humanScore | 결과 |
|-------|---------|------------|------|
| "이메일 초안 작성하기" | 3 (이메일, 초안, 작성) | 0 | 🟢 AI |
| "팀 미팅 일정 조율" | 1 (일정) | 0 | 🟢 AI |
| "클라이언트와 협상하기" | 0 | 1 (협상) | 🔴 Human |
| "분기 보고서 검토 및 의사결정" | 1 (보고서) | 1 (결정) | 🟡 Assist |
| "새로운 프로젝트 시작" | 0 | 0 | 🟡 Assist |

---

## 모드 2: AI 프롬프트 분류

### 프롬프트 템플릿

```
당신은 업무 분류 전문가입니다. 아래 할 일 목록을 분석해서
각 항목을 3가지 카테고리로 분류해주세요.

카테고리:
🟢 AI_GOOD: AI가 잘하는 일 (검색, 요약, 초안 작성, 데이터 정리, 코드 작성, 번역 등)
🟡 AI_ASSIST: AI의 도움을 받아야 하는 일 (판단이 필요하지만 AI가 초안/아이디어 제공 가능)
🔴 HUMAN_ONLY: 사람이 직접 해야 하는 일 (대인관계, 감정, 협상, 최종 결정, 책임)

할 일 목록:
1. {task1}
2. {task2}
...

응답 형식 (반드시 이 형식으로만):
AI_GOOD: 번호,번호,...
AI_ASSIST: 번호,번호,...
HUMAN_ONLY: 번호,번호,...
```

### 응답 파싱 (`parseAIResponse`)

```js
// 각 줄에서 번호 추출 후 태스크 배열에 매핑
raw.split('\n').forEach(line => {
  if (line.includes('AI_GOOD:'))    → groups.ai에 추가
  if (line.includes('AI_ASSIST:'))  → groups.assist에 추가
  if (line.includes('HUMAN_ONLY:')) → groups.human에 추가
});

// 미분류 항목은 자동으로 assist로 처리
```

---

## 분류 정확도 개선 방법

### 키워드 추가

`src/index.html` 의 `AI_KEYWORDS` / `HUMAN_KEYWORDS` 배열에 추가:

```js
const AI_KEYWORDS = [
  // 기존...
  '자동화', '스크립트', '파이썬', // ← 추가
];
```

### 가중치 방식으로 업그레이드

현재는 단순 카운트 방식. 키워드별 가중치를 추가하면 정확도 향상:

```js
const AI_KEYWORDS_WEIGHTED = {
  '코딩': 3,    // 높은 신뢰도
  '이메일': 1,  // 낮은 신뢰도
};
```

### ML 모델 연동 (향후 개선 방향)

- `transformers.js`로 브라우저 내 경량 NLP 모델 실행
- Electron 메인 프로세스에서 Python 서브프로세스 호출
- 외부 API 연동 (단, 사용자 데이터 전송 동의 필요)
