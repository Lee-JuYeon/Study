# GraphQL ![GraphQL](http://img.shields.io/badge/--E10098?style=flat&logo=GraphQL&logoColor=ffffff)
GraphQL이 REST API로부터 해결한 것.
1. under-fetching
    - 자격증 api를 예로 들어보면, 자격증 api에서는 자격증 이름이 아닌 코드넘버로 작성되어 있어서, 자격증 목록 api를 또 따로 request해야한다.
 이러한 문제점이 under-fetching이다.
2. over-fetching
    - 필요한 정보 이외에도 추가적으로 딸려오는 불필요한 데이터들이 많은 경우. 


npm install list
npm i nodemon -D
npm i apollo-server graphql


작업하면서 발생한 에러들
1. Apollo Server requires either an existing schema, moduels or typeDefs 
    (Apollo server는 존재하는 schema나 moduels 또는 typeDefs를 가져야한다.)
    - GraphQL이 data의 shape을 미리 알고있어야 하기 때문이다.
        - REST API에서는 수많은 url들의 집합인데, GraphQL은 수많은 type의 집합이다.
        GraphQL server한테 서버에 있는 data의 type을 설명해주어야한다.


GraphQL 보안처리
- timeout
- query 길이 제한 (query lenght limit)
- query whitelist
- query 깊이 제한 (query depth limit)
- query complexity

GraphQL 사용자 인증
- http 인증방식 
    - Bearer인증방식은 client에서 서버로 요청을 보낼때 마다 http Authorization 헤더를 Bearer <인증토큰>으로 설정한다. 그러면 서버에서는 클라이언트에서 보낸 인증 토큰이 유효한지, 어떤 사용자의 토큰인지를 파악해서 사용자 인증 처리를 해줍니다.
- 컨텍스트 레벨 인증
    - graphQL에서 가장 단순하지만 가장 안전한 인증이다.
    - 클라이언트에서 인증 토큰이 유효하지 않고나 넘어오지 않는 경우, 요청을 무조건 차단.
    - ApolloServer생성자의 context옵션에 함수를 할당하면, 할당된 함수는 모든 요청에 대해 호출이 되고 요청 정보를 인자로 받기 때문에 인증 토큰을 검증하는 장소로 적합.
    즉, ApolloServer생성자의 context옵션은 문지기이고, 거기에 할당하는 함수는 문지기에서 검사하는 사람이다.


# 🐘 PostgreSQL ![PostgreSQL](http://img.shields.io/badge/--4169E1?style=flat&logo=PostgreSQL&logoColor=ffffff)


PostgreSQL에 접속하기 위해선 PostgreSQL에 등록된 user로 먼저 접근한 뒤에, 해당 user로 DB에 접속이 가능하다. ( 계정 기반 접속 방식 )

| | MariaDB | PostgreSQL |
|---|---|---|
|접속 방식|공개 접속 방식|계정 기반 접속 방식|

* 🤔 MariaDB에서는 계정없이 DB접속이 가능했는데, PostgreSQL은 왜 계정으로 먼저 접속하고 DB에 접근이 가능한거지?
    - MariaDB는 기본적으로 모든 사용자에게 public 데이터 베이스에 대한 읽기 및 쓰기 권한을 부여하기 때문이다.
    - PostgreSQL은 User기반으로 DB에 접근 제어하기 때문에 계정으로 접속하고 이후에 DB에 접근하는 순서이다.

* 🤔 왜 굳이 그렇게 쓰는거지?
    - PostgreSQL의 '계정 기반 접속 방식'은 User의 관리 용이성과 DB의 보안강화를 위해 해당 방식을 사용한다.
    - MariaDB는 반대로 공개접속 방식을 사용하여 사용자 계정 생성 및 관리 과정이 필요하지 않아, 접근의 편의성을 높였다.

 

## 🤝🏻 계정에 접근하여 DB에 접근하기
```
* postgres는 PostgreSQL에서 초기 생성된 슈퍼 계정이다.

 psql -U postgres <- postgres 계정으로 psql에 접근

 su postgres  <- postgres계정으로 접근. 
 psql  <- db 접속
```

## 🙋🏻 계정 CRUD
```
* Read ( 유저 검색 )
SELECT * FROM pg_catalog.pg_user;


* Create
create user User1 with password '123asdf'
create user User1 with password '123asdf' superuser <- superuser 권한 부여

* Delete
drop user User1;

* Update
alter user User1 nosuperuser;  <- superuser 권한 해제

```

## ❗️ 접속시도시 인증오류가 발생한다면? 
### 1. 동일한 계정을 하나 더 생성한다.
 ```
 adduser TestUser
 passwd TestUser
 -> 처음 db생성 후에 추가했던 postgreSQL유저 계정과 동일한 계정을 os사용자에도 추가하는 방법.
 
 ```

### 2.  인증 설정 파일 수정

`vi /var/lib/pgsql/13/data/pg_hba.conf` 

|type|database|user|method|
|:--:|:--:|:--:|:--:|
|local|all|all|peer| 

여기서 method의 peer부분을  scram-sha-256으로 변경한 이후 DB를 재시작해줘야한다.
`systemctl restart postgresql`


## 💾 DB
```
* DB 생성
create database TestDB; 

* db 생성과 동시 유저 부여 ( 해당 유저는 해당 DB의 모든 권한을 가지게 된다)
create database db_name with owner user_name;

* db 사용 권한 부여
grant 권한 on db_name to user_namel
grant select on testDB to TestUser;
grant all privileges on testDB to TestUser;

* db 터미널 종료
\q ( 계정에서 로그아웃 )
exit ( DB 터미널에서 나옴 )
```


# 📡 SSH
```
* RockyLinux 레파지토리 추가
sudo yum install -y epel-release 

* SSH 패키지 설치
sudo yum install -y openssh-server openssh-clients

* SSH 서비스 시작
sudo systemctl start sshd

* SSH 서비스 활성화
sudo systemctl enable sshd

* SSH가 22번 포트 사용하는지 확인
sudo netstat -an | grep 22

* 아래처럼뜨면 22번 포트 사용중인걸로 확인.
tcp 0 0 0.0.0.0:22 0.0.0.0:* LISTEN
tcp6 0 0:::22  :::* LISTEN 
```

## 🧯 방화벽(Firewall)
```
* 방화벽 서비스 시작
sudo systemctl start firewalld

* 방화벽 활성화
sudo systemctl enable firewalld

* 기존 방화벽 규칙 삭제
firewall-cmd --zone=public --remove-all

* 모든 IP 차단
firewall-cmd --zone=public --add-source=0.0.0.0/0 --permanent

* 특정 IP 주소 허용
firewall-cmd --zone=public --add-source=내IP --permanent

* SSH 포트(포트 22) 허용
firewall-cmd --zone=public --add-port=22/tcp --permanent

* 방화벽 규칙 적용
firewall-cmd --reload
sudo systemctl restart firewalld

```

## 🌐 내 컴퓨터에서 SSH로 원격접속
```
* 22번포트로 접속
ssh -p 22 가상머신user@아이피

* 그냥 접속
ssh 가상머신user@아이피

* SSH 종료
exit
```


## user생성하고 db생성후 데이터 관리
```
* client용 user생성 
create user testclient with password 'vlwk!)1928'

* admin용 user생성 
create user testadmin with password 'vlwk!)1928'

* test_db이름으로 데이터베이스 생성. testAdmin이라는 user는 해당 db의 모든 권한을 가짐.
create database test_db with owner testAdmin

* testclient는 test_db의 read권한만 가짐.

여기서 이상한게 있다.

postgres=# \c testdb testadmin
이런식으로 testadmin계정으로 test_db에 접속하려면, 
'치명적오류:  사용자 "testadmin"의 peer 인증을 실패했습니다.' 이런 에러가 발생한다.
testadmin의 비밀번호를 업데이트 하는 방법이 있는데, 해당 방법으로는 해결이 안되어서 pg_hba.conf파일을 설정하는 방법으로 시도했다.

sudo find / -name pg_hba.conf 커맨드를 이용하여 pg_hba.conf파일 위치를 찾아보자.
cd /var/lib/pgsql/data/pg_hba.conf 
cd로 디렉토리를 이동하려니 권한이 막혀있어서 그냥 vi로 파일을 열었다.
sudo vi /var/lib/pgsql/data/pg_hba.conf
아래로 쭉내려서 peer부분을 md5로 고치고 저장.
sudo systemctl restart postgresql

근데 su postgres로 접근하려다 보니
'psql: error: 치명적오류:  사용자 "postgres"의 password 인증을 실패했습니다'이런 에러가 발생하는거다.

뭔가 이상해서 다시 pg_hba.conf파일을 열어 md5로 수정한 것을 peer로 되돌려놓고 sudo systemctl restart postgresql이후에 다시 su postgres하니깐, 이번엔 에러가 안뜸.

문제는 peer로 바꾼것이 문제인것인걸 파악함.
이번엔 pg_hba.conf에서 peer부분을 모드 md5로 바꾸고 postgresql을 재시작하고 다시 돌려보니 postgres계정으로 성공적으로 psql에 진입함.

* 파일설정
sudo find / -name postgresql.conf 
sudo vi /var/lib/pgsql/data/postgresql.conf 
'Connections and authentication'카테고리에서 
listen_addresses = 'localhost' -> '*'으로 수정.

```
