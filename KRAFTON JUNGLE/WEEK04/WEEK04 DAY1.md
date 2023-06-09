# WEEK04 DAY1 TIL
오늘은 4주차 알고리즘 문제를 풀기 전, 동적 프로그래밍에 대해서 학습하고 2748번, 1904번, 9084번, 9251번 문제를 풀었다.
그중에서 규칙 찾고 점화식을 생각하는 게 가장 힘들었던 9084번과 9251번 문제에 대해 접근 방법 및 풀이를 정리해 봤다.

## 1. 다이나믹 프로그래밍(Dynamic Programming)
- 다이나믹 프로그래밍이란?
    - 큰 문제를 작게 나누고, 같은 문제라면 한 번씩만 풀어 문제를 효율적으로 해결하는 알고리즘 기법이다.
    - 동적 계획법이라고도 부른다.

- 일반적인 프로그래밍에서의 동적(Dynamic)이란?
    - 프로그래밍에서의 동적은 '프로그램이 실행되는 도중에'라는 의미이다.
    - 자료구조에서의 동적 할당(Dynamic Allocation)은 '프로그램이 실행되는 도중에 실행에 필요한 메모리를 할당하는 기법'을 의미한다.
    - 다이나믹 프로그래밍에서의 동적은 별다른 의미 없이 사용된 단어이다.

- 피보나치 수열
    - 피보나치 수열이란?
        - 다이나믹 프로그래밍으로 해결할 수 있는 대표적인 문제이다.
        - 이전 두 항의 합을 현재의 항으로 설정하는 특징을 가진 수열이다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FA3UPa%2FbtqJ0nLUiJZ%2Fqu22SYb2vymzgbVonitKh1%2Fimg.png">
        - 점화식이란 '인접한 항들 사이의 관계식'을 의미하며, 피보나치 수열의 점화식은 다음과 같다.
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbOtyDC%2FbtqJ0ocZjjW%2Fyl4WyWeHzTzXKFdfGRu9jk%2Fimg.png">
            - 이를 해석하면 다음과 같다.
                - n번째 피보나치 수 = (n - 1)번째 피보나치 수 +(n - 2)번째 피보나치 수
                - 단, 1번째 피보나치 수와 2번째 피보나치 수 = 1

- 단순 재귀 함수를 이용한 피보나치 수열과 문제점
    - 재귀 함수를 이용한 피보나치 수열 소스코드
        ```python
        def fibo(x):
            if x == 1 or x == 2:
                return 1
            return fibo(x - 1) + fibo(x - 2)

        print(fibo(4))
        ```
    - 단순 재귀 함수를 이용한 피보나치 수열의 문제점
        - f(n) 함수에서 n이 커지면 커질수록 수행 시간이 기하급수적으로 늘어난다.
        - 위 소스코드의 시간 복잡도는 세타 표기법으로 𝜽(1.618・・・ᴺ)이며, 빅오 표기법으로는 O(2ᴺ)이다.
            - 빅오 표기법을 기준으로 N이 30이면 10억 가량의 연산을 수행해야 한다.

- 피보나치 수열의 효율적인 해법
    - 단순 재귀 함수를 사용했을 때의 피보나치 수열의 문제점은 다이나믹 프로그래밍을 이용하면 효율적으로 해결할 수 있다.
    - 다이나믹 프로그래밍은 다음 조건을 만족할 때 사용할 수 있다.
        - 최적 부분 구조 : 큰 문제를 작은 문제로 나눌 수 있다.
        - 중복되는 부분 문제 : 동일한 작은 문제를 반복적으로 해결한다.

- 메모제이션(Memoization) 기법
    - 메모제이션이란?
        - 다이나믹 프로그래밍을 구현하는 방법 중 한 종류로, 한 번 구한 결과를 메모리 공간에 메모해두고 같은 식을 다시 호출하면 메모한 결과를 그대로 가져오는 기법이다.
        - 값을 저장하는 방법이므로 캐싱(Cashing)이라고도 한다.
        - 엄밀히 말하면 메모이제이션은 이전에 계산된 결과를 일시적으로 기록해 놓는 넓은 개념을 의미한다.
            - 따라서 메모이제이션은 다이나믹 프로그래밍에 국한된 개념은 아니다.
            - 한 번 계산된 결과를 담아 놓기만 하고 다이나믹 프로그래밍을 위해 활용하지 않을 수도 있다.

    - 구현 방법
        - 한 번 구한 정보를 리스트에 저장하는 것이다.
        - 다이나믹 프로그래밍을 재귀적으로 수행하다가 같은 정보가 필요할 때는 이미 구한 정답을 그대로 가져오면 된다.
    - 메모제이션을 이용한 피보나치 수열 소스코드
        ```python
        # 한 번 계산된 결과를 메모이제이션(Memoization)하기 위한 리스트 초기화
        d = [0] * 100

        # 피보나치 함수(Fibonacci Function)를 재귀함수로 구현 (탑다운 다이나믹 프로그래밍)
        def fibo(x):
            # 종료 조건(1 혹은 2일 때 1을 반환)
            if x == 1 or x == 2:
                return 1
            # 이미 계산한 적 있는 문제라면 그대로 반환
            if d[x] != 0:
                return d[x]
            # 아직 계산하지 않은 문제라면 점화식에 따라서 피보나치 결과 반환
            d[x] = fibo(x - 1) + fibo(x - 2)
            return d[x]

        print(fibo(99))
        ```
    - 다이나믹 프로그래밍을 적용했을 때의 피보나치 수열의 시간 복잡도는 O(N)이다.
        - f(1)을 구한 다음 그 값이 f(2)를 푸는 데 사용되고, f(2)의 값이 f(3)를 푸는 데 사용되는 방식으로 이어지기 때문이다.
        - 한 번 구한 결과는 다시 구해지지 않는다.

- 탑다운과 보텀업 방식
    - 탑다운 방식이란?
        - 메모제이션처럼 재귀 함수를 이용하여 다이나믹 프로그래밍 소스코드를 작성하는 방법으로, 큰 문제를 해결하기 위해 작은 문제를 호출한다고 하여 '하향식'이라고도 한다.
    - 보텀업 방식이란?
        - 단순히 반복문을 이용하여 소스코드를 작성하는 경우 작은 무제부터 차근차근 답을 도출한다고 하여 '상향식'이라고도 한다.
        - 반복문을 이용한 피보나치 수열 소스코드
            ```python
            # 앞서 계산된 결과를 저장하기 위한 DP 테이블 초기화
            d = [0] * 100

            # 첫 번째 피보나치 수와 두 번째 피보나치 수는 1
            d[1] = 1
            d[2] = 1
            n = 99

            # 피보나치 함수(Fibonacci Function) 반복문으로 구현(보텀업 다이나믹 프로그래밍)
            for i in range(3, n + 1):
                d[i] = d[i - 1] + d[i - 2]

            print(d[n])
            ```
        - 다이나믹 프로그램의 전형적인 형태는 보텀업 방식이다.
            - 결과 저장용 리스트는 DP 테이블이라고 부른다.

## 2. 9084번 동전 문제 풀이
- 도저히 규칙과 점화식이 떠오르지 않아 결국 검색하여 해설을 보고 풀었다...
- 동전이 오름차순으로 정렬되어 주어지기 때문에 작은 동전부터 해당 동전을 이용하여 m원을 만들 수 있는 경우의 수를 더한다.
- 다음 동전으로 넘어가서 이전 경우의 수에 해당 동전으로 만들 수 있는 경우의 수를 순차적으로 더해가며 답을 구하는 방법으로 문제를 해결했다.
- 소스코드
    ```python
    import sys

    def DP(M):
        # 0 ~ 만들어야 할 금액까지의 경우의 수를 저장할 DP테이블 초기화
        d = [0] * (M + 1)
        # 각 동전별로 0개를 이용하여 0원을 만들 수 있기 때문에 DP 테이블 0번째를 1로 초기화
        d[0] = 1
        # 각 코인만큼 반복
        for coin in coins:
            # 각 코인 금액부터 반복
            for i in range(coin, M + 1):
                # 각 코인 금액부터 만들어야 할 금액까지 경우의 수를 누적하여 계산
                d[i] += d[i - coin]
        # DP테이블의 마지막 인덱스 값 반환
        return d[-1]

    if __name__ == "__main__":
        # 테스트 케이스 입력
        T = int(sys.stdin.readline())
        # 테스트 케이수 수만큼 반복
        for _ in range(T):
            # 동전 개수 입력
            N = int(sys.stdin.readline())
            # N가지 동전의 각 금액 입력
            coins = list(map(int, sys.stdin.readline().split()))
            # N가지 동전으로 만들어야 할 금액 입력
            M = int(sys.stdin.readline())
            #  결과값 출력
            print(DP(M))
    ```

## 3. 9251번 LCS 문제 풀이
- 최장 공통부분 수열(LCS, Longest Common Subsequence)이 되는 수열 중 가장 긴 것을 찾는 문제이다.
- 제일 처음 DP 테이블을 생성하고, i와 j가 1 이상일 때부터 검사할 수 있도록 편의상 i와 j가 0일 때는 모두 0을 넣어 마진값을 설정해 줬다.
- LCS 함수를 수행할 때 두 문자열을 한 글자씩 비교하면서 두 문자가 같다면 dp[i - 1][j - 1] 값을 찾아 값을 1 증가시켜 주고, 다르다면 dp[i - 1][j]와 dp[i][j - 1] 중에서 큰 값을 DP 테이블에 표시했다.
- 마지막으로 DP 테이블의 마지막 값을 출력해 준다. DP 테이블의 마지막 값이 두 문자열의 최장 공통부분 수열 중 가장 긴 길이를 가진 값이다.
- 최장 공통부분 수열에 대해 학습하기 위해 아래 사이트를 참고했고, 그림으로 쉽게 이해할 수 있도록 정리되어 있다.
    - https://velog.io/@emplam27/알고리즘-그림으로-알아보는-LCS-알고리즘-Longest-Common-Substring와-Longest-Common-Subsequence
- 소스코드
    ```python
    import sys

    def LCS(str_a, str_b):
	    # 두 문자열을 한글자씩 비교
	    for i in range(1, len(str_a) + 1):
		    for j in range(1, len(str_b) + 1):
			    # 두 문자가 같다면 dp[i - 1][j - 1]값을 찾아 1증가
			    if str_a[i - 1] == str_b[j - 1]:
				    dp[i][j] = dp[i - 1][j - 1] + 1
			    # 두 문자가 다르다면 dp[i - 1][j]와 dp[i][j - 1]중에서 큰값을 표시
			    else:
				    dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
	    # dp테이블의 마지막 값 출력
	    return dp[-1][-1]

    if __name__ == "__main__":
	    # 두 문자열 입력
	    str_a = sys.stdin.readline().strip()
	    str_b = sys.stdin.readline().strip()
	    # DP테이블 생성 : i, j가 1이상일 때부터 검사할 수 있도록 편의상 i, j가 0일때는 모두 0을 넣어 마진값 설정
	    dp = [[0] * (len(str_b) + 1) for _ in range(len(str_a) + 1)]
	    # 두 문자열에 대한 최장 공통 부분수열 출력
	    print(LCS(str_a, str_b))
    ```

## 4. 4주차 1일차를 마치며...
문제 수가 적다고 좋은게 아니었다... 문제 하나하나가 규칙과 점화식을 찾아내지 못하면 풀 시도조차 할 수 없는 것 같다.
다이나믹 프로그래밍이라는 분야 자체가 그런 것 같아서 규칙과 점화식을 찾아내지 못하는 문제들에 대해서는 비슷한 유형을 많이 풀어보거나 해당 유형의 풀이법을 외워야 할 것 같다.

컴퓨터 시스템 책도 읽어야 하는데 이번 주차도 쉽지 않은 주차가 될 것 같다.