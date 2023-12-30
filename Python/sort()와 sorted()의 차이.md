# sort()와 sorted()의 차이

## 1. sort()
1. sort()란?
    - 리스트 메서드
    - 원래 리스트 목록 영향 : O
    ```python
    arr = [1, 3, 2, 5, 4]
    arr.sort()
    print(arr) # [1, 2, 3, 4, 5]
    ```

2. sort() 내림차순 정렬
```python
arr = [1, 3, 2, 5, 4]
arr.sort(reverse = True)
print(arr) # [5, 4, 3, 2, 1]
```

## 2. sorted()
1. sorted()란?
    - 파이썬 표준 내장함수
    - 원래 리스트 목록 영향 : X
    - 새로운 정렬 결과 반환
    ```python
    arr = [1, 3, 2, 5, 4]
    result = sorted(arr)
    print(result) # [1, 2, 3, 4, 5]
    print(arr) # [1, 3, 2, 5, 4]
    ```

2. sorted() 내림차순 정렬
```python
arr = [1, 3, 2, 5, 4]
result = sorted(arr, reverse = True)
print(result) # [5, 4, 3, 2, 1]
print(arr) # [1, 3, 2, 5, 4]
```