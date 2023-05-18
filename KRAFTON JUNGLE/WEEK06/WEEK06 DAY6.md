# WEEK06 DAY6 TIL
오전에는 알고리즘 2문제를 풀었고, 오후부터는 어제에 이어서 묵시적 가용 리스트와 할당기가 이 검색을 수행하는 방법은 배치 정책 중, first-fit을 이용하여 구현을 완료했다.
추가로 나머지 배치 정책인 next-fit과 best-fit을 구현했고, 세 가지 정책의 차이를 확인했다.👍

## 1. 알고리즘 문제 풀이
- 10808번 알파벳 개수 문제 풀이
    - 아스키 코드를 이용한 풀이
        - 알파벳 소문자로 이루어진 문자열이 주어지면, 각 알파벳이 몇 개씩 포함되어 있는지 구하는 문제이다.
        - ord()함수를 이용하여 알파벳 소문자를 아스키 코드로 먼저 변환시켜 준다.
        - 알파벳 소문자를 세기 위해서는 변환된 아스키 코드에서 97을 빼주고, 알파벳 대문자는 65를 빼준다.
        - 알파벳 개수 카운트 배열[빼주고 난 뒤의 수]에 1을 더해준다.
        - 문자열의 각 문자에 대해서 위의 과정을 모두 거치고 나서 알파벳 개수 카운트 배열을 공백을 포함하여 출력해주면 된다.
    - 소스코드
        ```python
        import sys

        S = input() # sys.stdin.readline()으로 하면, 런타임 에러 발생(왜?)
        alphabet_cnt = [0] * 26
        for i in S:
            alphabet_cnt[ord(i) - 97] += 1
        print(*alphabet_cnt)
        ```
- 2577번 숫자의 개수 문제 풀이
    - 일반적인 풀이
        - 세 수를 곱한 값을 리스트로 저장하고, 0부터 9까지 리스트의 각 문자를 비교해서 같은 숫자면 카운트를 +1해준다.
        - 여기서 문자를 비교할 때, int형으로 변환한 값을 비교해줘야 한다.
        - 소스코드
            ```python
            import sys

            A = int(sys.stdin.readline())
            B = int(sys.stdin.readline())
            C = int(sys.stdin.readline())
            mul_nums_list = list(str(A * B * C))
            for i in range(0, 10):
                cnt = 0
                for j in mul_nums_list:
                    if int(j) == i:
                        cnt += 1
                print(cnt)
            ```
    - count 함수를 이용한 풀이
        - 세 수를 곱한 값을 리스트에 저장하는 것은 일반적인 풀이 방법과 같다.
        - 다만, 0부터 9까지 리스트의 각 문자를 비교할 때, count 함수를 이용하여 카운트를 세는 방식을 이용하는 것에서 다르다.
        - 소스코드
            ```python
            import sys

            A = int(sys.stdin.readline())
            B = int(sys.stdin.readline())
            C = int(sys.stdin.readline())
            mul_nums_list = list(str(A * B * C))

            for i in range(10):
                print(mul_nums_list.count(str(i)))
            ```

## 2. malloc-lab 구현
- 어제에 이어서 묵시적 가용 리스트와 할당기가 이 검색을 수행하는 방법은 배치 정책 중, first-fit을 이용하여 구현을 완료했다.
- 추가로 나머지 배치 정책인 next-fit과 best-fit을 구현하여 세 가지 정책의 차이를 확인했다.
- 구현 및 학습 내용은 다음과 같다.
- 블록 할당
    - 어플리케이션은 mm_malloc 함수를 호출하여 size 바이트의 메모리 블록을 요청한다.
    - 추가적인 요청들을 체크한 후에 할당기는 요청한 블록 크기를 조절해서 헤더와 풋터를 위한 공간을 확보하고, 더블 워드 요건을 만족시킨다.
    - 블록을 할당하는 mm_malloc 함수의 코드는 다음과 같다.
        ```C
        void *mm_malloc(size_t size)
        {
            size_t asize; /* 조정된 블록 크기 */
            size_t extendsize; /* 적합하지 않은 경우 힙을 확장할 크기 */
            char *bp;

            /* 가짜 요청 무시 */
            // 만약 할당 요청받은 용량이 0이면 그냥 반환
            if(size == 0)
                return NULL;

            /* 오버헤드 및 정렬 요구 사항을 포함하도록 블록 크기를 조정 */
            if(size <= DSIZE) // 사이즈가 2워드(8바이트) 이하라면 4워드로 할당 요청(앞의 1워드는 헤더에, 뒤의 1워드는 풋터)
                asize = 2 * DSIZE;
            else // 할당 요청의 용량이 2워드 초과(8바이트의 배수에 맞지 않은 경우)라면 충분한 8바이트의 배수의 용량을 할당
                asize = DSIZE * ((size + (DSIZE) + (DSIZE - 1)) / DSIZE);

            /* 적당한 크기의 가용 블록을 가용 리스트에서 검색 */
            if((bp = find_fit(asize)) != NULL) { // find_fit 함수로 적당한 크기의 가용 블록을 검색
                place(bp, asize); // place 함수로 초과 부분을 분할하고 새롭게 할당한 블록의 블록 포인터를 반환
                return bp;
            }

            /* 적당한 크기의 가용 블록을 찾지 못한다면 extend_heap 함수로 힙을 확장하여 추가 확장 블록을 배정 */
            extendsize = MAX(asize, CHUNKSIZE); // 둘 중 더 큰 값으로 사이즈 지정
            // extend_heap()은 워드 단위로 인자를 받으므로 WSIZE로 나눔
            if((bp = extend_heap(extendsize / WSIZE)) == NULL) // 힙 확장 실패 시 NULL을 반환(extendsize / WSIZE = 칸의 개수)
                return NULL;
            place(bp, asize); // 힙 확장 성공 시 블록을 배치하고 bp 반환
            return bp;
        }
        ```
        - 동적 할당할 메모리 크기를 받아 알맞은 크기의 블록을 할당한다.
        - 만약 후보가 없으면 힙을 CHUNKSIZE만큼 늘려 할당 받는다. 그리고 할당 받은 블록의 포인터를 반환한다.
- 적절한 가용 블록 검색
    - mm_malloc 함수에서 find_fit 함수를 통해 적당한 크기의 가용 블록을 검색한다.
    - 적당한 가용 블록을 검색하는 find_fit 함수의 코드는 다음과 같고, 여기서는 first_fit을 사용한다.
        ```C
        static void *find_fit(size_t asize)
        {
            void *bp;

            // Free list에서 유일한 할당 블록은 리스트 맨 뒤의 프롤로그 블록이므로, 할당 블록을 만나면 모든 list 노드들을 다 확인한 것으로 탐색 종료
            for(bp = heap_listp; GET_SIZE(HDRP(bp)) > 0; bp = NEXT_BLKP(bp)) { // bp는 힙의 시작점을 가리키는 heap_listp에서 시작하여 에필로그 블록까지 탐색
                if(!GET_ALLOC(HDRP(bp)) && (asize <= GET_SIZE(HDRP(bp)))) { // 만약 해당 헤더의 블록이 할당되어있지 않고(GET_ALLOC 함수로 판단), 사이즈도 원하는 크기(asize)보다 크다면(GET_SIZE로 판단)
                    return bp; // bp를 반환
                }
            }
            return NULL; // 못 칮으면 NULL 반환
        }
        ```
- 데이터 배치
    - 요청한 블록을 가용 블록의 시작 부분에 배치하고, 나머지 부분의 크기가 최소 블록 크기와 같거나 큰 경우에는 분할한다.
    - 데이터를 배치하고 분할하는 place 함수의 코드는 다음과 같다.
        ```C
        static void place(void *bp, size_t asize) // place 함수는 데이터를 할당할 가용 블록의 bp와 배치 용량을 할당받음
        {
            size_t csize = GET_SIZE(HDRP(bp)); // 할당할 가용 블록의 전체 크기를 csize로 저장

            if((csize - asize) >= (2 * DSIZE)) { // 분할이 가능한 경우
                // 요청 용량만큼 블록을 배치하고 헤더와 풋터를 배치
                PUT(HDRP(bp), PACK(asize, 1));
                PUT(FTRP(bp), PACK(asize, 1));
                // 남은 블록에 헤더와 풋터를 배치
                bp = NEXT_BLKP(bp);
                PUT(HDRP(bp), PACK(csize-asize, 0));
                PUT(FTRP(bp), PACK(csize-asize, 0));
            }
            else { // csize와 asize의 차이가 네 칸(16바이트)보다 작다면 해당 블록을 통째로 사용하고, 헤더와 풋터를 배치
                PUT(HDRP(bp), PACK(csize, 1));
                PUT(FTRP(bp), PACK(csize, 1));
            }
        }
        ```
- 메모리 재할당
    - mm_realloc 함수는 malloc으로 할당 받은 메모리 영역의 size를 변경하여 재할당받는 역할을 한다.
    - 여기서 이미 할당된 블록의 크기를 직접 건드리는 것이 아니라, 임시로 요청 크기 만큼의 블록을 만들고 현재의 블록을 반환해야 한다.
    - 또한 memcpy 함수를 이용하여 블록 내 데이터도 같이 옭겨준 다음 기존 블록을 반환한다.
    - mm_realloc 함수의 코드는 다음과 같다.
        ```C
        void *mm_realloc(void *ptr, size_t size)
        {
            void *oldptr = ptr;
            void *newptr;
            size_t copySize;
            
            newptr = mm_malloc(size);
            if (newptr == NULL)
            return NULL;
            copySize = GET_SIZE(HDRP(oldptr));
            if (size < copySize)
            copySize = size;
            memcpy(newptr, oldptr, copySize);
            mm_free(oldptr);
            return newptr;
        }
        ```
- Implicit, first-fit으로 구현된 할당기 테스트 결과
    - 점수 : Perf index = 44 (util) + 9 (thru) = 53/100
    - 가용 블록 탐색 시 항상 처음 위치에서 시작하는 방식으로, 처리량(Thru) 점수가 낮게 나온다.
    - 또한, 내부 단편화와 외부 단편화가 많이 생길 수 있는 가능성이 있다.
- Implicit, next-fit으로 구현된 할당기 테스트 결과
    - 점수 : Perf index = 44 (util) + 38 (thru) = 83/100
    - 가용 블록 탐색 시 마지막 탐색 지점부터 시작하는 방식으로, first fit 대비 빨리 가용블록을 찾을 확률이 높다.
- Implicit, best-fit으로 구현된 할당기 테스트 결과
    - 점수 : Perf index = 45 (util) + 8 (thru) = 53/100
    - 가용 블록 탐색 시 first-fit과 마찬가지로 힙의 처음부터 끝까지 탐색하지만, 가장 알맞는 크기의 블록을 찾을 수 있으므로 메모리 이용도는 다른 방법보다 우수하다.

## 3. 6주차 6일차를 마치며...
요즘 간단한 문제지만 알고리즘 문제를 꾸준히 풀기 위해 노력하고 있다.🚴‍♂️
이대로 문제를 계속 풀어가면서 점점 더 어려운 문제도 도전하여 알고리즘 문제 풀이 실력을 꾸준히 쌓을 계획이다.

명시적 가용 리스트, 분리 가용 리스트와 버디 시스템까지 구현했으면 좋았겠지만, 아쉽게도 묵시적 가용 리스트 방법밖에 구현하지 못했다.
그래도 묵시적 가용 리스트에서 할당기가 검색을 수행하는 방법인 세 가지 배치 정책(first-fit, next-fit, best-fit)을 이용하여 모두 구현해 봤다.
사실, 묵시적 가용 리스트를 구현하는 것만 해도 너무 힘들고 시간이 오래 걸렸고, 구현 및 학습 내용을 모두 완벽하게 이해했다고 하기에는 힘들다.
하지만, 단기간에 책을 읽고 구현해 보면서 이번 주차의 목적인 메모리와 포인터 개념에 대해 조금 더 익숙해질 수 있었던 시간이었다.

내일은 구현한 malloc-lab 코드 리뷰, 7주차 발제, 티타임이 예정되어 있으며, 협력사인 팀스파르타에서 채용 설명회 및 격려차 회식이 있을 예정이다.