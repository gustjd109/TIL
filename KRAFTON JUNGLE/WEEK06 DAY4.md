# WEEK06 DAY4 TIL
오전에는 간단하게 알고리즘 2문제를 풀었고, 그중에서 10804번 카드 역배치 문제를 푸는 방법이 세 가지가 있어 따로 정리를 해봤다.
오늘부터는 malloc-lab 구현에 시작했고, CSAPP 책에 있는 할당기 구현 과정을 하나씩 따라 해 보면서 작성된 코드를 학습하는 중이다.

## 1. 10804번 카드 역배치 문제 풀이
- 직접 푼 풀이
    - 카드 리스트에서 구간에 해당하는 수를 배열 하나를 생성하여 저장한 다음 역순으로 바꾸고 다시 카드에 저장시키는 방법으로 풀었다.
    - 저장한 수를 역순으로 바꾸는 과정에서 조금 시간이 걸렸다.
        - 처음에는 단순하게 수를 역으로 정렬한다는 생각으로 reverse_cards.sort(reverse=True)를 해줬다.
        - 역으로 정렬된 수를 출력해 보니, 잘못 출력되는 것을 확인했다.
        - 알고 봤더니, 저장된 수만 역으로 바꿔야 하는데, sort() 함수를 사용하니 정렬을 시켜버려서 문제가 되었던 것이었다.
        - 다시 코드를 수정하고 제출했더니 성공!
    - 소스코드
        ```python
        import sys

        cards = [i + 1 for i in range(20)]
        for _ in range(10):
            A, B = map(int, sys.stdin.readline().split())
            print(A, B)
            reverse_cards = []
            for i in range(A, B + 1):
                reverse_cards.append(cards[i - 1])
            reverse_cards = reverse_cards[::-1] # 문제되었던 곳
            print(reverse_cards)
            for j in range(A, B + 1):
                cards[j - 1] = reverse_cards[j - A]
        print(*cards)
        ```
- 문자열 슬라이스 기능을 이용한 풀이
    - 해당 풀이는 문자열 슬라이스 기능을 이용한 풀이다.
    - 앞/중간/뒤 구간으로 카드 리스트를 나누고, 중간 카드 리스트를 배열의 순서를 역으로 바꾸는 기능인[::-1]을 이용했다.
    - 중간 카드 리스트를 역으로 바꾸고, 다시 앞/중간/뒤 구간을 합쳐서 새로운 카드 리스트를 만들어서 주면 된다.
    - 소스코드
        ```python
        import sys

        cards = [i + 1 for i in range(20)]

        for i in range(10):
            A, B = map(int, sys.stdin.readline().split())
            back_cards=cards[:A - 1]
            mid_cards = cards[A - 1:B][::-1]
            front_cards=cards[B:]
            cards=back_cards + mid_cards + front_cards
        print(*cards)
        ```
- 수 두개씩 바꾸는 것을 이용한 풀이
    - 예를 들어, 구간이 [5, 10]이라고 가정하자.
        - 5<->10, 6<->9, 7<->8의 숫자를 교환하는 방식으로 문제를 풀면 된다.
    - 소스코드
        ```python
        import sys

        cards = [i + 1 for i in range(20)]

        for _ in range(10):
            A, B = map(int, sys.stdin.readline().split())
            for i in range(A, B - ((B - A) // 2)):
                cards[i - 1], cards[B - i + A - 1] = cards[B - i + A - 1], cards[i - 1]
        print(*cards)
        ```

## 2. malloc-lab 구현
- 학습 및 구현 내용은 아래와 같고, 깃허브 RedingRecord 저장소에 동일하게 저장되어 있다.
    - 9.9.12 종합 설계 : 간단한 할당기의 구현
        - 경계 태그 연결을 사용하는 묵시적 가용 리스트에 기초한 간단한 할당기의 구현을 따라가 보기로 한다.
        - 할당기 기본 설계
            - 우리의 할당기는 아래 코드에서 보여주는 것과 같은 memlib.c 패키지에서 제공되는 메모리 시스템의 모델을 사용한다.
                ```C
                /* Private global variables */
                static char *mem_heap;  /* Points to first byte of heap */
                static char *mem_brk; /* Points to last byte of heap plus 1 */
                static char *mem_max_addr; /* Max legal heap addr plus 1 */
                
                /* *mem_init - Initilaize the memory system model */
                
                void mem_init(void)
                {
                    mem_heap = (char *)Malloc(MAX_HEAP);
                    mem_brk = (char *)mem_heap;
                    mem_max_addr = (char *)(mem_heap + MAX_HEAP);
                }
                
                /*
                * mem_sbrk - Simple model of the sbrk function. Extends the heap
                * by incr bytes and returns the start address of the new area.
                * In this model, the heap cannot be shrunk
                */
                
                void *mem_sbrk(int incr)
                {
                    char *old_brk = mem_brk;
                    
                    if ( (incr < 0) || ((mem_brk + incr) > mem_max_addr)){
                        errno = ENOMEM;
                        fprintf(stderr, "ERROR: mem_sbrk failed. Ran out of memory...\n")
                        return (void *) -1;
                    }
                    mem_brk += incr;
                    return (void *)old_brk;
                }
                ```
                - 이 모델의 목적은 우리가 설계한 할당기가 기존의 시스템 수준의 malloc 패키지와 상관없이 돌 수 있도록 하기 위한 것이다.
                - 전역변수
                    - mem_heap : 힙의 처음을 가리키는 포인터다.
                    - mem_brk : 배당 받은 힙 공간의 마지막 자리를 가리킨다. 
                    - mem_max_addr : MAX_HEAP의 끝 자리를 나타내며, 이 이상으로는 할당할 수 없다. 
                - 함수
                    - init()
                        - 할당기를 초기화하고, 성공하면 0을, 아니면 -1을 반환한다.
                    - mem_sbrk()
                        - incr(할당 요청이 들어왔을 때, 요청된 용량)가 들어왔을 때, 이것이 MAX_HEAP을 초과하지 않으면 추가로 mem_brk를 할당 요청 용량만큼 옮긴다.
                        - 용량의 크기가 음수이거나, MAX_HEAP을 초과하면 error 메세지를 반환한다.
        - 할당기의 기본 블록 구성
            - 최소 블록 크기는 16바이트이고, 가용 리스트는 묵시적 가용 리스트로 구성되며, 아래 그림과 같이 변하지 않는 형태를 갖는다.  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fp4Hoa%2Fbtre4Odp0ce%2FyoRVbdKPA3hY4pFcBdFMKK%2Fimg.png"></img>
            - 첫 번째 워드
                - 더블 워드 경계로 정렬된 미사용 패딩 워드이다.
            - 프롤로그(prolog) 블록
                - 패딩 다음에는 특별한 프롤로그(prolog) 블록이 오며, 이것을 header와 footer로만 구성된 8바이트 할당 블록이다.
                - 프롤로그 블록은 초기화 과정에서 생성되며 절대 반환하지 않는다.
            - 일반 블록
                - 프롤로그 다음에는 malloc 또는 free를 호출해서 생성된 0 또는 1개 이상의 일반 블록들이 온다.
            - 에필로그(epilogue) 블록
                - 힙은 항상 특별한 에필로그(epilogue) 블록으로 끝나며, 헤더만으로 구성된 크기가 0으로 할당된 블록이다.
            - 프롤로그와 에필로그 블록들은 연결과정 동안에 가자앚리 조건을 없애주기 위한 속임수다.
            - 할당기는 한 개의 정적(static) 전역변수를 사용하며, 항상 프롤로그 블록을 가리킨다.
        - 가용 리스트 조작을 위한 기본 상수와 매크로
            -  아래의 코드는 할당기 코드 전체에서 가용 리스트 조작을 위한 기본 상수 및 매크로 정의이다.
                ```C
                /* Basic constants and macros */
                #define WSIZE 4 /* Word and header/footer size (bytes) */
                #define DSIZE 8 /* Double word size (bytes) */
                #define CHUNKSIZE (1<<12) /* Extend heap by this amount (bytes) */

                #define MAX(x, y) ((x) > (y)? (x) : (y))

                /* Pack a size and allocated bit into a word */
                #define PACK(size, alloc) ((size) | (alloc))

                /* Read and write a word at address p */
                #define GET(p) (*(unsigned int *)(p))
                #define PUT(p, val) (*(unsigned int *)(p) = (val))

                /* Read the size and allocated fields from address p */
                #define GET_SIZE(p) (GET(p) & ~0x7)
                #define GET_ALLOC(p) (GET(p) & 0x1)

                /* Given block ptr bp, compute address of its header and footer */
                #define HDRP(bp) ((char *)(bp) - WSIZE)
                #define FTRP(bp) ((char *)(bp) + GET_SIZE(HDRP(bp)) - DSIZE)

                /* Given block ptr bp, compute address of next and previous blocks */
                #define NEXT_BLKP(bp) ((char *)(bp) + GET_SIZE(((char *)(bp) - WSIZE)))
                #define PREV_BLKP(bp) ((char *)(bp) - GET_SIZE(((char *)(bp) - DSIZE)))
                ```

## 3. 6주차 4일차를 마치며...
2주마다 기숙사 방 청소를 해주시는 날이 따로 있는데 이번에는 공지를 받지 못해서 아침에 준비하고 나가면서 다른 방을 청소하시는 것을 보고 알았다.
일찍 나와서 다행이지 늦게 일어나서 씻고 있었으면 큰일날 뻔 했다.

이번 과제는 CSAPP 책을 읽으면서 구현을 진행하다 보니, 책을 이해하는 데 너무 긴 시간이 걸려 진행 속도가 많이 느리다...
그래서, 다른 팀원의 추천으로 책의 내용이 이해가 안 될 때 참고하면서 학습하기 위해 조금 쉽게 풀어서 설명해 주는 책을 따로 하나 구매했다.

내일도 오늘과 동일하게 알고리즘 문제 풀이 및 malloc-lab 구현을 계속 진행할 계획이다.