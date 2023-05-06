# WEEK05 DAY2 TIL
오늘은 백준 11660번 구간 합 구하기 5 문제를 풀었다.
어제에 이어서 C언어 포인터에 대해 복습하고, 2중 3중 포인터 등 남은 포인터 내용을 학습했다.
추가로 구조체, 동적 메모리 할당, 메모리 누수에 대해서도 학습했다.
구조체에서 자기 참조 구조체는 연결 리스트나 트리를 만들 때 사용된다고 하는데 RB Tree를 구현할 때 사용해야 할 것으로 보인다.

## 1. 11660번 구간 합 구하기 5 문제 풀이
- 일반적으로 생각한 풀이
    - 예제에 대한 답은 잘 나오는 데 문제가 분명 이렇게 쉽지 않은 문제일 게 분명하다.
    - 분명 시간초과가 나올 걸 알았지만 혹시 몰라서 시도해 봤다.
    - 역시나 시간초과가 뜬다.
    - 소스코드
        ```python
        import sys

        def solve():
            result = 0
            for i in range(x1 - 1, x2):
                for j in range(y1 - 1, y2):
                    result += arr[i][j]
            print(result)

        if __name__ == "__main__":
            sys.stdin = open("input.txt","rt")
            N, M = map(int, sys.stdin.readline().split())
            arr = [list(map(int, sys.stdin.readline().split())) for _ in range(N)]

            for _ in range(M):
                x1, y1, x2, y2 = map(int, sys.stdin.readline().split())
                solve()
        ```
- 다이나믹 프로그래밍 + 누적합을 이용한 풀이
    - 이 문제는 일반적으로 반복문을 이용하여 풀이하면 시간초과가 발생한다.
    - 누적합(Prefix Sum)과 다이나믹 프로그래밍을 통해 이미 계산된 각 칸의 누적합을 결과값을 계산하는 데 이용하면 시간초과를 해결할 수 있다.
    - 예를 들어, 크기가 N인 표가 있다고 하자.
        - 표의 시작점을 (1, 1), 끝지점을 (N, N)이라고 했을 때, (N, N)의 누적합을 구하는 방법은 다음과 같다.
        - (N, N)의 값 + (N - 1, N)의 누적합의 값 + (N, N - 1)의 누적합의 값 - (N - 1, N - 1)의 누적합의 값
        - (N - 1, N - 1)의 누적합의 값을 빼주는 이유는 (N - 1, N)의 누적합의 값과 (N, N - 1)의 누적합의 값을 더해줄 때, (N - 1, N - 1)의 누적합의 값이 중복해서 더해지기 때문이다.
        - 위 식을 점화식으로 표현하면 다음과 같다.
            - DP[i][j] = arr[i - 1][j - 1] + DP[i - 1][j] + DP[i][j - 1] - DP[i - 1][j - 1]
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbxFMob%2FbtraJoKVHED%2FhNdOEnx7o7tDy8LDscJny0%2Fimg.png">
    - 이 문제는 누적합이 아닌 구간합을 구하는 문제이므로, 어떤 구간에 대한 합을 구하는 방법에 대해 알아보자.
        - 예를 들어, 크기가 3인 표가 있다고 하자.
        - (x1, y1) ~ (x2, y2)의 구간합을 구하는 방법은 다음과 같다.
        - (x2, y2)의 누적합의 값 - (x1 - 1, y2)의 누적합의 값 - (x2, y1 - 1)의 누적합의 값 + (x1 - 1, y1 - 1)의 누적합의 값
        - (x1 - 1, y1 - 1)의 누적합의 값을 더해주는 이유는 (x1 - 1, y2)의 누적합의 값과 (x2, y1 - 1)의 누적합의 값을 빼줄 때, (x1 - 1, y1 - 1)의 누적합의 값이 중복해서 빼지기 때문이다.
        - 위 식을 점화식으로 표현하면 다음과 같다.
            - result = DP[x2][y2] - DP[x1 - 1][y2] - DP[x2][y1 - 1] + DP[x1 - 1][y1 - 1]
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FM4y1i%2FbtrBmPnRhMM%2FK69sop86wZRJDAK58dRa3K%2Fimg.png">
    - 문제 풀이 과정을 적을 때 이미지나 표를 통해 정리하면 더 도움이 될 것 같은데 아쉽다..., 패드를 하나 사야하나...😅
    - 소스코드
        ```python
        import sys

        def prefix_sum():
            for i in range(1, N + 1):
                for j in range(1, N + 1):
                    DP[i][j] = arr[i - 1][j - 1] + DP[i - 1][j] + DP[i][j - 1] - DP[i - 1][j - 1]
    
        def range_sum():
            result = DP[x2][y2] - DP[x1 - 1][y2] - DP[x2][y1 - 1] + DP[x1 - 1][y1 - 1]
            print(result)

        if __name__ == "__main__":
            sys.stdin = open("input.txt","rt")
            N, M = map(int, sys.stdin.readline().split())
            arr = [list(map(int, sys.stdin.readline().split())) for _ in range(N)]
            DP = [[0] * (N + 1) for _ in range(N + 1)]
            prefix_sum()

            for _ in range(M):
                x1, y1, x2, y2 = map(int, sys.stdin.readline().split())
                result = 0
                range_sum()
        ```

## 2. 5주차 2일차를 마치며...
오늘은 그래도 어제 계획했던 것 중에서 균형 이진 트리와 RB Tree 개념을 제외한 나머지 항목에 대해서 학습을 모두 완료했고, 백준 문제도 풀었다.
물론, 학습한 내용에 대해서 아직 완벽하게 이해하지 못한 부분도 있지만 앞으로 공부하면서 하나씩 채워나가야할 것 같다.

내일은 드디어 균형 이진 트리와 RB Tree 개념에 대해 학습하고, RB Tree 구현을 시작하는 것을 목표로 학습할 계획이다.