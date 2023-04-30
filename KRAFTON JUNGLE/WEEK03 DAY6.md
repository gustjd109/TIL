# WEEK03 DAY6 TIL
오늘은 전날 공부하고 문제를 풀었던 다익스트라 알고리즘에 대해 복습했다. 7569번 토마토와 2252번 줄 세우기 문제를 풀고, 2252번 문제를 풀기 위해 위상 정렬 개념을 공부했다.

## 1. 7569번 토마토 문제 풀이
- 이 문제는 모든 상자를 탐색해서 찾은 익은 토마토를 큐에 삽입해 준 후, BFS 알고리즘을 통해 익은 토마토와 인접한 익지 않은 토마토들을 익은 토마토로 갱신시켜 준다.
- 큐에 삽입한 익은 토마토가 없으면 반복문을 빠져나와 다시 상자를 탐색하여 익지 않은 토마토가 존재하면 -1을 아니라면 익은 토마토 중에서 가장 큰 값 - 1을 반환시켜 주는 방법을 통해 문제를 해결했다.
- 이 문제를 풀면서 하나 막혔던 부분은 3차원 배열의 위, 아래, 앞, 뒤, 좌, 우 방향을 통해 토마토를 탐색하는 것이었다.
    - 지속적해서 IndexError가 발생하여 확인해 보니, 좌표를 높이, 가로, 세로 순서로 넣어야 하는데 가로, 세로, 높이 순으로 넣어서 에러가 났었던 것이었다.
- 소스코드
    ```python
    import sys
    from collections import deque

    def bfs():
        # 큐가 비어있지 않다면 반복문 수행
        while queue:
            # 앞에서 찾은 익은 토마토의 높이, 가로, 세로 순서로 큐에서 삭제
            z, x, y = queue.popleft()
        
            # 위, 아래, 왼쪽, 오른쪽, 앞, 뒤 방향 순서로 익지 않은 토마토 탐색
            for i in range(6):
                nx = x + dx[i]
                ny = y + dy[i]
                nz = z + dz[i]
                # 좌표가 상자 범위를 벋어나지 않고, 해당 좌표의 토마토가 익지 않은 토마토라면 큐에 삽입하고 +1
                if 0 <= nx < N and 0 <= ny < M and 0 <= nz < H and box[nz][nx][ny] == 0:
                    queue.append([nz, nx, ny])
                    box[nz][nx][ny] = box[z][x][y] + 1

    if __name__ == "__main__":
        # 상자의 가로 칸의 수, 세로 칸의 수, 상자의 수 입력
        M, N, H = map(int, sys.stdin.readline().split())
        # 가장 밑의 상자부터 가장 위의 상자까지에 저장된 토마토들의 정보 입력
        box = [[list(map(int, sys.stdin.readline().split())) for _ in range(N)] for _ in range(H)]

        # 위, 아래, 왼쪽, 오른쪽, 앞, 뒤 방향 정보
        dx = [-1, 1, 0, 0, 0, 0]
        dy = [0, 0, -1, 1, 0, 0]
        dz = [0, 0, 0, 0, -1, 1]

        # 큐 구현을 위해 deque 라이브러리 사용
        queue = deque()
        # 상자에 익은 토마토가 있으면 큐에 삽입
        for i in range(H):
            for j in range(N):
                for k in range(M):
                    if box[i][j][k] == 1:
                        queue.append([i, j, k])

        # BFS 수행
        bfs()

        result = 0
        # BFS 수행 완료 후, 박스에 익지 않은 토마토가 있으면 -1 반환하고 프로그램 종료
        for i in range(H):
            for j in range(N):
                for k in range(M):
                    if box[i][j][k] == 0:
                        print(-1)
                        sys.exit(0)
                    # 모두 익은 토마토만 있다면 익은 토마토 중에서 가장 큰 수를 결과값으로 반환
                    else:
                        result = max(result, box[i][j][k])

        # 결과값 - 1이 최종 결과가 된다.
        print(result - 1)
    ```

## 2. 위상 정렬(Topology Sort)
- 위상 정렬이란?
    - 순서가 정해져 있는 일련의 작업을 차례대로 수행해야 할 때 사용할 수 있는 알고리즘이다.
    - 방향 그래프의 모든 노드를 '방향성에 거스르지 않도록 순서대로 나열하는 것'이다.
    - 큐를 이용하는 알고리즘이다.

- 진입차수(Indegree)와 진출차수(Outdegree)
    - 진입차수 : 특정한 노드로 들어오는 간선의 개수
    - 진출차수 : 특정한 노드에서 나가는 간선의 개수
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FwoC56%2FbtqSATVz83E%2Fg2UxZcKmalJcaIbVpAmZO1%2Fimg.png">

- 위상 정렬 알고리즘 동작 과정
    - 진입차수가 0인 모든 노드를 큐에 넣는다.
    - 큐가 빌 때까지 다음의 과정을 반복한다.
        - 큐에서 원소를 꺼내 해당 노드에서 나가는 건선을 그래프에서 제거한다.
        - 새롭게 진입차수가 0이 된 노드를 큐에 넣는다.
    - 결과적으로 각 노드가 큐에 들어온 순서가 위상 정렬을 수행한 결과와 같다.

- 위상 정렬 알고리즘의 구체적인 동작 과정
    - 위상 정렬을 수행할 그래프를 준비한다.
        - 이때 그래프는 사이클이 없는 방향 그래프(DAG)여야 한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FriBdW%2FbtqSxCfr7VG%2Fh3N6W5p73lxkWTJWs5f4zK%2Fimg.png">
    - [초기 단계] 초기 단계에서는 진입차수가 0인 모든 노드를 큐에 넣는다.
        - 처음에 노드 1이 큐에 삽입된다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FLHVAD%2FbtqSsQLVF60%2F8PAzC3pjDaGPBsMYj92Q3K%2Fimg.png">
    - [Step 1] 큐에서 노드 1을 꺼낸 뒤에 노드 1에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FG86vR%2FbtqSATVz85h%2FWAktuqlhu8jBdxd7qoGSj1%2Fimg.png">
    - [Step 2] 큐에서 노드 2를 꺼낸 뒤에 노드 2에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FtMwTO%2FbtqSGjspJxc%2FmtoY6ENiUJ1Bvfq4d8Juuk%2Fimg.png">
    - [Step 3] 큐에서 노드 5를 꺼낸 뒤에 노드 5에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb0WaJy%2FbtqSELbEwko%2F37cbUpQdmzuAcJtVWrFfPk%2Fimg.png">
    - [Step 4] 큐에서 노드 3를 꺼낸 뒤에 노드 3에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FAOoQb%2FbtqSpFRte1e%2FdkkUujX7KkduGekbALSIUK%2Fimg.png">
    - [Step 5] 큐에서 노드 6을 꺼낸 뒤에 노드 6에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb5B0zO%2FbtqSxCfr7Xu%2Fq0qD1K2NJZXKIE4g81Cytk%2Fimg.png">
    - [Step 6] 큐에서 노드 4를 꺼낸 뒤에 노드 4에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2F48K82%2FbtqSDugXPv7%2FtfbKBYUHzeIv7QvVXKoeLK%2Fimg.png">
    - [Step 7] 큐에서 노드 7을 꺼낸 뒤에 노드 7에서 나가는 간선을 제거한다.
        - 새롭게 진입차수가 0이 된 노드들을 큐에 삽입한다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbZiXVr%2FbtqSjBotIER%2FtQJgYuMrwkFmcPtA3OVOyk%2Fimg.png">
    - [위상 정렬 결과]
        - 큐에 삽입된 전체 노드 순서: 1 → 2 → 5 → 3 → 6 → 4 → 7
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbl7JC9%2FbtqSmAW9cdY%2FJC4IpfyADlrK0AtdoP0Qkk%2Fimg.png">

- 위상 정렬의 특징
    - 순환하지 않는 방향 그래프(DAG, Direct Acyclic Graph)에 대해서만 수행할 수 있다.
    - 여러 가지 답이 존재할 수 있다.
        - 한 단계에서 큐에 새롭게 들어가는 원소가 2개 이상인 때도 있다면 여러 가지 답이 존재한다.
    - 모든 원소를 방문하기 전에 큐가 빈다면 사이클이 존재한다고 판단할 수 있다.
        - 사이클에 포함된 원소 중에서 어떠한 원소도 큐에 들어가지 못한다.
    - 스택을 활용한 DFS를 이용해 위상 정렬을 수행할 수도 있다.

- 위상 정렬 알고리즘 구현
```python
from collections import deque

# 노드의 개수와 간선의 개수를 입력 받기
v, e = map(int, input().split())
# 모든 노드에 대한 진입차수는 0으로 초기화
indegree = [0] * (v + 1)
# 각 노드에 연결된 간선 정보를 담기 위한 연결 리스트 초기화
graph = [[] for i in range(v + 1)]

# 방향 그래프의 모든 간선 정보를 입력 받기
for _ in range(e):
    a, b = map(int, input().split())
    graph[a].append(b) # 정점 A에서 B로 이동 가능
    # 진입 차수를 1 증가
    indegree[b] += 1

# 위상 정렬 함수
def topology_sort():
    result = [] # 알고리즘 수행 결과를 담을 리스트
    q = deque() # 큐 기능을 위한 deque 라이브러리 사용

    # 처음 시작할 때는 진입차수가 0인 노드를 큐에 삽입
    for i in range(1, v + 1):
        if indegree[i] == 0:
            q.append(i)

    # 큐가 빌 때까지 반복
    while q:
        # 큐에서 원소 꺼내기
        now = q.popleft()
        result.append(now)
        # 해당 원소와 연결된 노드들의 진입차수에서 1 빼기
        for i in graph[now]:
            indegree[i] -= 1
            # 새롭게 진입차수가 0이 되는 노드를 큐에 삽입
            if indegree[i] == 0:
                q.append(i)

    # 위상 정렬을 수행한 결과 출력
    for i in result:
        print(i, end=' ')

topology_sort()

>>> 입력
7 8
1 2
1 5
2 3
2 6
3 4
4 7
5 6
6 4

>>> 출력
1 2 5 3 6 4 7
```

- 위상 정렬의 시간 복잡도
    - 위상 정렬을 수행할 때는 차례대로 모든 노드를 확인하면서 해당 노드에서 출발하는 간선을 차례대로 제거해야 한다.
    - 결과적으로 노드와 간선을 모두 확인한다는 측면에서 O(V + E)의 시간이 소요되기 때문에 위상 정렬의 시간 복잡도는 O(V + E)이다.

## 3. 2252번 줄 세우기 문제 풀이
- 이 문제는 위상 정렬 알고리즘을 그대로 이용하는 대표적인 문제로 공부한 위상 정렬 알고리즘을 통해 쉽게 해결할 수 있다.
- 소스코드
```python
import sys
from collections import deque

def topology():
    # 학생의 키 순서를 저장할 빈 리스트
    result = []
    # 큐 구현을 위해 deque 라이브러리 사용
    q = deque()

    # 진입 차수가 0인 학생을 큐에 삽입
    for i in range(1, N + 1):
        if indegree[i] == 0:
            q.append(i)

    # 큐가 비어있지 않으면 반복분 수행
    while q:
        # 큐에서 학생의 정보를 삭제
        now = q.popleft()
        # 결과값 저장 리스트에 꺼낸 학생 번호 삽입
        result.append(now)

        # 꺼낸 학생으로부터 진입 차수가 존재하는 학생들의 진입 차수 - 감소
        for i in graph[now]:
            indegree[i] -= 1
            # 진입 차수가 0인 학생이라면 큐에 삽입
            if indegree[i] == 0:
                q.append(i)

    # 키 순서대로 정렬된 학생의 번호 출력
    for i in result:
        print(i, end=' ')
    print()

if __name__ == "__main__":
    # 학생 수 N, 키 비교 횟수 M 입력
    N, M = map(int, sys.stdin.readline().split())
    # 진입차수 0으로 초기화
    indegree = [0] * (N + 1)
    # 두 학생의 번호 정보를 삽입할 빈 연결리스트 초기화
    graph = [[] for _ in range(N + 1)]

    # 두 학생의 번호 정보 삽입
    for _ in range(M):
        a, b = map(int, sys.stdin.readline().split())
        graph[a].append(b)
        # 삽입한 학생의 진입차수 1 증가
        indegree[b] += 1

    # 위상 정렬 알고리즘 수행
    topology()
```

## 4. 3주차 6일차를 마치며...
결국 모든 문제를 다 풀어보진 못했다...😥 그래도 유형별로 하, 중 정도의 문제들은 모두 풀어보면서 어떻게 관련된 알고리즘을 사용해야 하는지 정도는 파악이 된 것 같다. 난이도가 상인 플래티넘 문제는 정말 손도 못 댈 정도로 어려웠고, 남은 기간 꾸준히 문제를 풀어보면서 플래티넘 문제도 시간은 오래 걸려도 풀 수 있을 정도의 실력을 쌓았으면 좋겠다.

오늘 다들 피곤하고 집중력이 많이 떨어졌는지 12시 전에 거의 모두 방으로 돌아가셨다... 나도 집중력이 떨어져서 들어가고 싶었지만, 위상 정렬 개념과 한 문제 정도 풀어보고 가야겠다는 목표가 있어서 끝까지 마무리하고 방에 와서 TIL을 쓰며 마무리한다.

내일은 3주차 알고리즘 테스트 날인데 부디 한 문제라도 풀 수 있기를...🙏