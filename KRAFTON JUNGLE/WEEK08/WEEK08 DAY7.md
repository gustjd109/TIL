# WEEK08 DAY7 TIL

## 1. 오늘의 학습 목록
```
1. PintOS PROJECT1(Threads) 발표
2. PintOS PROJECT2(User Program) 발제
3. 당근마켓 채용설명회
```

## 2. PintOS PROJECT1(Threads) 발표
1. PintOS PROJECT1 회고
    - 오늘 새벽 늦게까지 프로젝트1 구현을 완료했고, 팀원들과 한 주 동안 학습한 내용, 일자별 프로젝트 진행 상황, 트러블 슈팅, 회고록 등을 포함하여 WIL을 작성했다. 팀별로 작성한 WIL을 바탕으로 7분씩 발표를 진행했고, 큰 문제 없이 모두 발표를 마칠 수 있었다.👏🏻<br><br>
    - cond_wait()와 cond_signal() 함수 구현 중에 발생한 문제를 해결했던 트러블 슈팅 부분에서 코치님의 피드백이 있었다. 우선순위가 가장 높은 스레드를 찾기 위해 less 조건으로 인해 list_max() 함수를 사용하면 반대로 최소값이 찾아지는 문제로 인해 list_min() 함수를 이용했다. 여기서, less 조건을 최대값을 찾을 수 있도록 재구현 또는 수정해 주면 정상적으로 최대값을 찾을 수 있다는 피드백을 해주셨다.<br><br>
    - 왜 list_max() 함수를 수정하거나 다시 구현해 볼 생각을 못 했는지 나한테 의문이 들었다...🤔 아마 프로젝트1 마지막 날이라 정신없이 구현하다 보니 시도할 생각조차 하지 못했던 것 같다. 좀 더 신중하게 문제에 접근했으면, 당연히 이걸 원래 함수 목적인 최대값을 찾을 수 있도록 하는 방법이 있지 않았을까 하는 생각이 들었을 텐데 많이 아쉬웠다.<br><br>
2. PintOS PROJECT1 WIL URL
    - https://github.com/gustjd109/pintos-kaist/discussions/1

## 3. PintOS PROJECT2(User Program) 발제
1. PintOS PROJECT2(User Program) 목표
    - OS에서 동작하는 User Program이 잘 동작할 수 있게 하는 것이 이번 과제의 목표이다.<br><br>
2. PintOS PROJECT2(User Program) 수행을 위한 필요 학습 내용
    - GitBook
        - 프로젝트2 항목의 모든 내용을 다 읽어보자.
        - Argument Passing 항목에서 hex_dump()를 통해 argument 세팅이 잘 되었는지 확인할 수 있다.
        - System Calls 테스트 케이스 실패 시 User Memory에서 문제가 발생했을 가능성이 있으므로 확인해 보자.<br><br>
3. 프로젝트 소스코드 확인 권장 내용
    - syscall.c에 있는 __attribute__() 함수의 어셈블리 코드는 한번 보는 것을 권장한다.

## 3. 당근마켓 채용설명회
1. 현재 당근마켓은?
    - 1,800만 MAU 달성
    - 4개국에 사업 진출
    - 약 400명의 직원
    - 중고 거래, 비즈 프로필, 동네 생활, 당근 알바, 부동산 직거래 등 지역 커뮤니티를 활성화하고자 노력<br><br>
2. 당근 문화
    - 자율과 책임 : 우리는 모드 메이커에요
        - 휴가, 식사 금액 제한 없음
    - 사용자 가치 : 우리는 빠른 실행을 통해 사용자가 원하는 것을 찾아내요
    - 신뢰와 충돌 : 우리의 마음에는 신뢰 온도가 있어요
        - 의견 충돌 과정을 통해 좋은 수확을 할 수 있다.
    - 공개와 공유 : 우리는 어디서도 볼 수 없는 수준의 투명성을 추구해요
        - 회의록 등 모든 정보를 투자자들에게 제공하고 있다.
    - 뛰어난 동료 : 우리는 나 보도 뛰어난 동료를 채용한다
        - 채용 시, 모든 사람이 그 사람이 자기보다 뛰어나다고 생각할 때 채용한다.<br><br>
3. 사내 행사
    - 문화 회의
        - 매달 한 번 진행
        - 슬랙을 통해 누구나 들어올 수 있는 공개 미팅
        - 특정 문화에 대해 문제점 등을 토론하면서 투표를 진행
    - 문화의 날
        - 저녁, 운동 등 다양한 활동을 통해 문화를 주제로 토론하는 행사<br><br>
4. 당근 개발 문화
    - 하고 싶은 것을 할 수 있게 하는 환경
    - 끝없는 학습 그리고 성장
        - 당근페이 엔지니어링 데이 : 팀마다 기술을 공유하는 세션을 진행
    - 사람이 아닌 기술로 해결
        - 서비스 운영실에서 가지고 있는 채팅 로그, 로케이션 로그 등을 활용하여 모델링을 통해 분석 및 예측해서 사기, 전문판매업자, 불법 거래 등을 방지(90% 이상)<br><br>
5. Q&A
    - 업무 장소가 자유로운가요?
        - 코로나 때는 주 5일 모두 재택이었지만, 현재는 주 3일 출근
    - 신입에게 기대하는 것이 있거나 확인하는 것이 있나요?
        - 어떤 일에 몰입해서 경험해 봤던 경험이 있는지와 성장에 대한 욕구가 있는지
    - 커리큘럼에서 어떤 부분 때문에 협력사가 되셨나요?
        - 몰입 경험
    - 신입 개발자 합격자 비율은 어떻게 되나요?
        - 200:1
    - 어떤 언어들을 사용하나요?
        - 레일즈, 자바, 코틀린, 자바스크립트, 파이썬, go 등 다양한 언어를 사용
    - 프로젝트에 당장 투입할 수 있는 사람을 원하는지 아니면 함께 성장하는 사람이 필요한가요?
        - 들어와서 바로 프로젝트 개발을 같이 진행하면서 업무를 수행할 수 있는 사람이 필요
        - 인턴십도 교육해 주는 것이 아니라 바로 자기가 하고 싶은 분야를 선택해서 그 개발팀에서 프로젝트를 실제를 진행한다.
    - 개발자 조직은 어떻게 구성되어 있나요?
        - 목적 조직으로 개발팀이 구성
            - 1, 2, 3팀이 아닌 자금팀, 송금팀, 중고거래팀 등 목적을 가진 팀으로 구성
    - 신입 개발자가 지원했을 때 중요하게 보는 부분이 있나요?
        - 실제 프로덕트 운영 경험을 통해 문제를 해결했던 경험을 중요하게 생각(특히 오래 운영했던 경험)
        - 지원시 인사팀과 현직자가 같이 확인
    - 어떤 복지가 있나요?
        - 도서, 컨프런스 참여, 교육 비용 등 전액 지원

## 4. 8주차 7일차를 마치며...
핀토스 프로젝트 2부터는 테스트 케이스가 기본으로 100개나 있어서 힘들 것 같지만, 프로젝트 1은 그래도 할만하다? 라는 생각이 들었고, 무리 없이 프로젝트를 잘 마무리할 수 있었다.
프로젝트 1에서 학습 및 진행 내용을 다음에 다시 보거나, 면접에서도 활용할 수 있도록 잘 정리할 예정이다.

오늘은 협력사인 당근마켓에서 채용설명회를 진행했는데, 채용설명 담당자가 중국에서 유학 시절 정말 친하게 지냈던 친구였다.
친구는 중국에서 미국으로 나는 한국으로 오면서 연락을 거의 10년 동안 하지 못했지만, 크래프톤 정글을 통해서 또 정말 오랜 친구를 만날 수 있어서 좋았다.

내일부터는 핀트스 프로젝트 2를 시작하는 날이며, 프로젝트 1처럼 항상 팀원들과 소통 및 협업하여 잘 끝마칠 수 있도록 할 것이다.