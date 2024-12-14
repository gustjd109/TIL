# 람다(Lambda) 함수

## 1. 람다 함수란?
1. 람다 함수 정의
    - 익명 함수(anonymous function)라고도 부르고, 간단한 한 줄짜리 함수를 정의할 때 사용
    - def 키워드를 사용하는 일반 함수와 달리 lambda 키워드를 사용하여 정의
    - 주로 filter(), map(), sorted() 등의 함수와 함께 사용되며, 함수 인자로 전달할 때 사용
    - 간단한 경우에 사용하기 좋지만, 복잡한 로직이나 여러 줄의 코드를 처리하기에는 적합하지 않음<br><br>

2. 람다 함수 구조
    ```python
    lambda arguments: expression
    ```
    - lambda : 람다 함수를 정의하는 키워드
    - arguments : 람다 함수에 전달되는 인자로, 쉼표(,)로 구분하여 여러 인자 전달 가능
    - expression : 인자들을 활용해 계산되는 표현식으로, 표현식의 결과가 람다 함수의 반환 값이 됨

## 2. 람다 함수와 일반 함수의 차이
1. 람다 함수와 일반 함수의 차이점
    - 람다 함수는 이름이 없지만, 일반 함수는 이름이 있음
    - 람다 함수는 표현식 하나만 사용할 수 있으며 복잡한 로직을 구현할 수 없지만, 일반함수는 복잡한 로직을 구현할 수 있음
    - 람다 함수는 간결한 코드 작성에 유용하지만, 일반 함수는 코드의 가독성과 재사용성을 높이는 데 도움이 됨

## 3. 람다 함수 사용 방법
1. 두 수를 더하는 람다 함수
    ```python
    add = lambda x, y: x + y
    result = add(3, 5)
    print(result) # 8
    ```

2. 문자열 길이를 반환하는 람다 함수
    ```python
    length = lambda s: len(s)
    result = length('Hello World!')
    print(result) # 12
    ```

3. map() 함수를 사용하여 리스트의 각 요소에 2를 곱하는 람다 함수
    ```python
    li = [1, 2, 3, 4, 5]
    doubleNums = list(map(lambda x: x * 2, li))
    print(doubleNums) # [2, 4, 6, 8, 10]
    ```

4. filter() 함수를 사용하여 리스트에서 짝수만 필터링하는 람다 함수
    ```python
    li = [1, 2, 3, 4, 5, 6, 7, 8, 9]
    evenNums = list(filter(lambda x: x % 2 == 0, li))
    print(evenNums) # [2, 4, 6, 8]
    ```

5. sorted() 함수를 사용하여 리스트에서 문자열 길이를 기준으로 오름차순 정렬하는 람다 함수
    ```python
    li = ['abc', 'abcdef', 'abcd', 'a', 'abcdefg', 'ab']
    sortedLi = sorted(li, key = lambda x: len(x))
    print(sortedLi) # ['a', 'ab', 'abc', 'abcd', 'abcdef', 'abcdefg']
    ```

6. reduce() 함수를 사용하여 리스트의 모든 요소를 곱하는 람다 함수
    ```python
    from functools import reduce

    li = [1, 2, 3, 4, 5]
    result = reduce(lambda x, y: x * y, li)
    print(result) # 120
    ```