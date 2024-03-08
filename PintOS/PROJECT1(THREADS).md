# PROJECT1 : THREADS

## 1. Introduction GitBook Contents
### Building Pintos
- cd 명령어를 사용하여 threads 디렉터리로 이동
    - 명령어 : cd threads
- make 명령어 실행
    - 명령어 : make
    - make 명령어를 실행하면, threads 디렉터리의 하위에 build 디렉터리가 생성됨
    - build 데렉터리에는 Makefile과 몇 개의 하위 디렉터리로 채운 다음 내부에 커널을 빌드합니다.

### Running Pintos
- cd 명령어를 사용하여 새로 생성된 build 디렉터리로 이동
    - 명령어 : cd build
- pintos run alarm-multiple 명령어를 실행하여 인수 run alarm-multiple을 Pintos 커널에 전달
    - 명령어 : pintos -- -q run alarm-multiple

## 2. PROJECT1(THREADS) GitBook Contents
### Understanding Threads
- 첫 번째 단계는 initial thread system의 코드를 읽고 이해하는 것입니다. 핀토스는 이미 thread creation, thread completion, thread switch를 위한 간단한 스케줄러와 synchronization primitives(semaphores, locks, condition variables, and optimization barriers)를 구현해 놓았습니다.<br><br>
- 이 코드 중 일부는 약간 이상하게 보일 수 있습니다. 원한다면, 거의 모든 곳에 printf()를 추가하여 어떤 일이 일어나는지, 어떤 순서로 진행되는지 확인할 수 있습니다. 또한, 디버거에서 커널을 실행하거나 궁금한 지점에 중단점를 설정해서 코드를 단계별로 실행할 수도 있습니다.<br><br>
- 스레드가 생성되면, 스케줄될 새 context가 생성됩니다. 이 context에 실행될 함수는 thread_create()의 인수로 넣어서 context에 제공할 수 있습니다. 스레드가 처음 스케줄되고 실행되면, 스레드는 새로 생성된 context 내에서 thread_create()로 들어간 함수의 시작 부분부터 실행됩니다. 함수가 반환되면 스레드가 종료됩니다. 따라서 각 스레드는 핀토스 내에서 thread_create()의 인자로 들어간 함수가 main() 함수 역할을 하는 미니 프로그램과 같다고 볼 수 있습니다.<br><br>
- 주어진 시간에 정확히 한 개의 스레드가 실행되고, 나머지 스레드(있는 경우)는 비활성화됩니다. 스케줄러는 다음에 실행할 스레드를 결정합니다.(지정된 시간에 실행할 준비가 된 스레드가 없으면, idle()에 구현된 특별한 idle 스레드가 실행됩니다.) synchronization primitives는 한 스레드가 다른 스레드가 어떤 작업을 수행할 때까지 기다려야 할 때 context switch를 강제할 수 있습니다.<br><br>
- Context switch의 메커니즘은 threads/thread.c의 thread_launch()에 있습니다(이해할 필요는 없습니다). 현재 실행 중인 스레드의 상태를 저장하고 바꾸려고 하는 스레드의 상태를 복원합니다.<br><br>
- GDB 디버거를 사용하여 context switch를 천천히 추적하여 결과를 확인합니다. schedule()에 중단점을 설정하여 시작한 다음 여기서 한 단계씩 수행할 수 있습니다. 각 스레드의 주소와 상태, 각 스레드에 대한 호출 스택의 절차를 추적해야 합니다. 한 스레드가 do_iret()에서 iret를 실행하면 다른 스레드가 실행되기 시작합니다.
- 주의 : 핀토스에서는 각 스레드에 크기가 4KB 미만인 작은 고정 크기의 실행 스택이 할당됩니다. 커널은 스택 오버플로우를 탐지하려고 하지만 완벽하게 탐지할 수 없습니다. 큰 데이터 구조를 intbuf[1000];와 같이 non-static local 변수로 선언하면 알 수 없는 kernel panics과 같은 이상한 문제가 발생할 수 있습니다. stack allocation 대신 page allocator와 block allocator가 있습니다.<br><br>
- 동기화 기초 요소(synchronization primitives)
    - 스레드 동기화 또는 프로세스 동기화를 지원하기 위한 목적으로 OS와 같은 플랫폼으로 유저에게 제공하는 간단한 소프트웨어 매커니즘
    - 보통은 low level 매커니즘으로 atomic 연산, 메모리 경계, spinlock, context switch 등을 포함하는 개념
    - 흔히 아는 mutex, event, conditional variables, semaphore 같은 것들도 synchronization primitives라고 할 수 있음

### Synchronization
- 적절한 동기화는 이러한 문제에 대한 해결책의 중요한 부분입니다. 모든 동기화 문제는 인터럽트를 off함으로써 쉽게 해결할 수 있습니다. 인터럽트를 비활성화 하면, 동시성이 없어지기 때문에 race condition에 대한 가능성이 없기 때문입니다. 따라서, 모든 동기화 문제를 이러한 방식으로 해결하는 것이 바람직하지만 그렇지 않습니다. 대신 semaphores, locks 및 condition variables를 사용하여 동기화 문제를 해결하기 바랍니다. 어떤 상황에서 어떤 synchronization primitives를 사용할지 모르는 경우, 동기화 섹션을 읽거나 threads/synch.c의 주석 부분을 보시기 바랍니다.<br><br>
- 핀토스 프로젝트에서 인터럽트를 비활성화함으로써 가장 잘 해결된 유일한 종류의 문제는 커널 스레드와 인터럽트 핸들러 간에 공유되는 데이터를 조정하는 것입니다. 인터럽트 핸들러는 재워야 할 수 없기 때문에 lock을 획득할 수 없습니다. 즉, 커널 스레드와 인터럽트 핸들러 간에 공유되는 데이터는 인터럽트를 해제하여 커널 스레드 내에서 보호되어야 합니다.<br><br>
- 이 프로젝트는 인터럽트 핸들러에서 약간의 스레드 상태만 액세스하면 됩니다. Alarm clock의 경우 타이머 인터럽트는 자는 스레드를 깨워야 합니다. 고급 스케줄러에서 타이머 인터럽트는 몇 가지 글로벌 변수와 스레드 단위 변수에 액세스해야 합니다. 커널 스레드에서 이러한 변수에 액세스할 때 타이머 인터럽트가 간섭하지 않도록 인터럽트를 비활성화해야 합니다.<br><br>
- 인터럽트를 해제할 때는 가능한 한 코드를 적게 사용하도록 주의하십시오. 그렇지 않으면, timer ticks나 input events와 같은 중요한 항목이 손실될 수 있습니다. 또한 인터럽트를 비활성화 하면 인터럽트 처리 지연 시간이 증가하며, 너무 오래 걸리면 시스템이 느려질 수 있습니다. <br><br>
-  synch.c의 Synchronization primitives 자체는 인터럽트를 비활성화하여 구현되었습니다. 여기서 인터럽트가 비활성화된 상태에서 실행되는 코드의 양을 늘려야 할 수도 있지만, 최소한으로 유지해야 합니다.<br><br>
- 만약 코드의 한 부분이 중단되지 않도록 하려면, 인터럽트를 비활성화하는 것이 디버깅에 유용합니다. 프로젝트를 제출하기 전에 디버깅 코드를 제거해야 합니다.<br><br>
- Busy waiting이 존재해서는 안됩니다. thread_yield()로 불리는 tight loop는 busy waiting의 한 형태입니다.

### Alarm Clock
- devices/timer.c에 정의된 timer_sleep()을 다시 구현하십시오.<br><br>
- 현재는 반복문을 통해 시간이 지날 때까지 시간을 체크하고, thread_yield() 함수를 호출하는 것을 반복하는 busy-wait 방식으로 구현되어 있습니다. 따라서 이 과제는 busy-wait를 사용하지 않는 방법으로 재구현하는 것입니다.<br><br>
- timer_sleep()
    ```
    void timer_sleep (int64_t ticks);
    ```
    - time_sleep()를 호출하는 스레드의 실행을 시간이 최소 ticks값 만큼의 시간이 지난 이후까지 일시 중단합니다. 시스템이 idle 상태가 아니면, 스레드는 정확하게 ticks값 이후에 깨어날 필요가 없습니다. 스레드를 해당 시간동안 기다린 후 ready queue에 넣으면 됩니다.<br><br>
- timer_sleep()는 실시간으로 작동하는 스레드에 유용합니다(예: 초당 한 번씩 커서를 깜박이는 경우). timer_sleep()의 인수는 밀리초 또는 다른 단위가 아닌 ticks으로 표시됩니다. 1초당 100번의 timer ticks가 있습니다. 100이라는 값은 devices/timer.h 에 정의된 TIMER_FREQ 값인데, 이 값을 바꾸면 여러 테스트에서 오류가 발생할 수 있으므로 바꾸는 것을 권장하지 않습니다.<br><br>
- timer_msleep(), timer_usleep(), timer_nsleep()은 각각 밀리초, 마이크로초, 나노초 단위에 따른 sleep을 위해 구현되어 있는 함수로, 필요한 경우 timer_sleep()이 자동으로 호출하기 때문에 수정할 필요가 없습니다. Alarm clock 구현은 프로젝트 4에서는 유용할 수 있지만, 다른 프로젝트에는 영향을 주지 않습니다.

### Priority Scheduling
- 핀토스에서 우선 순위 스케줄링과 priority donation을 구현하십시오.<br><br>
- 현재 실행중인 스레드보다 우선 순위가 높은 스레드가 ready list에 추가되면, 현재 실행중인 스레드는 즉시 프로세서를 새 스레드에 넘겨야 합니다. 마찬가지로 스레드가 lock, semaphore 또는 condition variable들을 기다리는 경우, 우선 순위가 가장 높은 대기 스레드를 먼저 깨워야 합니다. 스레드는 언제든지 자체 우선 순위를 올리거나 낮출 수 있지만, 더 이상 가장 높은 우선 순위를 갖지 않도록 우선 순위를 낮추면 CPU 사용을 다른 스레드에게 넘겨주게 됩니다.<br><br>
- 스레드 우선 순위는 PRI_MIN(0)에서 PRI_MAX(63)까지입니다. 숫자가 낮을수록 우선 순위가 낮으므로, 우선 순위 0이 가장 낮은 우선 순위이고 우선 순위 63이 가장 높습니다. 초기 스레드 우선 순위는 thread_create() 인수로 전달됩니다. 특정 우선 순위를 사용해야 하는 이유가 없다면, PRI_DEFAULT(31)을 사용하십시오. PRI_ 매크로는 threads/thread.h에 정의되어 있으며, 이 값을 변경하면 안 됩니다.<br><br>
- 우선순위 스케줄링과 관련된 한 가지 문제는 'priority inversion'이다. H, M, L을 각각 높은, 중간, 낮은 우선 순위의 스레드라 해봅시다. H가 L을 기다려야 하고(예를 들면, L이 lock을 걸은 경우) M은 ready list에 있다면, L이 CPU 이용 시간을 얻지 못하기 때문에 H도 절대 CPU를 사용하지 못하게 될 것입니다. 이 문제에 대한 부분적인 해결책은 L이 lock을 걸고 있는 동안에는 H가 우선 순위를 L에게 donate하고, L이 lock을 풀었을 때, H가 donate한 우선 순위를 가져오는 것입니다.<br><br>
- priority donation를 구현하십시오. priority donation이 필요한 모든 상황들을 고려해야 합니다. 여러 우선 순위가 하나의 스레드에 donation되는 multiple donation을 처리할 수 있어야 합니다. nested donation 또한 처리할 수 있어야 합니다. 만약, H가 M이 걸은 lock을 기다려야 하고, M이 L이 걸은 lock을 기다리고 있다면, M과 L은 모두 H의 우선순위를 갖게 해야 합니다. 필요한 경우, 지나친 nested priority donation를 방지하기 위해 8레벨 정도의 깊이 제한을 설정할 수 있습니다.<br><br>
- lock에 대한 priority donation을 구현해야 하지만, 다른 Pintos synchronization constructs에 대한 priority donation은 구현할 필요 없습니다. 모든 경우의 우선 순위 스케쥴링을 구현해야 합니다.<br><br>
- 마지막으로, 스레드가 자체 우선 순위를 검사하고 수정할 수 있도록 다음 함수들을 구현하십시오. 이 함수들의 Skeleton code는 threads/thread.c에 제공됩니다.<br><br>
- thread_set_priority()
    ```
    void thread_set_priority (int new_priority);
    ```
    - 현재 스레드의 우선 순위를 new_priority로 설정합니다. 현재 스레드가 더 이상 가장 높은 우선 순위를 가지지 않으면 양보합니다.<br><br>
- thread_get_priority()
    ```
    int thread_get_priority (void);
    ```
    - 현재 스레드의 우선 순위를 반환합니다. priority donation이 있는 경우, 더 높은 donate된 우선 순위를 반환합니다.<br><br>
- 스레드가 다른 스레드의 우선 순위를 직접 수정할 수 있도록 인터페이스를 제공할 필요는 없습니다.<br><br>
- 우선 순위 스케줄러는 이후 프로젝트에서 사용되지 않습니다.

## 3. Appendix GitBook Contents

### Synchronization
1. Synchronization
    - 스레드 간의 리소스 공유가 신중하고 통제된 방식으로 처리되지 않으면, 결과는 대개 큰 혼란을 초래합니다. 이는 특히 잘못된 공유로 인해 전체 시스템이 손상될 수 있는 운영 체제 커널의 경우에 해당합니다. 핀토스는 여기에 도움이 되는 몇 가지 syncronization primitives를 제공한다.<br><br>
2. Disabling Interrupts
    - 동기화를 수행하는 가장 거친 방법은 인터럽트를 비활성화하는 것, 즉 CPU가 일시적으로 인터럽트에 응답하지 못하도록 하는 것입니다. 인트럽트가 비활성화 되어 있으면, 실행 중인 스레드를 다른 스레드가 선점하지 않습니다. 왜냐하면, 스레드 선점은 타이머 인터럽트에 의해 구동되기 때문입니다. 인터럽트가 정상적으로 활성화 되어 있는 경우, 실행 중인 스레드는 두 개의 C statements 사이 또는 심지어 하나의 실행 범위 내에서 언제든지 다른 것에 의해 선점될 수 있습니다.<br><br>
    - 부수적으로, 이것은 핀토스가 '선점 가능한 커널', 즉 커널 스레드가 언제든지 선점될 수 있다는 것을 의미한다. 기존의 유닉스 시스템은 '선제 불가'이다. 즉, 커널 스레드는 스케줄러를 명시적으로 호출하는 지점에서만 선점될 수 있다. (사용자 프로그램은 두 모델 모두에서 언제든지 선점할 수 있습니다.) 당신이 상상하는 것처럼, 선점 가능한 커널은 더 명시적인 동기화를 요구한다.<br><br>
    - 인터럽트 상태를 직접 설정할 필요가 거의 없습니다. 대부분의 경우 다음 섹션에 설명된 다른 syncronization primitives를 사용해야 합니다. 인터럽트를 비활성화하는 주된 이유는 커널 스레드를 외부 인터럽트 핸들러와 동기화하기 위한 것이며, 이로 인해 대부분의 다른 형태의 동기화를 사용할 수 없다.<br><br>
    - 일부 외부 인터럽트는 인터럽트를 비활성화하더라도 지연될 수 없습니다. NMI(Non-Maskable Interrupt)라고 하는 이러한 인터럽트는 컴퓨터에 불이 나는 경우와 같이 비상시에만 사용되도록 되어 있습니다. 핀토스는 NMI를 처리하지 않습니다.<br><br>
    - include/threads/interrupt.h에는 인터럽트를 비활성화하고 활성화하는 유형과 기능이 있습니다.
        ```C
        enum intr_level;
        ```
        - One of INTR_OFF or INTR_ON. 인터럽트가 각각 비활성화 또는 활성화되었음을 나타냅니다.
        ```C
        enum intr_level intr_get_level (void)
        ```
        - 현재 인터럽트 상태를 반환합니다.
        ```C
        enum intr_level intr_set_level (enum intr_level level);
        ```
        - 레벨에 따라 인터럽트를 켜거나 끕니다. 이전 인터럽트 상태를 반환합니다.
        ```C
        enum intr_level intr_enable (void);
        ```
        - 인터럽트를 켭니다. 이전 인터럽트 상태를 반환합니다.
        ```C
        enum intr_level intr_disable (void);
        ```
        - 인터럽트를 끕니다. 이전 인터럽트 상태를 반환합니다.<br><br>
3. Semaphores
    - 세마포어는 그것을 원자적으로 조작하는 두 연산자와 함께하는 음이 아닌 정수로서, 다음과 같습니다.
        - 'Down' 또는 'P' : 값이 양수가 될 때까지 기다렸다가 감소합니다.
        - 'UP' 또는 'V': 값을 증가시킵니다(대기 중인 스레드가 있는 경우 하나를 깨웁니다).<br><br>
    - 0으로 초기화된 세마포어는 정확히 한 번 발생할 이벤트를 대기하는 데 사용될 수 있습니다. 예를 들어, 스레드 A가 다른 스레드 B를 시작하고, B가 어떤 활동이 완료되었음을 신호할 때까지 기다린다고 가정합니다. A는 0으로 초기화 된 세마포어를 만든 다음, 시작할 때 B에게 전달하고, 세마포어를 'down'할 수 있습니다. B는 활동을 마치면 세마포어를 ups' 한다. 이것은 A가 세마포어를 'down'하든 B가 먼저 'ups'하든 상관없이 작동한다.<br><br>
        - 예
            ```C
            struct semaphore sema;

            /* Thread A */
            void threadA (void) {
                sema_down (&sema);
            }

            /* Thread B */
            void threadB (void) {
                sema_up (&sema);
            }

            /* main function */
            void main (void) {
                sema_init (&sema, 0);
                thread_create ("threadA", PRI_MIN, threadA, NULL);
                thread_create ("threadB", PRI_MIN, threadB, NULL);
            }
            ```
            - 이 예에서 스레드 A는 스레드 B가 sema_up()을 호출할 때까지 sema_down()에서 실행을 중지합니다.<br><br>
    - 1로 초기화된 세마포어는 일반적으로 리소스에 대한 액세스를 제어하는 데 사용됩니다. 코드 블록이 리소스를 사용하기 시작하기 전에 세마포를 'down'한 후 리소스를 'ups'합니다. 이러한 경우 아래에 설명된 lock이 더 적절할 수 있다.<br><br>
    - 세마포어를 1보다 큰 값으로 초기화할 수도 있습니다. 이것들은 거의 사용되지 않는다. 세마포어는 Edsger Dijkstra에 의해 발명되었으며, 운영체제에 처음으로 사용되었다. 핀토스의 세마포어 유형과 연산은 include/threads/synch.에 선언됩니다.
        ```C
        struct semaphore;
        ```
        - 세마포어 구조체를 나타냅니다.
        ```C
        void sema_init (struct semaphore *sema, unsigned value);
        ```
        - 주어진 초기값을 가지고 sema를 새로운 세마포어로 초기화합니다.
        ```C
        void sema_down (struct semaphore *sema);
        ```
        - sema에 대해 'down" 또는 'P' 연산을 실행하여 값이 양수가 될 때까지 기다렸다가 1씩 감소시킵니다.
        ```C
        bool sema_try_down (struct semaphore *sema);
        ```
        - 기다리지 않고 sema에서 'down' 또는 'P' 작업을 실행하려고 시도합니다. sema가 성공적으로 감소한 경우 true를 반환하고, 이미 0이어서 대기하지 않고 감소할 수 없는 경우 false를 반환합니다. 이 함수를 타이트 루프에서 호출하면 CPU 시간이 낭비되므로 sema_down()을 사용하거나 다른 접근 방식을 찾아야 합니다.
        ```C
        void sema_up (struct semaphore *sema);
        ```
        - sema에 대해 'up' 또는 'V' 작업을 실행하여 값을 증가시킵니다. sema에 대기 중인 스레드가 있으면 그 중 하나를 깨웁니다. 대부분의 syncronization primitives와 달리 sema_up()은 외부 인터럽트 핸들러 내부에서 호출될 수 있다.<br><br>
    - 세마포어는 내부적으로 인터럽트 비활성화, 스레드 차단 및 차단 해제(thread_block() 및 thread_unblock())로 구성됩니다. 각 세마포어는 lib/kernel/list.c의 링크드 리스트를 사용하여 대기 스레드 리스트을 유지 관리합니다.<br><br>
4. Locks
    - lock은 초기 값이 1인 세마포와 같습니다. 'up'에 해당하는 lock을 'release(해제)'라고 하며, 'down' 작업을 'acquire(획득)'라고 합니다.<br><br>
    - 세마포어와 비교하여, lock은 한 가지 추가적인 제한이 있다 : lock을 획득한 스레드, 즉 lock의 'owner'만이 lock을 해제할 수 있다. 이 제한이 문제라면 lock 대신 세마포어를 사용해야 한다는 좋은 신호다.<br><br>
    - 핀토스의 lock은 '재귀적'이 아닙니다. 즉, 현재 lock을 보유하고 있는 스레드가 해당 lock을 획득하려고 시도하는 것은 오류입니다. lock 유형 및 기능은 include/threads/synch.h에 선언됩니다.
        ```C
        struct lock;
        ```
        - lock 구조체를 나타냅니다.
        ```C
        void lock_init (struct lock *lock);
        ```
        - lock을 새 lock으로 초기화합니다. lock은 처음에 스레드에 의해 소유되지 않습니다.
        ```C
        void lock_acquire (struct lock *lock);
        ```
        - 현재 스레드에 대한 lock을 획득합니다. 필요한 경우 현재 소유자가 해제할 때까지 먼저 기다립니다.
        ```C
        bool lock_try_acquire (struct lock *lock);
        ```
        - 대기하지 않고 현재 스레드에서 사용할 수 있는 lock을 획득하려고 합니다. 성공하면 true를 반환하고, lock이 이미 소유된 경우 false를 반환합니다. 이 함수를 엄격한 루프에서 호출하는 것은 CPU 시간을 낭비하기 때문에 좋지 않은 생각이므로 대신 lock_acquire()를 사용하시길 바랍니다.
        ```C
        void lock_release (struct lock *lock);
        ```
        - 현재 스레드가 소유해야 하는 lock을 해제합니다.
        ```C
        bool lock_held_by_current_thread (const struct lock *lock):
        ```
        - 실행 중인 스레드가 lock을 소유하면 true를 반환하고, 그렇지 않으면 false를 반환합니다. 임의 스레드가 lock을 소유하고 있는지 여부를 테스트하는 기능은 없습니다. 호출자가 lock에 대해 작업하기 전에 응답이 변경될 수 있기 때문입니다.<br><br>
6. Monitors
    - 모니터는 세마포어 또는 lock보다 더 높은 수준의 동기화 형태입니다. 모니터는 동기화되고 있는 데이터와 monitor lock이라고 불리는 lock 및 하나 이상의 조건 변수로 구성됩니다. 보호되는 데이터에 접근하기 전에 스레드가 먼저 monitor lock을 획득합니다. 그런 다음 'in the monitor'라고 말합니다. in the monitor에서, 스레드는 모든 보호된 데이터를 자유롭게 검사하거나 수정할 수 있습니다. 보호된 데이터에 대한 액세스가 완료되면 monitor lock이 해제됩니다.<br><br>
    - 조건 변수를 사용하면 모니터의 코드가 조건이 참이 될 때까지 기다리게 합니다. 각 조건 변수는 추상적인 조건(예: '일부 데이터가 처리를 위해 도착함' 또는 '사용자의 마지막 키 스트로크 이후 10초 이상 경과됨')과 연관되어 있다. 모니터의 코드가 참이 될 때까지 기다려야 할 때, 관련 조건 변수에 "waits"하여 lock을 해제하고 조건이 신호되기를 기다립니다. 반면에, 만약 그것이 이러한 조건들 중 하나가 실현되게 했다면, 그것은 waiter 한 명을 깨우는 조건을 'signals'하거나, 그들 모두를 깨우는 조건을 'broadcasts'합니다.<br><br>
    - 모니터의 이론적 틀은 C.A.R.Hoare에 의해 제시되었다. 그들의 실용적인 사용법은 나중에 Mesa 운영체제에 관한 논문에서 자세히 설명되었다. 조건 변수 유형 및 함수는 include/threads/synch.h에 선언됩니다.
        ```C
        struct condition;
        ```
        - 조건 변수를 구조체를 나타냅니다.
        ```C
        void cond_init (struct condition *cond);
        ```
        - cond을 새로운 조건 변수로 초기화 합니다.
        ```C
        void cond_wait (struct condition *cond, struct lock *lock);
        ```
        - 비정상적으로 lock(the monitor lock)을 해제하고 다른 코드 조각에 의해 cond가 신호를 받을 때까지 기다립니다. cond가 신호를 받은 후 다시 lock을 재획득한 후 돌아간다. 이 함수를 호출하기 전에 lock을 유지해야 합니다. 신호를 보내고 기다림에서 깨어나는 것은 atomic operation이 아닙니다. 따라서, 일반적으로 cond_wait()의 caller는 대기 완료 후 상태를 다시 확인하고 필요한 경우 다시 기다려야 합니다. 예는 다음 섹션을 참조하시길 바랍니다.
        ```C
        void cond_signal (struct condition *cond, struct lock *lock);
        ```
        - cond에서 대기 중인 스레드가 있으면(protected by monitor lock lock), 이 기능은 스레드 중 하나를 깨웁니다. 대기 중인 스레드가 없으면 작업을 수행하지 않고 리턴합니다. 이 함수를 호출하기 전에 lock을 유지해야 합니다.
        ```C
        void cond_broadcast (struct condition *cond, struct lock *lock);
        ```
        - cond에서 대기 중인 모든 스레드을 깨웁니다(protected by monitor lock lock) 이 함수를 호출하기 전에 lock을 유지해야 합니다.<br><br>

7. Optimization Barriers
    - Optimization barrier는 컴파일러가 barrier을 넘어 메모리 상태에 대한 가정을 하지 못하도록 하는 특수한 명령문이다. 컴파일러는 주소가 사용되지 않는 로컬 변수를 제외하고 barrier를 넘어 변수의 읽기 또는 쓰기 순서를 다시 지정하거나 barrier를 넘어 변수 값이 수정되지 않았다고 가정하지 않습니다. 핀토스에서 threads/synch.h는 barrier() macro를 optimization barrier로 정의합니다.<br><br>
    - Optimization barrier을 사용하는 이유 중 하나는 컴파일러의 지식 없이 데이터가 비동기적으로 변경될 수 있다는 것이다. devices/timer.c의 too_many_loops() 함수가 그 예이다. 이 기능은 timer tick이 발생할 때까지 루프에서 busy-waiting하는 것으로 시작됩니다 :
        ```C
        /* Wait for a timer tick. */
            int64_t start = ticks;
            while (ticks == start)
                barrier();
        ```
        - 루프에 optimization barrier이 없다면, 시작과 체크가 동일하게 시작되고 루프 자체가 루프를 변경하지 않기 때문에, 컴파일러는 루프가 결코 종료되지 않는다고 결론 내릴 수 있습니다. 그런 다음 기능을 '최적화'하여 무한 루프로 만들 수 있는데, 이는 분명 바람직하지 않을 것입니다.<br><br>
    - Optimization barrier은 다른 컴파일러 최적화를 방지하기 위해 사용할 수 있습니다. devices/timer.c에서도 busy_wait() 함수를 예로 들 수 있습니다. 이 루프는 다음과 같은 루프를 포함하고 있습니다.
        ```C
        while (loops-- > 0)
            barrier ();
        ```
        - 이 루프의 목표는 루프를 원래 값에서 0으로 카운트하여 busy-wait하는 것입니다. barrier이 없다면, 컴파일러는 루프를 완전히 삭제할 수 있는데, 왜냐하면 그것은 유용한 출력을 생성하지 않고 side effects도 없기 때문입니다. barrier은 루프 본체가 중요한 효과를 가지고 있는 척하도록 컴파일러에게 강요합니다.<br><br>
    - 마지막으로, optimization barrier는 메모리 읽기 또는 쓰기의 순서를 강제하는 데 사용될 수 있습니다. 예를 들어, 타이머가 중단될 때마다 글로벌 변수 timer_put_char의 문자가 콘솔에 프린트되지만 글로벌 bool 변수 timer_do_put이 참인 경우에만 나타나는 'feature'을 추가한다고 가정해 봅시다. 프린트할 x를 설정하는 가장 좋은 방법은 다음과 같은 optimization barrier를 사용하는 것입니다.
        ```C
        timer_put_char = 'x';
        barrier ();
        timer_do_put = true;
        ```
        - barrier이 없다면, 컴파일러는 동일한 순서로 작업을 유지할 이유가 없을 때 자유롭게 다시 정렬할 수 있기 때문에 코드는 버그입니다. 이 경우, 컴파일러는 할당 순서가 중요하다는 것을 알지 못하므로 최적화 프로그램이 순서를 교환할 수 있습니다. 실제로 이렇게 할지는 알 수 없으며, 컴파일러에 다른 최적화 플래그를 전달하거나 다른 버전의 컴파일러를 사용하면 다른 동작이 생성될 가능성이 있다.<br><br>
    - 또 다른 해결책은 할당 주변의 인터럽트를 비활성화하는 것이다. 이렇게 하면 순서가 다시 지정되는 것을 방지할 수 없지만, 인터럽트 핸들러가 할당 사이에 개입하는 것을 방지할 수 있습니다. 또한, 인터럽트를 비활성화하고 다시 활성화하는 데 추가적인 런타임 비용이 든다 :
        ```C
        enum intr_level old_level = intr_disable ();
        timer_put_char = 'x';
        timer_do_put = true;
        intr_set_level (old_level);
        ```
        - 두 번째 해결책은 timer_put_char와 timer_do_put의 선언을 휘발성으로 표시하는 것이다. 이 키워드는 컴파일러에게 변수가 외부에서 관찰 가능하며, 최적화를 위한 위도를 제한한다는 것을 알려준다. 그러나, 휘발성의 의미는 잘 정의되어 있지 않기 때문에 일반적으로 좋은 해결책은 아니다. 기본 핀토스 코드는 휘발성을 전혀 사용하지 않는다.<br><br>
    - 다음코드는 해결책이 아닙니다! 왜냐하면 lock이 인터럽트를 방지하거나 컴파일러가 lock이 있는 지역 내에서 코드를 다시 정렬하는 것을 막지는 않기 때문입니다.
        ```C
        lock_acquire (&timer_lock);        /* INCORRECT CODE */
        timer_put_char = 'x';
        timer_do_put = true;
        lock_release (&timer_lock);
        ```
        - 컴파일러는 외부적으로 정의된 함수의 호출, 즉 다른 소스 파일에서 제한된 형태의 optimization barrier으로 처리한다. 특히, 컴파일러는 외부적으로 정의된 함수가 정적으로 또는 동적으로 할당된 데이터와 주소가 할당된 로컬 변수에 액세스할 수 있다고 가정합니다. 이는 종종 명시적 barrier이 생략될 수 있음을 의미한다. 핀토스가 명백한 barrier을 거의 포함하지 않는 것은 한 가지 이유이다.<br><br>
    - 동일한 원본 파일 또는 원본 파일에 포함된 헤더에 정의된 함수는 optimization barrier으로 신뢰할 수 없습니다. 이는 컴파일러가 최적화를 수행하기 전에 전체 소스 파일을 읽고 구문 분석할 수 있기 때문에 정의 전 함수 호출에도 적용된다.

## 4. Alarm Clock 구현
### 목표 🎯
현재 핀토스에서 구현된 스레드를 잠시 재웠다가 일정 시간이 지나면 깨우는 기능인 Alarm Clock을 Busy-Waiting 방식에서 Sleep-Wakeup 방식으로 재구현 하는 것이다.

### Alarm Clock이란?
Alarm Clock이란 운영체제에서 프로세르를 잠시 재웠다가 일정 시간이 지나면 다시 깨우는 기능이다.

### 현재 핀토스에서 Alarm Clock을 구현한 Busy-Waiting이란?
1. Busy-Waiting이란?
    - OS에서는 원하는 자원을 얻기 위해 기다리는 것이 아니라 권한을 얻을 때까지 확인하는 것을 의미한다.<br><br>
2. Busy-Waiting은 어떤 상황일 때 사용하는 것이 좋은가?
    - 자원의 권한을 얻는 데 많은 시간이 소요되지 않는 경우
    - Context Switching 비용보다 성능적으로 더 우수한 경우<br><br>
3. Busy-wating의 단점은 무엇인가?
    - 권한 획득을 위해 많은 CPU를 낭비하고, 다른 스레드가 실행되는 기회를 줄여 성능 저하를 일으킬 수 있다.
    - Busy-Waiting 방식을 쉽게 비유하면 다음과 같다.
        - 예를 들어, 한 사람이 점심 먹고 1시간 낮잠을 잔다고 가정했을 때 수면 사이클은 다음과 같다.
        - 수면 시작 -> 1분 후 알람 울려서 깸 -> 1분 지났네? -> 다시 수면 시작 -> . . . -> 1분 후 알람 울려서 깸 -> 59분 지났네? -> 다시 수면 시작 -> 1분 후 알람 울려서 깸 -> 1시간 지났네? -> 기상!!!(난데?!... 8시 30분부터 10분 간격으로 9시까지 알람 울리면서 일어나는 것도 너무 피곤한데 저 정도면...🤯)
        - 위와 같은 사이클로 잠을 자면 자는 게 자는 것이 아닐 것이다.
        - 즉, 많은 시스템 자원(CPU 점유, 소모 전력 등)을 낭비하고 있다는 의미이다.<br><br>
4. Busy-Waiting 방식으로 구현된 Alarm Clock을 살펴보자.
    - Busy-Waiting 방식으로 구현된 기존의 코드
        ```C
        /* deivices/timer.c */
        void timer_sleep (int64_t ticks) 
        {
            int64_t start = timer_ticks ();

            ASSERT (intr_get_level () == INTR_ON);
            while (timer_elapsed (start) < ticks)
                thread_yield ();
        }
        ```
        - timer_sleep() 함수는 현재 스레드를 ticks만큼 재우는 함수이다.
        - timer_ticks() 함수는 현재의 ticks를 반환하는 함수로, 이 코드에서는 현재 ticks를 반환하여 start에 저장한다.
        - while문 내부에 진입하여 timer_elapsed() 함수를 호출한다.
            - timer_elapsed() 함수는 특정 시간 이후부터 경과된 ticks를 반환하는 함수로, 이 코드에서는 함수에 현재 ticks가 저장된 start를 전달하여 start부터 현재 ticks까지 경과한 tick을 반환한다.
            - 반환된 start 이후부터 경과된 tick가 ticks보다 작은 경우 thread_yield() 함수를 호출한다.
        - thread_yield() 함수는 현재 스레드를 ready_list의 맨 뒤로 추가하고, READY 상태로 변경해주는 함수이다.
            - 이 코드에서는 매 tick마다 running 상태에서 sleep 명령을 받은 스레드가 ready 상태가 되어 ready_list에 추가되고, ready_list에 있는 스레드는 자신이 일어날 시간이 아닌데도 깨워져 running 상태가 된다.
            - running 상태가 된 스레드는 자신이 일어날 시간이 되었는지 확인하고 아직 일어날 시간이 안 됐다면 다시 ready 상태로 전환하는 과정을 아래 그림과 같이 반복한다.  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FboocgH%2Fbtq21CiyjBi%2FJw84p7KG1kENYzqN3OooaK%2Fimg.png" height="150"></img><br><br>
5. Tick이란?
    - 일정 시간 간격으로 발생하는 시스템의 기본적인 시간 단위이다.
    - 시스템 타이머가 tick을 생성하고 증가시키며, 운영체제는 tick을 사용하여 시스템 상태를 유지하고 다양한 작업을 스케줄링한다.
    - 예를 들어, 시스템 타이머가 100번의 틱을 초당 생성한다면, 운영체제는 1초를 100개의 틱으로 나누어 시스템 상태를 업데이트하고 작업을 스케줄링한다.
    - 이러한 방식으로 시스템이 일관된 방식으로 동작할 수 있도록 해준다.<br><br>
6. Tick을 사용하는 이유는 무엇일까?
    - 틱은 고정된 간격으로 발생하므로 운영체제가 특정 작업을 실행하기 위해 기다리는 시간을 정확히 계산할 수 있다.
        - 운영체제는 틱이 발생하는 시간을 이용하여 정확한 시간을 측정하기 때문이다.
    - 시간을 추적함으로 시스템의 부하를 줄이고 일관성을 유지할 수 있다.
        - 시간 단위를 사용하는 경우, 시스템이 다른 작업을 수행하면서 시간이 흐를 때마다 시간을 업데이트해야 하므로 부하가 커질 수 있다.
        - 틱을 업데이트할 때도 부하가 발생하지만, 하드웨어에서 매우 빠르게 처리될 수 있는 단위이므로 이 부하는 대부분 무시할 수준이다.
    - CPU 사용률을 조절할 수 있다.
        - 틱의 간격을 더 작게 조정하면, 시스템은 더 자주 인터럽트를 처리하여 작업을 스케줄링할 수 있게 된다.
        - 우선순위가 높은 작업이 더 빠르게 실행될 수 있도록 하여 시스템의 반응성을 향상하는 데 도움이 된다.

### Busy-Waiting의 문제점을 보완할 수 있는 Sleep-Wakeup이란?
1. Sleep-Wakeup이란?
    - 권한을 얻기 위해 기다리는 시간을 wait queue에 실행 중인 스레드 정보를 담고 다른 스레드에게 CPU를 양보하는 것을 의미합니다.
    - 커널은 권한 이벤트가 발생하면 wait queue에 담긴 스레드를 깨워 CPU를 부여합니다.  
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fc15mtH%2Fbtq2XaUPmBr%2FBz8EgkGS0AamHjUj9iFj5k%2Fimg.png" height="150"></img>
    - Sleep-Wakeup 방식을 쉽게 비유하면 다음과 같다.
        - 예를 들어, 한 사람이 점심 먹고 1시간 낮잠을 잔다고 가정했을 때 수면 사이클은 다음과 같다.
        - 수면 시작 -> 1시간 후 알람 울려서 깸 -> 1시간 지났네? -> 기상!!!
        - 보통 잠을 자는 방식이다.😴
        - 즉, 스레드가 대기 상태에 들어가 있는 동안 CPU 사이클을 사용하지 않기 때문에, CPU 자원을 절약할 수 있다.<br><br>
2. Sleep-Wakeup은 어떤 상황일 때 사용하는 것이 좋은가?
    - 기다리는 시간을 예측할 수 없는 상황인 경우<br><br>
3. Sleep-Wakeup의 단점은 무엇인가?
    - wait queue에 넣는 비용과 Context Switching 비용이 든다.<br><br>

### Alarm Clock을 Sleep-wakeup 방식으로 구현하기 위해 기본적으로 추가해줘야 할 것은 무엇인가?
1. Sleep_list 구조체 & sleep_list에 있는 스레드의 wakeup_tick 최소값을 저장하는 변수 선언 및 초기화
    ```C
    /* threads/thread.c */
    static struct list sleep_list; // 재워야 할 스레드가 추가될 sleep_list 구조체 선언
    static int64_t next_tick_to_awake; // sleep_list에 있는 스레드의 wakeup_tick 최소값을 저장하는 변수 선언
    ...
    void thread_init (void) {
    ...
        list_init (&sleep_list); // 재워야 할 스레드가 저장될 sleep_list 구조체 초기화
        int64_t next_tick_to_awake = INT64_MAX; // sleep_list에 있는 스레드의 wakeup_tick 최소값을 저장하는 변수를 정수 최대값으로 초기화
    ...
    }
    ```
    - 재워야 하거나 자는 스레드를 관리하기 위해 sleep_list 구조체를 선언하고 초기화한다.
    - 자는 스레드 중 가장 먼저 일어나야 할 스레드의 tick을 저장하기 위해 next_tick_to_awake 변수를 선언하고 정수 최대값으로 초기화한다.<br><br>
2. wakeup_tick 변수 선언 및 초기화
    ```C
    /* include/threads/thread.h */
    struct thread {
        int64_t wakeup_tick; // 깨워야 할 스레드 tick 변수 선언
    }
    ```
    - Busy-Wating 방식으로 하지 않기 위해 스레드마다 언제 깨어나야 할지에 대한 정보를 각각 가지고 있어야 하므로, 깨워야 할 스레드의 tick을 저장할 변수를 선언한다.<br><br>
3. Sleep-Wakeup 방식으로 Alarm Clock을 구현하는 데 필요한 네 가지 함수 선언
    ```C
    /* include/threads/thread.h */
    void update_next_tick_to_awake(int64_t ticks); // 가장 빨리 깨워야 할 스레드의 tick을 갱신하는 함수 선언
    int64_t get_next_tick_to_awake(void); // 가장 빨리 깨워야 할 스레드의 tick을 반환하는 함수 선언
    void thread_sleep(int64_t ticks); // 현재 스레드를 ticks까지 재우는 함수 선언
    void thread_wakeup(int64_t ticks); // 자고 있는 스레드 중에서 ticks가 지난 스레드를 모두 깨우는 함수 선언
    ```
    - 가장 먼저 일어나야 할 스레드의 tick 정보를 계속해서 갱신해 주기 위해 update_next_tick_to_awake() 함수를 선언한다.
    - 가장 먼저 일어나야 할 스레드의 tick을 얻기 위해 get_next_tick_to_awake() 함수를 선언한다.
    - 스레드를 실제로 재우는 함수인 thread_sleep() 함수를 선언한다.
    - 스레드를 실제로 깨우는 함수인 thread_wakeup() 함수를 선언한다.<br><br>
4. 스레드를 재우는 함수 로직 변경
    ```C
    /* devices/timer.c */
    void timer_sleep (int64_t ticks) {
        int64_t start = timer_ticks (); // 현재의 ticks를 start에 저장

        ASSERT (intr_get_level () == INTR_ON);
            if(timer_elapsed(start) < ticks) // start 이후부터 경과된 tick가 ticks보다 작은 경우
                thread_sleep(start + ticks); // 현재 스레드를 깨워야 할 시간(start + ticks)까지 재우는 thread_sleep() 함수 호출
    }
    ```
    - timer_sleep() 함수에서 스레드가 비효율적으로 동작하는 과정을 수행하는 while문 부분을 지우고, 스레드를 실제로 재우는 함수인 thread_sleep() 함수를 호출하도록 변경한다.<br><br>
5. 스레드를 깨우는 함수 로직 변경
    ```C
    /* devices/timer.c */
    static void timer_interrupt (struct intr_frame *args UNUSED) {
        ticks++;
        thread_tick ();

        if(get_next_tick_to_awake() <= ticks) { // 스레드의 tick이 현재의 ticks보다 작거나 같은 경우(=깨워야 할 스레드가 존재)
            thread_wakeup(ticks); // 깨워야 할 스레드를 모두 깨워주는 thread_wakeup() 함수 호출
        }
    }
    ```
    - 매 tick마다 타이머 인터럽트가 걸리는데, 그때 timer_interrupt() 함수에서 매 tick마다 get_next_tick_to_awake() 함수를 통해 현재 깨워야 할 스레드가 있는지 확인하고, 깨워야 할 스레드가 있으면 thread_awake(ticks) 함수를 호출하여 스레드를 깨울 수 있도록 변경한다.<br><br>
- Alarm Clock을 Sleep-Wakeup 방식으로 구현하기 위한 모든 준비를 끝냈다. 이제 Sleep-Wakeup 방식으로 Alarm Clock을 구현하기 위한 네 가지 핵심 함수를 어떻게 구하는지 알아보자.👀

### 가장 빨리 깨워야 할 스레드의 tick을 갱신하는 update_next_tick_to_awake() 함수 구현
```C
/* threads/thread.c */
void update_next_tick_to_awake(int64_t ticks) {
    // 현재 sleep_list에 있는 스레드 중에서 가장 빨리 깨워야 할 스레드의 tick과 새로 sleep_list에 들어온 스레드의 tick을 비교하여 더 작은 tick으로 갱신
	next_tick_to_awake = (next_tick_to_awake > ticks) ? ticks : next_tick_to_awake;
}
```
- 깨워야 할 스레드의 tick을 찾고자 매번 접근하는 번거로움을 없애기 위해 sleep_list에 스레드가 들어오거나 나갈 때마다 tick을 비교하여 더 작은 tick(=깨워야 할 스레드의 tick)으로 갱신한다.

### 가장 빨리 깨워야 할 스레드의 tick을 반환하는 get_next_tick_to_awake() 함수 구현
```C
/* threads/thread.c */
int64_t get_next_tick_to_awake(void) {
	return next_tick_to_awake; // 가장 빨리 깨워야 할 스레드의 tick 반환
}
```
- timer_interrupt() 함수에서 매 tick마다 깨워야 할 스레드의 tick과 현재 ticks와 비교해서 깨워야 할 스레드가 있는지 확인한다.
- 이때, get_next_tick_to_awake 함수를 호출하여 깨워야 할 스레드의 tick을 반환한다.

### 현재 스레드를 ticks까지 재우는 thread_sleep() 함수 구현
```C
/* threads/thread.c */
void thread_sleep(int64_t ticks) {
	struct thread *curr = thread_current(); // 현재 스레드

	if(curr != idle_thread) { // 현재 스레드가 idle 스레드가 아닌 경우(=재워야할 스레드)
		enum intr_level old_level;
		old_level = intr_disable (); // 인터럽트 비활성화
		
		update_next_tick_to_awake(curr->wakeup_tick = ticks); // 제일 빨리 깨워야 할 스레드의 tick 갱신
		list_push_back(&sleep_list, &curr->elem); // sleep_list에 현재 스레드 추가
		thread_block(); // 현재 스레드를 BLOCKED 상태로 변경 및 schedule() 호출

		intr_set_level(old_level); // 인터럽트 활성화
	}
}
```
- 재워야 할 스레드를 sleep_list에 추가하고, BLOCKED 상태로 변경한다.
- 이때, 인터럽트의 방해를 무시하고, 함수 내부를 온전하게 실행할 수 있도록 intr_disable() 함수를 통해 인터럽트를 비활성화한다.
    - 함수 내부가 다 실행되고 나면, intr_set_level() 함수를 통해 다시 인터럽트를 활성화해 인터럽트를 받아들일 수 있도록 한다.
- 스레드를 재울 때, 현재 스레드가 idle 스레드가 아닐 때만 재운다.
    - idle 스레드는 운영체제가 초기화되고 ready_list가 생성되는데, 이때 ready_list에 첫 번째로 추가되는 스레드이다. 즉, 아무 일도 안 하는 스레드이다.
    - idle 스레드가 필요한 이유는 CPU가 실행 상태를 유지하기 위해 실행할 스레드 하나가 필요하기 때문이다.
    - CPU가 진행할 작업이 없을 때 꺼졌다가 진행할 작업이 생겨 다시 켜질 때 소모되는 전력보다 무의미한 일이라도 돌고 있는 게 더 적은 전력을 소모한다는 의미이다.
- 재워야 할 스레드는 ready_list에 없고 running 상태이므로, ready_list에서 빼주는 것이 아니라 바로 sleep_list에 추가하고 상태를 BLOCKED로 변경한다.
- sleep_list에 스레드 하나를 추가했기 때문에 update_next_tick_to_awake() 함수를 통해 가장 빨리 깨워야 할 스레드의 tick을 갱신한다.

### 자고 있는 스레드 중에서 ticks가 지난 스레드를 모두 깨우는 thread_wakeup() 함수 구현
```C
/* threads/thread.c */
void thread_wakeup(int64_t ticks) {
	next_tick_to_awake = INT64_MAX; // sleep_list가 비어 있을 경우 wakeup_tick 초기화

	struct list_elem *curr_elem = list_begin(&sleep_list); // sleep_list의 첫 번째 인자를 curr_elem에 저장

	enum intr_level old_level;
	old_level = intr_disable (); // 인터럽트 비활성화

	while (curr_elem != list_end(&sleep_list)) { // curr_elem가 sleep_list의 마지막 인자일 때까지 sleep_list를 순회
		struct thread *curr_thread = list_entry (curr_elem, struct thread, elem); // list_elem가 가리키는 스레드를 curr_thread에 저장

		if (curr_thread->wakeup_tick <= ticks) { // 현재 스레드의 tick이 현재 ticks보다 작거나 같은 경우(=깨워야 할 스레드)
			curr_elem = list_remove(&curr_thread->elem); // sleep_list에서 현재 스레드의 인자를 삭제하고, 다음 인자를 가리킴
			thread_unblock(curr_thread); // 현재 스레드를 ready_list에 추가하고, 상태를 READY로 변경
		}
		else { // 현재 스레드의 tick이 현재 ticks보다 큰 경우(=계속 재워야할 스레드)
			update_next_tick_to_awake(curr_thread->wakeup_tick); // 다음에 깨워야 할 스레드의 tick을 현재 스레드의 tick으로 갱신
			curr_elem = list_next(curr_elem); // curr_elem가 가리키는 sleep_list의 인자의 다음 인자를 가리킴
		}
	}

	intr_set_level(old_level); // 인터럽트 활성화
}
```
- sleep_list를 순회하면서 현재 ticks보다 작거나 같은 wakeup_tick을 가진 스레드를 sleep_list에서 빼주고, ready_list에 추가 및 상태를 READY로 변경한다.
- 스레드를 재울 때와 마찬가지로 인터럽트의 방해를 무시하고, 함수 내부를 온전하게 실행할 수 있도록 intr_disable() 함수를 통해 인터럽트를 비활성화한다.
    - 함수 내부가 다 실행되고 나면, intr_set_level() 함수를 통해 다시 인터럽트를 활성화해 인터럽트를 받아들일 수 있도록 한다.
- sleep_list를 순회하면서 깨워야 할 스레드를 찾기 위해 list_begin() 함수를 통해 sleep_list의 첫 번째 인자를 받는다.
    - list_entry() 함수를 통해 정확하게 sleep_list의 첫 번째 인자가 가리키는 스레드를 찾는다.
- 스레드를 깨울 때, 현재 스레드의 tick이 현재 ticks보다 작거나 같은 경우에만 깨운다.
    - 즉, 해당 스레드는 깨워야 할 시간이 되었거나 지난 스레드이기 때문이다.
- 깨워야 할 스레드는 list_remove() 함수를 통해 sleep_list에서 빼주고, thread_unblock() 함수를 통해 ready_list에 추가 및 상태를 READY로 변경한다.
- 만약, 현재 스레드의 tick이 현재 ticks보다 큰 경우 해당 스레드를 깨우면 안 된다.
    - 깨워야 할 시간이 아직 안 되었기 때문이다.
    - 이때, update_next_tick_to_awake() 함수를 통해 다음에 깨워야 할 스레드의 tick을 현재 스레드의 tick으로 갱신한다.
        - 이렇게 해주지 않으면, 현재 스레드의 tick보다 작은 tick을 가진 스레드만 깨워주게 되기 때문이다.
    - 다음 스레드를 확인하기 위해 list_next() 함수를 통해 sleep_list에서 현재 스레드의 다음 인자를 가리킨다.
- sleep_list를 순회할 때, sleep_list가 비어 있으면 가장 빨리 깨워야 할 스레드의 tick을 다시 정수 최대값으로 초기화한다.

### Alarm Clock 구현 트러블 슈팅
1. thread_wakeup() 함수에서 sleep_list를 순회하면서 깨워야 할 스레드를 찾는 방법
    - sleep_list를 순회하면서 깨워야 할 스레드를 찾아야 하는데, 이 스레드를 어떻게 구별해서 찾아낼 것인가에 대한 방법이 정확하게 떠오르지 않았다.
    - 처음 시도한 방법은 sleep list에 있는 스레드를 탐색하기 위해 cur_idx 변수를 선언 및 0을 초기화하여, while 문으로 sleep list를 탐색하는 것이었다.
    - 이 방법은 배열에 접근하는 방식이므로 연결리스트에서는 인덱스로 정확하게 깨워야 할 스레드를 찾는 게 힘들었다.
    - 그래서, 먼저 sleep_list를 순회하면서 깨워야 할 스레드를 찾기 위해 list_begin() 함수를 통해 sleep_list의 찻 번째 인자를 받아왔다.
    - 다음으로는 list_entry() 함수를 통해 정확하게 sleep_list의 첫 번째 인자가 가리키는 스레드를 찾아 sleep_list를 순회하면서 깨워야 할 스레드를 찾는 방법을 이용했다.<br><br>
2. 스레드를 재울 때, 상태를 BLOCKED로 변경하는 과정에서 발생한 오류
    - ready_list에 있는 스레드를 재우기 위해 sleep_list로 넣을 때 스레드 동작 상태를 running에서 BLOCKED로 변경하는 작업을 두 번 수행하여 오류가 발생했다.
    - 한 번 해주는 것으로 코드를 변경하여 오류를 해결했다.<br><br>
3. 깨워야 할 스레드를 sleep_list에서 탐색할 때, sleep_list가 비어 있을 경우를 고려하지 않고 구현하여 발생한 오류
    - sleep_list를 순회할 때 가리키는 sleep_list의 인자가 마지막 인자가 되면, 반복문을 빠져나오도록 조건을 변경해 줬다.
    - 또한, 가장 빨리 깨워야 할 스레드의 tick을 다시 정수 최대값으로 초기화시켜 줬다.<br><br>
4. 재워야 할 스레드를 sleep_list로 옮기는 동작 과정에서 발생한 오류
    - 재워야 할 스레드를 sleep_list로 옮길 때, ready_list에서 해당 스레드를 빼준 다음 sleep_list에 넣어주는 동작으로 인해 오류가 발생했다.
    - 재워야 할 스레드는 ready_list에 없고 running 상태이므로, ready_list에서 빼주는 것이 아니라 바로 sleep_list에 추가하고 상태를 BLOCKED로 변경시켜 줘야한다.

### 결과
1. Busy-Waiting 결과
    ```
    Execution of 'alarm-multiple' complete.
    Timer: 613 ticks
    Thread: 0 idle ticks, 613 kernel ticks, 0 user ticks
    Console: 2995 characters output
    Keyboard: 0 keys pressed
    Powering off...
    ```
2. Sleep-Wakeup 결과
    ```
    Execution of 'alarm-multiple' complete.
    Timer: 615 ticks
    Thread: 550 idle ticks, 66 kernel ticks, 0 user ticks
    Console: 2996 characters output
    Keyboard: 0 keys pressed
    Powering off...
    ```

## 5. Priority Scheduling 구현
### 목표 🎯
현재 핀토스에서 스레드를 실행시키는 스케줄러를 우선순위 상관없이 스케줄링 해주는 FIFO 스케줄링(=라운드 로빈 스케줄링) 방식에서 우선순위 스케줄링 방식으로 재구현 하는 것이다.

### Scheduler란?
운영체제는 CPU와 같은 컴퓨터 자원들을 적절히 프로세스마다 배분함으로써 효율적으로 많은 프로세스들을 동시에 실행시킬 수 있다. 이런 역할을 수행하는 프로세스를 스케줄러라고 한다.

### Round-Robin Scheduling란?
1. Round-Robin Scheduling이란?
    - 선점형 스케줄링의 하나이다.
    - 프로세스들 사이에 우선순위를 두지 않고, 시간단위 순서대로 CPU를 할당하는 방식이다.
    - 컴퓨터 자원을 사용할 수 있는 기회를 프로세스들에게 공정하게 부여할 수 있다.
    - 각 프로세스에 일정 시간을 할당하고, 일정 시간이 지나면 다음 프로세스에게 기회를 주고, 또 그 다음 프로세스에게 기회를 주는 방식으로 동작한다.
    - 수행이 끝난 프로세스는 Queue 끝으로 밀려나기 때문에 기다리는 시간 + 실행 시간은 길어질 수밖에 없다는 단점이 있다.

### 스케줄러를 우선순위 방식으로 어떻게 재구현 해야 할까?
1. Ready_list에 스레드를 삽입할 때 우선순위가 높은 스레드가 앞부분에 위치하도록 정렬해야 한다.
    - wait_list를 synchronization primitives(semaphore, condition variable)을 이용하여 정렬해야 한다.
    - 선점 기능을 구현해야 한다.
        - 선점 기능 구현 포인트 : 스레드가 ready_list에 추가되는 경우를 고려하여 구현해야 한다.<br><br>

2. 우리가 구현해야 할 두 가지 포인트
    - Ready_list를 검사하여 실행할 스레드를 선택할 경우
        - 우선순위가 높은 스레드를 선택해야 한다.
    - lock을 기다리는 스레드가 있을 경우
        - lock을 사용할 수 있을 때, 운영체제는 우선순위가 가장 높은 스레드를 선택해야 한다.<br><br>

3. 구현 시, 고려해야 할 세 가지 포인트
    - ready_list에서 실행시킬 스레드를 선택할 때, 우선순위가 가장 높은 스레드를 선택한다.
    - 선점
        - ready_list에 새로운 스레드를 추가할 때, 실행 중인 스레드와 우선순위를 비교한다.
        - 새로 추가된 스레드가 실행 중인 스레드보다 우선순위가 높다면, 새로 추가된 스레드가 실행중인 스레드를 선점힌다. 
    - lock(semaphore, condition variable)
        - lock이 사용 가능해지거나 세마포어와 조건 변수가 사용 가능해지면, 운영체제는 우선순위가 가장 높은 스레드를 선택한다.<br><br>

4. 핀토스에서의 우선순위
    - 핀토스에서의 우선순위 범위는 PRI_MIN(=0)부터 PRI_MAX(=63)까지 가지며, 숫자가 클수록 우선순위가 높다.
        - 기본값은 PRI_DEFAULT(=31)이다.
    - 핀토스 운영체제는 두 가지 기능을 제공하며, 생성된 thread의 우선순위는 다음 함수를 통해 변경이 가능하다.
        - void thread_set_priority(int new_priority)
            - 스레드의 우선순위를 지정한 값으로 설정하는 함수 -> 현재 스레드의 우선순위를 new_priority로 변경한다.
        - int thread_get_priority(void)
            - 현재 스레드의 우선순위를 반환하는 함수

### ready 리스트에 있는 스레드와 현재 스레드의 우선순위를 비교하는 cmp_priority() 함수 선언 및 구현
1. cmp_priority() 함수 선언
    ```C
    /* include/threads/thread.h */
    bool cmp_priority (const struct list_elem *a_, const struct list_elem *b_, void *aux UNUSED);
    ```
2. cmp_priority() 함수 구현
    ```C
    /* threads/thread.c */
    bool cmp_priority (const struct list_elem *a, const struct list_elem *b, void *aux UNUSED) {
        // 첫 번째 스레드의 우선순위가 높으면 1을 반환, 두 번째 스레드의 우선순위가 높으면 0을 반환
	    return list_entry(a, struct thread, elem)->priority > list_entry(b, struct thread, elem)->priority;
    }
    ```
    - 첫 번째 스레드의 우선순위가 높으면 1을 반환하고, 두 번째 스레드의 우선순위가 높으면 0을 반환한다.

### 스레드가 unblock될 때 우선순위가 정렬된 상태로 ready 리스트에 스레드를 추가될 수 있도록 thread_unblock() 함수 수정
```C
/* threads/thread.c */
/* 스레드를 ready_list에 추가하고, 상태를 READY로 변경하는 함수 */
void thread_unblock (struct thread *t) {
	enum intr_level old_level;

	ASSERT (is_thread (t));

	old_level = intr_disable (); // 인터럽트 비활성화
	ASSERT (t->status == THREAD_BLOCKED);
	// list_insert_ordered() 함수를 호출하여 ready_list의 스레드와 현재 스레드의 우선순위를 비교하는 cmp_priority() 함수를 통해 리스트의 적절한 위치에 현재 스레드를 추가
	list_insert_ordered (&ready_list, &t->elem, cmp_priority, NULL);
	t->status = THREAD_READY; // 현재 스레드의 상태를 READY로 변경
	intr_set_level (old_level); // 인터럽트 활성화
}
```
- thread_unblock() 함수 내부에서 list_push_back() 함수를 list_insert_ordered() 함수로 변경한다.
- list_insert_ordered() 함수를 호출하여 ready_list의 스레드와 현재 스레드의 우선순위를 비교하는 cmp_priority() 함수를 통해 리스트의 적절한 위치에 현재 스레드를 추가한다.

### 현재 수행중인 스레드가 사용중인 CPU를 양보하고 ready 리스트에 스레드를 추가할 때 우선순위가 정렬된 상태로 추가될 수 있도록 thread_yield() 함수 수정
```C
/* threads/thread.c */
/* 현재 수행중인 스레드가 사용중인 CPU를 양보하는 함수 */
void thread_yield (void) {
	struct thread *curr = thread_current (); // 현재 스레드를 curr 변수에 저장
	enum intr_level old_level;

	ASSERT (!intr_context ());

	old_level = intr_disable (); // 인터럽트 비활성화
	if (curr != idle_thread) { // 현재 스레드가 idle 스레드가 아닌 경우
		// list_insert_ordered() 함수를 호출하여 ready_list의 스레드와 현재 스레드의 우선순위를 비교하는 cmp_priority() 함수를 통해 리스트의 적절한 위치에 현재 스레드를 추가
		list_insert_ordered (&ready_list, &curr->elem, cmp_priority, NULL);
	}
	do_schedule (THREAD_READY); // 현재 스레드의 상태를 READY로 변경
	intr_set_level (old_level); // 인터럽트 활성화
}
```
- thread_unblock() 함수와 마찬가지로 thread_yield() 함수 내부에서 list_push_back() 함수를 list_insert_ordered() 함수로 변경한다.
- 현재 수행중인 스레드가 CPU를 양보하고, ready 리스트에 추가될 때 ist_insert_ordered() 함수를 호출하여 ready_list의 스레드와 현재 스레드의 우선순위를 비교하는 cmp_priority() 함수를 통해 리스트의 적절한 위치에 현재 스레드를 추가한다.

### ready_list에서 우선순위가 가장 높은 스레드와 현제 스레드의 우선순위를 비교하여 현재 스레드의 우선순위가 더 낮으면 CPU를 양보하는 test_max_priority() 함수 선언 및 구현
1. cmp_priority() 함수 선언
    ```C
    /* include/threads/thread.h */
    void test_max_priority (void);
    ```
2. cmp_priority() 함수 구현
    ```C
    /* threads/thread.c */
    bool cmp_priority (const struct list_elem *a, const struct list_elem *b, void *aux UNUSED) {
	// 첫 번째 스레드의 우선순위가 높으면 1을 반환, 두 번째 스레드의 우선순위가 높으면 0을 반환
	return list_entry(a, struct thread, elem)->priority > list_entry(b, struct thread, elem)->priority;
    }
    ```
    - 첫 번째 스레드의 우선순위가 높으면 1을 반환하고, 두 번째 스레드의 우선순위가 높으면 0을 반환한다.

### 새로 추가된 스레드가 실행 중인 스레드보다 우선순위가 높은 경우 CPU를 선점 할 수 있도록 thread_create() 함수 수정
```C
/* threads/thread.c */
tid_t thread_create (const char *name, int priority, thread_func *function, void *aux) {
	struct thread *t;
	tid_t tid;

	ASSERT (function != NULL);

	/* Allocate thread. */
	t = palloc_get_page (PAL_ZERO);
	if (t == NULL)
		return TID_ERROR;

	/* Initialize thread. */
	init_thread (t, name, priority);
	tid = t->tid = allocate_tid ();

	/* Call the kernel_thread if it scheduled.
	 * Note) rdi is 1st argument, and rsi is 2nd argument. */
	t->tf.rip = (uintptr_t) kernel_thread;
	t->tf.R.rdi = (uint64_t) function;
	t->tf.R.rsi = (uint64_t) aux;
	t->tf.ds = SEL_KDSEG;
	t->tf.es = SEL_KDSEG;
	t->tf.ss = SEL_KDSEG;
	t->tf.cs = SEL_KCSEG;
	t->tf.eflags = FLAG_IF;

	/* Add to run queue. */
	thread_unblock (t);
	test_max_priority (); // 현재 스레드의 우선순위와 ready_list에서 가장 높은 우선순위를 가진 스레드의 우선순위와 비교하는 test_max_priority() 함수 호출

	return tid;
}
```
- 스레드가 새로 생성되는 thread_create() 함수에도 스레드가 새로 생성되어 ready 리스트에 추가될 때 우선순위를 기준으로 추가될 수 있도록 test_max_priority() 함수를 추가한다.

### 현재 스레드의 우선순위와 ready 리스트에서 가장 높은 우선순위를 가진 스레드의 우선순위와 비교하여 스케줄링하도록 thread_set_priority() 함수 수정
```C
/* threads/thread.c */
void thread_set_priority (int new_priority) {
	thread_current ()->init_priority = new_priority; // 현재 스레드의 우선순위를 new_priority 값으로 설정
	test_max_priority (); // 현재 스레드의 우선순위와 ready_list에서 가장 높은 우선순위를 가진 스레드의 우선순위와 비교하는 test_max_priority() 함수 호출
}
```
- 현재 실행중인 스레드의 우선순위가 재 조정되는 순간에 ready 리스트의 첫 번째 스레드가 CPU를 점유 중인 스레드 보다 우선순위가 높은 상황이 발생할 수 있으므로, 우선순위를 비교할 수 있도록 test_max_priority() 함수를 추가한다.

### 결과
1. Priority Scheduling 구현 전 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    FAIL tests/threads/alarm-priority
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    FAIL tests/threads/priority-change
    FAIL tests/threads/priority-donate-one
    FAIL tests/threads/priority-donate-multiple
    FAIL tests/threads/priority-donate-multiple2
    FAIL tests/threads/priority-donate-nest
    FAIL tests/threads/priority-donate-sema
    FAIL tests/threads/priority-donate-lower
    FAIL tests/threads/priority-fifo
    FAIL tests/threads/priority-preempt
    FAIL tests/threads/priority-sema
    FAIL tests/threads/priority-condvar
    FAIL tests/threads/priority-donate-chain
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    20 of 27 tests failed.
    ```
2. Priority Scheduling 구현 후 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    pass tests/threads/alarm-priority(PASS)
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    pass tests/threads/priority-change(PASS)
    FAIL tests/threads/priority-donate-one
    FAIL tests/threads/priority-donate-multiple
    FAIL tests/threads/priority-donate-multiple2
    FAIL tests/threads/priority-donate-nest
    FAIL tests/threads/priority-donate-sema
    FAIL tests/threads/priority-donate-lower
    pass tests/threads/priority-fifo(PASS)
    pass tests/threads/priority-preempt(PASS)
    FAIL tests/threads/priority-sema
    FAIL tests/threads/priority-condvar
    FAIL tests/threads/priority-donate-chain
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    16 of 27 tests failed.
    ```

## 6. Priority Scheduling - Synchronization primitives 구현

### 목표 🎯
- 현재 핀토스는 세마포어를 대기하고 있는 스레드들의 리스트인 waiters가 FIFO로 구현되어 있다.

- 우리는 여러 스레드가 lock, 세마포어, 조건변수을 얻기 위해 기다릴 경우 우선순위가 가장 높은 스레드가 CPU를 점유 하도록 구현해야 한다.
    - lock, 세마포어, 조건변수가 사용 가능해지면, 스레드의 우선 순위에 따라 대기 중인 스레드를 깨웁니다.

- 핀토스에서 FIFO 방식과 우선순위 방식으로 lock/unlock하는 과정
    - FIFO
        - 스레드가 우선순위를 무시하고 waiters 리스트에 삽입되는 순서대로 lock을 획득한다.
    - 우선순위
        - 스레드가 세마포어를 요청할 때, waiters 리스트를 우선순위로 정렬하여 우선순위에 따라 lock을 획득한다.
        - 우리는 sema_down() 함수에서 waiters 리스트를 우선순위로 정렬하도록 수정해야 한다.

### Synchronization primitives 함수 설명
- 세마포어 함수 설명
    - void sema_init(struct semaphore *sema, unsigned value) : 세마포어를 주어진 값으로 초기화
    - void sema_down(struct semaphore *sema) : 세마포어를 요청하고 획득했을 때 값을 1 낮춤(수정필요)
    - void sema_up(struct semaphore *sema) : 세마포어를 반환하고 값을 1 높임(수정필요)

- lock 함수 설명
    - void lock_init (struct lock *lock) : lock 자료구조를 초기화
    - void lock_acquire (struct lock *lock) : lock을 요청
    - void lock_release (struct lock *lock) : ock을 반환

- 조건변수 함수 설명
    - void cond_init(struct condition *cond) : 조건변수 자료구조를 초기화
    - void cond_wait(struct condition *cond, struct lock *lock) : 프로세스가 블록 상태로 전환되고, 조건변수를 통해 signal이 오는지 기다림
    - void cond_signal(struct condition *cond, struct lock *lock UNUSED) : 조건변수에서 기다리는 가장높은 우선순위의 스레드에 signal 전송
    - void cond_broadcast(struct condition *cond, struct lock *lock) : 조건변수에서 기다리는 모든 스레드에 signal 전송

### 구현
- 수정해야 할 두 가지 함수
    - 스레드를 우선순위를 기준으로 waiters 리스트에 추가하도록 수정한다.
        - void sema_down(struct semaphore *sema)
            - 세마포어를 얻고 waiters 리스트 삽입 시, 우선순위대로 삽입되도록 수정한다.
        - void cond_wait(struct condition *cond, struct lock *lock)
            - 조건변수의 waiters 리스트에 우선순위 순서로 삽입되도록 수정한다.
    - waiters 리스트를 우선순위를 기준으로 정렬한다.
        - waiters 리스트에서 스레드의 우선순위가 변경되는 경우를 고려해야 한다.
        - void sema_up(struct semaphore *sema)
            - waiters 리스트에 있는 스레드의 우선순위가 변경 되었을 경우를 고려하여 waiters 리스트를 정렬(list_sort)하도록 수정한다.
            - 세마포어 해제 후 priority preemption 기능을 추가한다. -> 기존에 구현해놨던 test_max_priority() 함수 사용 가능
        - void cond_signal(struct condition *cond, struct lock *lock UNUSED)
            - 조건변수의 waiters 리스트를 우선순위로 재 정렬하도록 수정한다.
            - 대기 중에 우선순위가 변경되었을 가능성이 있기 때문이다.

- 구현해야 할 함수
    - bool cmp_sem_priority(const struct list_elem *a, const struct list_elem *b, void *aux UNUSED)
        - 첫 번째 인자로 주어진 세마포어를 위해 대기 중인 가장 높은 우선순위의 스레드와 두 번째 인자로 주어진 세마포어를 위해 대기 중인 가장 높은 우선순위의 스레드와 비교하는 함수를 구현한다.
        - semaphore_elem으로부터 각 semaphore_elem의 쓰레드 디스크립터를 획득한다.
        - 첫 번째 인자의 우선순위가 두 번째 인자의 우선순위보다 높으면 1을 반환 낮으면 0을 반환한다.

## 1. PintOS Priority Scheduling(Synchronization primitives) 구현 트러블 슈팅
1. cmp_sem_priority() 함수 구현 트러블 슈팅
    - cmp_sem_priority() 함수 소스코드
        ```C
        /* semaphore_elem가 나타내는 세마포어의 waiters 리스트의 맨 앞 스레드끼리 우선순위를 비교하는 함수 */
        bool cmp_sem_priority (const struct list_elem *a, const struct list_elem *b, void *aux UNUSED) {
            struct semaphore_elem *sa = list_entry(a, struct semaphore_elem, elem);
            struct semaphore_elem *sb = list_entry(b, struct semaphore_elem, elem);

            struct list *wa = &(sa->semaphore.waiters);
            struct list *wb = &(sb->semaphore.waiters);

            // 세마포어의 waters 리스트는 이미 내림차순으로 정렬되어 있으므로, 각 세마포어의 waiters 리스트의 맨 앞의 elem가 가장 우선순위가 높은 스레드가 됨
            // 사실 각 세마포어에는 스레드가 하나밖에 없어서 굳이 맨 앞의 elem를 찾을 필요 없이 그냥 하나 찾아도 가능
            struct thread *ta = list_entry(list_begin (wa), struct thread, elem);
            struct thread *tb = list_entry(list_begin (wb), struct thread, elem);

            return ta->priority > tb->priority; // 첫 번째 스레드의 우선순위가 두 번째 스레드의 우선순위보다 높으면 1을 반환 낮으면 0을 반환
        }
        ```
        - 이 함수는 그냥 보자마자 어떻게 구현해야 할지 감이 전혀 오지 않아 구현하는 데 가장 어려웠던 함수이다.
        - 한양대학교 핀토스 PDF 자료를 참고하여 기본 구조체 선언 정도만 구현할 수 있었다.
        - 하지만, semaphore, semaphore_elem, condition variables 세 자료구조가 꼬여있어 이해하기 어려웠고, condition 변수 내에서 어떤 방식으로 스레드가 대기하는지 정확한 동작 과정을 알 수 없어 더 이상 구현을 진행하지 못했다.
        - 결국, 새벽 2시쯤 강의실에 다시 나와서 김민석님, 김용현님의 설명을 듣고 함수를 구현할 수 있었다.
        - 더 큰 문제는 다음이다...<br><br>
2. cond_wait()와 cond_signal() 함수 구현 트러블 슈팅
    - cond_wait() 함수 소스코드
        ```C
        void cond_wait (struct condition *cond, struct lock *lock) {
            struct semaphore_elem waiter;

            ASSERT (cond != NULL);
            ASSERT (lock != NULL);
            ASSERT (!intr_context ());
            ASSERT (lock_held_by_current_thread (lock));

            sema_init (&waiter.semaphore, 0);
            list_push_back (&cond->waiters, &waiter.elem);
            //list_insert_ordered (&cond->waiters, &waiter.elem, cmp_sem_priority, NULL);
            lock_release (lock);
            sema_down (&waiter.semaphore);
            lock_acquire (lock);
        }
        ```
        - 원래대로라면 list_push_back() 함수를 주석 처리하고, list_insert_ordered() 함수로 대체해야 한다.
        - 하지만, list_push_back() 함수를 그대로 사용해도 괜찮으며, 코드를 확인해 보자.
        - 우선 semaphore_elem의 waiters의 세마포어 하나의 생성하면서 값을 0으로 초기화해 준다.
        - 이때, 이 세마포어는 스레드를 아직 할당받지 않았으므로 우선순위도 가지고 있지 않은 elem이다.
        - 그래서, list_insert_ordered() 함수를 사용해서 스레드의 우선순위를 비교하는 것은 쓸모없는 동작이며, 여기서 정렬해 줄 필요가 없다.
        - list_push_back() 함수를 그대로 사용하여 cond_waiters 리스트 맨 뒤에 추가시켜 주면 된다.
        - 마지막으로, sema_down() 함수를 이용해서 공유자원 사용을 요청한다.
        - 이때, 세마포어가 우선순위를 가진 스레드가 된다.
        - cond_signal() 함수 소스코드
        ```C
        void cond_signal (struct condition *cond, struct lock *lock UNUSED) {
            ASSERT (cond != NULL);
            ASSERT (lock != NULL);
            ASSERT (!intr_context ());
            ASSERT (lock_held_by_current_thread (lock));

            if (!list_empty (&cond->waiters)) {
                // list_sort(&cond->waiters, cmp_sem_priority, NULL); // 대기 중에 우선순위가 변경되었을 가능성이 있으므로 조건변수 waiters 리스트 재 정렬
                struct list_elem * max_elem = list_min (&cond->waiters, cmp_sem_priority, NULL);
                list_remove (max_elem);
                // sema_up (&list_entry (list_pop_front (&cond->waiters), struct semaphore_elem, elem)->semaphore);
                sema_up (&list_entry (max_elem, struct semaphore_elem, elem)->semaphore);
            }
        }
        ```
        - 정렬은 cond_signal() 함수에서 sema_up을 하기 전에 수행한다.
        - list_sort() 함수를 사용하는 것 보다, list_max() 함수를 이용하여 우선순위 제일 높은 값을 찾는 것이 더 좋다.
        - list_sort()는 시간복잡도가 O(NlogN)이고, list_max() 함수는 O(N)이기 때문이다.
        - sema_up() 함수에서의 list_sort() 함수도 동일하게 코드를 수정해야 한다.
        - list_max() 함수 소스코드
        ```C
        struct list_elem * list_max (struct list *list, list_less_func *less, void *aux) {
            struct list_elem *max = list_begin (list);
            if (max != list_end (list)) {
                struct list_elem *e;

                for (e = list_next (max); e != list_end (list); e = list_next (e))
                    if (less (max, e, aux))
                        max = e;
            }
            return max;
        }
        ```
        - 우선순위 제일 높은 값을 찾을 때 중요한 부분은 list_max() 함수가 아닌, list_min() 함수를 사용해야 한다는 것이다.
        - less 조건(a < b가 참인 경우)을 이용하므로 list_max() 함수를 사용하면 최소값, list_min()을 이용하면 최대값을 찾을 수 있기 때문이다.

### 결과
1. Synchronization primitives 구현 전 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    pass tests/threads/alarm-priority
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    pass tests/threads/priority-change
    FAIL tests/threads/priority-donate-one
    FAIL tests/threads/priority-donate-multiple
    FAIL tests/threads/priority-donate-multiple2
    FAIL tests/threads/priority-donate-nest
    FAIL tests/threads/priority-donate-sema
    FAIL tests/threads/priority-donate-lower
    pass tests/threads/priority-fifo
    pass tests/threads/priority-preempt
    FAIL tests/threads/priority-sema
    FAIL tests/threads/priority-condvar
    FAIL tests/threads/priority-donate-chain
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    16 of 27 tests failed.
    ```
2. Synchronization primitives 구현 후 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    pass tests/threads/alarm-priority
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    pass tests/threads/priority-change
    FAIL tests/threads/priority-donate-one
    FAIL tests/threads/priority-donate-multiple
    FAIL tests/threads/priority-donate-multiple2
    FAIL tests/threads/priority-donate-nest
    FAIL tests/threads/priority-donate-sema
    FAIL tests/threads/priority-donate-lower
    pass tests/threads/priority-fifo
    pass tests/threads/priority-preempt
    pass tests/threads/priority-sema(PASS)
    pass tests/threads/priority-condvar(PASS)
    FAIL tests/threads/priority-donate-chain
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    14 of 27 tests failed.
    ```

## 6. Priority Scheduling - Priority Invension 구현
### 목표 🎯
- 현재 핀토스는 세마포어를 대기하고 있는 스레드들의 리스트인 waiters가 FIFO로 구현되어 있다.

### 결과
1. Priority Invension 구현 전 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    pass tests/threads/alarm-priority
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    pass tests/threads/priority-change
    FAIL tests/threads/priority-donate-one
    FAIL tests/threads/priority-donate-multiple
    FAIL tests/threads/priority-donate-multiple2
    FAIL tests/threads/priority-donate-nest
    FAIL tests/threads/priority-donate-sema
    FAIL tests/threads/priority-donate-lower
    pass tests/threads/priority-fifo
    pass tests/threads/priority-preempt
    pass tests/threads/priority-sema
    pass tests/threads/priority-condvar
    FAIL tests/threads/priority-donate-chain
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    14 of 27 tests failed.
    ```
2. Priority Invension 구현 후 결과
    ```
    pass tests/threads/alarm-single
    pass tests/threads/alarm-multiple
    pass tests/threads/alarm-simultaneous
    pass tests/threads/alarm-priority
    pass tests/threads/alarm-zero
    pass tests/threads/alarm-negative
    pass tests/threads/priority-change
    pass tests/threads/priority-donate-one(PASS)
    pass tests/threads/priority-donate-multiple(PASS)
    pass tests/threads/priority-donate-multiple2(PASS)
    pass tests/threads/priority-donate-nest(PASS)
    pass tests/threads/priority-donate-sema(PASS)
    pass tests/threads/priority-donate-lower(PASS)
    pass tests/threads/priority-fifo
    pass tests/threads/priority-preempt
    pass tests/threads/priority-sema
    pass tests/threads/priority-condvar
    pass tests/threads/priority-donate-chain(PASS)
    FAIL tests/threads/mlfqs/mlfqs-load-1
    FAIL tests/threads/mlfqs/mlfqs-load-60
    FAIL tests/threads/mlfqs/mlfqs-load-avg
    FAIL tests/threads/mlfqs/mlfqs-recent-1
    pass tests/threads/mlfqs/mlfqs-fair-2
    pass tests/threads/mlfqs/mlfqs-fair-20
    FAIL tests/threads/mlfqs/mlfqs-nice-2
    FAIL tests/threads/mlfqs/mlfqs-nice-10
    FAIL tests/threads/mlfqs/mlfqs-block
    7 of 27 tests failed.
    ```

다음 내용에 대해서 시간날때 정리해보시기 바랍니다.
쓰레드 상태 (무엇이 있는지, 어떤 함수 또는 인터럽트등이 불려지면 어떤 상태로 전환되는지)
스케줄링이 무엇인지? (1의 함수들 호출과 스케줄링 관계 설명)
컨택스트 스위칭이란? + PCB
동기화 수단 (무엇이 있는지, 각각을 비교) - semaphore, lock, monitor (mutex)
프로세스와 쓰레드의 차이점
atomic이란?
스케줄링 알고리즘 (fifo, rr, ...)
프로세스는 무엇을 가상화하고 있나요? (토요일 권영진교수님 특강에서 아주 쉽게 설명해주실것 같네요)
이번주 과제 구현을 통해서, 위의 내용을 거의 대부분 구현(?)했습니다.
과제는 해당 개념을 익히기 위한 수단이었습니다.
현업에서 프로세스/쓰레드 API를 자주 씁니다.
하지만 운영체제 내부를 이해하고 쓰는 분은 많지 않습니다.
면접관님이 운영체제에 대해서 이런 범위에서 질문을 하실텐데요.
개념적인 내용에 대해서 잘 대답하고
추가로 “그것들의 내부 구현은 이렇게 되어있습니다” 라고 설명한다면
기본기가 충실하면서, 경쟁력 있는 신입으로 보이지 않을까요?

https://poalim.tistory.com/34
https://e-juhee.tistory.com/entry/Pintos-KAIST-Project-1-Priority-Scheduling