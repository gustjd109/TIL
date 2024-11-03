# zip 함수로 두 리스트의 데이터 엮기

## 1. zip 함수란
1. zip 함수 정의
    - 파이썬의 내장 함수로, 여러 개의 리스트의 동일한 위치에 있는 요소들을 묶어서 새로운 리스트를 생성하는 함수<br><br>

## 2. zip 함수 사용 방법
1. 기본 사용 방법
    ```python
    list1 = [1, 2, 3]
    list2 = ['a', 'b', 'c']
    zipped = zip(list1, list2)
    print(list(zipped)) # [(1, 'a'), (2, 'b'), (3, 'c')]
    ```

2. 여러 활용 방법
    - 다양한 자료형의 결합
        - 리스트뿐만 아니라 모든 종류의 반복 가능한 객체에 적용 가능
        - 리스트와 튜플을 zip 함수로 묶는 예시
            ```python
            list1 = [1, 2, 3]
            tuple1 = ('a', 'b', 'c')
            zipped = zip(list1, tuple1)
            print(list(zipped)) # [(1, 'a'), (2, 'b'), (3, 'c')]
            ```

    - 길이가 다른 리스트를 zip함수로 묶기
        - zip 함수는 길이가 짧은 리스트를 기준으로 묶기 때문에 길이가 긴 리스트의 남은 요소는 무시됨
        - 길이가 다른 리스트를 zip 함수로 묶는 예시
            ```python
            list1 = [1, 2, 3, 4, 5]
            list2 = ['a', 'b', 'c']
            zipped = zip(list1, list2)
            print(list(zipped)) # [(1, 'a'), (2, 'b'), (3, 'c')]
            ```

    - zip 함수의 결과 다시 분리하기
        - zip 함수를 사용해서 묶은 리스트는 zip 함수에 *(asterisk)를 붙여서 다시 원래의 상태로 돌려놓을 수 있음
        - zip 함수로 묶은 리스트를 다시 분리하는 예시
            ```python
            list1 = [1, 2, 3]
            list2 = ['a', 'b', 'c']
            zipped = zip(list1, list2)

            unzipped_list1, unzipped_list2 = zip(*zipped)
            print(list(unzipped_list1)) # [1, 2, 3]
            print(list(unzipped_list2)) # ['a', 'b', 'c']
            ```

    - zip으로 두 리스트를 dict 으로 변경
        - "dict(zip(l1, l2))"와 같이 두 개의 리스트를 튜플로 묶어주는 기능을 활용하여 사전(dict) 형태로 변경 가능
        - zip 함수와 dict를 함께 사용하는 예시
            ```python
            keys = ['name', 'age', 'job']
            values = ['Alice', 25, 'Engineer']

            dictionary = dict(zip(keys, values))
            print(dictionary) # Output: {'name': 'Alice', 'age': 25, 'job': 'Engineer'}
            ```
    
    - 여러 리스트를 동시에 순회하기
        - zip 함수와 for 루프를 사용하여 리스트를 순회하면서 동일한 인덱스의 다른 리스트의 요소를 참조하는 코드를 간결하게 만들 수 있음
        - 예시
            ```python
            names = ['Alice', 'Bob', 'Charlie']
            ages = [25, 30, 35]

            for name, age in zip(names, ages):
                print(f'{name} is {age} years old.')
                # Alice is 25 years old.
                # Bob is 30 years old.
                # Charlie is 35 years old.
            ```