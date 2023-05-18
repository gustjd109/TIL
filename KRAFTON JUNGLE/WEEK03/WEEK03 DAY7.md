# WEEK03 DAY7 TIL
오늘은 3주차 알고리즘 테스트가 있는 날이다. 이번 알고리즘 테스트 문제는 모두 BFS, DFS와 관련된 문제가 출제되었고, 마지막 문제만 해결하고 나머지 두 문제는 풀지 못했다. 이상하게 골드인 18405번 문제는 생각의 흐름대로 풀 수 있을 거 같아서 풀었더니 풀렸지만, 실버인 2667번과 1388번 문제가 더 접근하기 어렵고 풀기 힘들었다. 테스트를 마치고 풀지 못했던 2문제를 다시 풀어봤다.

## 1. 3주차 알고리즘 테스트
- 18405번 경쟁적 전염 문제 풀이
    - 알고리즘 테스트 3문제 중에서 이 문제가 그나마 의식의 흐름대로 풀 수 있었던 문제였다.
    - 이 문제를 처음 봤을 때 7569번 토마토 문제와 비슷하게 접근하면 되겠다고 생각했다. 시험관에 있는 바이러스들을 리스트에 넣고, 번호가 낮은 종류의 바이러스부터 먼저 증식한다는 조건에 따라 정렬시켜 줬다.
    - 정렬된 리스트를 이용해서 BFS를 수행하면서 카운트가 입력받은 초와 같다면 반복문을 빠져나와 결과를 출력하는 방식으로 해결했다.
    - 반복문을 수행할 때, 큐에 들어간 바이러스 개수가 모두 빠져나와서 탐색을 끝내야지만 1초가 끝나는 걸로 조건을 추가해 줬다.
    - 소스코드
        ```python
        import sys
        from collections import deque

        def BFS():
            # 바이러스 정보 리스트를 통해 큐 생성
            queue = deque(virus)
            # 몇 초 실행했는지 확인하기 위한 카운트 변수
            cnt = 0
            # 큐가 비어있지 않을 때까지 반복문 수행
            while queue:
                # 카운트가 입력한 초와 같다면 반복문 탈출
                if cnt == s:
                    break
                # 큐에 삽입된 바이러스 개수만큼 반복문 수행
                for _ in range(len(queue)):
                    # 큐에서 가장 작은 번호인 바이러스 번호와 좌표 삭제
                    v_num, v_num_x, v_num_y = queue.popleft()
                    # 상하좌우 탐색
                    for j in range(4):
                        nx = dx[j] + v_num_x
                        ny = dy[j] + v_num_y
                        # 시험관 범위 안에 있고, 값이 0이면 값을 현재 바이러스 번호로 바꾸고 큐에 삽입
                        if 0 <= nx < n and 0 <= ny < n and graph[nx][ny] == 0:
                            graph[nx][ny] = v_num
                            queue.append((graph[nx][ny], nx, ny))
                # 큐에 삽입된 바이러스 개수만큼 반복문을 모두 수행했다면 카운트 1증가
                cnt += 1
            # 결과값 출력
            print(graph[x - 1][y - 1])

        if __name__ == "__main__":
            # 시험관 크기 N, 바이러스 번호 K 입력
            n, k = map(int, sys.stdin.readline().split())
            # 시험관 정보 빈 리스트
            graph = []
            #바이러스 정보 빈 리스트
            virus = []
    
            # N 줄에 걸쳐서 시험관 정보를 입력하고, 바이러스 정보를 바이러스 리스트에 삽입
            for i in range(n):
                graph.append(list(map(int, sys.stdin.readline().split())))
                for j in range(n):
                    if graph[i][j] != 0:
                        virus.append((graph[i][j], i, j))

            # 번호가 낮은 종류의 바이러스부터 먼저 증식하기 때문에 바이러스 정보가 들어간 리스트 정렬
            virus.sort()

            # 초 S, 찾고자 하는 바이러스 좌표 입력            
            s, x, y = map(int, sys.stdin.readline().split())

            # 상하좌우 방향 정보
            dx = [-1, 1, 0, 0]
            dy = [0, 0, -1, 1]

            # BFS 알고리즘 수행
            BFS()
        ```

- 2667번 단지 번호 붙이기 문제 풀이
    - 이 문제는 지도를 탐색하면서 방문하지 않은 집을 찾은 후, 해당 집에 대해서 BFS를 먼저 수행시킨다.
    - BFS를 수행할 때, 찾은 집에 대해서 상하좌우로 집이 있으면 카운트 개수를 증가시켜 준다.
    - BFS 수행을 완료하면 카운트 개수를 반환하게 되는데 이때 카운트 개수가 한 단지의 전체 집 개수이다.
    - 단지의 길이와 오름차순으로 정렬된 단지의 집 개수를 출력해 주어 마무리한다.
    - 소스코드
        ```python
        import sys
        from collections import deque

        def BFS(x, y):
            # 집 하나를 찾았기 때문에 집 카운트 개수 1로 초기화
            cnt = 1
            queue = deque()
            # 큐에 찾은 집의 정보 삽입
            queue.append((x, y))
            # 찾은 집 방문 체크
            visited[x][y] = True
            # 큐가 비어있을 때까지 반복문 수행
            while queue:
                # 찾은 집의 정보 삭제
                x, y = queue.popleft()
                # 찾은 집의 상하좌우 방향 탐색
                for i in range(4):
                    nx = dx[i] + x
                    ny = dy[i] + y
                    # 찾은 집의 상화좌우 방향에 있는 데이터 중에서 지도의 크기를 넘어가지 않고, 방문하지 않았고, 집인 경우 큐에 찾은 집 삽입하고 방문체크
                    if 0 <= nx < N and 0 <= ny < N and visited[nx][ny] == False and house_map[nx][ny] == 1:
                        queue.append((nx, ny))
                        visited[nx][ny] = True
                        # 집을 하나 찾았기 때문에 집 카운트 개수 1증가
                        cnt += 1
            # 반복문 수행을 완료한 뒤, 집 카운트 개수 반환
            return cnt

        if __name__ == "__main__":
            # 지도의 크기 N 입력
            N = int(sys.stdin.readline())
            # N X N 지도에 집이 있는 곳 입력
            house_map = [list(map(int, sys.stdin.readline().strip())) for _ in range(N)]
            # 집 방문 체크
            visited = [[False for _ in range(N)] for _ in range(N)]
            # 단지별 집 개수 카운트 정보 리스트
            result = []
            # 상하좌우 방향 정보
            dx = [-1, 1, 0, 0]
            dy = [0, 0, -1, 1]

            # 지도에서 방문하지 않고, 값이 1인(집인 경우) 인덱스에 대해서 BFS 수행
            for i in range(N):
                for j in range(N):
                    if visited[i][j] == False and house_map[i][j] == 1:
                        # BFS 수행 완료 후, 반환된 집 카운트 개수 정보를 리스트에 삽입
                        result.append(BFS(i, j))
    
            # 단지별 집 개수 정보 리스트 길이 출력
            print(len(result))
            # 단지별 집 개수 정보 리스트 오름차순 정렬
            result.sort()
            # 정렬된 단지별 집 개수 정보 리스트 출력
            for i in range(len(result)):
                print(result[i])
        ```

- 1388번 바닥 장식 문제 풀이
    - 이중 for문을 이용하여 '-'과 '|' 모양의 바닥 장식을 따로 나누어 세는 방법을 사용하여 해결했다.
    - DFS를 사용하지 않은 풀이
        - 소스코드
            ```python
            import sys

            if __name__ == "__main__":
                # 방 바닥의 세로 크기 N과 가로 크기 M 입력
                N, M = map(int, sys.stdin.readline().split())
                # 방 바닥 장식 모양 정보 입력
                floor_decoration_shape = [list(sys.stdin.readline().strip()) for _ in range(N)]
                # 방 바닥을 장식하는데 필요한 나무 판자의 개수 0으로 초기화
                cnt = 0

                # '-' 모양의 바닥 장식 개수 세기
                for i in range(N):
                    shape = ''
                    for j in range(M):
                        if floor_decoration_shape[i][j] == '-':
                            if floor_decoration_shape[i][j] != shape:
                                cnt += 1
                        shape = floor_decoration_shape[i][j]

                # '|' 모양의 바닥 장식 개수 세기
                for j in range(M):
                    shape = ''
                    for i in range(N):
                        if floor_decoration_shape[i][j] == '|':
                            if floor_decoration_shape[i][j] != shape:
                                cnt += 1
                        shape = floor_decoration_shape[i][j]

                print(cnt)
            ```
    - DFS를 사용한 풀이
        - 방 바닥을 탐색하면서 '-'와 '|' 모양의 바닥 장식을 찾은 후, DFS를 수행한다.
        - DFS 수행 시, 위의 풀이와 동일하게 '-'와 '|'를 나누어서 DFS를 재귀호출하여 문제를 해결했다.
        - 소스코드
            ```python
            import sys
            sys.setrecursionlimit(10**9)

            def DFS(x, y):
                # 바닥 장식이 '-'일 경우
                if floor_decoration_shape[x][y] == '-':
                    # 찾은 바닥 방문처리
                    floor_decoration_shape[x][y] = 1
                    # 바닥 범위를 벗어나지 않고, 장식이 '-'인 좌우 바닥 탐색하여 DFS 수행
                    for _y in [1, -1]:
                        ny = y + _y
                        if 0 <= ny < M and floor_decoration_shape[x][ny] == '-':
                            DFS(x, ny)

                # 바닥 장식이 '|'일 경우
                if floor_decoration_shape[x][y] == '|':
                    # 찾은 바닥 방문처리
                    floor_decoration_shape[x][y] = 1
                    # 바닥 범위를 벗어나지 않고, 장식이 '|'인 좌우 바닥 탐색하여 DFS 수행
                    for _x in [1, -1]:
                        nx = x + _x
                        if 0 <= nx < N and floor_decoration_shape[nx][y] == '|':
                            DFS(nx, y)

            if __name__ == "__main__":
                # 방 바닥의 세로 크기 N과 가로 크기 M 입력
                N, M = map(int, sys.stdin.readline().split())
                # 방 바닥 장식 모양 정보 입력
                floor_decoration_shape = [list(sys.stdin.readline().strip()) for _ in range(N)]
                # 방 바닥을 장식하는데 필요한 나무 판자의 개수 0으로 초기화
                cnt = 0

                # 방 바닥을 모두 탐색하면서 장식이 '-' 또는 '|'인 것을 찾아 DFS 수행
                # DFS 수행을 완료할 떄마다 카운트 1증가
                for i in range(N):
                    for j in range(M):
                        if floor_decoration_shape[i][j] == '-' or floor_decoration_shape[i][j] == '|':
                            DFS(i, j)
                            cnt += 1

                print(cnt)
            ```

## 2. 3주차 7일차를 마치며...
여담으로 오늘 코뮨 카페에서 다음 달 백반을 선착순으로 신청하는 날이었다.

우리 반은 다 같이 알고리즘 테스트와 발제를 마치고 1시간 일찍 카페에 가서 미리 대기했고, 조금 시간이 지나자 다른 반 교육생들도 하나둘 오기 시작했다.🍱(오늘 저녁인 초밥~ 너무 맛있었다)

다행히 일찍 온 덕분에 신청할 수 있었지만, 우리 반에서 한 분이 신청하지 못하셨다.🥺 카페에서 추가로 5명을 더 받을 수 있는지 회의를 통해 알려주시겠다고 하셨고(꼭! 신청해서 다 같이 점심 식사할 수 있었으면 좋겠다...🙏), 대기 번호를 받으신 상태이다. 

매달 말에 이렇게 점심을 위해 오픈런 해야된다고 생각하니 머리가 아프다...🤯

오늘은 3주차 마지막 날로 내일부터 4주차가 다시 시작된다. 4주차는 그나마 문제 수가 적지만, 문제 난이도에 따라 또 어떻게 달리질지 모르겠다. 꼭 모든 문제를 풀고 복습 또는 다른 공부도 같이할 수 있는 시간을 만들 수 있도록 열심히 해야겠다.🔥

내일부터는 4주차 문제와 관련된 다이나믹 프로그래밍과 그리디 알고리즘에 관해 학습한 후, 문제를 풀 계획이다.