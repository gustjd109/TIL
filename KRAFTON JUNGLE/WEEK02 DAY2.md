# WEEK02 DAY2 TIL

오늘은 이진 탐색 문제인 11053번(가장 긴 증가하는 부분 수열)을 먼저 풀었다.  
해당 문제는 최장 증가 부분 수열(LIS, Longest, Increasing Subsequence) 문제로 이진 탐색과 동적 계획법 두 방법을 통해 풀 수 있다. 각각 최장 증가 부분 수열을 어떤 방식으로 찾는지와 차이점을 주제로 공부한 후에 두 방법을 모두 사용하여 문제를 풀었다. 나무위키에 모든 과정이 정말 자세하게 나와 있어서 도움이 많이 되었다. 알고 봤더니 4주차에 같은 문제를 동적 계획법으로 풀어야 한다(앗싸 1타 2피👍). 아래에 공부한 내용을 정리해 보았다.

## 1. 최장 증가 부분 수열(LIS, Longest Increasing Subsequence)
- 최장 증가 부분 수열이란?
    - 어떤 임의의 수열이 주어질 때, 이 수열에서 몇 개의 수들을 제거해서 부분 수열을 만들 수 있다. 이때 만들어진 부분 수열 중 오름차순으로 정렬된 가장 긴 수열을 최장 증가 부분 수열이라 한다.
    - 예를 들아 다음 수열이 주어졌다고 하자.
        - 예를 들어, {6, 2, 5, 1, 7, 4, 8, 3}이라는 배열이 있으면, LIS는 {2, 5, 7, 8}이 된다.
        - {2, 5}, {2, 7} 등 증가하는 부분 수열은 많지만, 그중에서 가장 긴 것이 {2, 5, 7, 8}이다.
    - 이진 탐색(Binary Search)과 동적 계획법(Dynamic Programming) 두 가지 알고리즘을 이용하여 해결할 수 있다.

- 동적 계획법을 이용한 최장 증가 부분 수열 문제 풀이 과정
    - length[i]는 i번째 인덱스에서 끝나는 최장 증가 부분 수열의 길이를 의미한다.
    - 주어진 배열에서 인덱스를 한 칸씩(k+=1) 늘려가면서 확인한다.
    -  그리고 내부 반복문으로 k보다 작은 인덱스들을 하나씩 살펴보면서 arr[i] < arr[k]인 것이 있으면, length[k]를 업데이트한다.
    - 업데이트하는 기준은 i번째 인덱스에서 끝나는 최장 증가 부분 수열의 마지막에 arr[k]를 추가했을 때의 LIS 길이와 추가하지 않고 기존의 length[k] 값 둘 중에 더 큰 값으로 length[k] 값을 업데이트한다.

- 이진 탐색을 이용한 최장 증가 부분 수열 문제 풀이 과정
    - 굳이 N개의 수에 대해서 현재 위치 이전의 모든 수를 반복하며 훑어봐야 할까? 라는 의문에서 시작된 풀이 방법이다.
    - LIS의 형태를 유지하기 위해 주어진 배열의 인덱스를 하나씩 살펴보면서 그 숫자가 들어갈 위치를 이분탐색으로 탐색해서 넣는다.

- 두 알고리즘의 차이점
    - 시간 복잡도의 차이
        - 최장 증가 부분 수열에서의 동적 계획법 시간 복잡도
            - N개의 수에 대해 자기 자신 전의 모든 수를 다 훑어봐야 하므로 O(N^2)의 시간복잡도를 가진다.
        - 최장 증가 부분 수열에서의 이분 탐색 시간 복잡도
            - 이분탐색은 일반적으로 시간복잡도가 O(log N) 이라고 알려져 있으므로, 이 문제의 시간 복잡도를 O(N log N)를 가진다.

- TO-DO-LIST
    - 최장 증가 부분 수열과 관련된 문제를 좀 더 풀어보면 좋을듯
    - https://www.acmicpc.net/workbook/view/13254

- 좀 더 자세한 내용을 확인하려면 아래 사이트를 확인 가능
    - https://namu.wiki/w/최장%20증가%20부분%20수열#s-3.2

## 2. 이진 탐색과 동적 계획법을 이용한 11053번 문제 풀이
- 이진 탐색을 이용한 풀이
    ```python
    import sys

    def binary_search(start, end, value):
        while start <= end:
            mid = (start + end) // 2

            if stack[mid] >= value:
                end = mid - 1
            else:
                start = mid + 1
        return start

    N = int(sys.stdin.readline())
    A = list(map(int, sys.stdin.readline().split()))
    # 부분 수열이 오름차순으로 저장될 리스트(A 리스트의 제일 처음 값을 넣어준다)
    stack = [A[0]]

    # A 리스트의 제일 처음 값을 stack 리스트를 넣어줬기 때문에 인덱스를 1~N-1까지 반복
    for i in range(1, N):
        # A[i]값이 stack 리스트의 마지막 값보다 크면 stack 리스트에 삽입
        if A[i] > stack[-1]:
            stack.append(A[i])
        # 작으면 이진 탐색을 통해 stack 리스트에서 A[i]을 삽입할 수 있는 A[i]보다 크면서 가장 작은 값의 인덱스를 찾는다.
        else:
            max_low_index = binary_search(0, len(stack) - 1, A[i])
            # 찾은 인덱스의 값과 A[i]값을 바꾼다.
            stack[max_low_index] = A[i]

    print(len(stack))
    ```

- 동적 계획법을 이용한 풀이
    ```python
    import sys

    N = int(sys.stdin.readline())
    A = list(map(int, sys.stdin.readline().split()))
    # A[i]를 마지막 값으로 가지는 가장 긴 증가 부분 수열의 길이 1로 초기화
    DP = [1] * N

    for i in range(N):
        for j in range(i):
            # a[i]가 A[j]보다 크면 DP[i]에 DP[i]와 DP[j] + 1을 비교하여 더 큰 값을 저장
            if A[i] > A[j]:
                DP[i] = max(DP[i], DP[j] + 1)

    print(max(DP))
    ```

- 이진 탐색 문제를 풀다가 시간도 너무 오래 걸리고 힘들어서 남은 2주차 일정 동안 모든 문제를 다 풀기 위해 그나마 조금 쉬운 문제인 스택 문제부터 풀기로 했다.  
스택과 파이썬에서의 스택 사용법에 대해 알아봤다.

## 3. 스택(Stack)
- 스택이란?
    - 가장 나중에 넣은 데이터를 가장 먼저 빼낼 수 있는 데이터 구조로 후입선출인 Last In First Out(LIFO) 혹은 First In Last Out(FILO) 방식이다.

- 스택의 기본 연산
    - push() : 스택에 원소를 추가한다.
    - pop() : 스택 가장 위에 있는 원소를 삭제하고 그 원소를 반환한다.
    - peek() : 스택 가장 위에 있는 원소를 반환한다. (삭제X)
    - empty() : 스택이 비어있다면 1, 아니면 0을 반환한다.

- 파이썬에서 스택 기능 사용 방법
    - 파이썬에서는 스택 자료구조를 따로 제공하지 않지만, 리스트 자료구조를 이용하여 구현할 수 있다.
    - 리스트명.append()
        - 리스트 맨 끝에 원소를 추가한다.
            ```python
            a_list = [1,2,3]
            a_list.append(1)
            >>> [1,2,3,1]
            ```
    - 리스트명.pop()
        - 리스트의 맨 끝 원소를 삭제한다.
            ```python
            a_list = [1,2,3]
            a_list.pop()
            >>> [1,2]
            ```
    - 둘 다 시간복잡도는 O(1)이다.
    - 이처럼 파이썬에서는 따로 스택 라이브러리가 존재하지 않기 때문에 덱 라이브러리를 import하여 스택 대산 사용하기도 한다.
        ```python
        from collections import deque

        dq=deque() # 덱 생성
        dq.append() # 덱의 가장 오른쪽에 원소 삽입
        dq.popleft() # 가장 왼쪽 원소 반환
        dq.appendleft() # 덱의 가장 왼쪽에 원소 삽입
        dp.pop() # 가장 오른쪽 원소 반환
        dp.clear() # 모든 원소 제거
        dp.copy() # 덱 복사
        dp.count(x) #x와 같은 원소의 개수를 계산
        ```

- 클래스를 이용한 스택 기본 연산 구현
    ```python
    class Stack:
    #리스트를 이용하여 스택 생성
    def __init__(self, limit: int= 100):
        self.top = []
        self.limit = limit

    #스택 크기 반환
    def __len__(self) -> bool :
        return len(self.top)

    #스택 내부 자료 전체를 string으로 변환하여 반환
    def __str__(self) -> str :
        return str(self.top[::1])

    #구현함수
    #스택에 원소 삽입
    def push(self, item):
        if(len(self.pop)>=self.limit):
            self.top.append(item)

    #스택 가장 위에 있는 원소를 삭제하고 반환
    def pop(self):
        if not self.isEmpty():
            return self.top.pop(-1)
        else:
            print("Stack underflow")
            exit()

    #스택 가장 위에 있는 원소를 반환
    def peek(self):
        if not self.isEmpty():
            return self.top[-1]
        else:
            print("underflow")
            exit()

    #스택을 비움
    def clear(self):
        self.top=[]

    #스택 안에 특정 item이 포함되어 있는지를 bool값으로 반환
    def isContain(self, item) -> bool:
        return item in self.top

    #스택이 비어있는 지를 bool값으로 반환
    def isEmpty(self) -> bool :
        return len(self.top)==0

    #스택이 가득 차 있는 지를 bool값으로 반환
    def isFull(self) -> bool :
        return self.size()==self.limit

    #스택의 크기를 int 값으로 반환 
    def size(self) -> int :
        return len(self.top)
    ```

## 4. 스택을 이용한 2493번 문제 풀이
이 문제는 뭔가 어떻게 풀어야 할지 감은 잡혔는데 막상 구현할 딱 막혔던 문제이다. 알고 봤더니 2차원 리스트를 이용해야 하는 문제였고, 막혔던 부분이 딱 뚫리는 기분이었다(왜 자꾸 1차원 리스트만 쓴다고 생각했는지...😅). 아래는 2차원 리스트와 스택을 이용한 풀이 코드이다.
```python
import sys

N = int(sys.stdin.readline())
T = list(map(int, sys.stdin.readline().split()))
# 탑의 인덱스와 값을 저장할 리스트
stack = []
# 각각의 탐들에서 발사한 레이저 신호를 수신한 탑들의 번호를 저장할 리스트
answer = []

# 탑의 수만큼 반복문 수행
for i in range(N):
    # 스택이 비어있지 않은 경우에 반복문 수행
    while stack:
        # 스택에 저장된 마지막 탑의 높이가 입력받은 탑의 높이보다 크거나 같으면
        # 탑 번호 저장 리스트에 스택에 저장된 마지막 탑의 인덱스 + 1 값을 저장하고 반복문 종료
        if stack[-1][1] >= T[i]:
            answer.append(stack[-1][0] + 1)
            break
        # 스택에 저장된 마지막 탐의 높이가 입력받은 탑의 높이보다 작으면 수신할 수 없기 때문에
        # 스택에 저장된 마지막 탑 삭제
        else:
            stack.pop()
    # 스택이 비어있으면 수신할 탑이 당연히 없기 때문에 탑 번호 저장 리스트에 0값 저장
    if not stack:
        answer.append(0)

    # 탑 번호만 저장했으므로 마지막에 스택에 입력받은 탑의 인덱스와 값 저장
    stack.append((i, T[i]))

# 탑 번호가 저장된 리스트값 모두 출력
print(*answer)
```

## 5. 2주차 2일차를 마치며...
요즘 아침저넉으로 추운데 비가 오니까 더 추운거 같다... 감기나 몸살 걸리지 않게 따숩게 입고 다니고 건물에서 건물로만 이동해야겠다.🤧