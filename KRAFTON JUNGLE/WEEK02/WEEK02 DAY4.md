# WEEK01 DAY4 TIL
오늘은 어제 공부한 큐 내용을 바탕으로 큐와 우선순위 큐 알고리즘 문제를 풀었다.  
2164번 카드2 문제를 풀면서 새롭게 배운 rotate 함수와 1655번 가운데를 말해요라는 문제 풀이에 대해 정리해 보았다.

## 1. 파이썬 rotate() 함수
- rotate() 함수란?
    - 파이썬의 collection 모듈의 deque 자료형에서 사용할 수 있는 함수로 리스트 자료형을 왼쪽과 오른쪽으로 회전시킬 수 있는 기능이다.
        ```python
        deq = deque([1, 2, 3, 4, 5])

        deq.rotate(1)
        print(deq)
        >>> deque([5, 1, 2, 3, 4])

        deq.rotate(-1)
        print(deq)
        >>> deque([1, 2, 3, 4, 5])
        ```

## 2. 2164번 카드2 문제 풀이
- deque를 이용한 풀이
    ```python
    from collections import deque
    import sys

    N = int(sys.stdin.readline())
    Q = deque([i for i in range(1, N + 1)])

    while len(Q) > 1:
        Q.popleft()
        Q.rotate(-1)

    print(Q[0])
    ```

- 해당 문제를 deque가 아닌 규칙을 찾아 푸는 방법이 있지 않을까 생각하다가 찾아낸 규칙으로 풀이한 코드이다.
    ```python
    import sys

    N = int(sys.stdin.readline())
    tmp = 1
    while N > tmp:
        tmp *= 2
    print(2 * N - tmp)

    # 규칙을 찾아보면
    # N = 1 -> 1
    # N = 2 -> 2 * 2 - 2
    # N = 3 -> 2 * 3 - 4
    # N = 4 -> 2 * 4 - 4
    # N = 5 -> 2 * 5 - 8
    # N = 6 -> 2 * 6 - 8
    # 순으로 나오며, (2 * N) - M라는 식이 나온다.
    # 이때, M은 1부터 시작해서 N > M가 아닐때까지 2를 누적해서 곱하여 구할 수 있다.
    ```

## 3. 1655번 가운데를 말해요 문제 풀이
- 처음에는 큐의 길이를 2로 나누어서 나온 인덱스 값의 큐 값과 그 인덱스 - 1의 값의 큐 값과 비교하여 중간값을 출력하는 방식으로 접근했지만 실패했다. 아래는 실패한 코드이다.
    ```python
    import sys
    import heapq

    N = int(sys.stdin.readline())
    Q = []

    for i in range(N):
        num = int(sys.stdin.readline())
        heapq.heappush(Q, num)

        if len(Q) % 2 == 0:
            if Q[len(Q) // 2] > Q[(len(Q) // 2) - 1]:
                print(Q[len(Q) // 2])
        else:
            print(print(Q[len(Q) // 2]))
    ```

- 다른 분들의 풀이를 보고 풀이한 것으로, 왼쪽 힙(최대 힙)과 오른쪽 힙(최소 힙)을 만들어서 루트를 비교하여 출력하는 방식이다.
    ```python
    import sys
    import heapq

    N = int(sys.stdin.readline())
    max_heap = []
    min_heap = []

    for _ in range(N):
        num = int(sys.stdin.readline())

        # 왼쪽 힙의 길이와 오른쪽 힙의 길이가 같으면
        if (len(max_heap) == len(min_heap)):
            # 왼쪽 힙에 숫자의 음수 삽입
            heapq.heappush(max_heap, -num)
        # 왼쪽 힙의 길이와 오른쪽 힙의 길이가 다르면
        else:
            # 오른쪽 힙에 숫자 삽입
            heapq.heappush(min_heap, num)

        # 양쪽 힙에 요소들이 존재하고, 왼쪽 힙의 루트 값에 음수를 곱한 값이 오른쪽 힙의 루트 값보다 크면
        if len(max_heap) >= 1 and len(min_heap) >= 1 and -max_heap[0] > min_heap[0]:
            # 왼쪽 힙의 루트 값 삭제
            max_root = heapq.heappop(max_heap)
            # 삭제한 왼쪽 힙의 루트 값의 음수 값을 오른쪽 힙에 삽입
            heapq.heappush(min_heap, -max_root)
            # 오른쪽 힙의 루트 값 삭제
            min_root = heapq.heappop(min_heap)
            # 삭제한 오른쪽 힙의 루트 값의 음수 값을 왼쪽 힙에 삽입
            heapq.heappush(max_heap, -min_root)

        # 왼쪽 힙의 루트 값에 음수를 곱한 값 출력
        print(-max_heap[0])
    ```
## 4. TO-DO-LIST
- 힙 공부(힙 자료구조, 힙 정렬)
- 스택을 이용한 계산기 구현에 대한 강의 듣기
- 파이썬 heapq 내장 모듈 사용법 공부

## 5. 2주차 4일차를 마치며...
오늘 우선순위 큐의 모든 문제를 풀고 내일 있을 퀴즈를 위해 힙 정렬에 대해 자세하게 공부하려고 했으나, 마지막에 남은 팀원분들과 이런저런 이야기를 많이 하다 보니 시간이 많이 지나서 목표량을 채우지 못했다... 그래도 같은 팀원분들과 이야기를 많이 나누다 보니 친하지 못했던 분들과도 더 친해질 수 있었고, 모르고 있었던 내용도 알 수 있었던 기회가 되었다. 물론 내일 공부해야 할 양이 더 많아지긴 했지만, 가끔 이렇게 다 같이 재충전할 기회가 있었으면 좋겠다.😁