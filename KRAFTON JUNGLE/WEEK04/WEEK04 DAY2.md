# WEEK04 DAY TIL
어제에 이어서 동적 프로그래밍 문제를 풀었고, 12865번 평범한 배낭 문제를 풀기 위해서 냅색 알고리즘를 학습했다.

## 1. 냅색 알고리즘(Knapsack Algorithm)
<img src="https://velog.velcdn.com/images%2Fuoayop%2Fpost%2Fa4cdc042-516b-4dcc-aefd-33b0039c22aa%2Fimage.png">

- 냅색 알고리즘이란?
    - 유명한 다이나믹 프로그래밍 문제 중 하나이다.
    - 가방에 담을 수 있는 무게엔 한계가 있고, 각 물건엔 가치가 정해져 있다. 가방에 최대치로 물건을 담았을 때, 최대의 가치값을 구하는 문제다.
    - 언듯 그리디 알고리즘과 비슷해 보이지만 최적의 해가 나오지 않을 때도 있다.
    - 두 가지 유형으로 나뉜다.

- 두 가지 유형의 냅색 알고리즘
    - Fraction Knapsack
        - 물건의 가격을 무게로 나누어 무게 대비 가격이 비싼 순서로 물건을 정렬해서 넣으면 쉽게 해결할 수 있는 문제이다.
        - 남은 배낭이 감당할 수 있는 무게보다 물건의 무게가 많이 나가면 잘라서 넣으면 된다.
        - greedy로 해결할 수 있다.
    - 0-1 Knapsack
        - 물건을 자를 수 없으므로 물건, 물건의 무게, 물건의 가격, 배낭의 남은 용량을 모두 고려해야 하는 문제이다.
        - 다이나믹 프로그래밍으로 해결할 수 있다.

- 다이나믹 프로그래밍을 이용한 냅색 알고리즘 풀이
    - 가방에 최대 M kg까지 담을 수 있을 때, dp[i][j] = 처음부터 i번째까지의 물건을 살펴보고, 배낭의 용량이 j였을 때 배낭에 들어간 물건의 가치합의 최댓값
    - 현재 물건이 해당 열의 무게보다 크면
        - 현재 물건을 담을 수 없으므로 이전 물건의 현재 무게의 값을 복사한다.
        - dp[i][j] = dp[i - 1][j]
    - 현재 물건이 해당 열의 무게보다 작거나 같으면
        - 현재 물건을 담을 수 있다.
        - 물건을 담았을 때와 담지 않았을 때의 가치를 비교해 준 뒤 더 큰 값을 할당해 준다.
        - 현재 물건의 가치는 v이다.
        - dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - items[i][0]] + items[i][1])
            - 말로 풀어서 설명 : dp[i][j] = max(dp[이전 물건][현재 가방 무게], dp[이전 물건][현재 가방 무게 - 현재 물건 무게] + 현재 물건 가치)
    - 물건의 최대 가치는 dp[가방 크기][물건의 개수]로 구할 수 있다.

## 2. 12865번 평범한 배낭 문제 풀이
- 문제의 제목처럼 평범한 다이나믹 프로그래밍 문제로 냅색 알고리즘의 대표적인 문제이다.
- 각 물품을 탐색하고, 1 ~ 최대무게를 탐색한다.
- 현재 물건이 해당 열의 무게보다 작거나 같으면, 현재 물건을 담을 수 있으므로 물건을 담았을 때와 담지 않았을 때의 가치를 비교해준 뒤 더 큰 값을 할당한다.
- 현재 물건이 해당 열의 무게보다 크면, 현재 물건을 담을 수 없으므로 이전 물건의 현재 무게의 값을 할당한다.
- 소스코드
    ```python
    import sys

    def DP(N, K):
        # 각 물품을 탐색하고, 1 ~ 최대무게를 탐색
        for i in range(1, N + 1):
            for j in range(1, K + 1):
                # 현재 물건이 해당열의 무게보다 작거나 같으면, 
                # 현재 물건을 담을 수 있으므로 물건을 담았을 때와 담지 않았을 때의 가치를 비교해준 뒤 더 큰 값을 할당
                if j >= items[i][0]:
                    dp[i][j] = max(dp[i - 1][j], dp[i - 1][j - items[i][0]] + items[i][1])
                # 현재 물건이 해당열의 무게보다 크면, 
                # 현재 물건을 담을 수 없으므로 이전 물건의 현재 무게의 값을 할당
                else:
                    dp[i][j] = dp[i - 1][j]
        return dp[-1][-1]

    if __name__ == "__main__":
        # 물품의 수 N과 준서가 버틸 수 있는 무게 K 입력
        N, K = map(int, sys.stdin.readline().split())
        # 각 물건의 무게 W와 가치 V를 N개 만큼 입력
        items = [[0, 0]]
        for i in range(1, N + 1):
            items.append(list(map(int, sys.stdin.readline().split())))
        # DP테이블 생성 : i, j가 1이상일 때부터 검사할 수 있도록 편의상 i, j가 0일때는 모두 0을 넣어 마진값 설정
        dp = [[0] * (K + 1) for _ in range(N + 1)]
    
        print(DP(N, K))
    ```

## 3. 4주차 2일차를 마치며...
오늘은 오랜만에 집에 가는 날이라 팀원들과 저녁 식사 후, 부모님을 기다리면서 그동안 읽지 못했던 컴퓨터 시스템 책을 읽었다. 책이 어려운 건지 내가 못 읽는 건지 한 장 읽는 데 시간이 너무 오래 걸리고, 한 문장을 읽는데 이해가 하나도 안 돼서 몇 번씩 읽었다... 머릿속에 잘 안 들어와도 정리하면서 4주차 남은 시간 동안 틈틈이 3장까지 꼭 읽어야겠다.

요즘 집중력이 처음보다 많이 떨어져서 집에 가는 김에 맛있는 것도 먹고 집에서 편하게 좀 푹 쉬면서 다시 힘내서 공부할 수 있게 충전 좀 하고 와야겠다.