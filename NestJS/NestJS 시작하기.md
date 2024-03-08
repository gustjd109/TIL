# NestJS 시작하기

## 1. NestJS 소개
1. NestJS란?
    - 자바스크립트 최신 기능을 사용하는 웹 프레임워크다.
    - 좋은 구조로 애플리케이션을 작성해 프로젝트의 복잡성을 잘 관리하는 것이 목표다.
    - 자바스크립트로 만드는 웹 서버 프레임워크의 아키텍처 문제를 효과적으로 해결하는 것이 목표다.
        - 서버 개발에서 쉽게 테스트하고, 쉽게 확장이 가능하고, 각 모듈 간의 의존성은 줄이도록 해야 유지보수가 쉽다.
        - 좋은 아키텍처는 이런 목표를 달성할 수 있게 해준다.<br><br>
2. NestJS 특징
    - Node.js에서 실행하는 서버 사이드 프레임워크다.
    - 타입스크립트를 완벽하게 지원한다.
    - 자바스크립트 최신 스팩을 사용하기 때문에 바닐라 자바스크립트를 사용한다면 babel 사용이 필수다.
    - HTTP 요청 부분은 추상화된 코드를 제공해 익스프레스와 패스티파이(Fastify)를 사용할 수 있다.
        - 빠른 성능이 필요한 부분에서는 패스티파이를 사용하고 그렇지 않은 부분에서는 막강한 서드파티의 지원을 받는 익스프레스를 쓸 수 있으니 NestJS는 성능과 확장성, 유연함을 모두 가져갈 수 있다.<br><br>
3. 패스티파이
    - 익스프레스와 하피(Hapi)에 영감을 받은 웹 프레임워크다.<br><br>
    - 패스티파이 특징
        - 고성능 : 초당 최대 3만 개의 요청을 처리할 수 있다.
        - 확장성 : hooks, plugins, decorator를 사용해 확장할 수 있다.
        - 스키마 기반 : JSON 스키마를 사용해 데이터의 유효성 검증을 할 수 있다.
        - 로깅 : 매우 중요하지만, 비용이 크기 때문에 오버헤드가 매우 적은 pino를 로깅 라이브러리로 사용한다.
        - 개발자 친화적 : 성능과 보안에 대한 타협을 하지 않으면서도 사용이 간편하다.<br><br>
4. 익스프레스 VS NestJS
    - 익스프레스
        - 간략 소개 : 미니멀리스트 웹 프레임워크
        - 라우터 : 직접 라우터 함수를 추가하거나, 미들웨어 사용
        - 의존성 주입 : 없음
        - 에러 핸들링 : 직접 에러를 처리해야 함
        - 테스트 : 직접 테스트 관련 도구들을 설치 및 실행해야 함
        - 인기도 : Node.js에서 가장 인기있는 프레임워크
        - 아키텍처 : 특정 아키텍처를 요구하지 않음<br><br>
    - NestJS
        - 간략 소개 : 자바스크립트의 최신 기능을 사용해 효율성을 추구하며 상업용 서버 애플리케이션 구축을 목표로 하는 프레임워크
        - 라우터 : @Controller() 데코레이터 사용
        - 의존성 주입 : 잘 만든 의존성 주입 기능을 제공함. 서비스의 의존 관계의 관리가 쉬움
        - 에러 핸들링 : @Catch() 데코레이터 사용
        - 테스트 : Jest를 기반으로 한 내장 테스트 모듈을 제공
        - 인기도 : 두 번째로 인기있는 프레임워크
        - 아키텍처 : 컨트롤러, 프로바이더, 모듈을 사용한 애플리케이션 아키텍처 제공<br><br>
5. NestJS 둘러보기
    - NestJS의 핵심 기능으로 의존성 주입을 들 수 있다.
        - 의존성 주입은 모듈 간의 결합도를 낮춰서 코드의 재사용을 용이하게 한다.
        - 즉, 모듈 내에서의 코드의 응집도는 높여서 모듈의 재사용을 꾀하고, 모듈 간의 결합도는 낮춰서 다양한 아키텍처에서 활용할 수 있게 해준다.
        - 이를 위한 장치들로 모듈, 가드, 파이프, 미들웨어, 인터셉터 같은 모듈과 코드의 의존 관계를 구성하는 프로그래밍적 장치들이 있다.<br><br>
    - 기존의 Node.js 생태계에서 자주 사용하는 기능을 통합하고 있으면 기본적으로 RDB와 NoSQL의 연동, 세션 처리, 문서화, 테스트 지원, 로깅, 태스크 스케줄링 등 상업용 서버에서 필요한 대부분의 기능을 제공한다.
    - 새로 필요한 기능이 있으면 모듈이나 커스텀 데코레이터를 만들어서 다른 코드들에 쉽게 적용하도록 지원한다.
        - 데코레이터 : 일종의 함수이며, '@데코레이터명'으로 사용할 수 있고 메소드, 클래스, 프로퍼티, 파라미터에 붙일 수 있다.

## 2. NestJS 설치하고 실행하기
1. NestJS 설치
    - 다음과 같은 명령어로 NestJS를 설치할 수 있다.
        - npm i @nestjs/core @nestjs/common @nestjs/platform-express reflect-metadata typescript
            - @nestjs common
                - 실제 프로젝트에서 사용할 대부분의 코드가 들어있다.
                - 데코레이터로 사용하는 함수들의 클래스들이 대표적이다.
            - @nestjs/core
                - @nestjs/common에서 사용하는 코드가 들어있다.
                - 가드, 미들웨어, 파이프 등을 만드는 핵심 코드가 들어있다.
            - @nestjs/platform-express
                - HTTP 요청/응답 부분을 감싸서 익스프레스의 req, res 객체를 사용하는 라이브러리다.
            - reflect-metadata
                - 데코레이터 사용 시 필수다.
            - typescript
                - 타입스크립트 사용 시 필수다.<br><br>
2. 타입스크립트 설정하기
    - 타입스크립트 설정 파일은 tsconfig.json 파일이며, 해당 파일을 생성하여 프로젝트 루트의 루트 디렉터리에 위치시키면 된다.
    - tsconfig.json 파일 소스 코드
        ```js
        {
            "compilerOptions": {                // 컴파일러 옵션   
                "module": "CommonJS",           // 모듈 시스템
                "target": "ESNext",             // 사용할 ES 버전
                "experimentalDecorators": true, // 데코레이터를 사용할지 여부
                "emitDecoratorMetadata": true   // 데코레이터와 메타 데이터를 같이 내보낼지 여부
            }
        }
        ```
3. NestJS 모듈과 컨트롤러 만들기
    - NestJS는 웹 서버이므로 HTTP 요청/응답을 처리한다.
    - 일반적으로 웹 어플리케이션 서버에서 HTTP 요청/응답을 처리하기까지 몇 단계를 거친다.
    - 보통 파이프 → 가드 → 컨트롤러 → 서비스 → 리포지토리 순서로 처리한다.
        - 파이프 : 요청의 대한 유효성 검증
        - 가드 : 인증/인가
        - 컨트롤러 : 특정 함수에 값을 전달(라우팅). 클라이언트에서 온 요청을 코드에 전달해야 하기 때문에 필수!
        - 서비스 : 비즈니스 로직
        - 리포지토리 : 데이터 저장<br><br>
    - NestJS 컨트롤러 소스 코드
        ```js
        import { Controller, Get } from "@nestjs/common"; // 1. 필요한 함수 임포트

        @Controller() // 2. 컨트롤러 데코레이터
        export class HelloController { // 3. 외부에서 사용하므로 export를 붙여준다.
            @Get() // 4. GET 요청 처리 데코레이션
            hello() {
                return "안녕하세요! NestJS로 만든 첫 애플리케이션입니다.";
            }
        }
        ```
        - src 디렉터리를 생성하고, 파일명.ts로 타입스크립트 파일을 생성하여 코드를 작성한다.
        - 1번 : 대부분의 필요한 함수는 nestjs/common에 있다.
            - Controller와 Get은 대문자로 시작하지만, 모두 함수이며 데코레이터다.
            - 데코레이터는 클래스, 함수, 변수에 위나 왼쪽에 붙일 수 있으며 해당 코드의 동작을 변경한다.
        - 2번 : 앞에 @가 붙어 있으면 데코레이터다.
            - 보통은 클래스와 함수의 앞뒤에 전후 처리를 해주어서 해당 코드의 동작에 부가적인 기능을 추가할 때 사용한다.
            - @Controller 데코레이터는 클래스에 붙이며 컨트롤러로 사용하도록 해준다.
            - 매개변수로 경로를 지정할 수 있지만, 아무것도 붙어 있지 않으므로 <서버 주소>의 경로가 되며 여기서는 localhost:3000을 사용한다.
        - 3번 : 컨트롤러 클래스는 Module에서 포함되어야 하므로 export를 붙여서 다른 클래스에서 불러올 수 있도록 해준다.
        - 4번 : @Get 데코레이터 함수는 HTTP 요청 중 GET 방식의 요청을 처리한다.
            - 매개변수로 경로에 대한 패턴을 지정할 수 있다.
            - @Controller와 @Get에 아무런 값이 없으므로 localhost:3000으로 접속 시 값이 나온다.<br><br>
    - NestJS 모듈 소스 코드
        ```js
        import { Module } from "@nestjs/common";
        import { HelloController } from "./hello.controller";

        @Module({ // 모듈 데코레이터
            controllers: [HelloController],
        })
        export class HelloModule {}
        ```
        - @Module은 모듈을 설정할 때 사용하는 데코레이터다.
        - 여기서는 controllers만 설정한다.
        - controllers에는 배열로 모듈에 포함된 컨트롤러들을 설정한다.
        - 현재는 HelloContrller 하나만 있으니 하나만 설정한다.<br><br>
    - NestJS의 가동 시 실행되는 메인 소스 코드
        ```js
        import { NestFactory } from "@nestjs/core";
        import { HelloModule } from "./hello-module";

        // 1. NestJS를 시작시키는 함수
        async function bootstrap() {
            // 2. NestFactory를 사용해서 NestApplication 객체 생성
            const app = await NestFactory.create(HelloModule);

            // 3. 3000번 포트로 서버 기동
            await app.listen(3000, () => { console.log("서버 시작!"); });
        }

        bootstrap();
        ```
        - 1번 : NestJS의 서버를 기동하려면 최초 실행되는 함수, 즉 최초 진입점인 bootstrap() 함수를 선언하는 것이 관례다.
        - 2번 : NestFactory는 NestFactoryStatic 클래스이며 create() 함수에 루트 모듈을 넣어 NestApplication 객체를 생성한다.
            - NestApplication 객체에는 HTTP 부분을 모듈화한 HTTPAdapter가 있으며, 기본적으로는 익스프레스가 사용된다.
        - 3번 : listen() 함수는 HTTP 어댑터로 무엇을 쓰느냐에 따라 다르지만, 여기서는 기본값인 익스프레스의 app.listen() 함수다.
            - NestJS의 애플리케이션을 실행하는 코드가 익스프레스와 같다.<br><br>
    - NestJS 서버 실행
        - 타입스크립트로 만든 프로그램을 실행하기 위해서는 'ts-node-dev'라는 패키지가 필요하다.
            - 설치하지 않고 실행하면 설치할지 여부를 물어보기 때문에 설치해주면 된다.
        - 서버 실행 코드는 다음과 같다.
            - npx ts-node-dev main.ts
        - 패키지를 설치하고 서버를 실행시킨 후, localhost:3000로 접속하면 실행 결과를 확인할 수 있다.

## 3. NestJS 네이밍 규칙
1. NestJS의 네이밍 컨벤션
    - 규칙 1 : 파일명을 .으로 연결
        - 모듈이 둘 이상의 단어로 구성되어 있으면 대시(-)로 연결
            ```js
            // <모듈명><컴포넌트명>.ts
            hello.controller.ts
            my-first.controller.ts
            ```
    - 규칙 2 : 클래스명은 낙타 표기법(Camel Case)을 사용
        ```js
        // <모듈명><컴포넌트명>.ts
        HelloController
        ```
    - 규칙 3 : 같은 디렉터리에 있는 클래스는 index.ts를 통해서 임포트하는 것을 권장
        ```ts
        // index를 사용하지 않는 경우
        import { MyFirstController } from '.controllers/my-first.controller'
        import { MySecondController } from '.controllers/my-second.controller'

        // index.ts를 사용하는 경우
        import { MyFirstController, MySecondController } from './controllers;
        ```
    - 규칙 4 : 타입스크립트에서는 인터페이스를 많이 사용한다.
        - 인터페이스는 타입을 정의하는 데 사용되고 구체적인 내용은 클래스를 만들고 인터페이스를 상속하는 방식으로 작성한다.
        - 인터페이스 작명법으로 앞에 I를 붙이는 방법이 있다.
            - 예를 들어 Series라는 타입을 정의할 때 ISeries처럼 작명한다.
            - 하지만, 보기에 어색한 부분이 있다.
        - 가능하면 Series 인터페이스를 만들고 그 하위 인터페이스 혹은 클래스를 만든다.
        - 작명 예
            ```js
            interface Series {}
            interface BookSeries extends Series {}
            class MovieSeries extends Series {}
            ```

## 4. NestJS로 웹 API 만들기
1. 프로젝트 생성과 설정
    - nest-cli를 사용하여 한 번에 프로젝트를 설정할 수 있다.
        - CLI(Command Line Interface) 프로그램이므로 global 옵션을 사용해 어디서든 사용하도록 해야 한다.<br><br>
    - nest-cli 설치
        - npm install -g @nestjs/cli<br><br>
    - 프로젝트 생성
        - nest new blog<br><br>
    - 프로젝트 실행
        - cd blog
        - npm install
        - npm run start