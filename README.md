# 설치 및 설정 방법

1. Node.js 설치<br> 이 프로젝트는 node 환경에서 실행되는 Nestjs 기반으로 작성되었습니다. 따라서 node를 설치해야 합니다<br>
   [Node.js 다운로드](https://nodejs.org/ko)<br> 참고로 이 코드는 20.19.1 버젼에서 작성되었습니다.

2. 이 프로젝트는 pnpm으로 패키지 관리를 하고 있습니다 node.js를 설치하며 함께 설치된 npm으로 pnpm을 설치해 줍니다
```
npm install pnpm
```
3. 패키지 설치<br>
```
pnpm install
```
4. 환경변수 설정
app에서 사용하는 각종 환경변수를 .env로 설정해줍니다
```
# DB
DB_HOST=localhost
DB_PORT=3306
DB_USER=local
DB_PASSWORD=local
DB_DATABASE=local
DB_LOGGING=false
DB_SYNC=false

# REDIS
REDIS_HOST=redis://localhost:6379

# Queue
QUEUE_HOST=localhost
QUEUE_PORT=6379

```
5. docker-compose 로 local에서 구동되는 database 를 실행시켜 줍니다<br>
**docker-compose** 를 실행시킬 수 있는 환경이어야 합니다 docker 또는 OrbStack 설치를 권장합니다
```
docker-compose up -d
```
이 명령어로 app에서 필요한 **mySQL**과 **Redis**가 구동됩니다
5. 서버 build<br>
build된 파일을 통해 database migration이 필요하여 build를 해줍니다
```
pnpm build
```
6. 비어있는 database에 table 과 필요한 최소 data 입력을 위해 typeOrm migration 을 실행시켜줍니다
```
pnpm run migration:run
```
7. 서버를 실행합니다
```
pnpm start
```

# API 문서
서버를 실행하게 되면 [swagger api 문서](localhost:3000/api-docs) 를 통해 각 api별 설명을 확인할 수 있으며 호출까지 할 수 있음

# 설계 내용
## 게시글
- 게시글 목록 조회
   - offset 기반의 Pagination
   - 제목 또는 작성자로 검색 가능
   - 게시글 제목과 작성자, 댓글 개수 확인 가능
- 게시글 상세 조회
  - 게시글 내용 확인 
- 게시글 생성
- 게시글 수정 및 삭제
  - 비밀번호가 일치하지 않으면 할 수 없음
  - 게시글 삭제시 해당 게시글에 작성된 댓글 함께 삭제
## 댓글
- 댓글 목록 조회
  - cursor 기반의 pagination(댓글은 게시글 만큼 page 번호를 통해 이동하는 사용성보다는 `댓글더보기` 같은 기능이 더 어울릴것이라 판단) 
- 댓글 생성
- 대댓글 생성

## 키워드
- 등록된 키워드로 알림 발송
  - 게시글, 댓글, 대댓글 작성 시 키워드 확인 후 알림처리를 위해 queue 처리(redis)
  - 여러 사람이 같은 키워드로 등록이 가능하기 때문에 unique 한 키워드 값으로 작성자 그룹화(알림 처리 시 반복 횟수 감소)
  - 키워드를 확인하기 위해선 모든 키워드를 조회해야 하기 때문에 db 부하를 최소화 하기 위한 cache 처리(당일 자정까지)
    - 키워드 추가 기능이 있었다면 추가 할 때 기존 cache를 삭제하고 다시 추가하는 방식으로 처리했을 것


