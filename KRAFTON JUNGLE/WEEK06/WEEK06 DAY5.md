# WEEK06 DAY5 TIL
어제와 마찬가지로 오전에는 알고리즘 문제 풀이로 시간을 사용했다.
점심 식사 후부터 어제에 이어서 malloc-lab 구현을 시작했고, 가용 리스트 조작을 위한 기본 상수와 매크로 정의 정리, mm_init(), extend_heap(), 
mm_free(), coalesce()까지 구현을 완료했다.

## 1. 알고리즘 문제 풀이
- 금일 풀었던 알고리즘 문제들 중에서 특별하게 어려웠던 문제가 없어 따로 정리는 생략한다.

## 2. malloc-lab 구현
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
        - 상수
            - WSIZE : 워드 사이즈 정의
            - DSIZE : 더블 워드 사이즈 정의
            - CHUNKSIZE : 초기 가용 블록과 힙 확장시 추가되는 블록 크기 정의
        - 매크로
            - MAX(x, y) : 최대값 구하는 함수 정의
            - PACK(size, alloc) : 크기와 할당 비트를 통합해서 헤더와 풋터에 저장할 수 있는 값 반환
            - GET(p) : 포인터 p가 가리키는 블록의 데이터 반환
            - PUT(p, val) : 포인터 p가 가리키는 블록의 값 저장
            - GET_SIZE(p) : 포인터 p가 가리키는 헤더 또는 풋터의 크기 반환
                - 7을 비트연산 not으로 반전 시키고 & 연산으로 뒤의 3비트를 제외한 값을 읽어온다.
                - & ~0x7 => 0x7:0000 0111 ~0x7:1111 1000이므로 ex. 1011 0111 & 1111 1000 = 1011 0000 : size 176bytes
            - GET_ALLOC(p) : 포인터 p가 가리키는 헤더 또는 풋터의 할당 비트 반환
                - & 0x1 => ex. 1011 0111 | 0000 0001 = 1 : Allocated
            - HDRP(bp) : 현재 블록 헤더의 위치 반환(bp - 1워드)
            - FTRP(bp) : 현재 블록 풋터의 위치 반환(bp + 현재 블록 크기 - 더블 워드 크기)
            - NEXT_BLKP(bp) : 다음 블록의 블록 포인터 반환(bp + 현재 블록 크기 - 1워드)
            - PREV_BLKP(bp) : 이전 블록의 블록 포인터 반환(bp - 현재 블록 크기 - 2워드)
- 초기 가용 리스트 만들기
    - mm_malloc이나 mm_free를 호출하기 전에 어플리케이션은 mm_init 함수를 호출해서 힙을 초기화해야 한다.
    - mm_init 함수는 최초의 가용 블록(4words)을 가지고 힙을 생성하고 할당기를 초기화한다. 성공하면 0, 실패하면 -1을 리턴한다.  
        <img src="https://github.com/dkkim0122/malloc-lab/blob/main/image/Untitled(14).png?raw=true" height="150"></img>
        - mm_init 함수에서 할당받은 4번째칸의 구조는 다음과 같다.
        - 1번째 칸 : 0을 적어넣는다.
        - 2번째 칸 : 용량은 2워드이며, 1(할당됨) 이라는 헤더를 적어 넣는다. 
        - 3번째 칸 : 용량은 2워드이며, 1 이라는 풋터를 적어 넣는다.(2번째, 3번째 칸은 prologue block이라고 칭한다.)
        - 4번째 칸 : 용량은 0워드이며, 1 이라는 헤더를 적어 넣는다.(이 칸은 앞으로 epilogue block header 라고 칭한다.)
    - 아래 코드를 통해 빈 가용 리스트를 초기화해 주는 mm_init 함수를 살펴보자.
        ```C
        int mm_init(void)
        {
        /* Create the initial empty heap */
        if ((heap_listp = mem_sbrk(4*WSIZE)) == (void *)-1)
        return -1;
        PUT(heap_listp, 0);                             /* Alignment padding */
        PUT(heap_listp + (1*WSIZE), PACK(DSIZE, 1));    /* Prologue header */
        PUT(heap_listp + (2*WSIZE), PACK(DSIZE, 1));    /* Prologue footer */
        PUT(heap_listp + (3*WSIZE), PACK(0, 1));        /* Epilogue header */
        heap_listp += (2*WSIZE);

        /* Extend the empty heap with a free block of CHUNKSIZE bytes */
        if (extend_heap(CHUNKSIZE/WSIZE) == NULL)
            return -1;
        return 0;
        }
        ```
        - if((heap_listp = mem_sbrk(4 * WSIZE)) == (void *) -1)
            - heap_listp에 4워드 만큼의 메모리를 확장
        - PUT(heap_listp, 0)
            - 더블 워드 경계로 정렬된 미사용 패딩
        - PUT(heap_listp + (1 * WSIZE), PACK(DSIZE, 1))
            - 프롤로그 헤더를 1워드 할당하고 DSIZE로 값 삽입
        - PUT(heap_listp + (2 * WSIZE), PACK(DSIZE, 1))
            - 프롤로그 풋터를 1워드 할당하고 DSIZE로 값 삽입
        - PUT(heap_listp + (3 * WSIZE), PACK(0, 1))
            - 에필로그 헤더를 1워드 할당하고 0 사이즈 삽입
        - heap_listp += (2 * WSIZE)
            - 정적 전역 변수는 늘 prologue block을 가리킨다.
        - if(extend_heap(CHUNKSIZE / WSIZE) == NULL)
            - 힙을 CHUNKSIZE 바이트로 확장하고 초기 가용 블록을 생성
- 힙을 초기화한 후, extend_heap 함수를 호출해서 힙을 CHUNKSIZE 만큼 힙을 확장해 초기 가용 블록을 생성한다.
    - 아래 코드를 통해 힙을 CHUNKSIZE 바이트로 확장하고 초기 가용 블록을 생성하는 과정을 살펴보자.
        ```C
        static void *extend_heap(size_t words)
        {
        char *bp;
        size_t size;

        /* Allocate an even number of words to maintain alignment */
        size = (words % 2) ? (words+1) * WSIZE : words * WSIZE;
        if ((long)(bp = mem_sbrk(size)) == -1)
        return NULL;

        /* Initialize free block header/footer and the epilogue header */
        PUT(HDRP(bp), PACK(size, 0)); /* Free block header */
        PUT(FTRP(bp), PACK(size, 0)); /* Free block footer */
        PUT(HDRP(NEXT_BLKP(bp)), PACK(0, 1)); /* New epilogue header */

        /* Coalesce if the previous block was free */
        return coalesce(bp);
        }
        ```
        - extend_heap은 두 가지 다른 경우에 호출한다.
            - 힙이 초기화될 경우와 mm_malloc이 적당한 맞춤 fit을 찾지 못했을 경우 호출한다.
        - 위 경우일 때 정렬을 유지하기 위해서 extend_heap은 요청한 크기를 인접 2워드의 배수(8배수)로 반올림하고, 메모리 시스템으로부터 추가적인 힙 공간을 요청한다.
        - size = (words % 2) ? (words + 1) * WSIZE : words * WSIZE
            - 워드가 홀수인 경우 정렬을 위해 인접 2워드의 배수(8바이트)로 반올림하며, 추가적인 힙 공간 요청
        - if((long)(bp = mem_sbrk(size)) == -1)
            - mem_sbrk 함수에서 이 size가 할당 가능한 힙의 범위를 초과했다고 판단하면, -1을 반환하고 할당하지 않음
        - PUT(HDRP(bp), PACK(size, 0))
            - 새로운 블록에 헤더 생성
        - PUT(FTRP(bp), PACK(size, 0))
            - 새로운 블록의 푸터 생성
        - PUT(HDRP(NEXT_BLKP(bp)), PACK(0, 1))
            - 새로운 블록 뒤에 붙는 에필로그 헤더 생성
        - return coalesce(bp)
            - 이전 힙이 가용 블록으로 끝났다면, 두 개의 가용 블록을 통합하기 위해 coalesce 호출
- 블록 반환
    - 응용은 이전에 할당한 블록을 mm_free 함수를 호출해서 반환한다.
    - 블록을 반환하는 코드는 간단하며, 아래 코드를 살펴보자.
        ```C
        void mm_free(void *bp)
        {
        size_t size = GET_SIZE(HDRP(bp));

        PUT(HDRP(bp), PACK(size, 0));
        PUT(FTRP(bp), PACK(size, 0));
        coalesce(bp);
        }
        ```
        - size_t size = GET_SIZE(HDRP(bp))
            - 해당 블록의 크기를 알아내 헤더와 풋터의 정보를 수정
        - PUT(HDRP(bp), PACK(size, 0))
            - 헤더를 0으로 할당
        - PUT(FTRP(bp), PACK(size, 0))
            - 풋터를 0으로 할당
        - coalesce(bp)
            - coalesce를 호출하여 가용 메모리를 연결
- 블록 연결
    - coalesce 함수는 mm_free 함수를 이용하여 블록을 반환하고, 경계 태그 연결을 사용해서 상수 시간에 인접 가용 블록들과 통합한다.
    - 직전 블록의 풋터과 직후 블록의 헤더를 보고 가용 여부를 확인한다.
    - 아래 코드를 통해 가용 블록을 연결하는 과정을 살펴보자.
        ```C
        static void *coalesce(void *bp)
        {
        size_t prev_alloc = GET_ALLOC(FTRP(PREV_BLKP(bp)));
        size_t next_alloc = GET_ALLOC(HDRP(NEXT_BLKP(bp)));
        size_t size = GET_SIZE(HDRP(bp));

        if (prev_alloc && next_alloc) {             /* Case 1 */
        return bp;
        }

        else if (prev_alloc && !next_alloc) {       /* Case 2 */
        size += GET_SIZE(HDRP(NEXT_BLKP(bp)));
        PUT(HDRP(bp), PACK(size, 0));
        PUT(FTRP(bp), PACK(size,0));
        }

        else if (!prev_alloc && next_alloc) {       /* Case 3 */
        size += GET_SIZE(HDRP(PREV_BLKP(bp)));
        PUT(FTRP(bp), PACK(size, 0));
        PUT(HDRP(PREV_BLKP(bp)), PACK(size, 0));
        bp = PREV_BLKP(bp);
        }

        else {                                      /* Case 4 */
        size += GET_SIZE(HDRP(PREV_BLKP(bp))) +
        GET_SIZE(FTRP(NEXT_BLKP(bp)));
        PUT(HDRP(PREV_BLKP(bp)), PACK(size, 0));
        PUT(FTRP(NEXT_BLKP(bp)), PACK(size, 0));
        bp = PREV_BLKP(bp);
        }
        return bp;
        }
        ```
        - size_t prev_alloc = GET_ALLOC(FTRP(PREV_BLKP(bp))) : 직전 블록 가용 여부
        - size_t next_alloc = GET_ALLOC(HDRP(NEXT_BLKP(bp))) : 직후 블록 가용 여부
        - if(prev_alloc && next_alloc) : case 1 : 이전, 다음 블록이 모두 할당인 경우 -> 현재만 반환
        - else if(prev_alloc && !next_alloc) : case 2 : 이전 블록 할당, 다음 블록 가용인 경우 -> 다음 블록과 병합
        - else if(!prev_alloc && next_alloc) : case 3 : 이전 블록 가용, 다음 블록 할당인 경우 -> 이전 블록과 병합
        - else : case 4 : 이전, 다음 블록 모두 가용인 경우 -> 이전 블록과 다음 블록 병합

## 3. 6주차 5일차를 마치며...
내일도 오전에는 알고리즘 문제를 풀고, 오후부터는 mm_malloc(), find_fit(), place(), realloc() 함수를 모두 구현할 계획이다.(목요일까지 무한반복⚙️)
현재 구현하는 방법은 과제의 초기 목적인 묵시적 할당기(implicit allocators)와 할당한 블록의 배치를 first fit을 이용하여 구현하는 중이다.
시간적 여유가 된다면, 할당한 블록의 배치를 next fit으로 변경하고, explicit까지 구현해볼 수 있었으면 좋겠다.