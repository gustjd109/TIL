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
                <br><br>

6. 콜백 함수 호출 시 그 함수 내부에서의 this
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
        - (3) : addEventListener는 지정한 HTML 엘리먼트에 'click' 이벤트가 발생할 때마다 그 이벤트 정보를 콜백 함수의 첫 번째 인자로 삼아 실행하라는 명렁
            - 버튼 클릭 시 앞서 지정한 에릴먼트와 크릭 이벤트에 관한 정보가 담긴 객체가 출력<br><br>

7. 생성자 함수 내부에서의 this
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
        <br><br>

## 2. 명시적으로 this를 바인딩하는 방법
1. call 메서드
    - call 메서드 기본 형식
        ```javascript
        Function.prototype.call(thisArg[, arg1[, arg2[, ...]]])
        ```
    - 메서드의 호출 주체인 함수를 즉시 실행하도록 하는 명령으로 임의의 객체를 this로 지정 가능
        - 첫 번째 인자 : this로 바인딩
        - 이후의 인자들 : 호출할 함수의 매개변수
    - call 메서드 예제 1
        ```javascript
        var func = function (a, b, c) {
            console.log(this, a, b, c);
        };

        func(1, 2, 3);                // Window{ ... } 1 2 3
        func.call({ x: 1 }, 4, 5, 6); // { x: 1 } 4 5 6
        ```
    - call 메서드 예제 2
        ```javascript
        var obj = {
            a: 1,
            method: function (x, y) {
                console.log(this.a, x, y);
            }
        };

        obj.method(2, 3);                // 1 2 3
        obj.method.call({ a: 4 }, 5, 6); // 4 5 6
        ```
        <br><br>

2. apply 메서드
    - apply 메서드 기본 형식
        ```javascript
        Function.prototype.apply(thisArg[, argsArray])
        ```
    - call 메서드와 기능적으로 동일하지만, 두 번째 인자를 배열로 받아 그 배열의 요소들을 호출할 함수의 매개변수로 지정
    - apply 메서드 예제
        ```javascript
        var func = function (a, b, c) {
            console.log(this, a, b, c);     // { x: 1 } 4 5 6
        };
        func.apply({x: 1}, [4, 5, 6]);

        var obj = {
            a: 1,
            method: function (x, y) {
                console.log(this.a, x, y);
            }
        };
        obj.method.apply({ a: 4 }, [5, 6]); // 4 5 6
        ```
        <br><br>

3. call / apply 메서드의 활용
    - 유사배열객체(array-like object)에 배열 메서드를 적용
        - 객체에는 배열 메서드를 직접 적용할 수 없음
        - 키가 0 또는 양의 정수인 프로퍼티가 존재하고 length 프로퍼티의 값이 0 또는 양의 정수인 객체, 즉 배열의 구조와 유사한 객체의 경우(유사배열객체) call 또는 apply 메서드를 이용해 배열 메서드를 차용할 수 있음
        - call/apply 메서드의 활용(유사배열객체에 배열 메서드를 적용)
            ```javascript
            var obj = {
                0: 'a',
                1: 'b',
                2: 'c',
                length: 3
            };
            Array.prototype.push.call(obj, 'd');
            console.log(obj); // {0: 'a', 1: 'b', 2: 'c', 3: 'd', length: 4 }

            var arr = Array.prototype.slice.call(obj);
            console.log(arr); // [ 'a', 'b', 'c', 'd' ]
            ```
            - 7번째 줄 : 배열 메서드인 push를 객체 obj에 적용해 프로퍼티 3에 'd'를 추가
            - 9번째 줄 : slice 메서드를 적용해 객체를 배열로 전환
                - slice 메서드 : 시작 인덱스값과 마지막 인덱스값을 받아 시작값부터 마지막값의 앞부분까지의 배열 요소를 추출하는 메서드
                    - 매개변수를 아무것도 넘기지 않으면, 원본 배열의 얕은 복사본을 반환
        - call/apply 메서드의 활용(arguments, NodeList에 배열 메서드를 적용)
            ```javascript
            function a () {
                var argv = Array.prototype.slice.call(arguments);
                argv.forEach(function (arg) {
                    console.log(arg);
                });
            }
            a(1, 2, 3);

            document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>';
            var nodeList = document.querySelectorAll('div');
            var nodeArr = Array.prototype.slice.call(nodeList);
            nodeArr.forEach(function (node) {
                console.log(node);
            });
            ```
            - 함수 내부에서 접근할 수 있는 argument 객체도 유사배열객체이므로 위의 방법으로 배열로 전환하여 활용 가능
                - querySelectorAll, getElementByClassName 등의 Node 선택자로 선택한 결과인 NodeList도 마찬가지
        - call/apply 메서드의 활용(문자열에 배열 메서드 적용)
            ```javascript
            var str = 'abc def';

            Array.prototype.push.call(str, ', pushed string');
            // Error: Cannot assign to read only property 'length' of object [object String]

            Array.prototype.concat.call(str, 'string'); // [String {"abc def"}, "string"]

            Array.prototype.every.call(str, function(char) { return char !== ' '; }); // false

            Array.prototype.some.call(str, function(char) { return char === ' '; }) // true

            var newArr = Array.prototype.map.call(str, function(char) { return char + '!'; });
            console.log(newArr); // ['a!', 'b!', 'c!', 'v!', 'd!', 'e!', 'f!']

            var newStr = Array.prototype.reduce.apply(str, [
                function(string, char, i) { return string + char + i; },
                ''
            ]);
            console.log(newStr); // "a0b1c2 3d4e5f6"
            ```
            - 배열처럼 인덱스와 length 프로퍼티를 지닌 문자열도 가능
            - 문자열의 length 프로퍼티는 읽기 전용이므로 원본 문자열에 변경을 가하는 메서드(push, pop, shift, unshift, splice 등)은 에러 발생
            - concat 처럼 대상이 반드시 배열이어야하는 경우에는 에러가 나지 않지만, 제대로된 결과를 얻기 힘듦
                - concat : 기존의 배열에서 또 다은 배열이나 값을 합치고 새로운 배열을 만드는 메서드
        - call/apply 메서드의 활용(ES6의 Array.from 메서드)
            ```javascript
            var obj = {
                0: 'a',
                1: 'b',
                2: 'c',
                length: 3
            };
            var arr = Array.from(obj);
            console.log(arr); // ['a', 'b', 'c']
            ```
            - ES6에서는 유사배열객체 또는 순회 가능한 모든 종류의 데이터 타입을 배열로 전환하는 Array.from 메서드를 새로 도입
    - 생성자 내부에서 다른 생성자 호출
        - 생성자 내부에 다른 생성자와 공통된 내용이 있을 경우 call 또는 apply를 이용해 다른 생성자를 호출하여 반복을 줄일 수 있음
        - call/apply 메서드의 활용(생성자 내부에서 다른 생성자를 호출)
            ```javascript
            function Person(name, gender) {
                this.name = name;
                this.gender = gender;
            }
            function Student(name, gender, school) {
                Person.call(this, name, gender);
                this.school = school;
            }
            function Employee(name, gender, company) {
                Person.apply(this, [name, gender]);
                this.company = company;
            }
            var by = new Student('보영', 'female', '단국대');
            var jn = new Employee('재난', 'male', '구골');
            ```
    - 여러 인수를 묶어 하나의 배열로 전달하고 싶을 때 - apply 사용
        - call/apply 메서드의 활용(최대/최솟값을 구하는 코드를 직접 구현)
            ```javascript
            var number = [10, 20, 3, 16, 45];
            var max = min = numbers[0];
            numbers.forEach(function(number) {
                if (number > max) {
                    max = number;
                }
                if (number < min) {
                    min = number;
                }
            });
            console.log(max, min); // 45 3
            ```
            - apply를 사용하지 않으면 코드가 불필요하게 길고 가독성이 떨어짐
        - call/apply 메서드의 활용(여러 인수를 받는 메서드(Math.max/Math.min)에 apply를 적용)
            ```javascript
            var numbers = [10, 20, 3, 16, 45];
            var max = Math.max.apply(null, numbers);
            var min = Math.min.apply(null, numbers);
            console.log(max, min); // 45 3
            ```
            - Math.max/Math.min 메서드에 apply를 적용하면 훨씬 더 간단해짐
        - call/apply 메서드의 활용(ES6의 펼치기 연산자 활용)
            ```javascript
            const numbers = [10, 20, 3, 16, 45];
            const max = Math.max(...numbers);
            const min = Math.min(...numbers);
            console.log(max, min); // 45 3
            ```
            - ES6에서는 펼치기 연산자를 이용하면 appy를 사용하는 것보다 더 간단하게 작성할 수 있음
    - call/apply 메서드의 단점
        - 명서적으로 별도의 this를 바인딩하면서 함수 또는 메서드를 실행하는 훌륭한 방법이지만, 오히려 this를 예측하기 어렵게 만들어 코드 해석을 방해
        - 그럼에도 불구하고 ES5 이하의 환경에서는 마땅한 대안이 없어 실무에서 매우 광법위하게 활용<br><br>

4. bind 메서드
    - bind 메서드
        - bind 기본 형식
            ```javascript
            Function.prototype.bind(thisArg[, arg1[, arg2[, ...]]])
            ```
        - bind 메서드란
            - ES5에서 추가된 기능으로, call과 비슷하지만 즉시 호출하지 않고 넘겨받은 this 및 인수들을 바탕으로 새로운 함수를 반환하는 메서드
            - 다시 새로운 함수를 호출할 때 인수를 넘기면 그 인수들은 기존 bind 메서드를 호출할 때 전달했던 인수들의 뒤에 이어서 등록
            - 함수에 this를 미리 적용하는 것과 부분 적용 함수를 구현하는 것이 목적
        - bind 메서드(this 지정과 부분 적용 함수 구현)
            ```javascript
            var func = function (a, b, c, d) {
                console.log(this, a, b, c, d);
            };
            func(1, 2, 3, 4); // Window{ ... } 1 2 3 4

            var bindFunc1 = func.bind({ x: 1 });
            bindFunc1(5, 6, 7, 8); // // { x: 1 } 5 6 7 8

            var bindFunc2 = func.bind({ x: 1 }, 4, 5);
            bindFunc2(6, 7); // { x: 1 } 4 5 6 7
            bindFunc2(8, 9); // { x: 1 } 4 5 8 9
            ```
    - name 프로퍼티
        - bind 메서드를 적용해서 새로 만든 함수의 한 가지 독특한 성질
            - name 프로퍼티에 동사 bind의 수동태인 bound라는 접두사가 붙음
            - 어떤 함수의 name 프로퍼티가 'bound xxx'라면, 함수명이 xxx인 함수에 bind 메서드를 적용한 새로운 함수라는 의미
            - 즉, call/apply 메서드보다 코드 추적이 수월해짐
        - bind 메서드(name 프로퍼티)
            ```javascript
            var func = function (a, b, c, d) {
                console.log(this, a, b, c, d);
            };
            var bindFunc = func.bind({ x: 1 }, 4, 5);
            console.log(func.name);     // func
            console.log(bindFunc.name); // bound func
            ```
    - 상위 컨텍스트의 this를 내부함수나 콜백 함수에 전달하기
        - self 등의 변수를 활용한 우회법보다 call/apply/bind 메서드를 이용하면 더 깔끔하게 처리 가능
            - 내부함수에 this 전달(call vs bind)
                ```javascript
                var obj = {
                    outer: function () {
                        console.log(this);
                        var innerFunc = function () {
                            console.log(this);
                        };
                        innerFunc.call(this);
                    }
                };
                obj.outer();

                var obj = {
                    outer: function () {
                        console.log(this);
                        var innerFunc = function () {
                            console.log(this);
                        }.bind(this);
                        innerFunc.();
                    }
                };
                obj.outer();
                ```
        - 콜백 함수를 인자로 받는 함수나 메서드 중에서 기본적으로 콜백 함수 내에서의 this에 관여하는 함수 또는 메서드에 대해서도 bind 메서드를 이용하면 this 값 변경이 수월
            - bind 메서드(내부함수에 this 전달)
                ```javascript
                var obj = {
                    logThis: function () {
                        console.log(this);
                    },
                    logThisLater1: function () {
                        setTimeout(this.logThis, 500);
                    },
                    logThisLater2: function () {
                        setTimeout(this.logThis.bind(this), 1000);
                    }
                };
                obj.logThisLater1(); // Window { ... }
                obj.logThisLater2(); // obj { logThis: f, ... }
                ```
                <br><br>

5. 화살표 함수의 예외상황
    - ES6에 새롭게 도입된 화살표 함수는 실행 컨텍스트 생성시 this를 바인딩하는 과정이 제외되어 내부에는 this가 아예 없으며, 접근하고자 하면 스코프체인상 가장 가까운 this에 접근
    - 화살표 함수 내부에서의 this
        ```javascript
        var obj = {
            outer: function () {
                console.log(this);
                var innerFunc = () => {
                    console.log(this);
                };
                innerFunc();
            }
        };
        obj.outer();
        ```
        - 별도의 변수로 this를 우회하거나 call/apply/bind를 적용할 필요가 없음<br><br>

6. 별도의 인자로 this를 받는 경우(콜백 함수 내에서의 this)
    - 콜백 함수를 인자로 받는 메서드 중 일부는 추가로 this로 지정할 객체(thisArg)를 인자로 지정할 수 있는 경우가 있음
        - 이러한 메서드의 thisArg 값을 지정하면 콜백 함수 내부에서 this 값을 원하는 대로 변경 가능
        - 이런 형태는 여러 내부 요소에 대해 같은 동작을 반복 수행해야 하는 배열 메서드에 많이 포진돼 있으며, 같은 이유로 ES6에서 새로 등장한 Set, Map, forEach 등의 메서드에도 일부 존재
    - thisArg를 받는 경우 예시(forEach 메서드)
        ```javascript
        var report = {
            sum: 0,
            count: 0,
            add: function () {
                var args = Array.prototype.slice.call(arguments);
                args.forEach(function (entry) {
                    this.sum += entry;
                    ++this.count;
                }, this);
            },
            average: function () {
                return this.sum / this.count;
            }
        };
        report.add(60, 85, 95);
        console.log(report.sum, report.count, report.average());
        ```
    - 콜백 함수와 함께 thisArg를 인자로 받는 메서드
        ```javascript
        Array.prototype.forEach(callback[, thisArg])
        Array.prototype.map(callback[, thisArg])
        Array.prototype.filter(callback[, thisArg])
        Array.prototype.some(callback[, thisArg])
        Array.prototype.every(callback[, thisArg])
        Array.prototype.find(callback[, thisArg])
        Array.prototype.findIndex(callback[, thisArg])
        Array.prototype.flatMap(callback[, thisArg])
        Array.prototype.from(arrayLike[, callback[, thisArg]])
        Set.prototype.forEach(callback[, thisArg])
        Map.prototype.forEach(callback[, thisArg])
        ```