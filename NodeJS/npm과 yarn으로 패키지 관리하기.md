# npm과 yarn으로 패키지 관리하기

## 1. npm(node package manager) 소개
1. npm이란?
    - 자바스크립트용 패키지 매니저이다.
        - 패키지 매니저 : 프로젝트에 필요한 의존성 패키지를 관리하는 프로그램이다.
        - 의존성 패키지 : 해당 프로젝트를 실행하는 데 꼭 필요한 라이브러리와 모듈들이다.
    - 유저가 만든 패키지를 등록하는 저장소를 의미하기도 하고, CLI(Command Line Interface)를 의미하기도 한다.
    - 보통 Node.js를 설치할 때 함께 설치된다.

## 2. 패키지와 모듈
1. Node.js에서의 패키지
    - Node.js에서 패키지는 package.json으로 정의한 파일 디렉터리를 의미한다.
    - 패키지는 package.json이 꼭 포함되며, 다음과 같은 것들 모두가 패키지가 될 수 있다.
        - package.json 파일이 있는 디렉터리
        - 1번을 압축한 파일
        - 2번을 내려받을 수 있는 URL 주소
        - 3번 정보를 가지고 npm 저장소에 <패키지명>@<버전>으로 등록된 것
        - 4번을 가리키는 <패키지명>@<태그>
        - <패키지명>만 있는 경우는 5번에서 latest 태그를 가리킴
        - 1번을 결과로 주는 깃 URL
    - 즉, package.json으로 정의한 코드 뭉치가 바로 패키지이다.<br><br>
2. Node.js에서의 모듈
    - [node_modules] 디렉터리 아래에 있는 파일 또는 디렉터리를 말하며, require() 함수로 읽을 수 있다.
    - [node_modules]에는 npm install 명령으로 설치한 패키지들이 저장되며, 모든 패키지는 모듈이다.
    - 패키지로 만들면 npm레지스트리에 등록할 수 있다.
        - 패키지로 만든 코드들은 간단하게 다른 곳에서 설치해 사용이 가능하므로 사설 npm 레지스트리에 공통으로 사용하는 패키지를 배포해서 사용할 수 있다.
    - require() 함수를 사용할 때 단순히 현재 디렉터리의 [node_modules]만 읽는 것이 아니다.
        - module.paths에 있는 경로를 따라서 모듈을 찾는다.
        - 터미널에서 다음과 같은 명령어를 통해 module.paths에 있는 경로를 따라서 모듈을 찾는 것을 확인할 수 있다.
            ```
            $ mkdir chapter4
            $ cd chapter4
            $ mkdir sample-chapter4
            $ cd sample-chapter4
            $ node
            > module.paths
            [
            '/Users/hyunsunghwang/Desktop/NodeJS/jsbackend/연습/chapter4/sample-package/repl/node_modules',
            '/Users/hyunsunghwang/Desktop/NodeJS/jsbackend/연습/chapter4/sample-package/node_modules',
            '/Users/hyunsunghwang/Desktop/NodeJS/jsbackend/연습/chapter4/node_modules',
            '/Users/hyunsunghwang/Desktop/NodeJS/jsbackend/연습/node_modules',
            '/Users/hyunsunghwang/Desktop/NodeJS/jsbackend/node_modules',
            '/Users/hyunsunghwang/Desktop/NodeJS/node_modules',
            '/Users/hyunsunghwang/Desktop/node_modules',
            '/Users/hyunsunghwang/node_modules',
            '/Users/node_modules',
            '/node_modules',
            '/Users/hyunsunghwang/.node_modules',
            '/Users/hyunsunghwang/.node_libraries',
            '/usr/local/lib/node'
            ]
            ```
            - 출력 결과에 [chapter4/node_modules]가 있지만, 사실 만들지도 않은 디렉터리이다.
                - 아예 생성도 되지 않은 디렉터리인데 패키지 매니저는 있다고 가정하고 설정한 경로이다.
            - 실제 존재하지도 않는 경로를 계속 타고 거슬러 올라가면서 [node_modules]이 있는지 검사한다.
            - 상위 디렉터리에 있는 패키지를 계속 타고 올라가면서 [node_modules]를 확인하면서 굉장히 많은 I/O를 수행한다.
            - 이것이 require() 함수가 무거워지는 이유이며, npm의 대안 yarn에서 이 문제점을 해결할 수 있다.<br><br>
3. package.json 파일 만들기
    - 패키지를 만들기 위해서는 package.json이 필요하며, 다음과 같은 명령어를 통해 생성할 수 있다.
        - npm init -y
        - y 옵션이 없다면 터미널에서 직접 입력하면서 내용을 변경할 수 있다.
        - 위 명령어로 생성된 package.json 파일
            ```
            {
            "name": "sample-package",
            "version": "1.0.0",
            "description": "",
            "main": "index.js",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": "",
            "license": "ISC"
            }
            ```
        - sample-package를 불러오면 실행하는 파일
            ```js
            // 모듈을 require 함수로 포함시킬 때 실행
            console.log("require로 부르면 실행됩니다.");

            module.exports = { // 외부로 노출할 객체를 저장
                add: (a, b) => a + b,
                sub: (a, b) => a - b,
                mul: (a, b) => a * b,
                div: (a, b) => a / b,
            }
            ```
            - require() 함수로 모듈을 읽을 때 파일을 위에서부터 읽는다.
                - 따라서, sample-package를 불러오는 시점에 console.log를 실행한다.
            - module.exports는 require를 사용해 불러왔을 때 반환하는 객체를 저장하는 변수이다.
                - module은 현재 모듈을 의미하며, exports는 외부에 노출할 객체를 저장하는 변수이다.
                - exports의 기본값은 비어 있으며, 여기에서는 사칙연산을 하는 각 함수를 객체 타입으로 저장했다.
            - sample-package를 설치한 프로젝트에서는 require('sample-pacakage')로 module.exports 안에 있는 값을 가져올 수 있다.<br><br>
        - sample-package 임포트 테스트
            ```js
            const calc = require("sample-package"); // sample-package 불러오기

            const a = 17;
            const b = 3;

            console.log("a + b = ", calc.add(a, b)); // 더하기
            console.log("a - b = ", calc.sub(a, b)); // 빼기
            console.log("a * b = ", calc.mul(a, b)); // 곱하기
            console.log("a / b = ", calc.div(a, b)); // 나누기
            ```
            - require() 함수를 사용해 sample-package를 불러와서 calc 변수에 담는다.
            - sample-package에서 가져온 사칙연산 함수들을 각각 실행해보고 로그를 출력한다.
                - 출력 결과를 보면, sample-package/index.js의 console.log로 작성한 문자열이 출력되는 것을 확인할 수 있다.
                - 즉, 모듈을 가져올 때, 파일을 읽는다는 것이다.
            - npm login과 npm publish 명령을 사용하면, 본인이 만든 패키지를 npm 레지스트리에 배포할 수 있다.

## 4. 패키지 설치, 업데이트, 삭제
1. 패키지 설치
    - npm install 명령으로 패키지를 설치할 수 있다.
        - npm i, npm add를 사용할 수도 있다.<br><br>
2. 패키지 업데이트
    - npm update [-g] [패키지명1, 패키지명2 ... 패키지명N] 명령으로 패키지를 업데이트할 수 있다.
        - npm up, npm upgrade를 사용할 수도 있다.
        - -g 옵션은 install과 마찬가지로 node가 설치되어 있는 디렉터리의 의존성 패키지를 업데이트할 때 사용한다.<br><br>
3. 설치된 패키지 확인
    - npm ls, npm list, npm la, npm ll 명령으로 현재 설치된 패키지를 확인할 수 있다.<br><br>
4. 패키지 삭제
    - npm uninstall 명령으로 패키지를 삭제할 수 있다.
        - npm remove, npm rm, npm r, npm un, npm unlink를 사용할 수도 있다.

## 5. 스크립트 기능과 NPX
1. 스크립트 기능
    - npm은 명령어를 지정해 실행하는 스크립트 기능도 제공하며, 기능은 다음과 같다.
        - 앱 시작(start)
        - 중지(stop)
        - 빌드(build)
        - 배포(deploy)
        - 테스트(test)
    - 위 외에도 다양한 기능을 제공하며, 명령어를 터미널에 매번 입력하지 않고 package.json에 정의함으로써 조금 더 간편하게 명령어를 실행할 수 있다.
    - 보통 스크립트는 [node_modules] 디렉터리 아래에 설치된 패키지에 있기 때문에 경로를 지정해야 하지만, npx를 이용하면 경로를 지정하지 않고 간편하게 사용할 수 있다.<br><br>
2. NPX로 코드 포매팅 명령어 prettier 실행하기
    - NPX는 Node Package eXecute의 약자이며, Node 패키지 실행자(Node Package Runner)라고도 한다.
    - Node.js 패키지는 대부분 프로젝트에 임포트해서 사용하지만 개발할 때는 프로젝트 실행, 관리, 테스트 등에 명령형 패키지를 다수 사용한다.
    - 대표적으로 prettier, eslint, jest 값은 포매팅, 문법 검사, 단위 테스트 도구들이 있다.
    - 이런 패키지들을 실행하려면 node_modules/.bin/[패키지명] 경로로 명령어를 실행해야 한다.
    - npx를 사용하면 npx[패키지명]처럼 경로를 생략해 실행할 수 있다.

## 6. 패키지 잠금