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
- 적절한 synchronization는 이러한 문제에 대한 해결책의 중요한 부분입니다. 모든 synchronization 문제는 interrupts를 off함으로써 쉽게 해결할 수 있습니다. interrupts를 off하면, concurrency이 없어지기 때문에 race condition에 대한 가능성이 없기 때문입니다. 따라서, 모든 synchronization 문제를 이러한 방식으로 해결하는 것이 바람직하지만 그렇지 않습니다. 대신 semaphores, locks 및 condition variables를 사용하여 synchronization 문제를 해결하기 바랍니다. 어떤 상황에서 어떤 synchronization primitives를 사용할지 모르는 경우, 동기화 섹션을 읽거나 threads/synch.c의 주석 부분을 보시기 바랍니다.<br><br>
- 핀토스 프로젝트에서 intterupts를 비활성화함으로써 가장 잘 해결된 유일한 종류의 문제는 커널 스레드와 interrupt handler 간에 공유되는 데이터를 조정하는 것입니다. interrupt handler는 sleep할 수 없기 때문에 lock을 획득할 수 없습니다. 즉, 커널 스레드와 interrupt handler 간에 공유되는 데이터는 interrupt를 해제하여 커널 스레드 내에서 보호되어야 합니다.<br><br>
- 이 프로젝트는 interrupt handler에서 약간의 스레드 상태만 액세스하면 됩니다. Alarm clock의 경우 timer interrupt는 sleep 중인 스레드를 깨워야 합니다. Advanced 스케줄러에서 timer interrupt는 몇 가지 글로벌 변수와 스레드 단위 변수에 액세스해야 합니다. 커널 스레드에서 이러한 변수에 액세스할 때 timer interrupt가 간섭하지 않도록 interrupt를 비활성화해야 합니다.<br><br>
- interrupt를 해제할 때는 가능한 한 코드를 적게 사용하도록 주의하십시오. 그렇지 않으면, timer ticks나 input events와 같은 중요한 항목이 손실될 수 있습니다. 또한 interrupt를 끄면 interrupt handling latency(인터럽트 처리 지연 시간)이 증가하며, 너무 오래 걸리면 시스템이 느려질 수 있습니다. <br><br>
-  synch.c의 Synchronization primitives 자체는 interrupt를 비활성화하여 구현되었습니다. 여기서 interrupt가 비활성화된 상태에서 실행되는 코드의 양을 늘려야 할 수도 있지만, 최소한으로 유지해야 합니다.<br><br>
- 만약 코드의 한 부분이 중단되지 않도록 하려면, interrupt를 비활성화하는 것이 디버깅에 유용합니다. 프로젝트를 제출하기 전에 디버깅 코드를 제거해야 합니다.<br><br>
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

## 3. 결과
### Busy Waiting 결과
```
qemu-system-x86_64: warning: TCG doesn't support requested feature: CPUID.01H:ECX.vmx [bit 5]
Kernel command line: -q run alarm-multiple
0 ~ 9fc00 1
100000 ~ ffe0000 1
Pintos booting with: 
        base_mem: 0x0 ~ 0x9fc00 (Usable: 639 kB)
        ext_mem: 0x100000 ~ 0xffe0000 (Usable: 260,992 kB)
Calibrating timer...  157,081,600 loops/s.
Boot complete.
Executing 'alarm-multiple':
(alarm-multiple) begin
(alarm-multiple) Creating 5 threads to sleep 7 times each.
(alarm-multiple) Thread 0 sleeps 10 ticks each time,
(alarm-multiple) thread 1 sleeps 20 ticks each time, and so on.
(alarm-multiple) If successful, product of iteration count and
(alarm-multiple) sleep duration will appear in nondescending order.
(alarm-multiple) thread 0: duration=10, iteration=1, product=10
(alarm-multiple) thread 0: duration=10, iteration=2, product=20
(alarm-multiple) thread 1: duration=20, iteration=1, product=20
(alarm-multiple) thread 0: duration=10, iteration=3, product=30
(alarm-multiple) thread 2: duration=30, iteration=1, product=30
(alarm-multiple) thread 1: duration=20, iteration=2, product=40
(alarm-multiple) thread 3: duration=40, iteration=1, product=40
(alarm-multiple) thread 0: duration=10, iteration=4, product=40
(alarm-multiple) thread 4: duration=50, iteration=1, product=50
(alarm-multiple) thread 0: duration=10, iteration=5, product=50
(alarm-multiple) thread 1: duration=20, iteration=3, product=60
(alarm-multiple) thread 2: duration=30, iteration=2, product=60
(alarm-multiple) thread 0: duration=10, iteration=6, product=60
(alarm-multiple) thread 0: duration=10, iteration=7, product=70
(alarm-multiple) thread 1: duration=20, iteration=4, product=80
(alarm-multiple) thread 3: duration=40, iteration=2, product=80
(alarm-multiple) thread 2: duration=30, iteration=3, product=90
(alarm-multiple) thread 4: duration=50, iteration=2, product=100
(alarm-multiple) thread 1: duration=20, iteration=5, product=100
(alarm-multiple) thread 1: duration=20, iteration=6, product=120
(alarm-multiple) thread 2: duration=30, iteration=4, product=120
(alarm-multiple) thread 3: duration=40, iteration=3, product=120
(alarm-multiple) thread 1: duration=20, iteration=7, product=140
(alarm-multiple) thread 4: duration=50, iteration=3, product=150
(alarm-multiple) thread 2: duration=30, iteration=5, product=150
(alarm-multiple) thread 3: duration=40, iteration=4, product=160
(alarm-multiple) thread 2: duration=30, iteration=6, product=180
(alarm-multiple) thread 3: duration=40, iteration=5, product=200
(alarm-multiple) thread 4: duration=50, iteration=4, product=200
(alarm-multiple) thread 2: duration=30, iteration=7, product=210
(alarm-multiple) thread 3: duration=40, iteration=6, product=240
(alarm-multiple) thread 4: duration=50, iteration=5, product=250
(alarm-multiple) thread 3: duration=40, iteration=7, product=280
(alarm-multiple) thread 4: duration=50, iteration=6, product=300
(alarm-multiple) thread 4: duration=50, iteration=7, product=350
(alarm-multiple) end
Execution of 'alarm-multiple' complete.
Timer: 613 ticks
Thread: 0 idle ticks, 613 kernel ticks, 0 user ticks
Console: 2995 characters output
Keyboard: 0 keys pressed
Powering off...
```

### Sleep queue 결과
```

```