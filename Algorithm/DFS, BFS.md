# 2가지 그래프 표현 방식

## 1. 인접 행렬(Adjacency Matrix)
- 2차원 배열로 그래프의 연결 관계를 표현하는 방식
- 다른 언어의 배열을 파이썬에서는 리스트 자료형으로 표현할 수 있으므로 파이썬은 인접 행렬을 2차원 리스트로 구현
- 연결이 되어 있지 않은 노드끼리는 무한의 비용이라고 작성
- 인접 행렬 방식 예제
    ```python
    INF = 999999999 # 무한의 비용 선언

    # 2차원 리스트를 이용해 인접 행렬 표현
    graph = [
        [0, 7, 5],
        [7, 0, INF],
        [5, INF, 0]
    ]

    print(graph)

    >>> [[0, 7, 5], [7, 0, 999999999], [5, 999999999, 0]]

## 2. 인접 리스트(Adjacency Matrix)
- 리스트로 그래프의 연결 관계를 표현하는 방식
- 모든 노드에 연결된 노드에 대한 정보를 차례대로 연결하여 저장
- 연결 리스트 자료구조를 이용
    - C++, 자바와 같은 언어에서는 별도로 연결 리스트 기능을 위한 표준 라이브러리를 제공
    - 파이썬에서는 인접 리스트를 이용해 그래프를 표현하고자 할 때에도 2차원 리스트를 이용하여 구현
- 인접 리스트 방식 예제
    ```python
    # 행(Row)이 3개인 2차원 리스트로 인접 리스트 표현
    graph = [[] for _ in range(3)]

    # 노드 0에 연결된 노드 정보 저장(노드, 거리)
    graph[0].append((1, 7))
    graph[0].append((2, 5))
    
    # 노드 1에 연결된 노드 정보 저장(노드, 거리)
    graph[1].append((0, 7))

    # 노드 2에 연결된 노드 정보 저장(노드, 거리)
    graph[2].append((0, 5))

    print(graph)

    >>> [[(1, 7), (2, 5)], [(0, 7)], [(0, 5)]]
    ```

## 3. 인접 행렬, 인접 리스트 차이
- 메모리 측면에서의 두 방식의 차이
    - 인접 행렬
        - 모든 관계를 저장하므로 노드 개수가 많을수록 메모리가 불필요하게 낭비
    - 인접 리스트
        - 연결된 정보만을 저장하기 때문에 메모리를 효율적으로 사용
        - 연결된 데이터를 하나씩 확인해야 하기 때문에 인접 행렬 방식에 비해 특정한 두 노드가 연결되어 있는지에 대한 정보를 얻는 속도가 느림
            - 특정한 노드와 연결된 모든 인접 노드를 순회해야 하는 경우, 인접 리스트 방식이 인접 행렬 방식에 비해 메모리 공간의 낭비가 적음





# DFS(Depth-First Search)

## 1. DFS란?
- 깊이 우선 탐색이라고도 부르며, 그래프에서 깊은 부분을 우선적으로 탐색하는 알고리즘<br><br>
- DFS 동작 과정
    1. 탐색 시작 노드를 스택에 삽입하고 방문 처리
    2. 스택의 최상단 노드에 방문하지 않은 인접 노드가 있으면 그 인접 노드를 스택에 넣고 방문 처리
        - 방문하지 않은 인접 노드가 없으면 스택에서 최상단 노드를 꺼냄
    3. 2번의 과정을 더 이상 수행할 수 없을 때까지 반복<br><br>
- DFS 동작 예시
    - STEP0
        - 그래프 준비(방문 기준 : 번호가 낮은 인접 노드부터 처리) / 시작 노드 : 1<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FGAxqb%2FbtqJ6dAYOOz%2Fp3ysI6YO2vKBtydazxsHW1%2Fimg.png" height="200"></img><br><br>
    - STEP1
        - 시작 노드인 '1'을 스택에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FVJVxF%2FbtqJ4HCmJ5l%2FpwWKCcQB3Akn6186o3VWXk%2Fimg.png" height="200"></img><br><br>
    - STEP2
        - 스택의 최상단 노드인 '1'에 방문하지 않은 인접 노드 중 가장 작은 노드인 '2'를 스택에 넣고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FoJ4ex%2FbtqJWRNcBZm%2FmXHsEc5wVRNfbFVIYOMxw1%2Fimg.png" height="200"></img><br><br>
    - STEP3
        - 스택의 최상단 노드인 '2'에 방문하지 않은 인접 노드 '7'을 스택에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fmo5iW%2FbtqJWRNcB1w%2FH1GLVZUl837r4okMVDHZj0%2Fimg.png" height="200"></img><br><br>
    - STEP4
        - 스택의 최상단 노드인 '7'에 방문하지 않은 인접 노드 중 가장 작은 노드인 '6'을 스택에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcv2RBz%2FbtqJ3hcOqeI%2FN0RUrpScWG5whJjymGOsL1%2Fimg.png" height="200"></img><br><br>
    - STEP5
        - 스택의 최상단 노드인 '6'에 방문하지 안접 노드가 없기 때문에 스택에서 '6' 노드를 꺼냄<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb910J3%2FbtqJ0oQ5VLP%2FSEHo4XvRsUCzK3oPLkzdlk%2Fimg.png" height="200"></img><br><br>
    - STEP6
        - 스택의 최상단 노드인 '7'에 방문하지 않은 인접 노드 '8'을 스택에 삽입하고 방문처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fl2ML8%2FbtqJ8gxr1Qe%2Fmgvbwo0GKlAkKGhaeKtxR1%2Fimg.png" height="200"></img><br><br>
    - 이러한 과정을 반복하였을 때 전체 노드의 탐색 순서는 다음과 같음<br>
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FIWkqk%2FbtqJ8fL8XOw%2FRxpE0vlH9kU2viCAFOFBQ0%2Fimg.png" height="250"></img><br><br>
- DFS 소스코드 예제
    ```python
    # DFS 함수 정의
    def dfs(graph, v, visited):
        # 현재 노드를 방문 처리
        visited[v] = True
        print(v, end=' ')
        # 현재 노드와 연결된 다른 노드를 재귀적으로 방문
        for i in graph[v]:
            if not visited[i]:
                dfs(graph, i, visited)

    # 각 노드가 연결된 정보를 리스트 자료형으로 표현(2차원 리스트)
    graph = [
    [],
    [2, 3, 8],
    [1, 7],
    [1, 4, 5],
    [3, 5],
    [3, 4],
    [7],
    [2, 6, 8],
    [1, 7]
    ]

    # 각 노드가 방문된 정보를 리스트 자료형으로 표현(1차원 리스트)
    visited = [False] * 9

    # 정의된 DFS 함수 호출
    dfs(graph, 1, visited)

    >>> 1 2 7 6 8 3 4 5
    ```





# BFS(Breath-First Search)

## 1. BFS란?
- 너비 우선 탐색이라고도 부르며, 그래프에서 가까운 노드부터 우선적으로 탐색하는 알고리즘<br><br>
- BFS 동작 과정
    1. 탐색 시작 노드를 큐에 삽입하고 방문 처리
    2. 큐에서 노드를 꺼내 해당 노드의 인접 노드 중에서 방문하지 않은 노드를 모두 큐에 삽입하고 방문 처리
    3. 2번의 과정을 더 이상 수행할 수 없을 때까지 반복<br><br>
- BFS 동작 예시
    - STEP0
        - 그래프 준비(방문 기준 : 번호가 낮은 인접 노드부터 처리) / 시작 노드 : 1<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FGAxqb%2FbtqJ6dAYOOz%2Fp3ysI6YO2vKBtydazxsHW1%2Fimg.png" height="200"></img><br><br>
    - STEP1
        - 시작 노드인 '1'을 큐에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdJ9wO7%2FbtqJ4G4wXZJ%2Fu95m978zQB3D1YE2aQgJ41%2Fimg.png" height="200"></img><br><br>
    - STEP2
        - 큐에서 노드 '1'을 꺼내 방문하지 않은 인접 노드 '2', '3', '8'을 큐에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcytDe7%2FbtqJ3gZh3Rk%2FYO6hSCl4su2924Tp0gUw70%2Fimg.png" height="200"></img><br><br>
    - STEP3
        - 큐에서 노드 '2'를 꺼내 방문하지 않은 인접 노드 '7'을 큐에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FWi8GR%2FbtqJ1MqADVD%2FSolzlavP0MSmin0Ju9KgF0%2Fimg.png" height="200"></img><br><br>
    - STEP4
        - 큐에서 노드 '3'을 꺼내 방문하지 않은 인접 노드 '4', '5'를 큐에 삽입하고 방문 처리<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcTHrgj%2FbtqJ8ezDLeG%2FuEXzA8kV5BlyZ0JdkUaukk%2Fimg.png" height="200"></img><br><br>
    - STEP5
        - 큐에서 노드 '8'을 꺼내고 방문하지 않은 인접 노드가 없으므로 무시<br>
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fz1c15%2FbtqJXVu3wKq%2FEdyutBlPdetiKd8BXc3wFk%2Fimg.png" height="200"></img><br><br>
    - 이러한 과정을 반복하였을 때 전체 노드의 탐색 순서는 다음과 같음<br>
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkJh5f%2FbtqJ3iiySBZ%2FPlahRHQqbhXD73iGHKXUpk%2Fimg.png" height="200"></img><br><br>
- BFS 소스코드 예제
    ```python
    from collections import deque

    # BFS 함수 정의
    def bfs(graph, start, visited):
        # 큐(Queue) 구현을 위해 deque 라이브러리 사용
        queue = deque([start])
        # 현재 노드를 방문 처리
        visited[start] = True
        # 큐가 빌 때까지 반복
        while queue:
            # 큐에서 하나의 원소를 뽑아 출력
            v = queue.popleft()
            print(v, end=' ')
            # 해당 원소와 연결된, 아직 방문하지 않은 원소들을 큐에 삽입
            for i in graph[v]:
                if not visited[i]:
                    queue.append(i)
                    visited[i] = True

    # 각 노드가 연결된 정보를 리스트 자료형으로 표현(2차원 리스트)
    graph = [
    [],
    [2, 3, 8],
    [1, 7],
    [1, 4, 5],
    [3, 5],
    [3, 4],
    [7],
    [2, 6, 8],
    [1, 7]
    ]

    # 각 노드가 방문된 정보를 리스트 자료형으로 표현(1차원 리스트)
    visited = [False] * 9

    # 정의된 BFS 함수 호출
    bfs(graph, 1, visited)

    >>> 1 2 3 8 7 4 5 6
    ```





# 