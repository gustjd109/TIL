# WEEK02 DAY5 TIL
오늘은 힙 정렬에 대한 정확한 이해를 위해 힙 자료구조와 힙 정렬을 공부한 후에 어제 풀었던 1655번 가운데를 말해요라는 문제를 직접 힙 정렬을 구현하여 다시 풀어봤다. 힙에 대해 학습하면서 파이썬에서 힙을 편하게 사용할 수 있도록 제공되는 내장함수인 heapq 사용 방법도 익혔다.

## 1. Heap 자료구조
- 힙 구조란?
    - 완전 이진 트리를 기초로 하는 자료구조
        - 완전 이진 트리 : 마지막을 제외한 모든 노드에서 자식들이 꽉 채워진 이진 트리
    - 여러 개의 값 중에서 최댓값이나 최솟값을 빠르게 찾아내도록 만들어진 자료구조
    - 일종의 반 정렬 상태(느슨한 정렬 상태)를 유지(큰 값이 상위 레벨에 있고 작은 값이 하위 레벨에 있다는 정도를 뜻 함)  
    간단히 말하면 부모 노드의 키 값이 자식 노드의 키 값보다 항상 크거나 작은 이진 트리를 말한다.
    - 힙 트리에서는 중복 값을 허용
    - 부모노드의 키 값과 자식노드의 키 값 사이에는 대소관계가 성립

- 힙의 종류
    - 최대 힙(Max Heap)
        - 부모 키 값이 자식노드 키 값보다 큰 힙
        - Key(parent) ≥ Key(child)
        - 가장 큰 값이 루트노드에 있음
        - 내림차순 정렬할 때 사용
    - 최소 힙(Min Heap)
        - 부모 키 값이 자식노드 키 값보다 작은 힙
        - Key(parent) ≤ Key(child)
        - 가장 작은 값이 루트노드에 있음
        - 오름차순 정렬할 때 사용

- 힙을 구현할 때 고려할 사항
    - 힙을 저장하는 표준적인 자료구조는 배열이며, 완전이진트리를 기본으로 하므로 빈 공간이 없어 배열로 구현하기에 용이하다.
    - 구현을 쉽게 하려고 배열의 첫 번째 인덱스인 0은 사용되지 않는다.
    - 특정 위치의 노드 번호는 새로운 노드가 추가되어도 변하지 않는다.
    - 힙에서의 부모 노드와 자식 노드의 관계
        - 왼쪽 자식의 인덱스 = (부모의 인덱스) * 2
        - 오른쪽 자식의 인덱스 = (부모의 인덱스) * 2 + 1 = 왼쪽 자식의 인덱스 + 1
        - 부모의 인덱스 = (자식의 인덱스) / 2 (인덱스 0 사용 안 하는 경우) = 왼쪽 자식 인덱스 // 2

- 힙의 삽입 연산
    - 힙에 새로운 요소가 들어오면, 일단 새로운 노드를 힙의 마지막 노드에 이어서 삽입
    - 부모노드와 비교해서 자식노드가 크다면 교환, 작다면 해당 부분에서 정지
    - 두 번째 과정을 반복하면 최대 힙 구조가 유지되면서 삽입 과정 완료

- 힙의 삭제 연산
    - 최대 힙(max heap)에서 삭제 연산은 최댓값을 가진 요소를 삭제하는 것으로, 최댓값은 루트 노드이므로 루트 노드가 삭제
    - 삭제된 루트 노드에는 힙의 마지막 노드를 삽입
    - 루트 노드를 자식 노드 중에서 더 큰 값과 비교하여 큰 값과 교환
    - 세 번째 과정을 반복하면 최대 힙 구조가 유지되면서 삭제 과정 완료

- 힙의 시간복잡도
    - heapify 시간 복잡도 : 최악의 경우 모든 노드 값을 비교해야 하므로 트리의 높이(log2N)에 의존적이다. 값을 비교하거나 바꾸는 연산은 O(1)이므로 O(logN)
    - 삽입, 삭제의 시간 복잡도 : 삽입/삭제하는데 드는 연산 O(1), heapify하는 데에 드는 시간은 O(logN)이므로 O(logN)이다.
    - 힙을 구성하는 시간 복잡도 : 비어있는 힙에 주어진 n개의 요소를 차례대로 삽입 연산을 해야 하므로, O(nlogN)이다.

## 2. 파이썬 내장함수 heapq 모듈
- heapq 모듈이란?
    - 이진 트리(binary tree) 기반의 최소 힙(min heap) 자료구조를 제공한다.

- heapq 모듈 사용 방법
    - 모듈 임포트
        - heapq 모듈은 내장 모듈이기 때문에 파이썬만 설치되어 있으면 다음과 같이 간단하게 임포트 후에 힙 관련 함수를 사용할 수 있다.
            ```python
            import heapq
            ```
    - 최소 힙 생성
        - 빈 리스트를 생성해놓은 다음 heapq 모듈의 함수를 호출할 때마다 이 리스트를 인자로 넘겨야 한다.

    - 힙에 원소 추가
        - heapq 모듈의 heappush() 함수를 이용하여 힙에 원소를 추가할 수 있다.
        - 첫 번째 인자는 원소를 추가할 대상 리스트이며 두 번째 인자는 추가할 원소를 넘긴다.
            ```python
            import heapq

            heappush(heap, 4)
            heappush(heap, 1)
            heappush(heap, 7)
            heappush(heap, 3)
            print(heap)
            >>> [1, 3, 7, 4]
            ```
        - heappush() 함수는 O(log(n))의 시간 복잡도를 가진다.

    - 힙에서 원소 삭제
        - heapq 모듈의 heappop() 함수를 이용하여 힙에서 원소를 삭제할 수 있다.
        - 원소를 삭제할 대상 리스트를 인자로 넘기면, 가장 작은 원소를 삭제 후에 그 값을 리턴한다.
            ```python
            from heapq import heappop

            print(heappop(heap))
            print(heap)
            >>> 1
            >>> [3, 4, 7]
            ```

    - 기존 리스트를 힙으로 변환
        - 이미 원소가 들어있는 리스트 힙으로 만들려면 heapq 모듈의 heapify()라는 함수에 사용하면 된다.
            ```python
            import heapq

            heap = [4, 1, 7, 3, 8, 5]
            heapify(heap)
            print(heap)
            >>> [1, 3, 5, 4, 8, 7]
            ```
        - heapify() 함수에 리스트를 인자로 넘기면 리스트 내부의 원소들의 위에서 다룬 힙 구조에 맞게 재배치되며 최소값이 0번째 인덱스에 위치된다.
        - heapify() 함수의 성능은 인자로 넘기는 리스트의 원소수에 비례하기 때문에 O(n)의 시간 복잡도를 가진다.

- heapq 모듈을 이용한 최소 힙 구현
    ```python
    import heapq

    heap = []

    # 아래 for문을 실행하고 나면 heap은 [1,2,3,5,4]로 힙 정렬이 되게 된다.
    for i in range(1,6):
	    heapq.heappush(heap, i)

    # 작은 숫자 순서대로 1,2,3,4,5가 출력된다.
    for i in range(5):
	    print(heapq.heappop(heap))
    ```

- heapq 모듈을 이용한 최대 힙 구현
    - heapq에서는 최대 힙을 제공하지 않는다. 
    - 따라서 다음과 같이 부호를 변경하는 방법을 사용해서 최대 힙을 구현할 수 있다.
    - 부호를 바꿔서 최소 힙에 넣어준 뒤에 최솟값부터 pop을 해줄 때 다시 부호를 바꿔주면 최대 힙과 동일하다.
    ```python
    import heapq

    heap = []
    values = [1,5,3,2,4]

    # 아래 for문을 실행시키고 나면 heap은 [-5,-4,-3,-1,-2]가 된다.
    for value in values:
	    heapq.heappush(heap, -value)

    # 아래 for문을 실행시키면 5,4,3,2,1이 출력된다. 즉, 큰 숫자부터 출력이 된다.
    for i in range(5):
	    print(-heapq.heappop(heap))
    ```

## 3. 힙 정렬 구현을 통한 1655번 가운데를 말해요 문제 풀이
- 각각 값이 삽입될 때 밑에서 위로, 삭제될 때 위에서 아래로, 최대힙과 최소힙 4개의 함수 구현을 통해 풀이해 봤으며 아래는 작성한 코드이다.
    ```python
    import sys

    def up_max_heapify(X):
        n = len(X)

        start = n - 1
        tmp = X[start]
        child = start

        while child > 0:
            parent = (child - 1) // 2

            if tmp <= X[parent]:
                break
            else:
                X[child] = X[parent]
                child = parent
        X[child] = tmp

    def up_min_heapify(X):
        n = len(X)

        start = n - 1
        tmp = X[start]
        child = start

        while child > 0:
            parent = (child - 1) // 2

            if tmp >= X[parent]:
                break
            else:
                X[child] = X[parent]
                child = parent
        X[child] = tmp

    def down_max_heapify(X):
        n = len(X)

        start = 0
        tmp = X[start]
        parent = start

        while parent < n // 2:
            left_child = (parent * 2) + 1
            right_child = left_child + 1

            if n > right_child:
                a = X[left_child]
                b = X[right_child]
                if a >= b:
                    real_child = left_child
                else:
                    real_child = right_child
        
            if right_child > n - 1:
                real_child = left_child
            else:
                real_child = right_child if X[right_child] > X[left_child] else left_child

            if tmp >= X[real_child]:
                break
            else:
                X[parent] = X[real_child]
                parent = real_child
        X[parent] = tmp
    
    def down_min_heapify(X):
        n = len(X)

        start = 0
        tmp = X[start]
        parent = start

        while parent < n // 2:
            left_child = (parent * 2) + 1
            right_child = left_child + 1

            if n > right_child:
                a = X[left_child]
                b = X[right_child]
                if a >= b:
                    real_child = right_child
                else:
                    real_child = left_child

            if right_child > n - 1:
                real_child = left_child
            else:
                real_child = right_child if X[right_child] < X[left_child] else left_child

            if tmp <= X[real_child]:
                break
            else:
                X[parent] = X[real_child]
                parent = real_child
        X[parent] = tmp

    N = int(sys.stdin.readline())
    left_heap = []
    right_heap = []

    for i in range(N):
        X = int(sys.stdin.readline())

        if len(left_heap) == len(right_heap):
            left_heap.append(X)
            up_max_heapify(left_heap)
        else:
            right_heap.append(X)
            up_min_heapify(right_heap)

        if len(right_heap) != 0 and left_heap[0] > right_heap[0]:
            left_heap[0], right_heap[0] = right_heap[0], left_heap[0]
            down_max_heapify(left_heap)
            down_min_heapify(right_heap)

    print(left_heap[0])
    ```

우선순위 큐의 13334번 철로 문제를 풀면서 새롭게 배운 리스트를 key 값을 기준으로 정렬시켜 주는 lambda 표현식에 대해서 정리해 봤다.

## 4. lambda 표현식
파이썬에서는 sort(), sorted() 함수를 사용하여 간단히 오름차순으로 정렬할 수 있으며, reverse = True를 같이 사용하여 내림차순으로도 정렬할 수 있다.  
또 다른 방법으로는 lambda를 이용할 수 있다.

- lambda 표현식이란?
    - 함수의 기능을 런타임에 생성해서 사용할 수 있는 익명 함수이다.
    - 함수는 def라는 키워드를 통해서 기능을 정의하고 여러 코드에서 해당 함수를 호출하여 사용할 수 있지만 람다 표현식은 한번 쓰고 버리는 일시적인 함수이다.
    - 람다 표현식은 함수를 간편하게 작성할 수 있어서 다른 함수의 인수로 넣을 때 주로 사용한다.
    - 사전형이나 리스트 형을 sort 하는 경우 주로 사용한다.

- 람다 표현식의 기본 형태
    - lambda 인자 : 표현식
    - 13334번에서 사용된 lambda 예제
        ```python
        roads_info.sort(key=lambda x: x[1])
        ```
    - 위의 예는 key가 하나일 때이며, key가 여러 개일 때 정렬 우선순위를 정렬할 수 있다.
    - 예를 들어 x[0]을 기준으로 정렬하다가 x[0]과 같다면 x[1]를 기준으로 정렬하는 식으로 우선순위를 정해줄 수 있다.

## 5. 2주차 5일차를 마치며...
이번 주 알고리즘 문제가 어려운 게 너무 많은거 같다...🤯 아직 분할정복 문제도 풀지 못해서 집중해서 남은 문제들도 모두 풀고 꼭 복습할 수 있도록 해야겠다.🔥