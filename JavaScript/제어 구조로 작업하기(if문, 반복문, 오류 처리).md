# If문, 반복문, 오류 처리

## 1. 비교 연산자
1. === VS !==
    - === : 값과 자료형이 일치하는지 확인하는 비교 연산자
    - !== : 값과 자료형이 일치하지 않는지 확인하는 비교 연산자
    - 자바스크립트에서는 ==와 !=인 이중 등호 연산자보다 삼중 등호 연산자인 ===와 !==를 더 선호한다.

## 2. 반복문
1. for 문
    ```javascript
    for (let i = 0; i < 3; i++) {
        console.log(i);
    }
    ```
2. for-of 문
    - 배열의 모든 요소에 대해 실행된다.
    - 배열의 모든 요소에 대해 코드를 실행할 수 있도록 해주는 것이다.
    ```javascript
    for (const el of arry) {
        console.log(el);
    }
    ```
3. for-in 문
    - 객체의 모든 키에 대해 코드를 실행하도록 해주는 것이다.
    ```javascript
    for (const key in obj) {
        console.log(key);
        console.log(obj[key]);
    }
    ```
4. while 문
    ```javascript
    while (isLoggedIn) {
        . . .
    }
    ```

## 3. 레이블 구문
1. 레이블 구문이란?
    ```javascript
    let j = 0;
    outerwhile: do {
        console.log('Outer', j);
        innerFor: for (let k = 0; k < 5; k++) {
            if (k === 3) {
                break outerwhile;
            }
            console.log('Inner', k);
        }
        j++;
    }
    ```
    - 반복문에 이름을 할당하는 것이다.
    - 어떤 반복문에서도 작동하며, 어떤 표현식에서도 이름을 할당할 수 있다.
    - 반복문에 이름을 할당하여 제어할 수 있다.
    - 자바스크립트를 사용하면서 필요한 경우는 거의 없는 기능이다.

## 4. try-catch
1. try-catch란?
    ```javascript
    function getMaxLifeValues() {
        const enteredValue = prompt('Maximum life for you and the monster.', '100');

        const parsedValue = parseInt(enteredValue);
        if (isNaN(parsedValue) || parsedValue <= 0) {
            throw { message: 'Invalid user input, not a number!' };
        }
        return parsedValue;
    }
    ```
    - 자바스크립트가 제공하는 또 다른 제어 구조이다.
    - 실패할 수도 있는 어떤 코드를 시도하고, 그 코드 안에서 발생할 수 있는 잠재적인 오류를 받아서 오류가 발생했다는 것을 나타내기 위해 어떤 작업을 할 수 있도록 해주는 기능이다.<br><br>
2. try-catch 랩핑
    ```javascript
    try {
    chosenMaxLife = getMaxLifeValues();
    } catch (error) {
    console.log(error);
    chosenMaxLife = 100;
    alert('You entered something wrong, default value of 100 was used.');
    // throw error;
    }
    ```
    - 코드를 실행하는 try 블록을 만든다.
    - catch 블록을 추가하여 괄호를 열어서, 괄호 내에는 매개변수를 넣는다.
    - 이때, 매개변수는 보통 error라고 지정한다.
    - 함수처럼 중괄호를 치고, 중괄호 내부에는 catch에 의해 잡힌 오류를 사용할 수 있다.
    - 이는 자바스크립트에 의해 함수처럼 호출되며, error는 발생한 오류에 해당한다.
    - 폴백 로직을 추가하여 오류가 발생했을 때 실행하는 코드를 작성한다.

## 5. try-finally
1. try-finally란?
    - finally의 내부 코드는 오류가 있든 없든 항상 실행된다.
    - try catch 블록에 또 다른 오류가 발생한 경우 finally를 사용해서 클린업 작업을 할 수 있다.