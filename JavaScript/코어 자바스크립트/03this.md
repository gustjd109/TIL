# 03 this

## 1. 상황에 따라 달라지는 this
1. 자바스크립트에서의 this
    - 실행 컨텍스트가 생성될 때 함께 결정
        - 실행 컨텍스트는 함수를 호출할 때 생성되므로, this는 함수를 호출할 때 결정된다고 볼 수 있음<br><br>

2. 전역 공간에서의 this
    - 전역 컨텍스트를 생성하는 주체가 전역 객체이므로, 전역 공간에서의 this는 객체를 가리킴
    - 전역 객체는 자바스크립트 런타임 환경에 따라 다른 이름과 정보를 가짐
        - 브라우저 환경에서의 전역 객체 : window
        - Node.js 환경에서의 전역 객체 : global<br><br>

3. 전역 공간에서만 발생하는 특이한 성질
    - 전역 변수 선언 시 자바스크립트 엔진은 이를 전역 객체의 프로퍼티로 할당
        - 전역변수와 전역객체(1)
            ```javascript
            var a = 1;
            console.log(a);        // 1
            console.log(window.a); // 1
            console.log(this.a);   // 1
            ```
            - 자바스크립트의 모든 변수는 특정 객체의 프로퍼티로서 동작
            - var 연산자를 이용해 변수를 선언하더라도 자바스크립트 엔진은 어떤 특정 객체의 프로퍼티로 인식
                - 특정 객체 : 실행 컨텍스트의 LexicalEnvirnment
        - 전역변수와 전역객체(2)
            ```javascript
            var a = 1;
            window.b = 2;
            console.log(a, window.a, this.a); // 1 1 1
            console.log(b, window.b, this.b); // 2 2 2

            window.a = 3;
            b = 4;
            console.log(a, window.a, this.a); // 3 3 3
            console.log(b, window.b, this.b); // 4 4 4
            ```
            - 전역 공간에서는 var로 변수를 선언하는 대신 window의 프로퍼티에 직접 할당하더라도 'window.'이 생략된 것이므로 var로 선언한 것과 같은 동작을 수행
        - 전역변수와 전역객체(3)
            ```javascript
            var a = 1;
            delete window.a;                  // false
            console.log(a, window.a, this.a); // 1 1 1

            var b = 2;
            delete window.b;                  // false
            console.log(b, window.b, this.b); // 2 2 2

            window.c = 3;
            delete window.c;                  // true
            console.log(c, window.c, this.c); // Uncaught ReferenceError: c is not defined

            window.d = 4;
            delete window.d;                  // true
            console.log(d, window.d, this.d); // Uncaught ReferenceError: d is not defined
            ```
            - 'delete' 명령어 사용 시 전역객체의 프로퍼티로 할당한 경우 삭제되지만, 전역변수로 선언한 경우 삭제되지 않음
                - 전역변수 선언 시, 자바스크립트 엔진이 자동으로 전역객체의 프로퍼티로 할당함과 동시에 프로퍼티의 configurable 속성(변경 및 삭제 가능성)을 false로 정의했기 때문임<br><br>

4. 메서드로서 호출할 때 그 메서드 내부에서의 this
    - 함수 VS 메서드
        - 함수 실행 방법
            - 함수로서 호출하는 경우
            - 메서드로서 호출하는 경우
        - 함수와 메서드의 차이 : 독립성
            - 함수 : 함수 그 자체로 독립적인 기능을 수행
            - 메서드 : 자신을 호출한 대상 객체에 관한 동작을 수행
        - 메서드는 어떤 함수를 객체의 프로퍼티에 할당한다고 해서 그 자체로는 무조건 메서드가 되는 것이 아니라 객체의 메서드로서 호출할 경우에만 메서드로 동작하고, 아니면 함수로 동작
            - 함수로서 호출, 메서드로서 호출
                ```javascript
                var func = function (x) {
                    console.log(this, x);
                };
                func(1);          // Window { ... } 1

                var obj = {
                    method : func
                };
                obj.method(2);    // { method: f } 2
                ```
                - 1번째 줄 : func라는 변수에 익명함수 할당
                - 4번째 줄 : func을 호출 → this로 전역객체 Window 출력
                - 6번째 줄 : obj라는 변수에 객체 할당하고, 그 객체의 method 프로퍼티에 앞에서 만든 func 함수 할당
                - 9번째 줄 : obj의 method 호출 → this로 obj 출력
                    - obj의 method 프로퍼티에 할당한 값과 func 변수에 할당한 값은 모두 1번째 줄에서 선언한 함수를 참조
        - '함수로서 호출'과 '메서드로서 호출' 구분 방법
            - 점 표기법 : 함수 앞에 '.'이 있는지 여부로 구분
            - 대괄호 표기법
            - 메서드로서 호출(점 표기법, 대괄호 표기법)
                ```javascript
                var obj = {
                    method: finction (x) { console.log(thos,x); }
                };
                obj.method(1);    // { method: f } 1
                obj['method'](2); // { method: f } 2
                ```
    - 메서드 내부에서의 this
        - 메서드 내부에서의 this에는 호출한 주체에 대한 정보가 저장
        - 어떤 함수를 메서드로서 호출하는 경우, 호출 주체는 함수명(프로퍼티명) 앞의 객체
        - 점 표기법의 경우 마지막 점 앞에 명시된 객체가 곧 this
        - 메서드 내부에서의 this
            ```javascript
            var obj = {
                methodA: function () { console.log(this); },
                inner: {
                    methodB: function () { console.log(this); }
                }
            };
            obj.methodA();             // { methodA:f, inner: { ... } } ( === obj )
            obj['methodA']();          // { methodA:f, inner: { ... } } ( === obj )

            obj.inner.methodB();       // { methodB: f } ( === obj.inner )
            obj.inner['methodB']();    // { methodB: f } ( === obj.inner )
            obj['inner'].methodB();    // { methodB: f } ( === obj.inner )
            obj['inner']['methodB'](); // { methodB: f } ( === obj.inner )
            ```
            <br><br>

5. 함수로서 호출할 때 그 함수 내부에서의 this
    - 함수 내부에서의 this
        - 어떤 함수를 함수로서 호출할 경우 호출 주체를 명시하지 않고, 실행한 것이므로 호출 주체의 정보를 알 수 없기 때문에 this가 지정되지 않고 전역객체를 가리킴
            - 이를 명백한 설계상의 오류라고 지적
    - 메서드의 내부함수에서의 this
        - 함수로서 호출했는지 메서드로 호출했는지만 파악하면 this의 값을 정확히 맞출 수 있음
        - 내부함수에서의 this
            ```javascript
            var obj1 = {
                outer: function () {
                    console.log(this);            // (1)
                    var innerFunc = function () {
                        console.log(this);        // (2) (3)
                    }
                    innerFunc();

                    var obj2 = {
                        innerMethod: innerFunc
                    };
                    obj2.innerMethod();
                }
            };
            obj1.outer();
            ```
            - 1번째 줄 : 객체를 생성하고 변수 obj1에 할당하는데, 객체 내부에는 outer라는 프로퍼티가 있으며, 익명함수가 연결
            - 15번째 줄 : obj1.outer 호출
            - 2번째 줄 : obj1.outer 함수의 실행 컨텍스트 생성 및 호이스팅하고, 스코프 체인 정보를 수집하여 this를 바인딩
                - 이 함수는 메서드로서 호출한 것이므로 this에는 마지막 점 앞의 객체인 obj1이 바인딩
            - 3번째 줄 : obj1 객체 정보 출력
            - 4번째 줄 : 호이스팅된 변수 innerFunc는 outer 스코프 내에서만 접근할 수 있는 지역변수이므로, 이 지역변수에 익명 함수 할당
            - 7번째 줄 : innerFunc 호출
            - 4번째 줄 : innerFunc 함수의 실행 컨텍스트가 생성되면서 호이스팅, 스코프 체인 수집, this 바인딩 등을 수행
                - 이 함수는 함수로서 호출한 것이므로 this가 지정되지 않고, 자동으로 스코프 체인상의 최상위 객체인 전역객체(Window)가 바인딩
            - 5번째 줄 : Window 객체 정보 출력
            - 9번째 줄 : 호이스팅된 변수 obj2도 outer 스코프 내에서만 접근할 수 있는 지역변수이므로 객체 할당
                - 할당된 객체에는 innerMethod라는 프로퍼티가 있으며, 앞서 정의된 변수 innerFunc와 연결된 익명 함수가 연결
            - 12번째 줄 : obj2.innerMethod 호출
            - 9번째 줄 : obj2.innerMethod 함수의 실행 컨텍스트가 생성
                - 이 함수는 메서드로서 호출한 것으로, this에는 마지막 점 앞의 객체인 obj2가 바인딩
            - 10번째 줄 : obj2 객체 정보 출력
    - 메서드 내부 함수에서의 this를 우회하는 방법
        - ES5까지 내부 함수에 this를 상속할 수 있는 방법이 없어 우회하는 방법을 사용
        - 변수를 활용한 우회 방법
            ```javascript
            var obj = {
                outer: function () {
                    console.log(this);             // (1) { outer: f }
                    var innerFunc1 = function () {
                        console.log(this);         // (2) Window { ... }
                    }
                    innerFunc1();

                    var self = this;
                    var innerFunc2 = function () {
                        console.log(self);         // (3) { outer: f }
                    };
                    innerFunc2();
                }
            };
            obj.outer();
            ```
            - 상위 스코프의 this를 저장하여 내부 함수에서 활용하는 방법으로 self라는 변수명을 가장 많이 사용
    - this를 바인딩하지 않는 함수
        - ES6에서는 함수 내부에서 this가 전역객체를 바라보는 문제를 해겨하기 위해 this를 바인딩하지 않는 화살표 함수(Arrow Function)를 새로 도입
        - 화살표 함수 : 실행 컨텍스트를 생성할 때 this 바인딩 과정이 없어, 상위 스코프의 this를 그대로 활용 가능
            - this를 바인딩하지 않는 함수(화살표 함수)
                ```javascript
                var obj = {
                    outer: function () {
                        console.log(this);      // (1) { outer: f }
                        var innerFunc = () => {
                            console.log(this);  // (2) { outer: f }
                        };
                        innerFunc();
                    }
                };
                obj.outer();
                ```
    - 콜백 함수 호출 시 그 함수 내부에서의 this
        - 콜백 함수 : 함수 A의 제어권을 다른 함수(또는 메서드) B에게 넘겨주는 겅우의 함수 A
            - 함수 A는 함수 B의 내부 로직에 따라 실행되며, this 역시 함수 B 내부 로직에서 정한 규칙에 따라 값이 결정
            - this가 전역객체를 참조하지만, 제어권을 받은 함수에서 콜백 함수에 별도로 this가 된 대상을 지정한 경우 그 대상을 참조
        - 콜백 함수 내부에서의 this
            ```javascript
            setTimeout(function () { console.log(this); }, 300);                       // (1)

            [1, 2, 3, 4, 5].forEach(function (x) {                                     // (2)
                console.log(this, x);
            });

            document.body.innerHTML += '<button id="a">클릭</button>';
            document.body.querySelector('#a').addEventListener('click', function (e) { // (3)
                console.log(this, e);
            });
            ```
            - (1) : setTimer 함수는 300ms 만큼 시간 지연을 한 뒤 콜백 함수를 실행하라는 명령
                - 0.3초 뒤 전역객체가 출력
            - (2) : forEach 메서드는 배열의 각 요소를 앞에서부터 하나씩 꺼내어 그 값을 콜백 함수의 첫 번째 인자로 삼아 함수를 실행하라는 명령
                - 전역객체와 배역의 각 요소가 5회 출력
            - (3) : addEventListener는 지정한 HTML 엘리먼트에 'click' 이벤트가 발생할 때마다 그 이벤트 정보를ㄹ 콜백 함수의 첫 번째 인자로 삼아 실행하라는 명렁
                - 버튼 클릭 시 앞서 지정한 에릴먼트와 크릭 이벤트에 관한 정보가 담긴 객체가 출력
    - 생성자 함수 내부에서의 this
        - 생성자 함수 : 어떤 공통된 성질을 지니는 객체들을 생성하는 데 사용하는 함수
        - 객체지향에서의 생성자와 객체
            - 생성자 : 클래스(Class) = 구체적인 인스턴스를 만들기 위한 일종의 틀
            - 클래스를 통해 만든 객체 : 인스턴스(Instance)
        - 자바스크립트는 함수에 생성자로서의 역할을 함께 부여함
        - new 명령어와 함께 함수를 호출하면 해당 함수가 생성자로서 동작
        - 어떤 함수가 생성자 함수로서 호출된 경우 내부에서의 this는 곧 새로 만들 구체적인 인스턴스 자신이 됨
        - 인스턴스 생성 과정
            - 생성자 함수 호출
            - 생성자의 prototype 프로퍼티를 참조하는 __proto__라는 프로퍼티가 있는 객체(인스턴스) 생성
            - 미리 준비된 공통 속성 및 개성을 생성된 객체(this)에 부여
        - 생성자 함수
            ```javascript
            var Cat = function (name, age) {
                this.bark = '야옹';
                this.name = name;
                this.age = age;
            };
            var choco = new Cat('초코', 7);
            var nabi = new Cat('나비', 5);
            console.log(choco, nabi);

            /* 결과
            Cat { bark: '야옹', name: '초코', age: 7 }
            Cat { bark: '야옹', name: '나비', age: 5 }
            */
            ```