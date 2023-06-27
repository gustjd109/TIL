# WEEK11 DAY7 TIL

## 1. 오늘의 학습 목록
```
1. 핀토스 프로젝트3 진행
    - Swap In/Out 과제 구현
    - 개념 정리
    - 발표 준비
```

## 2. 11주차 7일차 핀토스 프로젝트 3를 마치며...
오늘 아침에 일어나서 테스트 돌려봤는데 이제는 그냥 swap-fork에서 터져서 테스트가 계속 실패한다.  
진짜 아침부터 노트북 던질 뻔했다...😡  

테스트 실행 시, swap-fork가 터지면서 아래 오류가 발생한다.  
Kernel panic in run: PANIC at ../../threads/thread.c:330 in thread_yield(): assertion `!intr_context ()' failed.  
thread_yield() 함수에서의 ASSERT (!intr_context ()) 부분에서 문제가 발생하는 것 같다.  
intr_context() 함수는 외부 인터럽트를 처리 중일 때는 true를 반환하고, 아니면 false를 반환하는 함수다.  
즉, 외부 인터럽트가 들어오면 테스트에서 FAIL이 발생하는 것이다.  
따라서, 외부 인터럽트가 아닐 때만 thread_yield() 함수를 실행하도록 코드를 수정하여 문제를 해결했다.  
```C
/* ready_list에서 우선순위가 가장 높은 스레드와 현재 스레드의 우선순위를 비교하는 함수 */
void test_max_priority (void) {
	// Ready_list가 비어있지 않고, ready_list에서 우선순위가 가장 높은 스레드보다 현재 스레드의 우선순위가 더 작은 경우
	if(!list_empty (&ready_list) && ((thread_current ()->priority) < (list_entry(list_front (&ready_list), struct thread, elem)->priority))) {
		if (!intr_context()) {
			thread_yield (); // thread_yield() 함수를 호출하여 현재 스레드의 CPU를 양보
		}
	}
}
```

아래 4개의 테스트 케이스는 간헐적으로 실패하는 케이스인데, 결국 원인을 알지 못해 해결하지 못해서 많이 아쉽다...  
FAIL tests/vm/page-merge-par  
FAIL tests/vm/page-merge-stk  
FAIL tests/vm/page-merge-mm  
FAIL tests/filesys/base/syn-read

내일은 프로젝트3 발표가 끝나고, 프로젝트 4가 시작되는 날이다.  
일주일밖에 시간이 없어서 개념 공부 및 구현하는 데 절대적으로 시간이 부족할 것 같지만, 최대한 열심히 할 수 있는 데까지 해볼 생각이다.😀