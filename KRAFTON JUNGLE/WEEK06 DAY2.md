# WEEK06 DAY02 TIL
오전에 그동안 풀지 못했던 알고리즘 문제를 풀었다.
며칠 풀지 못했어서 엄청 간단한 문제들 위주로 풀었고, 그중에서 1주차에 풀었던 문제인 2309번 난쟁이 문제가 있었다.
6주차 과제를 구현하기 전까지에 대한 동적 메모리 할당 내용도 학습했다.

## 1. 2309번 일곱 난쟁이 문제 풀이
- 앞서 다른 TIL에 정리되어 있겠지만, 브루트포스 알고리즘을 이용한 풀이와 아주 살짝 다른 부분이 있어서 다시 정리를 해봤다.
- 브루트포스 알고리즘을 이용한 풀이
    ```python
    import sys

    Dwarfs = [int(sys.stdin.readline()) for _ in range(9)]
    Sum_Dwarfs_Height = sum(Dwarfs)

    for i in range(8):
        for j in range(i + 1, 9):
            if Sum_Dwarfs_Height - Dwarfs[i] - Dwarfs[j] == 100:
                Fake_Dwarf1 = Dwarfs[i]
                Fake_Dwarf2 = Dwarfs[j]
                Dwarfs.remove(Fake_Dwarf1)
                Dwarfs.remove(Fake_Dwarf2)
                Dwarfs.sort()
                print(*Dwarfs, sep='\n')
                sys.exit(0)
    ```

- 순열 라이브러리를 이용한 풀이
    ```python
    import sys
    import itertools

    N = [int(sys.stdin.readline()) for _ in range(9)]

    for i in itertools.combinations(N, 7):
        if sum(i) == 100:
            for j in sorted(i):
                print(j)
            break
    ```

## 3. 동적 메모리 할당 추가 학습
- 이번 학습 내용 또한 저번과 동일하게 깃허브에 저장되어 있다.

## 6주차 2일차 마무리...
큰일이다, 알고리즘 문제를 매일 풀기로 마음 먹었는데 며칠이나 미뤄버렸다...!
진짜 쉬운 문제여도 한문제라도 풀어야하는데 과제가 급하나는 변명으로 자꾸 미뤄지게 된다... 정신 차리자!

깃허브를 사용하다보니, 몇 가지 수정해야할 부분이 보였다.
알고리즘과 자료구조 유형을 TIL에 모두 정리하니까 필요할 때마다 찾는데 시간이 오래 걸려서 틈틈히 다른 폴더에 정리를 해야겠다.
알고리즘 문제 풀이도 각 문제가 어떤 유형인지 분류가 필요해보인다.