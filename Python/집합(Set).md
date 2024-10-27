# 집합(Set)

## 1. 파이썬에서의 집합이란?
1. 파이썬에서의 집합이란?
    - 고유한 요소의 모음이다.
    - 단일 변수에 여러 항목을 저장하는 것이 목적이다.<br><br>
2. 파이썬의 집합 특징
    - 순서가 없다.
        - 따라서, 인덱스로 접근할 수 없다.
    - 중복은 허용되지 않는다.
    - 요소는 변경 불가능한 자료형만 사용할 수 있다.

## 2. 파이썬에서 집합 만들기
1. set() 함수 사용
    - 집합을 만드는 첫 번째 방법으로 set() 함수를 이용한다.
    - set() 함수는 변경 가능한 자료형(list, dictionary, string 등)을 집합으로 변환할 수 있다.
        ```python
        set_example = set([1, 2, 3, 4, 5])
        print(set_example)
        
        {1, 2, 3, 4, 5}
        ```
2. 집합에 직접 값 할당
    - 변수에 값을 직접 할당하여 집합을 만들 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        print(set_example)
        
        {1, 2, 3, 4, 5}
        ```

## 3. 집합의 요소 접근
1. 집합의 인덱싱
    - 파이썬에서 집합은 순서가 지정되지 않기 때문에 인덱스로 접근할 수 없다.<br><br>
2. 반복문을 이용한 집합 요소 접근
    - 집합의 요소는 반복문을 이용하여 접근할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}

        for i in set_example:
            print(i)

        1
        2
        3
        4
        5
        ```
3. in 연산자를 이용한 요소 확인
    - 집합에 특정 요소가 있는지 in 연산자를 이용하여 확인할 수 있다.
        ```python
        fruits = {'apple', 'banana', 'cherry'}
        print('apple' in fruits)
        print('grape' in fruits)

        True
        False
        ```

## 4. 집합에 요소 추가
1. add() 메서드 사용
    - add() 메서드는 집합에 단일 요소를 추가하는 데 사용할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.add(6)
        print(set_example)

        {1, 2, 3, 4, 5, 6}
        ```
2. update() 메서드 사용
    - update() 메서드는 집합에 여러 요소를 추가하는 데 사용할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.update([6, 7, 8])
        print(set_example)

        {1, 2, 3, 4, 5, 6, 7, 8}
        ```

## 5. 집합에서 요소 제거
1. remove() 메서드 사용
    - remove() 메서드는 집합에서 특정 요소를 제거하는 데 사용할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.remove(5)
        print(set_example)

        {1, 2, 3, 4}
        ```
    - 요소가 집합에 없으면, KeyError가 발생한다.<br><br>
2. discard() 메서드 사용
    - discard() 메서드는 집합에서 특정 요소를 제거하는 데 사용할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.discard(6)
        print(set_example)

        {1, 2, 3, 4, 5}
        ```
    - 요소가 집합에 없으면, KeyError를 발생시키지 않는다.<br><br>
3. pop() 메서드 사용
    - pop() 메서드는 집합에서 임의의 요소를 제거하는 데 사용할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.pop()
        print(set_example)

        {2, 3, 4, 5}
        ```
    - 맨 앞에 있는 요소가 계속해서 제거되기 때문에 순서가 있는 것 처럼 제거된다고 느낄 수 있지만, 집합은 순서가 없기에 임의의 요소가 제거되는 것이라고 말할 수 있다.

## 6. 합집합, 교집합, 차집합, 대칭 차집합
1. 합집합
    - 합집합은 두 집합의 모든 요소를 포함하는 집합이다.
    - union() 메서드 또는 '|' 연산자를 사용하여 합집합을 구할 수 있다.
    - union() 메서드와 '|' 연산자를 이용한 합집합 구하기 예시
        ```python
        set_a = {1, 2, 3, 4, 5}
        set_b = {4, 5, 6, 7, 8}
        set_c = set_a.union(set_b)
        print(set_c)

        {1, 2, 3, 4, 5, 6, 7, 8}


        set_c = set_a | set_b
        print(set_c)

        {1, 2, 3, 4, 5, 6, 7, 8}
        ```
2. 교집합
    - 교집합은 두 집합에 공통인 요소만 포함하는 집합이다.
    - intersection() 메서드 또는 '&' 연산자를 사용하여 교집합을 구할 수 있다.
    - intersection() 메서드와 '&' 연산자를 이용한 교집합 구하기 예시
        ```python
        set_a = {1, 2, 3, 4, 5}
        set_b = {4, 5, 6, 7, 8}
        set_c = set_a.intersection(set_b)
        print(set_c)

        {4, 5}


        set_c = set_a & set_b
        print(set_c)

        {4, 5}
        ```
3. 차집합
    - 차집합은 한 집합에는 있지만 다른 집합에는 없는 요소를 포함하는 집합이다.
    - difference() 메소드 또는 '-' 연산자를 이용하여 차집합을 구할 수 있다.
    - difference() 메소드와 '-' 연산자를 이용한 차집합 구하기 예시
        ```python
        set_a = {1, 2, 3, 4, 5}
        set_b = {4, 5, 6, 7, 8}
        set_c = set_a.difference(set_b)
        print(set_c)

        {1, 2, 3}


        set_c = set_a - set_b
        print(set_c)

        {1, 2, 3}
        ```
4. 대칭 차집합
    - 대칭 차집합은 공통된 요소만 제외하고 모든 요소를 포함하는 집합이다.
    - symmetric_difference() 메서드 또는 '^' 연산자를 이용하여 대칭 차집합을 구할 수 있다.
    - symmetric_difference() 메서드와 '^' 연산자를 이용한 대칭 차집합 구하기 예시
        ```python
        set_a = {1, 2, 3, 4, 5}
        set_b = {4, 5, 6, 7, 8}
        set_c = set_a.symmetric_difference(set_b)
        print(set_c)

        {1, 2, 3, 6, 7, 8}


        set_c = set_a ^ set_b
        print(set_c)

        {1, 2, 3, 6, 7, 8}
        ```

## 7. 집합의 기타 메서드
1. 집합 요소의 수 세기
    - len() 메서드를 이용해 집합의 요소의 수를 찾을 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        print(len(set_example))

        5
        ```
2. 집합 모든 요소 제거
    - clear() 메서드를 이용해 집합에서 모든 요소를 제거할 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_example.clear()
        print(set_example)

        set()
        ```
3. 집합 복사
    - copy() 메서드를 이용해 집합의 얕은 복사본을 만들 수 있다.
        ```python
        set_example = {1, 2, 3, 4, 5}
        set_copy = set_example.copy()
        print(set_copy)

        {1, 2, 3, 4, 5}
        ```

## 8. set() VS frozenset()
- set() 함수는 가변 집합을 생성하고, frozenset() 함수는 불변 집합을 생성한다.
- frozenset() 함수는 불변 집합이기 때문에 add() 메서드로 요소를 추가하려고 하면 AttributeError가 발생한다.
- set() 함수와 frozenset() 함수를 이용하여 가변 집합과 불변 집합을 생성하는 예시
    ```python
    set_example = set([1, 2, 3, 4, 5])
    set_example.add(6)
    print(set_example)

    {1, 2, 3, 4, 5, 6}


    frozenset_example = frozenset([1, 2, 3, 4, 5])
    frozenset_example.add(6)

    AttributeError: 'frozenset' object has no attribute 'add'
    ```

## 9. 얕은 복사(Shallow Copy) VS 깊은 복사(Deep Copy)
1. 얕은 복사
    - 변수의 내용을 복사하지만, 가리키는 객체를 공유하기 때문에 얕은 복사를 통해 복사한 변수의 값을 변경하면 원본 변수에 영향을 미친다.
2. 깊은 복사
    - 변수의 내용을 복사하며, 가리키는 객체도 복사하기 때문에 깊은 복사를 통해 복사한 변수의 값을 변경해도 원본 변수에 영향을 미치지 않는다.