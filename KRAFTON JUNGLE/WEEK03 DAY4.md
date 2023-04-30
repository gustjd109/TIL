# WEEK03 DAY4 TIL
오늘도 역시나 문제가 어려워서 한 문제당 시간을 너무 오래 잡고 있다 보니 21606번 아침 산책과 14888번 연산자 끼워넣기 문제밖에 풀지 못했다. 14888번 문제는 어느 정도 고민을 조금 오래 했지만, 어떻게 풀어야 할지 감이 잡히는 문제였고, 알고 봤더니 삼성 기출문제였다. 코딩 테스트 때 이 정도의 난이도의 문제만 나왔으면 좋겠다.😂

## 1. 21606번 아침 산책 문제 풀이
- 이 문제는 실내가 아닌 실외를 기준으로 잡고 가능한 경로의 수를 찾아야 한다.
- 실내 노드의 수가 3개이고, 실외 하나에 연결되어 있다고 가정하자.
    - 이때 실내에서 출발해서 도착할 수 있는 경우의 수는 6이다.
    - N개 중에 하나를 고르고, 나머지 N - 1개 중에 하나를 것이기에 N(N - 1)개의 경우의 수가 나온다.
- 실외 노드를 하나 잡고 DFS로 모든 실외 노드를 탐색하며 각 실외 노드가 가지고 있는 실내 노드들의 개수를 모두 합해준다.
- 실내 노드 개수들의 총합 N에 대하여 N(N - 1)을 하면 가능한 경로가 몇 가지인지 알 수 있기 때문이다.
- 이때 주위해야 할 점은, 실외 노드끼리 연결되는 경우의 두 가지 케이스이다.
    - 실외 노드끼리 인접해서 연결될 때(실외 <-> 실외)
    - 중간에 실내 노드를 끼고 있을 때(실외 <-> 실내 <-> 실외) : 이건 엄밀히 말하면 실외 노드가 연결되었다고 할 수 없다.
        - 이런 식으로 중간에 실내가 끼어있게 되면, 실내가 나왔을 때 탐색을 중단할 것이기에 저 건너편에 노드들이 있다면 해당 노드들은 탐색하지 못하게 된다.
        - 그래서 DFS를 일단 돌리고, 방문한 실외 노드들을 제외한 나머지 노드들에 대해 다시 돌리는 방법을 통해 실외 노드들을 모두 탐색해야 한다.
    - '실내 <-> 실내'도 2가지의 경로이다.
- 소스코드
    ```python
    import sys
    sys.setrecursionlimit(10**9)

    # DFS 함수 : V는 정점의 번호, cnt는 실외와 연결된 실내 노드 개수 카운트
    def dfs(v, cnt):
        visited[v] = True

        # 노드 V와 연결된 인접 노드를 하나씩 가져옴
        for i in graph[v]:
            # 해당 노드의 위치가 실내이면 실내 카운트 +1
            if location[i] == 1:
                cnt += 1
            # 방문하지 않았고 i번째 노드의 위치가 실외라면 해당 실외를 기준으로 DFS 수행
            elif not visited[i] and location[i] == 0:
                cnt = dfs(i, cnt)
        return cnt

    if __name__ == "__main__":
        ans = 0
        # 정점 개수 입력
        N = int(sys.stdin.readline())
        # 1과 0으로 이루어진 실내, 실외 정보 입력 : 인덱스 번호를 1부터 시작하기 위해 앞에 0으로 설정
        location = [0] + list(map(int, sys.stdin.readline().strip()))
        # 1번 노드부터 N번 노드까지 받아오기 위한 빈 공간 생성
        graph = [[] for _ in range(N + 1)]

        # 간선 정보 입력
        for _ in range(N - 1):
            a, b = map(int, sys.stdin.readline().split())
            graph[a].append(b)
            graph[b].append(a)
            # 둘 노드가 실내라면 서로 방문하는 케이스가 2가지이므로 2개 +
            if location[a] == 1 and location[b] == 1:
                ans += 2

        sum = 0
        visited = [False] * (N + 1)
        for i in range(1, N + 1):
            # 실외를 기준으로 dfs 실행
            if not visited[i] and location[i] == 0:
                # 현재 cnt는 0으로 설정
                x = dfs(i, 0)
                # 실외인 노드를 기준으로 인접 노드의 개수를 세는 것이 N * (N - 1)이므로 실외 노드 걸릴때마다 전부 세기
                sum += x * (x - 1)

        print(sum + ans)
    ```

## 2. 14888번 연산자 끼워 넣기 문제 풀이
- 이 문제는 DFS를 재귀적으로 호출하여 연산할 수 있는 모든 경우의 수를 계산하고, 한 경우에 대해 계산이 완료될 때마다 최대, 최소값을 갱신해줘야 한다.
- 결국 마지막 연산이 끝났을 때 갱신된 최대, 최소값이 결과값이 된다.
- 소스코드
    ```python
    import sys
    sys.setrecursionlimit(10**9)

    def dfs(i, now_val):
        global add, sub, mul, div, max_val, min_val

        # 인덱스가 N이 되면, 모든 연산을 완료한 것이므로 최대, 최소값 계산
        if i == N:
            max_val = max(max_val, now_val)
            min_val = min(min_val, now_val)

        else:
            # 더하기 연자가 1개 이상이면
            if add > 0:
                # 더하기 연산자 1개 사용할 것이므로 더하기 연산자 -1
                add -= 1
                # 다음 연산할 인덱스와 연산된 결과값 전달
                dfs(i + 1, now_val + array[i])
                # 연산이 완료되었으면 다시 연산자의 개수 +1
                add += 1
            if sub > 0:
                sub -= 1
                dfs(i + 1, now_val - array[i])
                sub += 1
            if mul > 0:
                mul -= 1
                dfs(i + 1, now_val * array[i])
                mul += 1
            if div > 0:
                div -= 1
                dfs(i + 1, int(now_val / array[i]))
                div += 1

    if __name__ == "__main__":
        # 초기 최대, 최소값 설정
        max_val, min_val = -sys.maxsize, sys.maxsize
        # 수의 개수 입력
        N = int(sys.stdin.readline())
        # 수열 입력
        array = list(map(int, sys.stdin.readline().split()))
        # 연산자 수 입력
        add, sub, mul, div = map(int, sys.stdin.readline().split())

        dfs(1, array[0])

        print(max_val)
        print(min_val)
    ```

## 3. 3주차 4일차를 마치며...
이번 주 문제가 너무 어렵고 공부해야 할 개념이 많다 보니 집중력이 많이 떨어지는 거 같다... 다시 정신 차리고 집중해서 이번 주 문제 모두 마무리할 수 있도록 더 노력해야겠다.
마무리는 짧게 마무리하고 내일 다시 몰입 모드 돌입!!!🔥