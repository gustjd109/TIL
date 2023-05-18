# WEEK03 DAY2 TIL
최소 스패닝 거리 문제 지옥에 빠졌다...😈

이 문제를 풀기 위해서는 그래프, 신장 트리, 최소 신장 트리, 서로소 집합, 크루수칼 알고리즘, 프림 알고리즘에 대해서 모두 알아야 한다.

정말 하루 종일 해당 개념들에 대해서 공부하고 정리했다. 하는 김에 다음 유형인 DFS와 BFS에 대해서도 추가로 공부했고, 좀 늦더라도 그래프 탐색 기본 문제들을 모두 풀어봤다.

## 1. 그래프
- 그래프란?
    - 노드(N, node)와 그 노드를 연결하는 간선(E, edge)을 하나로 모아 놓은 자료구조이다.
    - 연결된 객체 간의 관계를 표현할 수 있는 자료구조이다.
    - 그래프는 여러 개의 고립된 부분 그래프(Isolated Subgraphs)로 구성될 수 있다.

- 오일러 경로(Eulerian Tour)
    - 그래프에 존재하는 모든 간선(edge)을 한 번만 통과하면서 처음 정점(vertex)으로 되돌아오는 경로를 말한다.
    - 그래프의 모든 정점에 연결된 간선의 개수가 짝수일 때만 오일러 경로가 존재한다.

- 그래프에 관련된 용어
    - 정점(vertex): 위치라는 개념. (node라고도 부름)
    - 간선(edge): 위치 간의 관계. 즉, 노드를 연결하는 선(link, branch라고도 부름)
    - 인접 정점(adjacent vertex): 간선에 의해 직접 연결된 정점
    - 정점의 차수(degree): 무방향 그래프에서 하나의 정점에 인접한 정점의 수
        - 무방향 그래프에 존재하는 정점의 모든 차수의 합 = 그래프의 간선 수의 2배
    - 진입 차수(in-degree): 방향 그래프에서 외부에서 오는 간선의 수(내차수 라고도 부름)
    - 진출 차수(out-degree): 방향 그래프에서 외부로 향하는 간선의 수(외차수 라고도 부름)
        - 방향 그래프에 있는 정점의 진입 차수 또는 진출 차수의 합 = 방향 그래프의 간선의 수(내차수 + 외차수)
    - 경로 길이(path length): 경로를 구성하는 데 사용된 간선의 수
    - 단순 경로(simple path): 경로 중에서 반복되는 정점이 없는 경우
    - 사이클(cycle): 단순 경로의 시작 정점과 종료 정점이 같은 경우

- 그래프의 특징
    - 그래프는 네트워크 모델이다.
    - 2개 이상의 경로가 가능하다.
    - 즉, 노드들 사이에 무방향/방향에서 양방향 경로를 가질 수 있다.
    - self-loop뿐 아니라 loop/circuit 모두 가능하다.
    - 루트 노드라는 개념이 없다.
    - 부모-자식 관계라는 개념이 없다.
    - 순회는 DFS나 BFS로 이루어진다.
    - 그래프는 순환(Cyclic) 혹은 비순환(Acyclic)이다.
    - 그래프는 크게 방향 그래프와 무방향 그래프가 있다.
    - 간선의 유무는 그래프에 따라 다르다.

- 그래프의 종류
    - 무방향 그래프(Undirected Graph)
        - 무방향 그래프의 간선은 간선을 통해서 양방향으로 갈 수 있다.
        - 정점 A와 정점 B를 연결하는 간선은 (A, B)와 같이 정점의 쌍으로 표현한다.
            - (A, B)는 (B, A) 동일
    - 방향 그래프(Directed Graph)
        - 간선에 방향성이 존재하는 그래프
        - A -> B로만 갈 수 있는 간선은 <A, B>로 표시한다.
            - <A, B>는 <B, A>는 다름
    - 가중치 그래프(Weighted Graph)
        - 간선에 비용이나 가중치가 할당된 그래프
        - ‘네트워크(Network)’라고도 한다.
    - 연결 그래프(Connected Graph)
        - 무방향 그래프에 있는 모든 정점 쌍에 대해서 항상 경로가 존재하는 경우
    - 비연결 그래프(Disconnected Graph)
        - 무방향 그래프에서 특정 정점쌍 사이에 경로가 존재하지 않는 경우
    - 사이클(Cycle)
        - 단순 경로의 시작 정점과 종료 정점이 동일한 경우
            - 단순 경로(Simple Path): 경로 중에서 반복되는 정점이 없는 경우
    - 비순환 그래프(Acyclic Graph)
        - 사이클이 없는 그래프
    - 완전 그래프(Complete Graph)
        - 그래프에 속해 있는 모든 정점이 서로 연결된 그래프
        - 무방향 완전 그래프
            - 정점 수: N이면 간선의 수: N * (N - 1) / 2

- 그래프 구현 2가지 방법
    - 인접 리스트(Adjacency List)
        - 인접 리스트로 그래프를 표현하는 것이 가장 일반적인 방법이다.
        - 모든 정점(혹은 노드)을 인접 리스트에 저장한다. 즉, 각각의 정점에 인접한 정점들을 리스트로 표시한 것이다.
        - 정점의 번호만 알면 이 번호를 배열의 인덱스로 하여 각 정점의 리스트에 쉽게 접근할 수 있다.
        - 무방향 그래프(Undirected Graph)에서 (a, b) 간선은 두 번 저장된다.
            - 한 번은 a 정점에 인접한 간선을 저장하고 다른 한 번은 b에 인접한 간선을 저장한다.
            - 정점의 수: N, 간선의 수: E인 무방향 그래프의 경우
                - N개의 리스트, N개의 배열, 2E 개의 노드가 필요하다.
        - 그래프에선 특정 노드에서 다른 모든 노드로 접근이 불가능하다.
    - 인접 행렬(Adjacency Matrix)
        - 인접 행렬은 NxN 불린 행렬(Boolean Matrix)로써 matrix[i][j]가 TRUE라면 i -> j로의 간선이 있다는 뜻이다.
        - 0과 1을 이용한 정수 행렬(Integer Matrix)을 사용할 수도 있다.
        - 정점(노드)의 개수가 N인 그래프를 인접 행렬로 표현할 경우
            - 간선의 수와 무관하게 항상 n^2개의 메모리 공간이 필요하다.
        - 무방향 그래프를 인접 행렬로 표현한다면 이 행렬은 대칭 행렬(Symmetric Matrix)이 된다.
            - 방향 그래프는 대칭 행렬이 안 될 수도 있다.
        - 인접 리스트를 사용한 그래프 알고리즘들 또한 인접 행렬에서도 사용이 가능하다.
        - 인접 리스트는 어떤 노드에 인접한 노드들을 쉽게 찾을 수 있다.

- 인접 리스트와 인접 행렬 중 선택 방법
    - 인접 리스트
        - 그래프 내에 적은 숫자의 간선만을 가지는 희소 그래프(Sparse Graph)의 경우
        - 장점
            - 어떤 노드에 인접한 노드들을 쉽게 찾을 수 있다.
            - 그래프에 존재하는 모든 간선의 수는 O(N+E) 안에 알 수 있다. 인접 리스트 전체를 조사한다.
        - 단점
            - 간선의 존재 여부와 정점의 차수 : 정점 i의 리스트에 있는 노드의 수 즉, 정점 차수만큼의 시간이 필요
    - 인접 행렬
        - 그래프에 간선이 많이 존재하는 밀집 그래프(Dense Graph)의 경우
        - 장점
            - 두 정점을 연결하는 간선의 존재 여부(M[i][j])를 O(1) 안에 즉시 알 수 있다.
            - 정점의 차수는 O(N) 안에 알 수 있다. 인접 배열의 i번째 행 또는 열을 모두 더한다.
        - 단점
            - 어떤 노드에 인접한 노드들을 찾기 위해서는 모든 노드를 전부 순회해야 한다.
            - 그래프에 존재하는 모든 간선의 수는 O(N^2) 안에 알 수 있다. 인접 행렬 전체를 조사한다.

- 그래프 탐색 2가지 방법
    - 깊이 우선 탐색(DFS, Depth-First Search)
    - 너비 우선 탐색(BFS, Breadth-First Search)

## 2. 깊이 우선 탐색(DFS, Depth First Search)
- 깊이 우선 탐색이란?
    - 루트 노드(혹은 다른 임의의 노드)에서 시작해서 다음 분기(branch)로 넘어가기 전에 해당 분기를 완벽하게 탐색하는 방법이다.
    - 모든 노드를 방문하고자 할때 이 방법을 사용한다.
    - 너비 우선 탐색보다 좀 더 간단하다.
    - 단순 검색 속도 자체는 너비 우선 탐색에 비해서 느리다.

- 깊이 우선 탐색의 특징
    - 스택 또는 재귀 함수를 이용한다.
    - 자기 자신을 호출하는 순환 알고리즘의 형태를 가지고 있다.
    - 전위 순회(Preorder Traversals)를 포함한 다른 형태의 트리 순회는 모두 DFS의 한 종류이다.
    - 이 알고리즘을 구현할 때 가장 큰 차이점은, 그래프 탐색의 경우 어떤 노드를 방문했었는지를 반드시 검사 해야 한다는 것이다.
        - 이를 검사하지 않을 때 무한루프에 빠질 위험이 있다.

- 스택 자료구조를 이용한 DFS 동작 과정
    - 탐색 시작 노드를 스택에 삽입하고 방문 처리를 한다.
    - 스택의 최상단 노드에 방문하지 않은 인접 노드가 있으면 그 인접 노드를 스택에 넣고 방문 처리를 한다. 방문하지 않은 인접 노드가 없으면 스택에서 최상단 노드를 꺼낸다.
    - 두 번째 과정을 더 이상 수행할 수 없을 때까지 반복한다.

- '방문 처리'는 스택에 한 번 삽입되어 처리된 노드가 다시 삽입되지 않게 점검하는 것을 의미한다. 방문 처리를 함으로써 각 노드를 한 번씩만 처리할 수 있다.

- 코딩 테스트에서는 번호가 낮은 순서부터 처리하도록 명시하는 경우가 종종 있다. 따라서 관행적으로 번호가 낮은 순서부터 처리하도록 구현하는 것이 좋다.

- 재귀 함수를 이용한 구현
    ```python
    # DFS 메서드 정의
    def dfs(graph, v, visited):
        # 현재 노드를 방문 처리
        visited[v] = True
        print(v, end=' ')
        # 현재 노드와 연결된 다른 노드를 재귀적으로 방문
        for i in graph[v]:
            if not visited[i]:
                dfs(graph, i ,visited)

    # 각 노드가 연결된 정보를 리스트 자료형으로 표현(2차원 배열)
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

    # 각 노드가 방문된 정보를 리스트 자료형으로 표현(1차원 배열)
    visited = [False] * 9

    # 정의된 DFS 함수 호출
    dfs(graph, 1, visited)

    >>> 1 2 7 6 8 3 4 5
    ```

- 깊이 우선 탐색의 시간 복잡도
    - DFS는 그래프(정점의 수: N, 간선의 수: E)의 모든 간선을 조회한다.
    - 인접 리스트로 표현된 그래프 : O(N+E)
    - 인접 행렬로 표현된 그래프 : O(N^2)
    - 즉, 그래프 내에 적은 숫자의 간선만을 가지는 희소 그래프(Sparse Graph)의 경우 인접 행렬보다 인접 리스트를 사용하는 것이 유리하다.

## 3. 너비 우선 탐색(BFS, Breadth First Search)
- 너비 우선 탐색이란?
    - 루트 노드(혹은 다른 임의의 노드)에서 시작해서 인접한 노드를 먼저 탐색하는 방법이다.
    - 시작 정점으로부터 가까운 정점을 먼저 방문하고 멀리 떨어져 있는 정점을 나중에 방문하는 순회 방법이다.
    - 두 노드 사이의 최단 경로 혹은 임의의 경로를 찾고 싶을 때 이 방법을 사용한다.
    - 너비 우선 탐색이 깊이 우선 탐색보다 좀 더 복잡하다.

- 너비 우선 탐색의 특징
    - 직관적이지 않은 면이 있다.
    - 시작 노드에서 시작해서 거리에 따라 단계별로 탐색한다고 볼 수 있다.
    - 재귀적으로 동작하지 않는다.
    - 이 알고리즘을 구현할 때 가장 큰 차이점은, 그래프 탐색의 경우 어떤 노드를 방문했었는지를 반드시 검사 해야 한다는 것이다.
        - 이를 검사하지 않을 때 무한루프에 빠질 위험이 있다.
    - 방문한 노드들을 차례로 저장한 후 꺼낼 수 있는 자료 구조인 큐(Queue)를 사용한다.
        - 즉, 선입선출(FIFO) 원칙으로 탐색
        - deque 라이브러리를 사용하는 것이 좋다.
    - 일반적으로 큐를 이용해서 반복적 형태로 구현하는 것이 가장 잘 동작한다.
        - ‘Prim’, ‘Dijkstra’ 알고리즘과 유사하다.

- 큐 자료구조를 이용한 BFS 동작 과정
    - 탐색 시작 노드를 큐에 삽입하고 방문 처리를 한다.
    - 큐에서 노드를 꺼내 해당 노드의 인접 노드 중에서 방문하지 않은 노드를 모두 큐에 삽입하고 방문 처리를 한다.
    - 두 번째 과정을 더 이상 수행할 수 없을 때까지 반복한다.

- 큐를 이용한 구현
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
    ```

- 너비 우선 탐색의 시간 복잡도
    - 인접 리스트로 표현된 그래프 : O(N+E)
    - 인접 행렬로 표현된 그래프 : O(N^2)
    - 깊이 우선 탐색과 마찬가지로 그래프 내에 적은 숫자의 간선만을 가지는 희소 그래프(Sparse Graph)의 경우 인접 행렬보다 인접 리스트를 사용하는 것이 유리하다.

## 4. 신장 트리(Spanning Tree)
- 신장 트리란?
    - 그래프 내의 모든 노드를 포함하면서 사이클이 존재하지 않는 부분 그래프이다.
    - 모든 노드가 포함되어 서로 연결되면서 사이클이 존재하지 않는다는 조건은 트리의 조건이기도 하다.
    - 다음은 신장 트리와 신장 트리가 아닌 예시이다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FphSl8%2FbtqSAT2rD82%2FB62wM7mrHNN3HKtN24464k%2Fimg.png">

- 신장 트리의 특징
    - DFS, BFS를 이용하여 그래프에서 신장 트리를 찾을 수 있다.
    - 탐색 도중에 사용된 간선만 모으면 만들 수 있다.
    - 하나의 그래프에는 많은 신장 트리가 존재할 수 있다.
    - 신장 트리는 트리의 특수한 형태이므로 모든 정점이 연결되어 있어야 하고 사이클을 포함해서는 안 된다.
        - 따라서 신장 트리는 그래프에 있는 n개의 정점을 정확히 (n-1) 개의 간선으로 연결한다.

## 5. 최소 신장 트리(MST, Minimum Spanning Tree)
- 최소 신장 트리란?
    - 신장 트리 중에서 사용된 간선들의 가중치 합이 최소인 트리이다.
    - 각 간선의 가중치가 같지 않을 때 단순히 가장 적은 간선을 사용한다고 해서 최소 비용이 얻어지는 것은 아니다.
    - 최소 신장 트리는 간선에 가중치를 고려하여 최소 비용의 신장 트리를 선택하는 것을 말한다.
        - 즉, 네트워크(가중치를 간선에 할당한 그래프)에 있는 모든을 가장 적은 수의 간선과 비용으로 연결하는 것이다.

- 최소 신장 트리의 특징
    - 간선의 가중치의 합이 최소여야 한다.
    - n개의 정점을 가지는 그래프에 대해 반드시 (n-1) 개의 간선만을 사용해야 한다.
    - 사이클이 포함되어서는 안 된다.

- 최소 신장 트리 구현 방법
    - 크루스칼 알고리즘(Kruskal Algorithm)
    - 프림 알고리즘(Prim Algorithm)

## 6. 서로소 집합(Disjoint Sets)
- 서로소 집합이란?
    - 공통 원소가 없는 두 집합을 의미한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FpRJU2%2FbtqSmz40Pmr%2FhhTdKCkUjE9gd3VNJuRUN1%2Fimg.png">

- 서로소 집합 자료구조란?
    - 서로소 부분 집합들로 나누어진 원소들의 데이터를 처리하기 위한 자료구조이다.
    - 서로소 집합 자료구조는 두 종류의 연산을 지원한다
        - 합집합(Union): 두 개의 원소가 포함된 집합을 하나의 집합으로 합치는 연산이다.
        - 찾기(Find): 특정한 원소가 속한 집합이 어떤 집합인지 알려주는 연산이다.
    - 합치기 찾기(Union Find) 자료구조라고 불리기도 한다.

- 여러 개 합치기 연산이 주어졌을 때 서로소 집합 자료구조의 동작 과정
    - 합집합(Union) 연산을 확인하여, 서로 연결된 두 노드 A, B를 확인한다.
    - A와 B의 루트 노드 A′, B′를 각각 찾는다.
    - A′를 B′의 부모 노드로 설정한다.
    - 모든 합집합(Union) 연산을 처리할 때까지 1번의 과정을 반복한다.

- 서로소 집합의 구체적인 동작 과정
    - 처리할 연산들: Union(1, 4), Union(2, 3), Union(2, 4), Union(5, 6)
        - [초기 단계] 노드의 개수 크기의 부모 테이블을 초기화한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FrfwwB%2FbtqSEKX71Ow%2FjjU0PKeYUxvjFthjwO6rmk%2Fimg.png">
        - [Step 1] 노드 1과 노드 4의 루트 노드를 각각 찾는다. 현재 루트 노드는 각각 1과 4이므로 더 큰 번호에 해당하는 루트 노드 4의 부모를 1로 설정한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdLVMzI%2FbtqSDt3nsPH%2Fi9g6LCsi6WRsk1RYT6RkfK%2Fimg.png">
        - [Step 2] 노드 2과 노드 3의 루트 노드를 각각 찾는다. 현재 루트 노드는 각각 2와 3이므로 더 큰 번호에 해당하는 루트 노드 3의 부모를 2로 설정한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcjcwCV%2FbtqSjAiOtSs%2FK9hgSvvAhbD4xRPE5kK900%2Fimg.png">
        - [Step 3] 노드 2과 노드 4의 루트 노드를 각각 찾는다. 현재 루트 노드는 각각 2와 1이므로 더 큰 번호에 해당하는 루트 노드 2의 부모를 1로 설정한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbv9JC2%2FbtqSsRYj57e%2Foy7PJHeTqaGseLfMXTOK8K%2Fimg.png">
        - [Step 4] 노드 5과 노드 6의 루트 노드를 각각 찾는다. 현재 루트 노드는 각각 5와 6이므로 더 큰 번호에 해당하는 루트 노드 6의 부모를 5로 설정한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F8r8WP%2FbtqSGimJEsA%2FAr1sbr44oKVZlPsEHq3DVk%2Fimg.png">
    - 서로소 집합 자료구조 : 연결성
        - 서로소 집합 자료구조에서는 연결성을 통해 손쉽게 집합의 형태를 확인할 수 있다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FETHfB%2FbtqSmACW6VF%2FYRdzjpIHSma3WQb2AFk6a0%2Fimg.png">
        - 기본적인 형태의 서로소 집합 자료구조에서는 루트 노드에 즉시 접근할 수 없다.
            - 루트 노드를 찾기 위해 부모 테이블을 계속해서 확인하며 거슬러 올라가야 한다.
        - 다음 예시에서 노드 3의 루트를 찾기 위해서는 노드 2를 거쳐 노드 1에 접근해야 한다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbKMKtF%2FbtqSDtPQRtH%2FVZ8mWwqya77l0jdfiu6wak%2Fimg.png">

- 서로소 집합 기본적인 구현 방법
    ```python
    # 특정 원소가 속한 집합을 찾기
    def find_parent(parent, x):
        # 루트 노드가 아니라면, 루트 노드를 찾을 때까지 재귀적으로 호출
        if parent[x] != x:
            return find_parent(parent, parent[x])
        return x

    # 두 원소가 속한 집합을 합치기
    def union_parent(parent, a, b):
        a = find_parent(parent, a)
        b = find_parent(parent, b)
        if a < b:
            parent[b] = a
        else:
            parent[a] = b

    # 노드의 개수와 간선(Union 연산)의 개수 입력 받기
    v, e = map(int, input().split())
    parent = [0] * (v + 1) # 부모 테이블 초기화하기

    # 부모 테이블상에서, 부모를 자기 자신으로 초기화
    for i in range(1, v + 1):
        parent[i] = i

    # Union 연산을 각각 수행
    for i in range(e):
        a, b = map(int, input().split())
        union_parent(parent, a, b)

    # 각 원소가 속한 집합 출력하기
    print('각 원소가 속한 집합: ', end='')
    for i in range(1, v + 1):
        print(find_parent(parent, i), end=' ')

    print()

    # 부모 테이블 내용 출력하기
    print('부모 테이블: ', end='')
    for i in range(1, v + 1):
        print(parent[i], end=' ')
    ```

- 서로소 집합 기본적인 구현 방법의 문제점
    - 합집합(Union) 연산이 편향되게 이루어지는 경우 찾기(Find) 함수가 비효율적으로 동작한다.
    - 최악의 경우에는 찾기(Find) 함수가 모든 노드를 다 확인하게 되어 시간 복잡도가 O(V) 이다.
        - 다음과 같이 {1, 2, 3, 4, 5}의 총 5개의 원소가 존재하는 상황을 확인해 보자.
        - 수행 연산들 : Union(4, 5), Union(3, 4), Union(2, 3), Union(1, 2)
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F6akvl%2FbtqSxCNkHyw%2FkeiKWqXgCno3HDl8I23LLk%2Fimg.png">

- 경로 압축(Path Compression)
    - 찾기(Find) 함수를 최적화하기 위한 방법이다.
    - 찾기(Find) 함수를 재귀적으로 호출한 뒤에 부모 테이블 값을 바로 갱신한다.
        ```python
        # 특정한 원소가 속한 집합을 찾기
        def find_parent(parent, x):
            # 루트 노드가 아니라면, 루트 노드를 찾을 때까지 재귀적으로 호출
            if parent[x] != x:
                parent[x] = find_parent(parent, parent[x])
            return parent[x]
        ```
    - 경로 압축 기법을 적용하면 각 노드에 대하여 찾기(Find) 함수를 호출한 이후에 해당 노드의 루트 노드가 바로 부모 노드가 된다.
    - 동일한 예시에 대해서 모든 합집합(Union) 함수를 처리한 후 각 원소에 대하여 찾기(Find) 함수를 수행하면 다음과 같이 부모 테이블이 갱신된다.
    - 기본적인 방법에 비하여 시간 복잡도가 개선된다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FEm1VP%2FbtqSmzRxksP%2FQzY6slICjbKQymzl15M0gK%2Fimg.png">

- 경로 압축을 이용한 서로소 집합 구현
```python
# 특정 원소가 속한 집합을 찾기
def find_parent(parent, x):
    # 루트 노드가 아니라면, 루트 노드를 찾을 때까지 재귀적으로 호출
    if parent[x] != x:
        parent[x] = find_parent(parent, parent[x])
    return parent[x]

# 두 원소가 속한 집합을 합치기
def union_parent(parent, a, b):
    a = find_parent(parent, a)
    b = find_parent(parent, b)
    if a < b:
        parent[b] = a
    else:
        parent[a] = b

# 노드의 개수와 간선(Union 연산)의 개수 입력 받기
v, e = map(int, input().split())
parent = [0] * (v + 1) # 부모 테이블 초기화하기

# 부모 테이블상에서, 부모를 자기 자신으로 초기화
for i in range(1, v + 1):
    parent[i] = i

# Union 연산을 각각 수행
for i in range(e):
    a, b = map(int, input().split())
    union_parent(parent, a, b)

# 각 원소가 속한 집합 출력하기
print('각 원소가 속한 집합: ', end='')
for i in range(1, v + 1):
    print(find_parent(parent, i), end=' ')

print()

# 부모 테이블 내용 출력하기
print('부모 테이블: ', end='')
for i in range(1, v + 1):
    print(parent[i], end=' ')
```

- 서로소 집합을 이용한 사이클 판별
    - 서로소 집합은 무방항 그래프 내에서의 사이클을 판별할 때 사용할 수 있다.
        - 방향 그래프에서의 사이클 여부는 DFS를 이용하여 판별할 수 있다.
    - 사이클 판별 알고리즘
        - 각 간선을 하나씩 확인하며 두 노드의 루트 노드를 확인한다.
        - 루트 노드가 서로 다르다면 두 노드에 대하여 합집합(Union) 연산을 수행한다.
        - 루트 노드가 서로 같다면 사이클(Cycle)이 발생한 것이다.
        - 그래프에 포함되어 있는 모든 간선에 대하여 1번 과정을 반복한다.

- 서로소 집합을 이용한 사이클 판별 동작 과정
    - [초기 단계] 모든 노드에 대하여 자기 자신을 부모로 설정하는 형태로 부모 테이블을 초기화한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fd0Rgym%2FbtqSpGv7ZQq%2FfOsQRbaTV4pNIEXjkCq7JK%2Fimg.png">
    - [Step 1] 간선 (1, 2)를 확인한다. 노드 1과 노드 2의 루트 노드는 각각 1과 2이다. 따라서 더 큰 번호에 해당하는 노드 2의 부모 노드를 1로 변경한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkF2gM%2FbtqSmApoXwN%2FQjHRC5LBNINLdxqmyjvtI1%2Fimg.png">
    - [Step 2] 간선 (1,3)을 확인한다. 노드 1과 노드 3의 루트 노드는 각각 1과 3이다. 따라서 더 큰 번호에 해당하는 노드 3의 부모 노드를 1로 변경한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcbygOL%2FbtqSsRD1p3S%2FDqClkwtXwcdy0y8FUCm1U1%2Fimg.png">
    - [Step 3] 간선 (2,3)을 확인한다. 이미 노드 2과 노드 3의 루트 노드는 모두 1이다. 다시 말해 사이클이 발생한다는 것을 알 수 있다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbxjObf%2FbtqSmAQnkRM%2FiAU7g2cEeEgu8w7V8bXum0%2Fimg.png">

- 서로소 집합을 이용한 사이클 판별 구현
```python
# 특정 원소가 속한 집합을 찾기
def find_parent(parent, x):
    # 루트 노드가 아니라면, 루트 노드를 찾을 때까지 재귀적으로 호출
    if parent[x] != x:
        parent[x] = find_parent(parent, parent[x])
    return parent[x]

# 두 원소가 속한 집합을 합치기
def union_parent(parent, a, b):
    a = find_parent(parent, a)
    b = find_parent(parent, b)
    if a < b:
        parent[b] = a
    else:
        parent[a] = b

# 노드의 개수와 간선(Union 연산)의 개수 입력 받기
v, e = map(int, input().split())
parent = [0] * (v + 1) # 부모 테이블 초기화하기

# 부모 테이블상에서, 부모를 자기 자신으로 초기화
for i in range(1, v + 1):
    parent[i] = i

cycle = False # 사이클 발생 여부

for i in range(e):
    a, b = map(int, input().split())
    # 사이클이 발생한 경우 종료
    if find_parent(parent, a) == find_parent(parent, b):
        cycle = True
        break
    # 사이클이 발생하지 않았다면 합집합(Union) 연산 수행
    else:
        union_parent(parent, a, b)

if cycle:
    print("사이클이 발생했습니다.")
else:
    print("사이클이 발생하지 않았습니다.")
```

## 7. 크루스칼 알고리즘(Kruskal Algorithm)
- 크루스칼 알고리즘이란?
    - 대표적인 최소 신장 트리 알고리즘이다.
    - 그리디 알고리즘(Greedy Algorithm)으로 분류된다.

- 크루스칼 알고리즘의 동작 과정
    - 간선 데이터를 비용에 따라 오름차순으로 정렬한다.
    - 간선을 하나씩 확인하며 현재의 간선이 사이클을 발생시키는지 확인한다.
        - 사이클이 발생하지 않는 경우 최소 신장 트리에 포함한다.
        - 사이클이 발생하는 경우 최소 신장 트리에 포함하지 않는다.
    - 모든 간선에 대하여 두 번째 과정을 반복한다.

- 크루스칼 알고리즘의 구체적인 동작 과정
    - [초기 단계] 그래프의 모든 간선 정보에 대하여 오름차순 정렬을 수행한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FqDr3V%2FbtqSgNCIJxK%2FIxzn6oYTH6nMChodLZtjP1%2Fimg.png">
    - [Step 1] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (3, 4)를 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fnj3q4%2FbtqSASbl3oi%2FsJ55jjdgj0EEAaKiV4Sx81%2Fimg.png">
    - [Step 2] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (4, 7)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FqLS42%2FbtqSmzKHLU6%2FpF0bTmL264Xa6G6XK38cRK%2Fimg.png">
    - [Step 3] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (4, 6)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbnIT6E%2FbtqSmAv8aSj%2FHKZdnKdErROK1M7Fv3MHo1%2Fimg.png">
    - [Step 4] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (6, 7)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbse6he%2FbtqSpGQkvbp%2FvgDPPUfirhmD9oLVqCFhPk%2Fimg.png">
    - [Step 5] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (1, 2)를 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcNClIe%2FbtqSxBHIZi4%2FPJjagUrZsRJ0HRikbIF7gK%2Fimg.png">
    - [Step 6] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (2, 6)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcUfFKO%2FbtqSjAXpQ2s%2FCnoOcgkCTdls3ompzNxQhK%2Fimg.png">
    - [Step 7] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (2, 3)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FL7ttH%2FbtqSsSpraJx%2F3x4TbGYotthyvHtDkoHeck%2Fimg.png">
    - [Step 8] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (5, 6)을 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbcNAlx%2FbtqSATBiF3K%2FN2Icdl9K3UhorF7Dfh6KVk%2Fimg.png">
    - [Step 9] 아직 처리하지 않은 간선 중에서 가장 짧은 간선인 (1, 5)를 선택하여 처리한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fcu1nzm%2FbtqSELirlyF%2FBwfXsbENBsln6FGLX6LxB1%2Fimg.png">
    - [알고리즘 수행 결과] 최소 신장 트리에 포함된 간선의 비용만 모두 더하면, 그 값이 최종 비용에 해당한다.
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FAY3Su%2FbtqSgNbIdXd%2FplDEha4JlBktdq7mMZscC0%2Fimg.png">

- 크루스칼 알고리즘 구현
    ```python
    # 특정 원소가 속한 집합을 찾기
    def find_parent(parent, x):
        # 루트 노드가 아니라면, 루트 노드를 찾을 때까지 재귀적으로 호출
        if parent[x] != x:
            parent[x] = find_parent(parent, parent[x])
        return parent[x]

    # 두 원소가 속한 집합을 합치기
    def union_parent(parent, a, b):
        a = find_parent(parent, a)
        b = find_parent(parent, b)
        if a < b:
            parent[b] = a
        else:
            parent[a] = b

    # 노드의 개수와 간선(Union 연산)의 개수 입력 받기
    v, e = map(int, input().split())
    parent = [0] * (v + 1) # 부모 테이블 초기화하기

    # 모든 간선을 담을 리스트와, 최종 비용을 담을 변수
    edges = []
    result = 0

    # 부모 테이블상에서, 부모를 자기 자신으로 초기화
    for i in range(1, v + 1):
        parent[i] = i

    # 모든 간선에 대한 정보를 입력 받기
    for _ in range(e):
        a, b, cost = map(int, input().split())
        # 비용순으로 정렬하기 위해서 튜플의 첫 번째 원소를 비용으로 설정
        edges.append((cost, a, b))

    # 간선을 비용순으로 정렬
    edges.sort()

    # 간선을 하나씩 확인하며
    for edge in edges:
        cost, a, b = edge
        # 사이클이 발생하지 않는 경우에만 집합에 포함
        if find_parent(parent, a) != find_parent(parent, b):
            union_parent(parent, a, b)
            result += cost

    print(result)
    ```

- 크루스칼 알고리즘의 시간 복잡도
    - 크루스칼 알고리즘은 간선의 개수가 E개일 때, O(ElogE) 의 시간 복잡도를 가진다.
    - 크루스칼 알고리즘에서 가장 많은 시간을 요구하는 곳은 간선의 정렬을 수행하는 부분이다.
    - 표준 라이브러리를 이용해 E 개의 데이터를 정렬하기 위한 시간 복잡도는 O(ElogE)이다.

## 8. 프림 알고리즘(Prim Algorithm)
- 프림 알고리즘이란?
    - 크루스칼 알고리즘과 더불어 그리디 알고리즘을 기반으로 최소 신장 트리를 구하는 대표적인 알고리즘이다.
    - 시작 정점에서부터 출발하여 신장트리 집합을 단계적으로 확장해 나가는 방법이다.
    - 간선을 중심으로 최소 신장 트리를 구하는 크루스칼 알고리즘과 달리 노드를 중심으로 최소 신장 트리를 구한다.

- 프림 알고리즘의 동작 과정
    - 시작 단계에서 시작 정점만이 최소 신장 트리 집합에 포함된다.
    - 앞 단계에서 만들어진 최소 신장 트리 집합에 인접한 정점 중에서 최소 간선으로 연결된 정점을 선택하여 트리를 확장한다.
        - 이때, 가장 낮은 가중치를 먼저 선택한다.
    - 두 번째 과정을 트리가 N - 1개의 간선을 가질 때까지 반복한다.

- 그림으로 표현한 프림 알고리즘의 구체적인 동작 과정
<img src="https://mblogthumb-phinf.pstatic.net/20150925_163/babobigi_1443168054469RLzMz_JPEG/fig593_01_0.jpg?type=w2">

- 프림 알고리즘 시간 복잡도
    - 모든 노드에 대해 탐색을 진행하므로 O(V)이다. 그리고 우선순위 큐를 사용하여 노드마다 최소 간선을 찾는 시간은 O(logV)이다. 따라서, 탐색 과정에서는 O(VlogV)의 시간이 소요된다.
    - 각 노드의 인접 간선을 찾는 시간은 모든 노드의 차수와 같으므로 O(2E) = O(E)의 시간이 소요된다.
    - 각 간선에 대해 힙에 넣는 과정이 O(logV)가 되어 우선순위 큐 구성에 O(ElogV)의 시간이 소요된다. 따라서, 프림 알고리즘의 시간 복잡도는 O(VlogV + ElogV)로 O(ElogV)가 된다.
    - 만약 우선순위 큐가 아니라 배열로 구현한다면 각 정점에 최소 간선을 갖는 정점 탐색을 매번 정점마다 수행하므로 O(|V|^2)가 되고 탐색 결과를 기반으로 각 정점의 최소 비용 연결 정점 탐색에는 O(1)가 소요된다. 따라서, 시간복잡도는 O(V2)이다.

## 9. 3주차 2일차를 마치며...
진짜 하루 종일 너무 많은 양의 개념을 공부했다. 이 모든 게 내 머릿속에 다 저장이 가능할지 모르겠다(머리 터지는 거 아닌지 모르겠네...🤯). 그래도 내일 일요일이니까 평일보다 한 2시간 정도만 더 자고 오후에는 공부 시작할 수 있도록 해야겠다.
추가로 DFS, BFS, 크루스칼 알고리즘에 대해 개념을 어느정도 이해하고 있으니, 소스 코드 정도는 외워서 나중에 바로 써먹을 수 있으면 좋을 듯 싶다.