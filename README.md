
# Web Socket과 Spring Boot로 채팅서버 구현하기

## 프로젝트 실행방법

- 프로젝트를 다운받은 후, 사용하시는 IDE에서 해당 프로젝트를 열어야 합니다.
- `application.yml`을 열어서, 김의 내용을 참고해 OAuth 관련한 설정을 변경해주셔야 합니다.
    - kakao.client-id, kakao.client-secret
    - google.client-id, google.client-secret
- docker를 이용해 아래의 경로에 mysql을 설치하고, db를 설정해줍니다.
    - localhost:3308/chat_service
- 프로젝트의 루트 디렉토리에서 `./gradlew bootRun` 명령어를 실행하거나, IDE에서 실행시켜줍니다.
- `localhost:8080`으로 접속하면 채팅 서비스를 이용할 수 있습니다.

### docker를 이용해 mysql 설치하기

- mysql 이미지 다운로드
  ```bash
  docker pull mysql:latest
  ```

- mysql 컨테이너 실행 (사용자 설정 : chat_service_user / 로컬 포트 : 3308)
  ```bash
  docker run --name chat-service-database \
    -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
    -e MYSQL_DATABASE=chat_service_db \
    -e MYSQL_USER=chat_service_user \
    -p 3308:3306 \
    -d mysql:latest
  ```

- mysql 컨테이너 실행확인
  ```bash
  docker ps
  ```

- mysql 컨테이너 접속 (root 사용자)
  ```bash
  docker exec -it chat-service-database mysql -u root
  ```
  
- 사용자 생성 및 권한 부여
  ```bash
  DROP USER IF EXISTS 'chat_service_user'@'%';
  
  CREATE USER 'chat_service_user'@'%' IDENTIFIED BY '';
  
  GRANT ALL PRIVILEGES ON chat_service_db.* TO 'chat_service_user'@'%';
  
  FLUSH PRIVILEGES;
  ```
