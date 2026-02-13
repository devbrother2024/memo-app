# 메모 앱 설정 가이드

## 환경 변수 설정 (선택사항)

이 앱은 Supabase와 로컬 스토리지 두 가지 방식을 지원합니다:

- **Supabase**: 클라우드 데이터베이스 (환경 변수 설정 필요)
- **로컬 스토리지**: 브라우저 로컬 스토리지 (설정 불필요, 기본값)

### 현재 상태
환경 변수가 설정되지 않았으므로 **로컬 스토리지**를 사용합니다.

### Supabase 사용하기 (선택사항)

1. [Supabase 대시보드](https://supabase.com/dashboard)에서 프로젝트 생성
2. 프로젝트 루트에 `.env.local` 파일 생성:

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Supabase 프로젝트에서 다음 테이블 생성:

```sql
CREATE TABLE memos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'general',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 정책 (선택사항 - 인증 없이 모든 사용자 허용)
ALTER TABLE memos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations" ON memos FOR ALL USING (true) WITH CHECK (true);
```

4. 앱 재시작

### 데이터 스토리지 확인

앱을 실행하면 콘솔에서 현재 사용 중인 스토리지 타입을 확인할 수 있습니다:
- `Using supabase for data storage` - Supabase 사용 중
- `Using localStorage for data storage` - 로컬 스토리지 사용 중

## 실행 방법

```bash
npm run dev
# 또는
yarn dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.