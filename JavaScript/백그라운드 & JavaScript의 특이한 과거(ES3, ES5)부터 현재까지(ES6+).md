# 백그라운드 & JavaScript의 특이한 과거(ES3, ES5, ES6+)

## 1. ES5 VS ES6
1. ES란?
    - ES는 ECMAScript를 의미한다.
    - ECMAScript는 자바스크립트를 뒷받침하는 언어이다.<br><br>
2. ES5
    - ES5 및 이전 버전에는 변수를 생성하는 데에 var 키워드만 있고, let과 const는 없었다.<br><br>
3. ES6
    - 더 깔끔하고 더 나은 더 빠른 코드를 작성할 수 있게 해주며, 처선의 해결책 및 임시적인 방법들을 줄여 준다.

## 2. var VS let VS const
1. var
    - 자바스크립트가 존재했을 때부터 이런 방식으로 변수를 생성했다.
    - 함수, 전역 스코프에서 변수를 생성할 수 있었다.
    - 변수를 한 번 선언 및 초기화한 후에 또 다른 값으로 초기화가 가능하다.
    - 만약, 변수명 앞에 var, let, const를 입력하지 않으면, 자바스크립트의 관대한 특징 때문에 숨겨져 있지만 자동으로 var가 들어가 있어 변수 선언 및 초기화가 가능하다.<br><br>
2. let
    - ES6 버전부터 사용 가능했다.
    - 브라우저가 채택하면서 사용 가능했다.
    - 함수 및 전역 스코프를 사용하지 않지만, 많은 경우에 블록 스코프라는 개념을 사용하는 것처럼 동작한다.<br><br>
3. const
    - ES6 버전부터 사용 가능했다.
    - 브라우저가 채택하면서 사용 가능했다.
    - 함수 및 전역 스코프를 사용하지 않지만, 많은 경우에 블록 스코프라는 개념을 사용하는 것처럼 동작한다.

## 3. Hoisting
1. Hoisting이란?
    - 자바스크립트 엔진과 브라우저에서 스크립트를 로드할 때 전체 스크립트를 확인해서 함수를 찾은 뒤 자동으로 로드하고 등록해서 실제 사용하는 코드 아래에 함수를 작성하도록 하는 것이다.

## 4. 엄격 모드
1. 엄격 모드란?
    - 자바스크립트 상에서 관대한 동작을 비활성화 하기 위해 엄격 모드를 활성화 할 수 있다.
    - ES5부터 도입되었으며, 배제 가능한 몇 가지 기능이 있다.
    - 안전을 보장하고 싶다면, 파일의 시작 부분이나 활성화하려는 함수의 시작 부분에 "use strict";라는 문자열을 추가해서 파일에서 활성화 하거나 함수에서 활성화 할 수 있다.

## 5. 브라우저가 코드가 구문 분석되고, 컴파일링되는 과정
1. 브라우저가 코드로 어떤 작업을 실행하는가?
    - 작성한 코드를 HTML 파일에 임포트한다면?
        - 브라우저가 해당 HTML 파일을 읽는 작업을 수행한다.
        - 스크립트를 감지하며 임포트한다.
        - 브라우저가 스크립트를 HTML 혹은 HTML로 작성된 인라인 스크립트를 실행한다.
            - 스크립트를 실행한다는 것은 사용하는 브라우저와 엔진에 따라 다르지만, 코드 분석(Parsing)과 코드를 실행하는 작업을 의미한다.
                - 브라우저가 자바스크립트 코드를 읽어 들여서 로딩하는 작업이며, 코드가 영향력을 발휘하는 단계이다.
                - 이때, 브라우저가 자바스크립트 엔진을 이용하며 크롬 브라우저의 V8 엔진은 인터브리터와 컴파일러(JiT 컴파일러)를 이용하여 스크립트를 분석한다.
                - 인터프리터는 스크립트를 로드하고, 읽어 들여서 이를 실행하기에 좀 더 쉬운 바이트 코드로 변환한 다음 스크립트를 실행시켜 컴파일러로 전달한다.
                - 크롬에서의 컴파일러는 TurboFan이라는 것으로, 인터프리터로부터 전달 받은 스클비트를 머신 코드로 변환한다.
                - 변환된 머신 코드는 컴퓨터로 전달되어서 실행 단계로 접어든다.<br><br>
            - 자바스크립트 엔진, 즉 브라우저는 실행 및 컴파일링 시간을 단축하기 위한 몇 가지 최적화 기술을 적용한다.
                - 예를 들어, 이전 실행화 현재 실행 시 달라진 부분이 없는 코드의 경우에는 재컴파일링하지 않고 컴파일된 코드를 다시 사용한다.<br><br>
    - 브라우저에서 지원하는 중요한 기능
        - API와 같이 자바스크립트 코드에서 사용할 수 있는 비트인 기능을 지원한다.

## 6. 가비지 컬렉션
1. 자바스크립트에서의 메모리 관리
    - 자바스크립트는 도달 가능성(reachability)라는 개념을 사용해 메모리 관리를 수행한다.
        - 도달 가능성이란 어떻게든 접근하거나 사용할 수 있는 값을 의미한다.
        - 도달 가능한 값은 메모리에서 삭제되지 않는다.
        - 도달 가능한 값의 예
            - 현재 함수의 지역 변수와 매개변수
            - 중첩 함수의 체인에 있는 함수에서 사용되는 변수와 매개변수
            - 전역 변수 등
            - 위의 값들을 루트(roo)라고 부른다.<br><br>
    - 자바스크립트 엔진 내에선 가비지 컬렉터가 끊임없이 동작한다.
        - 가비지 컬렉터란 사용되지 않는 객체(참조되지 않은 객체)에 대한 힙 메모리를 주기적으로 확인하여 사용되지 않은 객체를 메모리에서 제거하는 역할을 수행한다.