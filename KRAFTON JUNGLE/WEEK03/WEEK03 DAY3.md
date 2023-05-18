# WEEK03 DAY3 TIL
오늘은 DFS 11725번 트리의 부모 찾기와 1707번 이분 그래프 문제를 풀었고, 1707번 문제를 풀기 위해 이분 그래프에 관해서도 공부했다.

이제 문제 하나하나가 너무 어려워져서 한 문제 푸는데도 시간이 너무 오래걸린다...⌛️

## 1. 11725번 트리의 부모 찾기 문제 풀이
- 해당 문제는 DFS 알고리즘을 이용하여 조금만 생각을 바꿔보니 바로 해결할 수 있는 문제였다.
- 루트를 1로 지정해 줬으므로 1부터 DFS 탐색을 시작하고, 1과 연결된 정점을 탐색하면서 부모 노드를 저장하는 것이다.
- DFS는 항상 부모에서 자식 노드로 이동한다는 점을 이용했다.
- 소스코드
    ```python
    import sys
    sys.setrecursionlimit(10**9)

    def dfs(i):
        visited[i] = True
        for j in graph[i]:
            if not visited[j]:
                dfs(j)
                parent[j] = i

    if __name__ == "__main__":
        N = int(sys.stdin.readline())
        graph = [[] for _ in range(N + 1)]
        visited = [False] * (N + 1)
        parent = [0] * (N + 1)
    
        for _ in range(N - 1):
            a, b = map(int, sys.stdin.readline().split())
            graph[a].append(b)
            graph[b].append(a)

        for i in range(1, N + 1):
            graph[i].sort()

        dfs(1)

        for i in range(2, N + 1):
            print(parent[i])
    ```

## 2. 이분 그래프(Bipartite Graph)
- 이분 그래프란?
    - 그래프의 모든 정점이 두 그룹으로 나누어지고 서로 다른 그룹의 정점만이 간선으로 연결된 그래프이다.
    - 정점을 어떠한 방법으로든 두 개의 집합으로 나눴을 때 각 집합의 정점끼리 간선이 존재하지 않게 나눌 수 있으면 이분 그래프이다.
    - DFS와 BFS 알고리즘을 이용하여 이분 그래프를 판별할 수 있다.
    - 아래 이미지에서 1, 2, 3은 이분 그래프이고, 4는 같은 집합끼리 간선이 연결되어 있으므로 이분 그래프가 아니다.
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbaddKu%2FbtrwUj2aHo4%2F5i8vk62DJ9kZYwKJ8kkJX0%2Fimg.png">

- 이분 그래프 판별 방법
    - 모든 정점에 대해 각 정점에서 DFS 또는 BFS를 진행하면서 2개 종류의 집합을 번갈아 가며 설정한다.
        - 두 종류의 집합을 True, False 또는 1, -1로 해도 상관없으며, 체크만 가능하면 된다.
    - DFS 또는 BFS를 진행하다가 인접한(간선이 연결된) 정점이 자신과 같은 종류의 집합이라면 이분 그래프가 아니며, 모두 통과되었다면 이분 그래프이다.

## 3. 1707번 이분 그래프 문제 풀이
- 이 문제를 풀기 위해 이분 그래프를 공부하다가 두 그룹으로 나누어 해결한다는 것을 알고 아래 과정을 통해 해결했다. 크루스칼 알고리즘과 마찬가지로 이분 그래프 판별하는 코드 정도는 외워둘 필요가 있는 것 같다...
- 해당 문제는 DFS로 탐색하면서 인접 노드로 탐색을 이어 나갈 때, 현재 그룹과 다른 그룹으로 표시해 둔다.
- 인접 노드 중에서 현재 노드의 그룹과 같은 그룹에 속한 노드를 만나게 되면 이분 그래프가 아니므로 'NO'를 출력하고, 아니면 'YES'를 출력하는 과정을 이용하여 해결했다.
- 소스코드
    ```python
    import sys
    sys.setrecursionlimit(10**9)

    def dfs(v, group):
        global bipatite

        # 이분 탐색이 아니라면 리턴
        if not bipatite:
            return
    
        # V정점을 첫 번째 그룹으로 등록
        visited[v] = group
        for i in graph[v]:
            # V정점과 인접한 i정점이 방문 상태가 아니라면 dfs함수 호출
            if not visited[i]:
                # 인접 정점은 두 번째 그룹으로 등록
                dfs(i, -group)
            # V정점과 인접한 i정점이 같은 그룹이라면 이분 그래프가 아니므로 False값 리턴
            elif visited[i] == visited[v]:
                bipatite =  False
                return

    if __name__ == "__main__":
        K = int(sys.stdin.readline())

        for _ in range(K):
            V, E = map(int, sys.stdin.readline().split())
            graph = [[] for _ in range(V + 1)]
            visited = [False] * (V + 1)
            # 이분 그래프인지 확인하기 위한 플래그 변수(True : 이분 그래프 O, False : 이분 그래프 X)
            bipatite = True
        
            for _ in range(E):
                a, b = map(int, sys.stdin.readline().split())
                graph[a].append(b)
                graph[b].append(a)

            # 정점 1부터 V정점까지 방문 처리가 되어있지 않다면 dfs함수 호출
            for i in range(1, V + 1):
                if visited[i] == False:
                    dfs(i, 1)
                    # 만약 이분 그래프가 아니라면 반복문 탈출
                    if not bipatite:
                        break

            print('YES' if bipatite else 'NO')
    ```

## 4. 3주차 3일차를 마치며...
너무 피곤해서 오늘은 평소보다 조금 늦게 일어나서 룸메이트인 대겸님과 아침 겸 점심으로 편의점 도시락을 먹었다.🍙 다 좋은데 밥 고민하는 게 너무 시간이 오래 걸려서 싫다.

평일 점심은 코뮨 카페에서 백반을 먹는데 월말에 다음 달 거를 미리 신청해야지 먹을 수 있고 인원 제한도 있어서 못 먹을 수도 있다...
그리고 주변에 마땅한 식당이 없어서 저녁은 거의 반원들과 배달 음식을 시켜 먹는다. (식비가 많이 깨지는 듯...💵)

점심 먹고 조금 쉬었다가 강의실에서 하면 집중력이 떨어지는 거 같아 방에서 공부했지만, 똑같이 집중을 하나도 못 해서 제대로 공부를 못 했다. 다음 주 일요일에는 머리 커트하러 한 번 외출하는 김에 장소를 바꿔 카페 같은 곳에서 공부를 해봐야겠다.