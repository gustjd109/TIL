# HTTP

## 1. HTTP(Hypertext Transfer Protocol)
1. HTTP란?
    - HTML 문서와 같은 리소스들을 가져올 수 있도록 해주는 포로토콜(약속)이다.
    - 웹에서 이루어지는 모든 데이터 교환의 기초이며, 클라이언트-서버 프로토콜이기도 하다.
        - 클라이언트-서버 프로토콜 : 보통 웹브라우저인 수신자 측에 의해 요청이 초기화되는 프로토콜을 의미한다.

## 2. HTTP Method
1. HTTP Method란?
    - 수행할 작업의 종류를 나타내기 위해 서버에 보내는 메시지다.
    - HTTP 메서드를 이용하면 브라우저와 서버 간의 통신이 가능해진다.
    - HTTP 메서드 종류
        - GET : 어떠한 데이터를 서버로부터 받아(GET) 올 때 사용하는 메서드이다.(GET /posts, /posts/2)
        - POST : 일반적으로 무언가를 생성하기 위해 서버에 데이터 블록을 수락하도록 요청하는 것이다.(POST /posts)
        - PUT : 전체 데이터를 업데이트할 때 사용한다.(PUT /posts/3)
            - PATCH : 부분 데이터를 업데이트할 때 사용한다.
        - DELETE : 데이터를 서버에서 삭제할 때 사용한다.(DELETE /posts/3)

## 3. HTTP의 Stateless 특징
1. HTTP의 Stateless 특징이란?
    - HTTP의 특징 중 하나로 상태 비저장 프로토콜은 서버가 여러 요청 기간 동안 각 사용자에 대한 정보나 상태를 유지할 필요가 없다는 것이다.
    - 예를 들어, 첫 번째 요청에서 서버에 이미 사용자 123이라고 말해도 그 후 서버에게 다시 물어보면 서버는 내가 누군지 모른다.
        - 클라이언트가 요청을 보낼 때 상태나 정보를 포함하지 않고 HTTP 요청을 보내기 때문에 서버는 사용자 정보를 모르는 것이다.
        - 상태나 정보를 포함하지 않고 요청하는 이유는 단지 성능 때문이다.
        - 각 요청에 대한 연결을 재설정하는 데 소요되는 시간/대역폭을 최소화하기 위한 것이다.
        - 그래서 이런 특징으로 인해 인증 절차가 필요하다.

## 4. HTTP Request 구조
1. HTTP Request 구조
    - 예
        ```
        GET /test.html HTTP/1.1
        Host: google.com
        Accept: text/html
        Accept-Encoding: gzip, deflate
        Connection: keep-alive

        name=john&location=seoul
        ```
        - Starter line : http, method 종류, request target(url), http version 정보를 담고 있다.
        - Headers : Key:Value 값으로 해당 request에 대한 추가 정보를 담고 있다.
            - Host : 요청하려는 서버 호스트 이름, 포트번호
            - User-agent : 클라이언트 프로그램 정보
            - Referer : 바로 직전에 머물렀던 웹 링크 주소
            - Accept : 클라이언트가 처리 가능한 미디어 타입 종류 나열
            - If-Modified-Since : 여기에 쓰인 시간 이후로 변경된 리소스를 취득하고, 페이지가 수정되었으면 최신 페이지로 교체
            - Authorization : 인증 토큰을 서버로 보낼 때 쓰이는 Header
            - Origin : 서버로 Post 요청을 보낼 때 요청이 어느 주소에 시작되었는지 나타내는 값으로, 이 값으로 요청을 보낸 주소와 받는 주소가 다르면 CORS 에러가 발생
            - Cookie : 쿠기 값 key-value로 표현되며, Set-Cookie 헤더와 함께 서버로부터 이전에 전송됐던 저장된 HTTP 쿠키를 포함
        - Body : 해당 request가 전송하는 데이터가 담겨있는 부분으로, 전송하려는 데이터가 없으면 비어있게 된다.

## 5. HTTP Response 구조
1. HTTP Response 구조
    - 예
        ```
        HTTP/1.1 200 OK
        Date: Mon, 20 July ...
        Server: Apache
        Content-length: 20
        Content-Type: text/html

        <h2>Title</h2>
        ```
        - status line : HTTP version, Status Code, Status Text를 나타낸다.
        - headers : Request의 headers와 동일하지만, Response Headers에서만 쓰이는 값도 있다.
            - Server : 웹 서버의 종류
            - Age : max-age 시간 내에서 얼마나 흘렀는지 초 단위로 알려주는 값
            - Referrer-policy : 서버 referrer 정책을 알려주는 값(ex : origin, no-referrer, unsafe-url)
            - WWW-Authenticate : 사용자 인증이 필요한 자원을 요구할 시, 서버가 제공하는 인증 방식
            - Proxy-Authenticate : 요청한 서버가 프락시 서버인 경우 유저 인증을 위한 값
            Set-Cookie : 서버 측에서 클라이언트에게 세션 쿠키 정보를 설정(RFC 2965에서 규정)
        - body : Response body와 일반적으로 동일하다.

## 6. HTTP Status Codes
1. HTTP Status Code란?
    - 브라우저 요청에 따라 서버에서 반환되는 코드이다.
    - 요청이 성공했지는 또는 오류가 있었는지 나타낸다.
    - 요류 상태 코드는 찾을 수 없음, 액세스할 수 없음 또는 이동됨과 같은 오류 유형을 지정한다.
    - 예
        - 200 OK : 성공적인 HTTP 요청을 위한 코드
        - 404 Not Found : 요청된 페이지에 대한 코드를 찾을 수 없습니다.

## 7. Server & Route 실습
1. 실습 소스코드
    ```js
    const http = require('http');
    const port = 3000;
    const targetObject = {a: "a", b: "b"};
    const server = http.createServer((req, res) => {
        if(req.method === 'POST' && req.url === '/home') {
            req.on('data', (data) => {
                console.log(data);
                const stringfiedeData = data.toString();
                console.log(stringfiedeData);
            Object.assign(targetObject, JSON.parse(stringfiedeData));
            })
        } else {
            if(req.url === '/home') {
                res.writeHead(200, {
                    'Content-Type': 'application/json'
                })
                res.end(JSON.stringify(targetObject));
            } else if(req.url === '/about') {
                res.setHeader('Content-Type', 'text/html');
                res.write('<html>');
                res.write('<body>');
                res.write('<h1>About Page</h1>');
                res.write('</body>');
                res.write('</html>');
            } else {
                res.statusCode = 404;
                res.end();
            }
        }
    })

    server.listen(port, () => {
        console.log(`Listening on port ${port}...`);
    })
    ```
    - http://localhost:3000/home 페이지에서 개발자 도구의 Console을 이용하여 다음과 같음 명령어를 이용하면, POST 메소드를 이용한 데이터를 추가할 수 있다.
        - fetch('http://localhost:3000/home', { method: 'POST', body: JSON.stringify({c: "c"})});