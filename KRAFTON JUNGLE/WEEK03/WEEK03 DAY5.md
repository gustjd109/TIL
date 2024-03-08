# WEEK03 DAY5 TIL
오늘은 2178번 미로 탐색, 18352번 특정 거리의 도시 찾기, 1916번 최소 비용 구하기와 2665번 미로 만들기 문제를 풀이했고, 최단 경로 관련 문제를 풀기 위해 다익스트라 최단 경로 알고리즘에 관해 공부했다.

## 1. 2178번 미로 탐색 문제 풀이
- 이 문제는 1주차 떄 풀었던 2468번 안전 영역 문제와 비슷한 문제로, 동일하게 BFS와 상하좌우 좌표 탐색을 통해 문제를 해결할 수 있다.
- 소스코드
    ```python
    from collections import deque
    import sys

    def bfs(x, y):
        # 큐 구현을 위해 deque 라이브러리 사용
        queue = deque()
        # 큐에 (x, y), 즉 (0, 0) 삽입
        queue.append((x, y))
        # 큐가 빌때까지 반복
        while queue:
            # 큐에서 (x, y) 좌표 하나 삭제
            x, y = queue.popleft()
            # 현재 위치에서 상하좌우 녜 방향으로의 이동 가능 위치 확인
            for i in range(4):
                nx = dx[i] + x
                ny = dy[i] + y
                # N X M 공간을 벗어난 경우 무시
                if nx < 0 or nx >= N or ny < 0 or ny >= M:
                    continue
                # 벽인 경우 무시
                if graph[nx][ny] == 0:
                    continue
                # 해당 좌표를 처음 방문하는 경우에만 최단 거리 기록
                if graph[nx][ny] == 1:
                    graph[nx][ny] = graph[x][y] + 1
                    queue.append((nx, ny))
        # 현재 좌표가 (N -1, M -1)일 때 최단 거리 값 반환
        return graph[N - 1][M - 1]

    if __name__ == "__main__":
        # N X M 크기의 배열을 표현하는 두 정수 입력
        N, M = map(int, sys.stdin.readline().split())
        # 미로를 표현하는 N개의 줄에서 M개의 정수 입력
        graph = [list(map(int, sys.stdin.readline().strip())) for _ in range(N)]
        # 방향 정보(상하좌우)
        dx = [-1, 1, 0, 0]
        dy = [0, 0, -1, 1]
        # (0, 0) 좌표부터 BFS 탐색 시작
        print(bfs(0, 0))
    ```

## 2. 18352번 특정 거리의 도시 찾기 문제 풀이
- 이 문제는 특정 도시 X를 시작점으로 BFS를 수행하여 모든 도시까지의 최단 거리를 계산한 뒤, 각 최단 거리를 하나씩 확인하며 그 값이 K인 경우에 해당 도시의 번호를 출력하는 방법으로 해결했다.
- 소스코드
    ```python
    from collections import deque
    import sys

    def bfs(X):
        # 큐 구현을 위해 deque 라이브러리 사용
        queue = deque()
        # 큐에 출발 도시 X값 삽입
        queue.append(X)

        # 큐가 빌때까지 반복
        while queue:
            # 큐에서 도시 하나 삭제
            X = queue.popleft()

            # 출발한 도시에서 갈 수 있는 인접 도시 탐색
            for city_num in graph[X]:
                # 아직 방문하지 않은 도시라면 최단 거리를 갱신하고 큐에 해당 도시를 삽입
                if distance[city_num] == -1:
                    distance[city_num] = distance[X] + 1
                    queue.append(city_num)

        # 최단 거리가 K인 도시 존재 유무 확인 플래그 False로 초기화
        have_shortest_city = False
        # 최단 거리가 K인 도시의 번호를 오름차순으로 출력
        for i in range(N + 1):
            if distance[i] == K:
                print(i)
                # 최단 거리가 K인 도시가 있다면 플래그 True로 갱신
                have_shortest_city = True
            
        # 최단 거리가 K인 도시가 없다면 -1 출력
        if have_shortest_city == False:
            print(-1)

    if __name__ == "__main__":
        # 도시의 개수 N / 도로의 개수 M / 최단 거리 K / 출발 도시 번호 X 입력
        N, M, K, X = map(int, sys.stdin.readline().split())
        # A번 도시에서 B번 도시로 이동하는 단방향 도로를 저장할 빈 공간
        graph = [[] for _ in range(N + 1)]
        # A번 도시에서 B번 도시로 이동하는 단방향 도로 삽입
        for _ in range(M):
            A, B = map(int, sys.stdin.readline().split())
            graph[A].append(B)
        # 모든 도시의 최단 거리 초기화
        distance = [-1] * (N + 1)
        # 출발 도시 X에서 출발 도시 X로 가는 최단거리는 항상 0이므로 0으로 초기화
        distance[X] = 0

        bfs(X)
    ```

## 3. 다익스트라(Dijkstra) 최단 경로 알고리즘
- 최단 경로 알고리즘
    - 말그대로 가장 짧은 경로를 찾는 알고리즘이다.
    - 다양한 최단 경로 알고리즘 문제
        - 한 지점에서 다른 한 지점까지의 최단 경로 찾기
        - 한 지점에서 다른 모든 지점까지의 최단 경로 찾기
        - 모든 지점에서 다른 모든 지점까지의 최단 경로 찾기
    - 아래와 같이 각 지점은 그래프에서 노드로, 지점 간 연결된 도로는 그래프에서 간선으로 표현한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb6Xprx%2FbtqKxRdRy7F%2FyRnK3ow2RD2uF9XT9KIAhk%2Fimg.png">
    - 다익스트라 최단 경로 알고리즘, 플로이드 워셜, 벨만 포드 알고리즘, 이렇게 3가지이다.
    - 그리디 알고리즘과 다이나믹 프로그래밍 알고리즘이 최단 경로 알고리즘에 그대로 적용된다는 특징이 있다.

- 다익스트라 최단 경로 알고리즘이란?
    - 특정한 노드에서 출발하여 다른 노드로 가는 각각의 최단 경로를 구해주는 알고리즘이다.
    - 음의 간선이 없을 때 정상적으로 동작한다.
        - 음의 간선 : 0보다 작은 값을 가지는 간선을 의미한다.
    - 그리디 알고리즘으로 분류된다.
        - 매번 '가장 비용이 적은 노드'를 선택해서 임의의 과정을 반복하기 때문이다.

- 다익스트라 최단 경로 알고리즘 기본 원리
    - 출발 노드를 설정한다.
    - 최단 거리 테이블을 초기화한다.
    - 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드를 선택한다.
    - 해당 노드를 거쳐 다른 노드로 가는 비용을 계산하여 최단 거리 테이블을 갱신한다.
    - 위 과정에서 3과 4번 과정을 반복한다.
    - 동작 과정에서 각 노드에 대한 현재까지의 최단 거리 정보를 항상 1차원 리스트에 저장하며 리스트를 계속 갱신해줘야 한다.

- 다익스트라 알고리즘 구현 방법
    - 구현하기 쉽지만 느리게 동작하는 코드
    - 구현하기에 조금 더 까다롭지만 빠르게 동작하는 코드
        - 자다가도 일어나서 바로 코드를 작성할 수 있을 정도로 코드에 숙달되어 있어야 한다!

- 다익스트라 알고리즘의 구체적인 동작 과정
    - 예시에서 출발 노드를 1이라 가정했을 때, 1번 노드에서 다른 모든 노드로의 최단 거리를 계산해볼 것이다. 초기 상태에서는 다른 모든 노드로 가는 최단 거리를 '무한'으로 초기화한다.
    - [초기 상태] 그래프를 준비하고 출발 노드를 설정한다.
    - 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드를 선택하는데, 출발 노드에서 출발 노드로의 거리는 0으로 보기 때문에 처음에는 출발 노드인 1을 선택한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fqopgr%2FbtqKC9EAKzQ%2FT75o2FzTptAlRxeZQg47c1%2Fimg.png">
    - [Step 1] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 1번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FTY66Q%2FbtqKAAiomTC%2FA7RMZ7qDmyzlP8Knu1cV41%2Fimg.png">
    - [Step 2] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 4번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F6I2H2%2FbtqKAAionqO%2FnKdK0wLSRXO9GDweEHkzB1%2Fimg.png">
    - [Step 3] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 2번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmpxPm%2FbtqKAAbA0qw%2FgR35tkHqaIVBGMhksMrwt1%2Fimg.png">
    - [Step 4] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 5번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbFxksL%2FbtqKv8nj3Ip%2FpuFAkD4vZM8dskBrHjjw01%2Fimg.png">
    - [Step 5] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 3번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcHs7fq%2FbtqKwSxyOCu%2FaVkQx4vwus1T5OzwfXWm80%2Fimg.png">
    - [Step 6] 방문하지 않은 노드 중에서 최단 거리가 가장 짧은 노드인 6번 노드를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcdfGID%2FbtqKwrAcDim%2FiDE5Dz2gJs7hKN0xACKBw0%2Fimg.png">

- 다익스트라 알고리즘의 특징
    - 동작 과정에서 봤듯이 '방문하지 않은 노드 중에서 가장 최단 거리가 짧은 노드를 선택'하는 과정을 반복한다.
    - 따라서, 선택된 노드는 '최단 거리'가 완전히 선택된 노드이므로 더 이상 알고리즘을 반복해도 최단 거리가 줄어들지 않는다.
    - 즉, 다익스트라 알고리즘이 진행되면서 한 단계당 하나의 노드에 대한 최단 거리를 확실히 찾는 것으로 이해할 수 있다.
    - 그렇기 때문에, 사실 마지막 노드에 대해서는 해당 노드를 거쳐 다른 노드로 가는 경우를 확인할 필요가 없다.

- 간단한 다익스트라 알고리즘
    - 간단한 다익스트라 알고리즘의 시간 복잡도
        - 간단한 다익스트라 알고리즘의 시간 복잡도는 O(V^2)이다. (V : 노드의 개수)
        - 총 O(V)번에 걸쳐서 최단 거리가 가장 짧은 노드를 매번 선형 탐색해야 하고, 현재 노드와 연결된 노드를 매번 일일이 확인하기 때문이다.
        - 코딩 테스트에서 최단 경로 문제의 전체 노드 개수가 5,000개 이하라면 일반적으로 간단한 다익스트라 알고리즘으로 풀이가 가능하지만, 10,000개를 넘어가면 어렵다.
    - 간단한 다익스트라 알고리즘 소스코드
        ```python
        import sys
        input = sys.stdin.readline
        INF = int(1e9) # 무한을 의미하는 값으로 10억을 설정

        # 노드의 개수, 간선의 개수를 입력받기
        n, m = map(int, input().split())
        # 시작 노드 번호를 입력받기
        start = int(input())
        # 각 노드에 연결되어 있는 노드에 대한 정보를 담는 리스트를 만들기
        graph = [[] for i in range(n + 1)]
        # 방문한 적이 있는지 체크하는 목적의 리스트를 만들기
        visited = [False] * (n + 1)
        # 최단 거리 테이블을 모두 무한으로 초기화
        distance = [INF] * (n + 1)

        # 모든 간선 정보를 입력받기
        for _ in range(m):
            a, b, c = map(int, input().split())
            # a번 노드에서 b번 노드로 가는 비용이 c라는 의미
            graph[a].append((b, c))

        # 방문하지 않은 노드 중에서, 가장 최단 거리가 짧은 노드의 번호를 반환
        def get_smallest_node():
            min_value = INF
            index = 0 # 가장 최단 거리가 짧은 노드(인덱스)
            for i in range(1, n + 1):
                if distance[i] < min_value and not visited[i]:
                    min_value = distance[i]
                    index = i
            return index

        def dijkstra(start):
            # 시작 노드에 대해서 초기화
            distance[start] = 0
            visited[start] = True
            for j in graph[start]:
                distance[j[0]] = j[1]
            # 시작 노드를 제외한 전체 n - 1개의 노드에 대해 반복
            for i in range(n - 1):
                # 현재 최단 거리가 가장 짧은 노드를 꺼내서, 방문 처리
                now = get_smallest_node()
                visited[now] = True
                # 현재 노드와 연결된 다른 노드를 확인
                for j in graph[now]:
                    cost = distance[now] + j[1]
                    # 현재 노드를 거쳐서 다른 노드로 이동하는 거리가 더 짧은 경우
                    if cost < distance[j[0]]:
                        distance[j[0]] = cost

        # 다익스트라 알고리즘을 수행
        dijkstra(start)

        # 모든 노드로 가기 위한 최단 거리를 출력
        for i in range(1, n + 1):
            # 도달할 수 없는 경우, 무한(INFINITY)이라고 출력
            if distance[i] == INF:
                print("INFINITY")
            # 도달할 수 있는 경우 거리를 출력
            else:
                print(distance[i])
        ```

- 개선된 다익스트라 알고리즘
    - 개선된 다익스트라 알고리즘이란?
        - 다익스트라 최단 경로 문제를 최악의 경우에도 시간 복잡도 O(ElogV)를 보장하여 해결할 수 있다. (V : 노드의 개수 / E : 간선의 개수)
        - 힙 자료구조를 사용하여 특정 노드까지의 최단 거리에 대한 정보를 힙에 담아서 처리하므로 출발 노드로부터 가장 거리가 짧은 노드를 더욱 빠르게 찾을 수 있다.(힙 자료구조에 대해서는 2주차 5일차 TIL 참고)
            - 이 과정에서 선형 시간이 아닌 로그 시간이 걸린다.
            - N = 1,000,000일 때, logN이 약 20인 것을 감안하면 속도가 획기적으로 빨리지는 것을 알 수 있다.
            - 간단한 다익스트라 알고리즘은 '최단 거리가 가장 짧은 노드'를 찾기 위해서, 매번 최단 거리 테이블을 선형적으로 탐색해야 했다.
        - 현재 가장 가까운 노드를 저장해 놓기 위해서 힙 자료구조를 추가적으로 이용한다는 점이 다르다.
        - 현재의 최단 거리가 가장 짧은 노드를 선택해야 하므로 최소 힙을 사용한다.


- 개선된 다익스트라 알고리즘의 구체적인 동작 과정
    - [초기 상태] 그래프를 준비하고 출발 노드를 설정하여 우선순위 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcT3c5F%2FbtqKABhh34W%2Fdc5Tp2uKM8gq5pZzUkrX5k%2Fimg.png">
    - [Step 1] 우선순위 큐에서 원소를 꺼낸다 1번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FDTUXf%2FbtqKAACHYyl%2Fgr1APXR1sq4JhL7yCX12fk%2Fimg.png">
    - [Step 2] 우선순위 큐에서 원소를 꺼낸다 4번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FPPRKH%2FbtqKxk8quIh%2F6svobOJsnssq7qPuE1iMe0%2Fimg.png">
    - [Step 3] 우선순위 큐에서 원소를 꺼낸다 2번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbx8Vnq%2FbtqKAzRi7Vn%2FUFUEpudWj8N51VawxjPAck%2Fimg.png">
    - [Step 4] 우선순위 큐에서 원소를 꺼낸다 5번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FQ5CTC%2FbtqKBPGnpTC%2FxLAjwzODiM6FFncHmK2Gk1%2Fimg.png">
    - [Step 5] 우선순위 큐에서 원소를 꺼낸다 3번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbY70kM%2FbtqKv79LVXe%2FkpCG8ccNEJLXHWfUy3wKH1%2Fimg.png">
    - [Step 6] 우선순위 큐에서 원소를 꺼낸다 3번 노드는 이미 방문했으므로 무시한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FeFS6lQ%2FbtqKDajcgGT%2FoBYIKOypRkASFXKhmqM3bk%2Fimg.png">
    - [Step 7] 우선순위 큐에서 원소를 꺼낸다 6번 노드는 아직 방문하지 않았으므로 이를 처리한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FdrYO23%2FbtqKABavl4n%2F9RvTIryayB6iavXOAe9m7k%2Fimg.png">
    - [Step 8] 우선순위 큐에서 원소를 꺼낸다 3번 노드는 이미 방문했으므로 무시한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbEgG76%2FbtqKy6u3tjj%2FXoZUs6IyxkKfkO5TChfy31%2Fimg.png">

- 개선된 다익스트라 알고리즘 소스코드
    ```python
    import heapq
    import sys
    input = sys.stdin.readline
    INF = int(1e9) # 무한을 의미하는 값으로 10억을 설정

    # 노드의 개수, 간선의 개수를 입력받기
    n, m = map(int, input().split())
    # 시작 노드 번호를 입력받기
    start = int(input())
    # 각 노드에 연결되어 있는 노드에 대한 정보를 담는 리스트를 만들기
    graph = [[] for i in range(n + 1)]
    # 최단 거리 테이블을 모두 무한으로 초기화
    distance = [INF] * (n + 1)

    # 모든 간선 정보를 입력받기
    for _ in range(m):
        a, b, c = map(int, input().split())
        # a번 노드에서 b번 노드로 가는 비용이 c라는 의미
        graph[a].append((b, c))

    def dijkstra(start):
        q = []
        # 시작 노드로 가기 위한 최단 경로는 0으로 설정하여, 큐에 삽입
        heapq.heappush(q, (0, start))
        distance[start] = 0
        while q: # 큐가 비어있지 않다면
            # 가장 최단 거리가 짧은 노드에 대한 정보 꺼내기
            dist, now = heapq.heappop(q)
            # 현재 노드가 이미 처리된 적이 있는 노드라면 무시
            if distance[now] < dist:
                continue
            # 현재 노드와 연결된 다른 인접한 노드들을 확인
            for i in graph[now]:
                cost = dist + i[1]
                # 현재 노드를 거쳐서, 다른 노드로 이동하는 거리가 더 짧은 경우
                if cost < distance[i[0]]:
                    distance[i[0]] = cost
                    heapq.heappush(q, (cost, i[0]))

    # 다익스트라 알고리즘을 수행
    dijkstra(start)

    # 모든 노드로 가기 위한 최단 거리를 출력
    for i in range(1, n + 1):
        # 도달할 수 없는 경우, 무한(INFINITY)이라고 출력
        if distance[i] == INF:
            print("INFINITY")
        # 도달할 수 있는 경우 거리를 출력
        else:
            print(distance[i])
    ```

- 개선된 다익스트라 알고리즘의 시간 복잡도
    - 힙 자료구조를 이용하는 다익스트라 알고리즘의 시간 복잡도는 O(ElogV)이다.
    - 노드를 하나씩 꺼내 검사하는 반복문(while문)은 노드의 개수 V 이상의 횟수로는 처리되지 않는다.
        - 결과적으로 현재 우선순위 큐에서 꺼낸 노드와 연결된 다른 노드들을 확인하는 총 횟수는 최대 간선의 개수(E)만큼 연산이 수행될 수 있다.
    - 직관적으로 전체 과정은 E개의 원소를 우선순위 큐에 넣었다가 모두 빼내는 연산과 매우 유사하다.
        - 시간 복잡도를 O(ElogE)로 판단할 수 있다.
        - 중복 간선을 포함하지 않는 경우에 이를 O(ElogV)로 정리할 수 있다.
            - O(ElogE) -> O(ElogV²) -> O(2ElogV) -> O(ElogV)

## 4. 1916번 최소비용 구하기 문제 풀이
- 이 문제는 다익스트라 알고리즘을 이용하여 마지막에 구하고자 하는 구간 출발점의 도시에서부터 도착점의 도시까지의 최단 거리 출력해주면 된다.
- 소스코드
    ```python
    import heapq
    import sys
    input = sys.stdin.readline
    # 무한을 의미하는 값으로 10억을 설정
    INF = int(1e9)

    def dijkstra(start):
        q = []
        # 시작 노드로 가기 위한 최단 경로는 0으로 설정하여, 큐에 삽입
        heapq.heappush(q, (0, start))
        distance[start] = 0
         # 큐가 비어있지 않다면
        while q:
            # 가장 최단 거리가 짧은 노드에 대한 정보 꺼내기
            dist, now = heapq.heappop(q)
            # 현재 노드가 이미 처리된 적이 있는 노드라면 무시
            if distance[now] < dist:
                continue
            # 현재 노드와 연결된 다른 인접한 노드들을 확인
            for i in graph[now]:
                cost = dist + i[1]
                # 현재 노드를 거쳐서, 다른 노드로 이동하는 거리가 더 짧은 경우
                if cost < distance[i[0]]:
                    distance[i[0]] = cost
                    heapq.heappush(q, (cost, i[0]))

    if __name__ == "__main__":
        # 도시 개수 입력
        N = int(input())
        # 버스 대수 입력
        M = int(input())
        # 각 노드에 연결되어 있는 노드에 대한 정보를 담는 리스트를 만들기
        graph = [[] for _ in range(N + 1)]
        # 최단 거리 테이블을 모두 무한으로 초기화
        distance = [INF] * (N + 1)

        # 모든 간선 정보를 입력받기
        for _ in range(M):
            start_city, end_city, start_end_cost = map(int, input().split())
            # 시작 도시에서 도착 도시로 가는 비용 리스트에 저장
            graph[start_city].append((end_city, start_end_cost))
    
        # 구하고자 하는 구간 출발점의 도시번호와 도착점의 도시번호 입력
        start, end = map(int, input().split())

        # 다익스트라 알고리즘을 수행
        dijkstra(start)

        # 구하고자 하는 구간인 출발점의 도시에서부터 도착점의 도시까지의 최단 거리 출력
        print(distance[end])
    ```

## 5. 2665번 미로만들기 문제 풀이
- 이 문제는 다익스트라 알고리즘을 이용하여 흰방을 탐색하다가 검은 방을 만났을 때 검은 방 카운트를 추가해주면서 좌표가 NXN 좌표에 도달했을 때 현재 검은 방의 수를 반환해주는 방법으로 풀이했다.
- 소스코드
    ```python
    import heapq
    import sys
    input = sys.stdin.readline
    # 무한을 의미하는 값으로 10억을 설정
    INF = int(1e9)

    def dijkstra(black_room_cnt, x, y):
        q = []
        # 큐에 시작방에서의 흰방으로 바꾸어야 할 최소의 검은 방의 수와 시작방 좌표 삽입
        heapq.heappush(q, [black_room_cnt, x, y])
        distance[x][y] = black_room_cnt
        # 큐가 비어있지 않다면
        while q:
            # 현재 큐에 들어가있는 검은 방의 수와 x, y좌표 꺼내기
            black_room_cnt, x, y = heapq.heappop(q)

            # 불필요한 중복 연산을 허용하지 않게 하기 위해서 현재 검은 방의 수가 현재 방의 검은 방 수보다 크면 무시
            if black_room_cnt > distance[x][y]:
                continue
            
            # x, y 좌표가 N X N 좌표라면 검은 방의 수 반환
            if x == N - 1 and y == N - 1:
                return result
            
            # 상하좌우 탐색 시작
            for i in range(4):
                nx = x + dx[i]
                ny = y + dy[i]

                # nx, ny 좌표가 N X N 좌표를 넘어가지 않으면
                if 0 <= nx < N and 0 <= ny < N:
                    # 결과값에 최소 검은 방의 수 삽입
                    result = black_room_cnt
                    # nx, ny좌표 방이 검은 방이면 결과값 +1
                    if roomboard[nx][ny] == 0:
                        result += 1
                    # nx, ny 좌표의 검은 방 수가 결과값보다 크면 값 바꾸고, 큐에 삽입
                    if result < distance[nx][ny]:
                        distance[nx][ny] = result
                        heapq.heappush(q, [result, nx, ny])

    if __name__ == "__main__":
        # 백준 문제의 예제를 txt 파일에 미리 저장해놓고, 매번 복사 과정이 필요없이 바로 출력 가능할 수 있도록 해줌
        sys.stdin = open("input.txt","rt")

        # 한 줄에 들어가는 방의 수 N 입력
        N = int(sys.stdin.readline())
        # N개 줄의 각 줄마다 0과 1이 이루어진 길이가 N인 수열 입력
        roomboard = [list(map(int, sys.stdin.readline().strip())) for _ in range(N)]
        distance = [[INF] * N for _ in range(N)]

        # 방향 정보(상하좌우)
        dx = [-1, 1, 0, 0]
        dy = [0, 0, -1, 1]

        # 다익스트라 알고리즘을 수행
        # 매개변수로 흰방으로 바꾸어야 할 최소의 검은 방의 수와 시작방의 좌표 전달
        print(dijkstra(0, 0, 0))
    ```

## 6. 3주차 5일차를 마치며...
오늘도 역시나 문제 하나하나마다 너무 어려웠다... 하필 중간에 최단 경로를 구하는 문제가 있어서 다익스트라 알고리즘에 관해 급하게 개념과 구현 코드를 공부했다.

2665번 문제를 풀기 위해 고민하던 중, 새벽 1시 반이 넘어갈 때쯤 용현님이 기적처럼 오셔서 문제 접근 방법, 이 문제에 왜 다익스트라 알고리즘을 이용해야 하는지와 구현하는 데 많은 도움을 주셨다🤩. (용현님 없었으면 기숙사에 못 들어 갔을 듯...😇) 설명해 주시는 것을 듣고 직접 한 단계씩 구현해 나가다 보니 다익스트라 알고리즘에 대한 이해도가 많이 올라갔고, 어떤 방식으로 구현해야 하는지도 감이 잡혔다.

다른 분들도 문제가 어려워지고 배워야 하는 개념이 많아지다 보니 많이 힘들어하시는 것 같다. 이제 알고리즘 테스트까지 하루 남았으니 좀 더 힘내서 3주차 잘 마무리했으면 좋겠다. 화이팅~!