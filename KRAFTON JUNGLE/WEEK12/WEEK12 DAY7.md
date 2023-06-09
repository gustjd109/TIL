# WEEK12 DAY7 TIL

## 1. 오늘의 학습 목록
```
1. 백준 알고리즘 문제 풀이
    - 17608번 막대기, 11653번 소인수분해, 11720번 숫자의 합, 11816번 8진수/10진수/16진수, 8595번 히든 넘버 문제 풀이
2. 파이썬 진법 변환 학습
```
## 2. 파이썬 진법 변환
### N진수 → 10진수
- 파이썬에서는 기본적으로 int()라는 함수를 지원한다.
    ```C
    int(string, base)
    ```
    - base에 원래 진법을 넣어 사용한다.<br><br>
- N진수 → 10진수 예
    ```C
    print(int('111',2)) → 7
    print(int('222',3)) → 26
    print(int('333',4)) → 63
    print(int('444',5)) → 124
    print(int('555',6)) → 215
    print(int('FFF',16)) → 4095
    ```

### 10진수 → 2, 8, 16진수
- 파이썬에서 2, 8, 16진수는 bin(), oct(), hex() 함수를 지원한다.
    ```C
    bin(number)
    oct(number)
    hex(number)
    ```
    - bin(), oct(), hex() 함수 안에 10진수를 넣어 사용한다.<br><br>
- 10진수 → 2, 8, 16진수 예
    ```C
    print(bin(10)) → 0b1010
    print(oct(10)) → 0o12
    print(hex(10)) → 0xa
    ```
    - 0b는 2진수, 0o는 8진수, 0x는 16진수를 의미한다.<br><br>
- 앞의 진법 표시를 지울려면 [2:]를 사용하면 된다.
    ```C
    print(bin(10)[2:]) → 1010
    print(oct(10)[2:]) → 12
    print(hex(10)[2:]) → a
    ```

## 3. 12주차 7일차를 마치며...
간단하게 백준 알고리즘 문제를 푸는 시간을 가졌다.

11816번 문제 푸는 방법이 바로 떠오르지 않았는데 알고 봤더니 간단하게 int() 함수를 이용하여 풀 수 있는 문제였고, 추가로 파이썬에서 진법을 변환하는 방법을 학습했다.

8595번 문제는 결과값까지 정상적으로 잘 출력되게끔 풀었지만, 시간초과가 계속 발생했다.  
내가 풀었던 방법은 입력받은 문자열에서 각 문자를 탐색하면서 해당 문자가 숫자라면, 히든 넘버 문자열에 추가했다.  
이때, 다음 문자가 같은 숫자라면, 히든 넘버 문자열과 해당 문자를 합쳤다.  
마지막으로 split() 함수를 이용하여 히든 넘버 문자열에 있는 공백을 모두 제거한 후, 모든 히든 넘버를 int 형으로 변환하여 합한 값을 출력한다.

결국, 다른 사람의 풀이를 참고하여 문제를 풀었는데 풀이는 다음과 같다.  
입력받은 문자열에서 먼저 영문 대, 소문자를 모두 제거한다.  
마지막으로 내가 풀었던 방법과 같이 split() 함수를 이용하여 히든 넘버 문자열에 있는 공백을 모두 제거한 후, 모든 히든 넘버를 int 형으로 변환하여 합한 값을 출력한다.

두 문제 모두 브론즈 문제로 난이도가 쉬운 문제였으나, 문자열 또는 진법 변환 사용 방법에 익숙하지 않으면 쉽게 풀 수 없는 문제였다.  
아직 파이썬에 대해서 잘 모르고 있다는 느낌을 많이 받았고, 문제를 풀면서 파이썬 문법을 이용하여 푸는 방법들을 학습 및 정리하는 과정이 필요하다는 느낌을 많이 받았다.

오늘 우리 반 사람들과 같이 저녁을 먹다가 나만의 무기 조원 공지를 받았다.  
다행히 원래 하고 싶었던 대인이형, 대겸이형, 동윤이와 함께 같은 팀이 되었고, 다 같이 잠깐 각자 프론트엔드와 백엔드 누가 맡아서 할 것인지와 언어 및 프레임워크 선택 등 간단한 내용에 대해서 회의하는 시간을 가졌다.  
내일 핀토스 프로젝트4 발표를 끝으로 나만의 무기 과정이 시작되는데, 지치지 않고 서로 협업하면서 프로젝트를 끝까지 잘 마무리할 수 있었으면 좋겠다.

겨란즈 퐈이팅~!!!🔥🥚