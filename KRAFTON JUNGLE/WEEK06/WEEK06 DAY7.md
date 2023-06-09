# WEEK06 DAY7 TIL
오늘 진행했던 일정은 다음과 같다.
```
- malloc-lab 코드 리뷰
- 티타임 참석
- 스파르타코딩클럽 채용설명회 및 회식 참석
- 동적 메모리 할당의 명시적 가용 리스트와 분리 가용 리스트 학습
- 백준 알고리즘 1475번 방 번호 문제 풀이
```

## 1. 티타임
오늘 티타임에서는 백승현 코치님께서 간단하게 3개의 퀴즈를 내주셨다.
- 퀴즈 1 : 배열과 포인터의 차이
    - 배열의 이름은 배열의 시작 주소값을 가리키는 상수이지만, 포인터는 변수이다.
        - 즉, 배열은 선언 할 때 그 위치가 이미 고정되므로 다른 대상을 가리킬 수 없지만, 포인터는 고유의 메모리를 차지하고 있고 언제든지 다른 대상을 가르킬 수 있다.
    - 포인터 변수가 가리키는 배열의 크키는 동적으로 결정할 수 있지만 배열의 이름이 가리키는 배열의 크기는 선언할 때 정적으로 결정된다.
        - 고정된 길이의 배열이 필요하면 int ar[n]; 선언문으로 배열을 생성하고, 가변길이의 배열이 필요하면 int *형의 포인터 변수를 선언한 후 malloc으로 할당해서 사용해야 한다.
        - 포인터로 할당한 배열은 실행 중에라도 realloc으로 크기를 재할당하여 변경할 수 있다.
    - 배열은 그 자체가 크기 때문에 함수의 인수로 전달할 수 없지만, 포인터는 대상체가 무엇이든간에 4바이트의 크기밖에 차지하지 않으므로 함수로 전달할 수 있다.
        - 그래서 배열을 함수로 전달할 때는 반드시 포인터를 사용해야 한다.
    - 배열로 요소를 읽는 것과 포인터로 대상체를 읽는 동작의 속도 차이가 있다.
        - 배열의 첨자 연산은 매번 배열선두에서부터 출발하지만 포인터는 대상체로 직접 이동해서 바로 읽으므로 액세스 속도가 빠르다.
        - 포인터가 배열보다 두배 정도 빠르다.
- 퀴즈 2 : int *ptr을 ++1 수행하면 어떻게 되는가?
    - 주소값이 int 형의 크기인 4바이트 만큼 증가한다.
    - 32비트에서는 4바이트, 64비트에서는 8바이트 만큼 증가한다.
추가로 김현수 코치님께서 과제를 수행하는데 바쁘겠지만, 다음에 진행하는 OS 프로젝트에 대비하여 컴퓨터 시스템 책의 12장은 꼭 읽어볼 것을 권장하셨다.

## 2. 스파르타코딩클럽 채용설명회
스파르타코딩클럽 온라인 개발팀장 이동현님께서 채용 설명회를 진행해주셨고, 정리한 내용은 다음과 같다.
- 스파르타코딩클럽이 하고있는 비즈니스는 어떤 것들이 있나요?
    - 교육비즈니스
    - 직무교육 : 향해 99, 정글 사관학교
    - 창업 부트캠프 : 창
    - 즉, 개발자를 길러내서 개발자들이 만든 서비스를 통해 비즈니스를 확장해 나가고 있다.
- 스파르타코딩클럽은 어떻게 일하나요?
    - 약속을 하고 그 약속을 꼭 지키는 회사
        - 22년 목표했던 계획을 모두 달성
    - 빠르게, 와우하게, 진전성 있게 라는 핵심가치를 바탕으로 업무 수행
        - 각 팀만의 빠와성에 부여한 의미가 다르다.
    - 함께 만드는 곳
        - 주크샵
            - 쌍방향으로 흐르는 정보
            - 서로 같이 고민하고 결과를 바탕으로 발표하는 시간을 매주 가진다.
    - 다 모여보니 재미있다
        - 르탄마켓
            - 중고장터
    - 와우함
        - 위트있는 곳
        - 서로 스터디에 참석하여 어떤 것이라도 학습하는 것을 권유
    - 대화할 수 있는 곳
        - 스파르타 수다 타임(스수타)
            - 대표님과 편하게 대화할 수 있는 자리
    - 주도적으로 일할 수 있는 복지 보유
        - 유급 휴가 무제한 + 여름/겨울방학 1주일
    - 전사 팀원의 높은 개발 이해도
        - 코딩을 교육하는 업을 진행하다보니 개개인의 실력이 높음
- 개발자로써 어떻게 성장할 수 있나요?
    - 좋은 개발자가 되려면
        - justin hong 개발자
            - 운전대를 잡고 있다고 생각해라
                - 개발을 하다보면 수많은 결정을 스스로 해야한다.
        - 나의 역할을 어떻게 정의 하느냐의 문제
    - 잘 되는 회사
        - 폭발적으로 성장하는 회사, 그래서 만들 것들이 엄청 많음
    - 주요한 역할
        - 누구나 임팩트 있는 개발을 할 수 있음
    - 사고치면 어떻게 될까요?
        - 사고에서 배우는 팀이다.
        - 실수하지 않으면 전진할 수 없다.
        - 부검 없는 실수는 좀비가 되어 돌아온다.
        - 그러니 인정하고 투명하게 공개하고 더 나아지자.
    - 어떻게 하면 모두가 훌륭한 개발자가 될 수 있을까?
        - 갯트백(이름 다른듯?)
            - 나는 타고난 프로그래머가 아니었지만, 올바른 습관을 꾸준히 실천함으로썬 탁월함에 다가갈 수 있었다.
    - 좋은 방법을 알고 좋은 방법을 실천하고 돌아보는 것을 계속해서 실천해야지 좋은 개발자가 될 수 있다.
    - 좋은 개발자가 되기 위해 매주 백, 프론트 모두 스터디를 진행
        - 테스트 코드로 방어하고, 코드리뷰로 서로를 보완해준다.
    - 돌아보기
        - 트러블슈팅과 장애 대응 로그를 남기고, 매주 돌아보는 시간을 가진다.
    - 3년 후에 시장에서 못가는 회사 없게 만들어 드릴게요!!!👍
- 채용설명회 후 질문
    - 크래프톤 정글 교육생의 취업에서의 강점
        - 전산학에 대한 지식을 가장 압축적으로 공부했던 경험이 가장 크고, 면접이나 업무를 수행할 때 자연스럽게 학습했던게 나온다.
        - 얼마나 엔지니어링 마인드가 함량이 되어 있느냐
            - 문제의 목적과 목표를 얼마나 정확하게 알고, 가설 또는 틀린 가설을 거르는 것을 잘 하는가
    - 입사 시, 진행하는 온보딩 중에서 가장 인상 깊었던 부분(모두에게 포함)
        - 풀타임으로 2주간 진행
        - 원래 직무와 다른 직무의 일을 수행
        - TDD 수행
            - API문서를 주고 나만의 결제 모듈 제작
        - 실제 오류 수정 경험
        - 파이프라인 만들기
            - 실제 배포할 때 어떻게 진행되는지 과정을 알 수 있음

## 3. 명시적 가용 리스트와 분리 가용 리스트 학습
### 9.9.13 명시적 가용 리스트(Explicit Free List)
- 묵시적 가용 리스트는 블록 할당 시간이 전체 힙 블록의 수에 비례하기 때문에 처리 속도가 느려 범용 할당기에는 적합하지 않다.
    - 힙 블록의 수가 사전에 알려져 있고, 작고 특수한 경우에는 좋을 수도 있다.
- 명시적 가용 리스트
    - 가용 블록들을 일종의 명시적 자료구조로 구성해 가용 리스트들을 모두 연결한다.
    - 아래 그림처럼 각 블록 내에 이전 가용 블럭의 시작 주소를 가리키는 Pred(predeccessor)와 다음 가용 블록의 시작 주소를 가리키는 SUCC(successor) 포인터를 포함하는 이중 연결 가용 리스트로 구성될 수 있다.  
        <img src="https://velog.velcdn.com/images%2Fwhddn0221%2Fpost%2F275f263c-d3d7-4487-87fc-1f48c41a7667%2Fimage.png"></img>
    - 이중 연결 가용 리스트를 이용하여 명시적 가용 리스트를 구현할 경우 first fit 탐색 시간을 가용 블록의 수에 비례하는 것으로 줄일 수 있다.
    - 명시적 가용 리스트를 사용할 때 가용 블록을 어떤 방식으로 정렬하는 가에 따라 블록의 반환 시간은 리스트의 크기에 비례하거나 상수 시간을 가질 수 있다.
- 명시적 가용 리스트 내에서 블록을 정렬하는 두 가지 정책
    - LIFO(후입선출, Last In First Out)
        - 새롭게 반환한 블록들을 리스트의 시작 부분에 삽입하고, first fit을 사용하는 방식이다.
        - 할당기가 최근에 사용된 블록들을 먼저 조사하기 때문에 블록의 반환은 상수 시간에 수행된다.
        - 경계 태그를 사용하면 연결도 상수 시간에 수행된다.
    - 주소 순으로 정렬
        - 리스트를 주소 순으로 정렬해 리스트 내 각 블록의 주소가 다음 블록의 주소보다 작도록 하는 것이다.
        - 이때 블록을 반환할 때 리스트 내에서 블록이 들어갈 위치를 찾아야 하므로 선형 검색 시간이 필요로 하다.
        - 주소 순으로 정렬하는 방식은 LIFO 방식보다 best fit의 이용도에 근접하는 더 좋은 메모리 이용도를 가진다.
- 명시적 가용 리스트 단점
    - 가용 블록들이 충분히 커서 모든 필요한 포인터 뿐만 아니라 헤더와 풋터까지 포함해야 한다는 것이다.
        - 그 결과, 최소 블록 크기가 커지고 잠재적인 내부 단편화 가능성이 증가한다.

### 9.9.14 분리 가용 리스트(Segregated Free List)
- 단일 연결 가용 블록 리스트를 사용하는 할당기는 한 개의 블록을 할당하는 데 가용 블록의 수에 비례하는 시간이 필요하다.
- 분리 가용 리스트
    - 다수의 가용 리스트를 유지하며, 각 리스트는 거의 동일한 크기의 블록들을 저장한다.
    - 기본적인 아이디어는 모든 가능한 블록 크기를 크기 클래스라고 하는 동일 클래스의 집합들로 분리하는 것이다.
- 크기 클래스를 정의하는 방법
    - 블록 크기를 2의 제곱으로 나누는 방법
        ```
        [1], [2, 3], [4 ~ 7], [8 ~ 15], [16 ~ 31], ...
        ```
    - 크기가 작은 블록들은 자신의 크기 클래스에 할당하고, 큰 블록들은 2의 제곱으로 분리하는 방법
        ```
        [1], [2], [3], [4], ... , [1024], [1025], ... , [2048 ~ 4095], [4096 ~ 8192] ...
        ```
- 할당기는 가용 리스트의 배열을 관리하고, 크기 클래스마다 크기가 증가하는 순서로 한 개의 가용 리스트를 가진다.
- 할당기가 크기 n의 블록이 필요하면 적당한 가용 리스트를 검색한다.
- 이때 리스트 내부에 가용 가능한 블록이 없다면, 다음 리스트를 검색한다.
- 나머지는 명시적 가용 리스트를 이용한 할당기와 대부분 비슷하다.

## 4. 1475번 방 번호 문제 풀이
- 이 문제는 9와 6이 서로 뒤집을 수 있다는 것이라는 조건만 잘 해결해주면 된다.
- 6 또는 9가 나오면, 두 수의 개수가 저장된 리스트에서 둘 중에서 더 작은 개수를 가진 수의 인덱스 값을 증가시켜주면 된다.
- 그 외의 숫자들은 숫자의 개수만큼 인덱스 값을 증가시켜주면 된다.
- 마지막으로, 수의 개수를 저장하는 리스트의 최대값을 출력하면 된다.
- 소스코드
    ```python
    import sys

    sys.stdin = open("input.txt","rt")
    N = input() # sys.stdin.readline()으로 하면, 런타임 에러 발생
    N_cnt = [0] * 10
    for i in range(len(N)):
        num = int(N[i])
        if num == 6 or num == 9:
            if N_cnt[6] <= N_cnt[9]:
                N_cnt[6] += 1
            else:
                N_cnt[9] += 1
        else:
            N_cnt[num] += 1
    print(max(N_cnt))
    ```

## 5. 6주차 7일차를 마치며...
오늘은 두 번째 협력사인 스파르타코딩클럽에서 진행하는 채용설명회에 참석했고, 감사하게도 격려차 회식을 제공해 주셔서 덕분에 맛있는 저녁을 먹을 수 있었다.👏
회식을 진행하면서 실제 현업에서 활동하시는 분들과 대화할 기회가 있었는데 사람도 많고, 자리가 여유롭지 않다 보니 여러 이야기를 나누지 못해 아주 아쉬웠다.
이런 분들과 많은 대화를 나눌 기회가 흔치 않다 보니 더 많은 기회가 있었으면 좋겠다.

내일부터는 7주차 과제인 웹 proxy 서버를 구현하기 위한 학습과 알고리즘 문제를 풀 계획이다.