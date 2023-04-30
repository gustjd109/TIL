# WEEK02 DAY3 TIL
오늘 일요일인데 매일 아침부터 새벽까지 로봇처럼 공부만 하다 보니 뭔가 시간과 요일 개념이 완전히 사라진 듯하다...🤖  
금요일부터 너무 피곤했는지 가끔 졸 때가 있어서 잠을 보충하기 위해 조금 늦게 일어나서 남은 스택 문제를 풀고, 큐 문제를 풀기 전 큐에 관해서 공부했다.

## 1. 파이썬 JOIN  
JOIN은 2812번 크게 만들기라는 문제를 풀면서 마지막 출력값으로 리스트에 저장된 각 요소를 문자열로 변환하여 출력하기 위해 사용한 함수이다.
- JOIN 함수란?
    - 매개변수로 들어온 리스트에 있는 요소 하나하나를 합쳐서 하나의 문자열로 바꾸어 반환하는 함수

- JOIN 함수 원형
    - '구분자'.join(리스트)
        - 리스트의 값과 값 사이에 '구분자'에 들어온 구분자를 넣어서 하나의 문자열로 변환해 준다.

- JOIN 예제
    ```python
    a_list = ['a', 'b', 'c']
    print(''.join(a_list))
    >>> abc

    a_list = ['a', 'b', 'c']
    print('_'.join(a_list))
    >>> a_b_c
    ```

## 2. 큐(Queue)
- 큐란?
    - 먼저 들어온(Enqueue) 데이터가 먼저 나가는(Dequeue) 구조로 선입선출인 First In First Out(FIFO) 방식이다.
    - 스트리밍(Streaming), 너비 우선 탐색(BFS, Breath First Search)등에 사용할 수 있다.

- 큐의 기본 연산
    - Enqueue : 큐 맨 뒤에 어떠한 요소를 추가
    - Dequeue : 큐 맨 앞쪽의 요소를 삭제
    - Peek : front에 위치한 데이터를 읽음
    - front : 큐의 맨 앞의 위치(인덱스)
    - rear : 큐의 맨 뒤의 위치(인덱스)
    - isFull : 큐가 꽉 찼는지 확인
    - isEmpty : 큐가 비었는지 확인

- 파이썬에서 큐 사용하기
    - List 자료구조 사용하기
        - list 자료구조의 .append(n) 함수를 사용하면 뒤에 데이터를 추가 할 수 있고, .pop(0) 함수를 이용하면 맨 앞의 데이터를 제거할 수 있기 때문에 큐 자료구조를 사용하는 효과를 낼 수 있다.
        - 파이썬의 list 자료구조는 무작위 접근에 최적화된 자료구조이기 때문에 pop(0) 연산의 시간 복잡도는 O(N) 이어서 N이 커질 수록 연산이 매우 느려진다.
        ```python
        queue = [1, 2, 3]
        queue.append(4)
        queue.append(5)
        print(queue)
        [1, 2, 3, 4, 5]
        queue.pop(0)
        1
        queue.pop(0)
        2
        print(queue)
        [3, 4, 5]
        ```
    - Collections 모듈의 deque 사용하기
        - double-ended queue의 약자로 데이터를 양방향에서 추가하고 제거할 수 있는 자료구조이다.
        - popleft() 라는 메서드를 사용하면 list의 pop(0) 메서드와 같은 효과를 낼 수 있다.
        - deque는 Queue와 다르게 appendleft(x) 라는 메서드로 데이터를 맨 앞에서 삽입할 수 있다.
        - deque의 popleft()와 appendleft(x) 메서드는 모두 O(1)의 시간 복잡도를 가지기 때문에, list 자료 구조보다 성능이 훨씬 뛰어나다.
        - 무작위 접근의 시간 복잡도가 O(N)이고, 내부적으로 linked list를 사용하고 있기 때문에 N번째 데이터에 접근하려면 N번 순회가 필요하다는 단점이 있다.
        ```python
        from collections import deque
        queue = deque([1, 2, 3])
        queue.append(4)
        queue
        >>> deque[1, 2, 3, 4]
        queue.popleft()
        >>> 1
        queue.popleft()
        >>> 2
        queue
        >>> deque[3, 4]
        ```
    - queue 모듈의 Queue 클래스 사용하기
        - deque와 달리 방향성이 없기 때문에 데이터 추가와 삭제가 하나의 메서드로 처리된다.
        - 데이터 추가 : put(x) 메서드를 사용
        - 데이터 삭제 : get() 메서드 사용
        - Queue의 성능은 deque와 똑같다. 데이터 추가/삭제는 O(1), 데이터 접근은 O(N)의 시간 복잡도를 가진다.
        ```python
        from queue import Queue
        que = Queue()
        que.put(1)
        que.put(2)
        que.put(3)
        que.get()
        >>> 1
        que.get()
        >>> 2
        ```

- 선형 큐(Linear Queue)
    - 선형 큐는 기본적인 큐의 형태이다.

    - 일반적인 선형 큐는 rear이 마지막 index를 가르키면서 데이터의 삽입이 이루어진다. 문제는 rear이 배열의 마지막 인덱스(즉, 포화상태)를 가르키게 되면 앞에 남아있는(삽입 중간에 Dequeue 되어 비어있는 공간) 공간을 활용 할 수 없게 된다는 문제점이 있다.

- 원형 큐(Cicular Queue)
    - 선형 큐의 문제점을 보완하기 위한 자료구조
    - 배열의 마지막 인덱스에서 다음 인덱스로 넘어갈 때 '(index+1) % 배열의 사이즈'를 이용하여 Out Of Bounds Exception이 일어나지 않고 인덱스 0으로 순환되는 구조를 가진다.
    - Enqueue 연산 시(데이터 추가), rear = (rear + 1) % size 하여 데이터를 새로 넣는다.
    - (rear + 1) % size = front이면 꽉 차 있다고 판단한다.
    - Dequeue 연산 시(데이터 삭제), front도 (front+1) % size 만큼 움직인다.

- 우선순위 큐(Priority Queue)
    - 큐의 선입선출 방식을 따르지 않고, 원소들의 우선순위에 따라 순서대로 빠져나오는 방식이다.
    - 따라서 값이 입력되고 삭제될 때마다 자료구조가 내부적으로 정렬해줘야 하기 때문에 구현방법과 시간 복잡도에서 차이가 있다.
    - 일반적으로 힙을 이용하여 많이 구현하며, 파이썬에서는 heapq 모듈을 통해 구현되어 있다.
    - 파이썬에서의 우선순위 큐 사용법
        - 클래스 임포트
            - 우선 PriorityQueue 클래스는 queue 내장 모듈에서 제공되기 때문에 파이썬만 설치되어 있으면 별다른 추가 설치없이 임포트할 수 있다.
                ```python
                from queue import PriorityQueue
                ```
        - 우선순위 큐 생성
            - PriorityQueue() 생성자를 이용해서 비어있는 우선순위 큐를 초기화할 수 있다.
                ```python
                que = PriorityQueue()
                ```
            - 우선순위 큐의 디폴트 사이즈는 무한대이다. 만약에 특정 최대 크기를 가진 우선순위 큐가 필요하다면 maxsize를 넘기면 된다.
                ```python
                que = PriorityQueue(maxsize=8)
                ```
        - 우선순위 큐에 원소 추가
            - PriorityQueue 클래스의 put() 메서드를 이용하여 우선순위 큐에 원소를 추가할 수 있다.
                ```python
                que.put(4) # 4 삽입
                que.put(1) # 1 삽입
                que.put(7) # 7 삽입
                que.put(3) # 3 삽입
                ```
        - 우선순위 큐에 원소 삭제
            - PriorityQueue 클래스의 get() 메서드를 이용하여 우선순위 큐에 원소를 삭제할 수 있다.
                ```python
                print(que.get())  # 1 삭제
                print(que.get())  # 3 삭제
                print(que.get())  # 4 삭제
                print(que.get())  # 7 삭제
                ```
            - get() 메서드는 삭제된 원소를 리턴하기 때문에, 위와 같이 출력을 해보면, 크기 순서대로 원소가 삭제됨을 알 수 있다.
        - 정렬 기준 변경
            - 만약 단순 오름차순이 아닌 다른 기준으로 원소가 정렬되기를 원한다면, (우선순위, 값)의 튜플의 형태로 데이터를 추가하고 제거하면 된다.
                ```python
                que.put((3, 'Apple'))
                que.put((1, 'Banana'))
                que.put((2, 'Cherry'))

                print(que.get()[1])  # Banana 출력
                print(que.get()[1])  # Cherry 출력
                print(que.get()[1])  # Apple 출력
                ```
    - 우선순위 큐 시간복잡도
        - 내부적으로 heap 모듈을 사용하는 PriorityQueue 클래스의 put(), get() 함수는 O(log n)의 시간 복잡도를 가진다.