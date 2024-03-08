# NodeJS와 익스프레스로 웹 애플리케이션 서버 구현

## 1. OK를 반환하는 간단한 서버 만들기
1. OK를 반환하는 서버 소스 코드
    ```js
    const http = require("http");
    const server = http.createServer((req, res) => {
        res.setHeader("Content-Type", "text/html"); // 응답의 헤더 설정
        res.end("OK"); // OK를 응답하고 종료
    });

    server.listen("3000", () => console.log("OK 서버 시작!")); // 접속 대기
    ```
    - 코드 실행 시 간단히 서버가 시작됐다는 디버그 문구를 출력하고, 브라우저로 접속하면 OK가 나오는 것을 확인할 수 있다.
    
## 2. 라우터 만들기
1. 라우팅
    - 일반적인 웹 서버는 URL 경로에 따라서 다른 응답을 주며, 이러한 기능을 라우팅이라고 한다.<br><br>
2. URL의 구조
    - http://www.example.com:80/path/to/file.html?key1=value1#hash
    - http : 프로토콜(protocol)
    - www.example.com : 도메인명(hostname)
    - 80 : 포트 번호(port)
    - path/to/file.html : 웹 서버 자원에 대한 경로(pathname)
    - key1=value1 : 웹 서버에서 제공하는 추가 매개변수(query)
    - #hash : 일종의 북마크이며, 서버에 전송하지 않음(hash)<br><br>
3. URL의 경로를 읽어서 다른 응답을 주도록 수정된 소스 코드
    ```js
    const http = require("http");
    const url = require("url"); // url 모듈을 로딩
    http
        .createServer((req,res) => {
            const path = url.parse(req.url, true).pathname; // 패스명 할당
            res.setHeader("Content-Type", "text/html; charset=utf-8"); // 한글이 깨지지 않도록 charset=utf-8을 추가

            if (path === "/user") {
                res.end("[user[ name : andy, age : 30"); // user 결괏값 설정
            } else if (path === "/feed") {
                res.end(`<ul>
                <li>picture1</li>
                <li>picture2</li>
                <li>picture3</li>
                </ul>
                `); // feed에 대한 결괏값 설정
            } else {
                res.statusCode = 404;
                res.end("404 page not found"); // 결괏값으로 에러 메시지 설정
            }
        })
        .listen("3000", () => console.log("라우터를 만들어보자!"));
    ```
    - url 모듈을 로딩하고 url 변수에 할당한다.
    - url 모듈을 사용해 요청(req)으로 받은 url의 pathname을 얻는다.
    - url이 "localhost:3000/user"라면 pathname은 "/user"가 된다.
    - parse() 함수의 두 번째 인수로 있는 true는 쿼리 스트링도 함께 파싱할지 여부를 설정하는 변수이며, 경로명 다음의 ? 기호 뒤에 키=값의 형태로 붙인다.
        - 쿼리 스티링(query string)
            - HTTP 요청을 보낼 때 사용자가 원하는 값을 보내는 방식이다.
            - 경로값 뒤에 ?를 붙인 다음 key=value 형식으로 사용할 수 있으며, 여러 개일 경우 &로 구분해 추가한다.
    - 브라우저에서 localhost:3000/user와 localhost:3000/feed로 접속하면, 각각 보낸 응답에 대한 출력값을 확인할 수 있다.
    - /user와 /feed 이외의 요청은 페이지가 없다는 404 에러를 보여준다.

## 3. createServer() 리팩터링하기
1. 위에서 구현한 라우팅의 첫 번째 문제
    - 현재는 요청에 대한 응답을 createServer() 안에서 직접 컨트롤한다.
    - 이렇게 되면 createServer() 안의 콜백 함수에 모든 코드를 다 추가해야 하므로 좋지 않다.
    - 따라서, 라우팅 이후의 처리를 별도의 함수를 만들어서 처리하도록 코드를 리팩터링해야 한다.<br><br>
2. 리팩터링(refactoring)
    - 동작 결과를 변경하지 않으면서 코드의 구조를 재조정하는 작업이다.
    - 가독성을 높이고 유지보수를 편하게 하는 목적으로 진행한다.<br><br>
3. 라우터와 실행하는 함수 코드를 나눈 소스 코드
    ```js
    const http = require("http");
    const url = require("url"); // url 모듈을 로딩
    http
        .createServer((req,res) => {
            const path = url.parse(req.url, true).pathname; // 패스명 할당
            res.setHeader("Content-Type", "text/html; charset=utf-8");

            if (path === "/user") {
                user(req, res); // user 결괏값 설정
            } else if (path === "/feed") {
                feed(req, res); // feed에 대한 결괏값 설정
            } else {
                notFound(req, res); // 결괏값으로 에러 메시지 설정
            }
        })
        .listen("3000", () => console.log("라우터를 만들어보자!"));

    const user = (req, res) => {
        res.end(`[user] name : andy, age : 30`);
    };

    const feed = (req, res) => {
        res.end(`
        <ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
        </ul>
        `);
    };

    const notFound = (req, res) => {
        res.statusCode = 404;
        res.end("404 page not found");
    }
    ```
    - /user 요청을 처리하는 코드를 user() 함수로, /path 요청을 처리하는 코드를 feed() 함수로, 설정된 path가 없을 때 처리하는 코드를 notFound() 함수로 분리했다.
    - 동작은 이전과 동일하게 동작하는 것을 확인할 수 있다.

## 4. 동적으로 응답하기
1. 위에서 구현한 라우팅의 두 번째 문제
    - 앞에서 작성한 서버는 브라우저에 접속하면 user() 함수를 통해 응답으로 고정된 name과 age 정보를 반환하여 언제는 같은 결과를 보여준다.
    - user() 함수를 url의 query 부분에 name과 age 정보를 추가하여 매개변수에 따라 동적으로 응답이 변경되도록 해야 한다.<br><br>
2. user() 함수를 수정해서 매개변수에 따라 동적으로 응답할 수 있도록 코드 수정
    ```js
    const http = require("http");
    const url = require("url"); // url 모듈을 로딩
    http
        .createServer((req,res) => {
            const path = url.parse(req.url, true).pathname; // 패스명 할당
            res.setHeader("Content-Type", "text/html; charset=utf-8");

            if (path === "/user") {
                user(req, res); // user 결괏값 설정
            } else if (path === "/feed") {
                feed(req, res); // feed에 대한 결괏값 설정
            } else {
                notFound(req, res); // 결괏값으로 에러 메시지 설정
            }
        })
        .listen("3000", () => console.log("라우터를 만들어보자!"));

    const user = (req, res) => {
        const userInfo = url.parse(req.url, true).query; // 쿼리 스트링 데이터를 userInfo에 할당
        res.end(`[user] name : ${userInfo.name}, age : ${userInfo.age}`); // 결괏값으로 이름과 나이 설정
    };

    const feed = (req, res) => {
        res.end(`
        <ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
        </ul>
        `);
    };

    const notFound = (req, res) => {
        res.statusCode = 404;
        res.end("404 page not found");
    }
    ```
    - url의 query 부분을 user라는 매개변수로 받는다.
    - 응답을 줄 때 user.name, user.age를 사용한다.
    - 주소 뒤에 ?를 붙인 후 키=값 형식으로 다음과 같이 추가해 준다.
        - localhost:3000/user?name=mike&age=20

## 5. 라우터 리팩터링하기
1. 위에서 구현한 라우팅의 세 번째 문제
    - 현재는 분기문에서 모든 요청을 분석한다.
    - 아직은 함수가 user(), feed(), notFound() 총 3개 뿐이지만, 이런 함수가 100개가 넘어간다면 유지보수하기가 매우 힘들어질 것이다.
    - 함수를 하나 추가할 때마다 분기문에서 실수 하지 않도록 조치해야 하며, 유지보수성을 높이는 관점에서 라우터를 리팩터링해야 한다.
    - 분기문에 사용되는 매개변수가 같은 패턴을 보일 때는 맵 자료구조를 사용하는 것이 좋으며, 우리가 만든 라우팅 규칙도 분기문에 들어가는 매개변수라 같은 패턴을 보이기 때문에 맵을 사용해서 분기문을 조금 더 깔끔하게 할 수 있다.<br><br>
2. 리팩터링한 라우터 소스 코드
    ```js
    const http = require("http");
    const url = require("url"); // url 모듈을 로딩
    http
        .createServer((req,res) => {
            const path = url.parse(req.url, true).pathname; // 패스명 할당
            res.setHeader("Content-Type", "text/html; charset=utf-8");

            if (path in urlMap) { // urlMap에 path가 있는지 확인
                urlMap[path](req, res); // urlMap에 path값으로 매핑된 함수 실행
            } else {
                notFound(req, res); // 결괏값으로 에러 메시지 설정
            }
        })
        .listen("3000", () => console.log("라우터를 리팩터링해보자!"));

    const user = (req, res) => {
        const userInfo = url.parse(req.url, true).query; // 쿼리 스트링 데이터를 userInfo에 할당
        res.end(`[user] name : ${userInfo.name}, age : ${userInfo.age}`); // 결괏값으로 이름과 나이 설정
    };

    const feed = (req, res) => {
        res.end(`
        <ul>
            <li>picture1</li>
            <li>picture2</li>
            <li>picture3</li>
        </ul>
        `);
    };

    const notFound = (req, res) => {
        res.statusCode = 404;
        res.end("404 page not found");
    }

    // 라우터 규칙 매핑 키로 path가 들어가고 값에 함수를 할당
    const urlMap = {
        "/": (req, res) => res.end("HOME"),
        "/user": user,
        "/feed": feed,
    }
    ```
    - urlMap[키]를 넣으면 키에 해당하는 값을 반환한다.
    - 키로 path를 넣으면 값인 함수가 반환된다.
    - urlMap['user']을 입력하면 user가 반환되므로 결국 코드는 user(req, res);가 된다.
    - 코드의 가장 하단에 urlMap을 추가한 이유는 user()와 feed() 함수보다 위에 있으면 에러가 발생하기 때문이다.
        - const로 선언한 변수들은 초기화 전에 읽을 수 없어서 에러가 발생하는 것이다.
        - let, const 함수 표현식, 클랙스 표현식은 호이스팅되지 않기 때문이다.
            - 호이스팅(hoisting) : 함수, 클래스, 변수를 끌어올려서 선언되기 전에 사용하도록 하는 기능이다.

## 6. 익스프레스 프레임워크 사용하기
1. 일반적으로 웹 서버가 제공하는 기능
    - 라우팅 : URL 요청을 함수와 매핑시켜주는 기능
    - 정적 파일 서비스 : CSS, 자바스크립트, 이미지 등의 정적인 파일을 다루는 기능
    - 템플릿 엔진 : 동적인 웹페이지를 HTML과 인스턴스를 사용해 생성하는 기능
    - 요청(request) 데이터 다루기 : HTTP 요청을 추상화해 편리하게 다룰 수 있게 하는 기능
    - 응답(response) 데이터 다루기 : HTTP 응답을 커스터마이징할 수 있는 기능, 파일 내려받기, 이미지 출력 등
    - 파일 업로드 : HTTP로 전송된 파일을 읽고 다룰 수 있는 기능
    - 쿠키 및 세션 지원 : 클라이언트 측 혹은 서버 측의 메모리에 일정 기간 동안 저장해야 하는 데이터를 다루는 기능
    - 리다이렉트 : 서버의 응답 시 다른 페이지로 전달(redirect)시키는 기능
    - 에러 페이지 : 요청이 잘못되었거나, 서버 에러 시 특정 에러 페이지를 보여주기
    - 미들웨어 : 요청 혹은 응답 사이에 공통된 기능을 추가하는 기능<br><br>
    - 위와 같이 기본 라이브러리로 구현하고 유지보수할 수도 있지만 시간이 많이 든다.
    - Node.js에는 이런 작업들을 제공하는 오픈 소스 웹 서버가 많으며, 그중에 익스프레스가 가낭 널리 사용된다.<br><br>
2. JSON(JsvaScript Object Notation)
    - 경량의 데이터 표시 형식이다.
    - 이름 처럼 자바스크립트의 객체를 표현할 때 사용한다.
    - 키-값으로 된 객체 혹은 배열로 데이터를 표현한다.
    - 확장자가 .json으로 된 파일의 내용은 JSON 형식으로 되어 있다.<br><br>
3. 간단한 익스프레스 서버 만들기
    - 간단한 익스프레스 서버 소스 코드
        ```js
        const express = require("express");
        const app = express()
        const port = 3000;

        app.get("/", (req, res) => { // /으로 요청이 오는 경우 실행됨
            res.set({ "Content-Type" : "text/html; charset=utf-8" }); // 헤더값 설정
            res.end("헬로 Express");
        });

        app.listen(port, () => { // 서버를 기동해 클라이언트 요청을 기다림
            console.log(`START SERVER : use ${port}`);
        });
        ```
        - localhost:3000으로 접근하면 "헬로 express"를 반환하는 간단한 서버이다.
        - express 패키지를 로딩해 express에 할당한다.
        - express()를 실행해 express 인스턴스를 만들고 app에 할당한다.
        - app.get을 사용해 url의 path가 '/'이면서 http 메서드가 get()인 경우 콜백 한수를 실행한다.
        - 반환된 콘텐츠의 정보를 설정한다.
        - 결과의 콘텐츠 타입은 html이며 결과에 한글이 있으므로 캐릭터셋을 utf-8로 변경한다.
        - listen() 함수를 사용해 클라이언트의 요청을 기다리며, 포트는 3000번을 사용한다.<br><br>
4. Node.js 라이브러리로 만든 서버를 익스프레스로 구현하기
    - Node.js 라이브러리로 만든 서버를 익스프레스로 구현한 소스 코드
        ```js
        const url = require("url");
        const express = require("express");
        const app = express();
        const port = 3000;

        app.listen(port, () => {
            console.log("익스프레스로 라우터 리팩터링하기");
        });

        // GET 메서드의 라우팅 설정
        app.get("/", (_, res) => res.end("HOME"));
        app.get("/user", user);
        app.get("/feed", feed);

        function user(req, res) {
            const user = url.parse(req.url, true).query;

            // 결괏값으로 유저명과 나이 제공
            res.json(`[user] name : ${user.name}, age : ${user.age}`);
        };

        function feed(_, res) { // feed로 요청이 오면 실행되는 함수
            res.json(`
            <ul>
                <li>picture1</li>
                <li>picture2</li>
                <li>picture3</li>
            </ul>
            `);
        };
        ```
        - 기존 코드에서는 urlMap으로 url 매핑을 관리하던 부분이 없어지고, app.get() 함수에 등록하도록 변경했다.
            - 수백 개의 URL이 있다면, 그 수백 개의 함수를 하나 하나 매핑시켜줘야 하고 urlMap이 굉장히 길어지게 되는 단점이 있었다.
            - 하지만, express에서는 app.get() 함수에 설정을 추가하면 되기에 코드를 조금 더 깔끔하게 유지할 수 있다.
        - 기존 코드에서는 res.end() 함수를 사용했지만, express에서는 res.json() 함수를 사용했다.
            - 응답을 JSON 타입으로 보여주기도 하고, charset=utf-8을 자동으로 설정해주므로 한글을 간단하게 처리할 수 있다.
        - 기존 코드에는 function이 아니라 const로 선언되어 있었다.
            - 호이스팅을 사용하기 위해 function으로 변경했다.
        - feed(req, res)의 첫 번째 인수로 _ 기호를 넣었는데, 사용하지 않는 변수는 빼는 것이 원칙이지만 함수 인터페이스 구조상 넣을 수밖에 없을 때의 관례이다.

## 7. 익스프레스로 간단한 API 서버 만들기
1. API(Application Programming Interface)
    - 프로그램에서 다른 프로그램의 기능을 사용할 수 있게 해주는 일종의 규약이다.<br><br>
2. 게시판 API 코드 작성하기
    - API는 REST API의 원칙에 따라 만들 것이다.
        - REST API 원칙 : 자원을 URL에 표현하고 가져오는 행위를 HTTP 메서드로 표현하는 규칙이다.<br><br>
    - 게시판 API 스펙
        - /(경로) → get(HTTP 메서드) → 게시판 목룍을 가져온다.(설명)
        - /posts(경로) → post(HTTP 메서드) → 게시판에 글을 쓴다. 글은 아이디(id), 제목(title), 작성자(name), 내용(text), 생성일시(createdDt)로 구성된다.(설명)
        - /posts/:id(경로) → delete(HTTP 메서드) → 게시글 아이디가 id인 글을 삭제한다.(설명)<br><br>
    - API 규칙에 맞게 서버 구현하기
        - API 규칙에 따라 구현한 서버 소스 코드
            ```js
            const express = require("express");
            const app = express();
            let posts = []; // 1. 게시글 리스트로 사용할 posts에 빈 리스트 할당

            // req.body를 사용하려면 JSON 미들웨이를 사용해야 한다.
            // 사용하지 않으면 undefined로 반환
            app.use(express.json()); // 2. JSON 미들웨어 활성화

            // POST 요청 시 컨텐트 타입이 application/x-www-form-urlencoded인 경우 파싱
            app.use(express.urlencoded({ extended: true })); // 3. JSON 미들웨어와 함께 사용

            app.get("/", (req, res) => { // 4. /로 요청이 오면 실행
                res.json(posts);         // 5. 게시글 리스트를 JSON 형식으로 보여줌
            });

            app.post("/posts", (req, res) => {          // 6. /posts로 요청이 오면 실행
                const { title, name, text } = req.body; // 7. HTTP 요청의 body 데이터를 변수에 할당

                // 8. 게시글 리스트에 새로운 게시글 정보 추가
                posts.push({ id: posts.length + 1, title, name, text, createdDt: Date() });
                res.json({ title, name, text });
            });

            app.delete("/posts/:id", (req, res) => {
                const id = req.params.id; // 9. app.delete에 설정한 path 정보에서 id값을 가져옴
                const filteredPosts = posts.filter((post) => post.id !== +id); // 10. 글 삭제 로직
                const isLengthChanged = posts.length !== filteredPosts.length; // 11. 삭제 확인
                posts = filteredPosts;
                if (isLengthChanged) { // 12. post의 데이터 개수가 변경되었으면 삭제 성공
                    res.json("OK");
                    return;
                }
                res.json("NOT CHANGED"); // 13. 변경되지 않음
            });

            app.listen(3000, () => {
                console.log("welcome posts START!");
            });
            ```

## 8. res.json() VS res.send()
1. res.json()와 res.send()의 차이점
    - 외부에서 보기에는 차이가 없지만, res.send()는 내부에서 호출 한 번이 더 일어나는 것을 볼 수 있다.
    - 또한, Object를 보낼 땐 res.json()을 이용하는 게 더 직관적이기도 하기 때문에 res.json()을 이용하는 것이 좋다.

## 9. Middleware
1. Middleware란?
    - Express는 자체 기능이 최소화된 라우팅 및 미들웨어 웹 프레임워크다.
    - Express 애플리케이션은 본질적으로 일련의 미들웨어 기능 호출이다.
    - 미들웨어 기능은 애플리케이션의 요청-응답 주기에서 요청 객체(req), 응답(res), next 미들웨어 함수에 접근할 수 있는 기능이다.
        - next 미들웨어 기능은 일반적으로 next라는 변수로 표시된다.
    - 즉, Express 애플리케이션은 본질적으로 일련의 미들웨어 기능 호출이다.<br><br>
2. Middleware 생성
    - app.use 메소드를 사용한다.
    - 실습 소스 코드
        ```js
        const express = require('express');

        const PORT = 3000;

        const Users = [
            {
                id: 0,
                name: 'Jack'
            },
            {
                id: 1,
                name: 'Jennifer'
            }
        ]
        const app = express();

        app.use((req, res, next) => {
            const start = Date.now();
            console.log(`${req.method} ${req.url}`);
            next();
            const diffTime = Date.now() - start;
            console.log(`end: ${req.method} ${req.url} ${diffTime}ms`);
        })

        app.get('/users', (req, res) => {
            res.send(Users);
        });

        app.get('/users/:userId', (req, res) => {
            const userId = Number(req.params.userId);
            const user = Users[userId];
            if(user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        });

        app.get('/', (req, res) => {
            res.send('Hello World!');
        });

        app.listen(PORT, () => {
            console.log(`Running on port ${PORT}`);
        });
        ```

## 10. express.json()
1. express.json()란?
    - POST 요청할 때 사용한다.
    - 예를 들어, 어떤 배열에 POST 요청하여 새로운 데이터를 추가할 때 undefined 문제가 발생한다.
        - 이때, 원래는 bodyParser 모듈을 이용하여 해결해줄 수 있었지만, express 4.16.0부터는 express에 들어 있는 내장 미들웨어 함수로 bodyParser 모듈을 대체해줄 수 있다.
        - app.use(express.json());를 미들웨어로 등록해주면 된다.
    - 만약, 요청 body가 없을 때 조건을 처리하기 위해서는 400 상태 코드를 보내주면 된다.
        - 응답을 보내준 후에는 아래 코드가 실행되지 않도록 return 형식으로 응답을 보내줘야 한다.<br><br>
2. express.json() 실습 소스 코드
    ```js
    const express = require('express');

    const PORT = 3000;

    const Users = [
        {
            id: 0,
            name: 'Jack'
        },
        {
            id: 1,
            name: 'Jennifer'
        }
    ]
    const app = express();
    app.use(express.json());

    app.use((req, res, next) => {
        const start = Date.now();
        console.log(`${req.method} ${req.url}`);
        next();
        const diffTime = Date.now() - start;
        console.log(`end: ${req.method} ${req.url} ${diffTime}ms`);
    });

    app.get('/users', (req, res) => {
        res.send(Users);
    });

    app.get('/', (req, res) => {
        res.send('Hello World!');
    });

    app.post('/users', (req, res) => {
        if (!req.body.name) {
            return res.status(404).json({
                error: 'Missing user name'
            });
        }

        const newUser = {
            name: req.body.name,
            id: Users.length
        }
        Users.push(newUser);
        res.json(newUser);
    });

    app.get('/users/:userId', (req, res) => {
        const userId = Number(req.params.userId);
        const user = Users[userId];
        if(user) {
            res.json(user);
        } else {
            res.sendStatus(404);
        }
    });

    app.listen(PORT, () => {
        console.log(`Running on port ${PORT}`);
    });
    ```

## 11. MVC(Model, View, Controller) 패턴
1. MVC 패턴이란?
    - 관련 프로그램 로직을 상호 연결된 3개의 요소로 나누는 사용자 인터페이스를 개발하는 데 일반적으로 사용되는 소프트웨어 아키텍처 패턴이다.<br><br>
2. 모델
    - 데이터와 비즈니즈 로직을 관리한다.
    - 앱이 포함해야 할 데이터가 무엇인지를 정의한다.
    - 데이터의 상태가 변경되면 모델을 일반적으로 뷰에게 알리며 가끔 컨트롤러에게 알리기도 한다.<br><br>
3. 뷰
    - 레이아웃과 화면을 처리한다.
    - 앱의 데이터를 보여주는 방식을 정의한다.
    - 항목이 사용자에게 보여지는 방식을 정의하며, 표시할 데이터를 모델로부터 받는다.<br><br>
4. 컨트롤러
    - 명령을 모델과 뷰 부분으로 라우팅한다.
    - 앱의 사용자로부터의 입력에 대한 응답으로 모델 및 뷰를 업데이트하는 로직을 포함한다.<br><br>
5. MVC 패턴 실습
    - 모델, 뷰, 컨트롤러 파일을 모두 생성해주고, 코드를 나눠준다.<br><br>
    - server.js
        ```js
        const express = require('express');
        const usersController = require('./controllers/users.controller');
        const postsController = require('./controllers/posts.controller');
        const PORT = 3000;
        const app = express();

        app.use(express.json());

        app.use((req, res, next) => {
            const start = Date.now();
            console.log(`${req.method} ${req.url}`);
            next();
            const diffTime = Date.now() - start;
            console.log(`end: ${req.method} ${req.url} ${diffTime}ms`);
        });

        app.get('/users', usersController.getUsers);
        app.get('/users/:userId', usersController.getUser);
        app.post('/users', usersController.postUser);
        app.get('/posts', postsController.getPost);

        app.listen(PORT, () => {
            console.log(`Running on port ${PORT}`);
        });
        ```
    - postsController.js
        ```js
        function getPost(req, res) {
            res.send('<div><h1>Post Title</h1><p>This is a post</p></div>');
        };

        module.exports = {
            getPost
        };
        ```
    - usersController.js
        ```js
        const model = require('../models/users.model');

        function getUsers(req, res) {
            res.send(model);
        };

        function getUser(req, res) {
            const userId = Number(req.params.userId);
            const user = model[userId];
            if(user) {
                res.json(user);
            } else {
                res.sendStatus(404);
            }
        };

        function postUser(req, res) {
            if (!req.body.name) {
                return res.status(404).json({
                    error: 'Missing user name'
                });
            }

            const newUser = {
                name: req.body.name,
                id: model.length
            }
            model.push(newUser);
            res.json(newUser);
        };

        module.exports = {
            getUsers,
            getUser,
            postUser
        };
        ```
    - users.model.js
        ```js
        const Users = [
            {
                id: 0,
                name: 'Jack'
            },
            {
                id: 1,
                name: 'Jennifer'
            }
        ];

        module.exports = Users;
        ```

## 12. Router
1. Router란?
    - 클라이언트의 요청 경로에 따라 이 요청을 처리할 수 있는 곳으로 기능을 전달해주는 것이다.
    - 애플리케이션이 점점 커질수록 server.js 파일에 api들이 많아져서 복잡해지게 된다.
    - 이럴 때 router를 이용하면, 이 부분을 정리해줄 수 있다.<br><br>
2. Router 실습
    - routes 폴더를 생성해주고, posts.router.js, users.router.js 파일을 만들어준다.<br><<br>
    - server.js
        ```js
        const express = require('express');
        const usersRouter = require('./routes/users.router');
        const postRouter = require('./routes/posts.router');
        const PORT = 3000;
        const app = express();
        app.use(express.json());

        app.use((req, res, next) => {
            const start = Date.now();
            console.log(`start: ${req.method} ${req.url}`);
            next();
            const diffTime = Date.now() - start;
            console.log(`end: ${req.method} ${req.baseUrl} ${diffTime}ms`);
        });

        app.use('/users', usersRouter);
        app.use('/posts', postRouter);

        app.listen(PORT, () => {
            console.log(`Running on port ${PORT}`);
        });
        ```
    - users.router.js
        ```js
        const express = require('express');
        const usersRouter = express.Router();
        const usersController = require('../controllers/users.controller');

        usersRouter.get('/', usersController.getUsers);
        usersRouter.get('/:userId', usersController.getUser);
        usersRouter.post('/', usersController.postUser);

        module.exports = usersRouter;
        ```
    - posts.router.js
        ```js
        const express = require('express');
        const postRouter = express.Router();
        const postsController = require('../controllers/posts.controller');

        postRouter.get('/', postsController.getPost);

        module.exports = postRouter;
        ```

## 13. RESTful API
1. RESTful API란?
    - 두 컴퓨터 시스템이 인터넷을 통해 정보를 안전하게 교환하기 위해 사용하는 인터페이스다.
    - 통신을 할 때 안전하고 효율적인 방법을 위해서 사용하는 것이다.<br><br>
2. REST란?
    - Representational State Transfer의 약자로, 처음에 인터넷과 같은 복잡한 네트워크에서 통신을 관리하기 위한 지침이다.
    - 덕분에 REST 기반의 아키텍처를 사용해서 대규모 고성능 통신을 안정적으로 지원힌다.

## 9. 핵심 용어
- RESTful API
    - REST 구조를 사용하는 API이다.
    - REST(Representational State Transfer)는 HTTP URL를 통해 자원을 명시하고 HTTP 메소드(POST, GET, PUT, DELETE 등)를 사용해 자원을 처리한다.
- 일급 객체
    - 값으로 취금할 수 있는 객체를 의미한다.
    - 값으로 취급하면, 변수에 할당이 가능하고, 함수의 매개변수로 넣을 수 있으며, 함수의 결괏값으로도 받을 수 있다.
- 익스프레스
    - Node.js에서 가장 유명한 웹 서버이다.
    - 필수 기능만 제공하고 그 외 기능은 확장해 사용한다.
- 익스프레스에서 미들웨어
    - HTTP 요청과 응답 사이에 함수를 추가하여 새로운 기능을 추가하는 것을 의미한다.