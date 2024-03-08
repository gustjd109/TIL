# 카이스트 권영진 교수님 OS 특강
## OS는 어떻게 배워야 할까?
- TOP-DOWN OR BOTTOM-UP?
    - OS는 사람이 디자인한 것이므로 암기 과목이 아니다.
    - 어떻게 디자인할 것이고, 그러면 어떠한 기능들이 필요하고, 각 기능들은 어떤 기술, 요소, 조건 등이 필요한지 이해하는 TOP-DOWN 방식으로 학습하는 것이 좋다.

## Bird eye view of OS
- 전체적인 OS 구성  
    <img src="https://velog.velcdn.com/images/torrac9/post/4dab0284-7881-4bbe-b85e-f2a22126d223/image.png"></img>
    - User는 Kernel을 건들 수 없도록 User level이 Protection boundary로 Kernel level과 나뉘어져 있다.
    - Kernel level(OS)은 user가 하드웨어를 읽을 수 있게 해준다.

## What's going on?
- OS의 동작 원리를 이해하자.  
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FK7kxR%2FbtrpBCm9wXz%2FxCYxsL9tfkFkR7B3ZNS8hK%2Fimg.png"></img>
    - 위 코드를 확인해보자.
        - mmap()으로 메모리를 1MB 할당받고, addr로 해당 메모리 주소를 받아온다.
        - memset() 함수로 해당 addr에 넣을 값을 1로 초기화한다.
        - memset() 함수를 돌리는데 걸린 시간을 출력하는 printf을 추가한다.
        - 위와 같은 작업을 하는 코드를 아래에 추가한다.
        - 이때는 메모리에 값을 2로 초기화한다.
        - 함수 내용이 똑같으므로, memset() 하는데 걸리는 시간 역시 똑같을 것이라고 생각한다.<br><br>
    - 위 코드를 실행하면 다음과 같이 나온다.  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbjyTKj%2Fbtrpz1AjwN8%2FadKLCazhdm1VGujLmXvVH1%2Fimg.png"></img>
        - 2번 memset() 함수를 실행했을 때가 1번 memset() 함수를 실행했을 때보다 10배 더 빠르다.
        - 1번은 첫 작업이다보니 DRAM에서 작업을 수행하기 때문에 시간이 더 느리고, 2번은 이전에 작업한 내용이 캐시에 저장되어 있으므로 캐시에서 바로 작업을 수행하기 때문이다.<br><br>
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FnXkFD%2FbtrpwQforzT%2FR4DKR3bg12WOUA9XjaFXrk%2Fimg.png"></img>
    - 위 코드를 확인해보자.
        - 이번에는 MAP_SIZE를 따로 선언해주고, 메모리를 1GB를 할당했다.
        - 나머지 코드는 같으며, 이때 코드를 실행했을 때 memset() 하는데 걸리는 시간은 어떻게 될까?<br><br>
    - 위 코드를 실행하면 다음과 같이 나온다.  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FDysE0%2FbtrpDLKGmmp%2F2Szqld1NfvvvJDWDud3nUk%2Fimg.png"></img>
        - 여전히 2번 memset() 실행 시간이 2배 더 빠른다.
        - Demand Paging 기법을 사용했기 때문이다.
        - 즉, 1번 memset() 실행 시간은 메모리를 할당하기 위해 공간을 찾고, 페이지 테이블을 통해 찾는 등의 작업 시간이 있기 때문에 사간이 더 걸린다.<br><br>
    - 이렇게 같은 동작이라도, OS의 동작 원리로 인해 서로 다른 성능을 보인다.
    - 우리는 이런 OS의 동작 원리를 알아야 한다.

## OS는 왜 필요할까?
- OS가 필요한 이유
    - 하드웨어가 있다고 했을 때 어플리케이션에서 하드웨어에 접근하기 위해서는 엄청난 시간이 걸리고 어렵다.
        - 예를 들어, SSD를 뜯어보면 명령어만 수백만개. 이를 각각 프로그래밍해서 제어할려면 매우 어렵다.
    - 이런 문제를 해결하기 위해 하드웨어 기능을 어플리케이션이 쉽게 이용할 수 있도록 API로 expose한다.
        - 이것이 추상화(Abstractions)이다.

## OS의 주요 역할
- OS의 세 가지 역할
    - 추상화(Abstrations)
        - 하드웨어를 사용하도록 추상화 설계
        - 예를 들어, 시스템 콜이 있다.<br><br>
    - 보호 & 격리(Protection & Isolation)
        - 응용 프로그래머가 하드웨어를 잘못 건드리면 심각한 오류를 발생시킬 수 있다.
        - 따라서, 하드웨어와 운영체제를 보호하기 위해서도 운영체제가 필요하다.
        - 예를 들어, 가상 메모리가 있다.<br><br>
    - 자원 공유(Sharing)
        - 예를 들어, 스케줄링이 있다.<br><br>
    - 세 가지 OS의 역할에 따라 필요한 요소들을 하나씩 이해하는 것이 탑 다운 방식으로 학습하는 것이다.

## CS에서 소프트웨어를 개발할 때 가장 중요한 것은 무엇일까?
- 추상화(Abstractions)
    - 추상화의 목적은 복잡한 내부 상황을 알지 않고도 필요한 기능을 사용할 수 있도록 구현하는 것이다.
    - 즉, 운영체제는 하드웨어를 추상화해서 사용자에게 제공하는 것이다.
    - 하드웨어 기능을 추상화하고, 기능별로 큰 문제를 분해(problem complexity decomposition)하는 것이 중요하다.
        - 이것이 우리가 흔히 아는 분할 정복(divide and conquer)이다.
    - 여기서 우리는 개발자로서 비개발자 즉, 어떤 기능이든 사용자가 복잡하고 어려운 동작없이 사용할 수 있도록 해주는 것이 얼마나 중요한지 알 수 있다.
- 스탠포드대학교 John Ousterhout 교수님의 "a phyilosopy of software design" 유튜브 영상 참고

## 추상화를 하기 위해 OS를 디자인 관점에서 살펴보자.
- 처음 추상화를 하기 위한 OS 디자인
    - 아무도 세부적으로 하드웨어를 직접 처리하는 프로그램을 작성하고 싶어하지 않는다.
        - 쉽게 프로그램을 작성할 수 있어야 한다.
    - 하드웨어 리소스를 활용하려면 OS를 여러 개 실행해야 한다.
        - 실행 관리 단위가 필요하다.
    - 다른 것으로부터 프로그램을 보호해야 한다.
        - 실행 보호 단위가 필요하다.
    - 결론적으로, 하나의 머신에서 여러 프로그램이 실행되는 것처럼 착각을 불러일으키도록 추상화를 하는 것이며, 이것을 프로세스라고 한다.
        - 즉, 컴퓨터를 추상화 한 것이다.

## 어떻게 쉽게 하드웨어를 사용할 수 있도록 할까?
- OS 설계자는 하드웨어 리소스의 각 추상화를 구축하고 이를 프로세스에 바인딩한다.
    - CPU : virtualizing CPU로 추상화
    - Memory : virtual address space로 추상화
    - Storage : file로 추상화
    - 각각의 기능을 추상화로 만들고, 추상화된 것을 api에 제공하는 것을 시스템 콜이라 한다.

## 프로세스 추상화
- 프로세스는 컴퓨터를 추상화한 것이다(Own view of machine or computer).
    - 즉, 프로세스 하나가 자신만이 사용하는 주소 공간(메모리), CPU, 파일을 사용한다.
    - 각각의 기능에 추상화된 기능을 붙여준다.

## 주소 공간 추상화
- 주소 공간 추상화란?
    - 프로세스에서 사용하고 있는 주소 공간을 물리 메모리로 매핑해주겠다는 것이다.
    - 각 물리적 메모리를 작은 덩어리로 나눈 것으로, 이것을 우리는 페이지라고 한다.<br><br>
- 어떻게 주소 공간을 가상 주소에 매핑할까?
    - 세그멘테이션, 페이징, 세그멘티드 페이징 등의 기법을 통해 매핑해준다. -> 따로 학습 필요!!!
    - MMU가 세그멘테이션과 페이징 기법을 사용할 수 있고, 이 기법을 사용해서 물리메모리로 접근한다.
    - 예를 들어, int *ptr만들고, 0으로 초기화한 다음 *ptr을 출력하면 세그멘테이션 폴트 에러가 발생한다. -> 세그멘테이션 폴트 에러 학습 필요!!!
        - 사용자 모드에서 접근 불가한 주소에 접근하여 접근 실패했다는 시그널을 보내고 에러를 출력한다.<br><br>
- 주소 공간 추상화에 대한 세 가지 질문
    - 페이지 테이블은 어디에 저장될까? DRAM
    - 페이징을 위한 OS의 역할은 무엇일까? policy of addr translation
    - 페이징을 위한 하드웨어의 역할은 무엇일까? mechanism of addr translation
    - 즉, 가상 주소를 물리 주소로 변환하는 것은 하드웨어(MMU)가 하고 그 룰을 OS가 정해준다. 
    - 변환을 소프트웨어가 해도 괜찮을까?
        - 가능하지만, 속도가 하드웨어에 비해 엄청 느리다.

## 언제 물리 메모리를 할당하는가?  
<img src="https://velog.velcdn.com/images/torrac9/post/f5bdaf1a-5a8c-4576-8c0b-f480952099a3/image.png"></img>
- 물리 메모리를 할당하는 방법
    - 직접 MMAP을 이용하여 가상 주소를 만들고 물리 메모리를 할당해줘도 된다.
    - 하지만, 메모리 낭비가 심하여 정말 필요할 경우에만 할당할 수 있도록 해주는 Demand Paging 기법이 생겼다.<br><br>
- Demand Paging 과정
    - 애플리케이션은 먼저 할당되지 않은 물리적 메모리에 액세스한다.
    - 어플리케이션이 처음 할당되지 않은 물리메모리에 접근할 때 cpu가 페이지 폴트를 보낸다.
    - 페이지를 가져온다.
    - 페이지를 0으로 초기화시켜 준다.
        - 이것을 우리는 Zero Page라고 하면, zero page를 사용 안하면 protection rule에 위반하는 것이므로 꼭 사용해야 한다.
        - malloc의 buff는 0이 아니라 쓰레기값이 저장되는 데 그 이유는 같은 유닛 내에서 동작하기에 보호가 필요 없기 때문이다.

## 페이지 폴트 핸들링
- 변수 값과 주소는 각각 어디에 저장될까?
    - 변수 값은 stack에 저장된다.
    - 주소는 heap에 저장된다.<br><br>
- 하드디스크에서 값을 가져와서 함수와 변수는 어디에 할당될까?
    - 함수는 text(code)에 할당한다.
    - 변수는 data에 할당한다.<br><br>
- stack이나 heap에 저장된 변수들을 가져오려면 어떻게 해야할까?
    - data나 text(code)는 하드디스크에서 initialize한다.
    - stack이나 heap은 0으로 initialize하여 저장한다.<br><br>
- 커널이 물리 메모리를 관리하는 관점에서 생각했을 때, 물리 메모리는 두 타입으로 나뉜다.
    - file-backed : code, data
    - anonymous : heap, stack

## 페이지 폴트 핸들링 과정
- 페이지 폴트 핸들러가 피일 시스템에게 블럭 주소를 알려준다.
- 주소를 받아와서 이 주소로 내 메모리 영역(DRAM)에 올려달라고 할때 DMA가 발생한다.
- 이때 이 작업은 CPU가 모르기 때문에 메모리가 인터럽트를 발생하여 CPU에게 메모리가 들어왔다고 알려준다.
- 인터럽트와 익셉션(페이지 폴트) 두 가지 요소가 커널에서 일관적으로 작업을 진행하다가 훅 띄어서 어디에 준다.

## 스토리지 추상화
- 메모리와 같은 관점과 뷰 포인터로 설계되었다.
- 데이터의 위치는 오프셋(LSEEK 함수)으로 식별됩니다.
- OS 하위 시스템은 파일을 물리적 저장소에 매핑합니다.
    - 이것을 파일 시스템(File System)이라고 한다.

## 파일에서 스토리지로 매핑하는 방법?
- 인덱스로 파일의 logical block을 받아 storage의 physical block으로 매핑하며, 소프트웨어가 이 작업을 수행한다.
- 파일의 offset을 받아서 physical block으로 옮기는 기법을 indexed allocation라고 한다.
- 페이지 테이블은 하드웨어가 하고, machanism 파트를 소프트웨어가 해도 속도가 느리기 때문에 괜찮다.<br><br>
- indirect inode pointer 기법 종류
    - extent tree
    - b tree
    - radix tree(page table)
    - FAT<br><br>
- 스토리지 추상화에 대한 질문
    - internal nodes는 어디에 저장되는가? storage에서 저장되었다가 DRAM(memory)으로 간다.
        - 프로그램이 꺼졌을 때 메모리가 보존되어야 하기 때문이다.
    - indexing에 하드웨어 도움이 필요한가? 필요 없다.
    - physical block은 언제 할당되는가? 파일을 쓰고 저장할 때 할당된다.(fsync가 불렸을 때)
    - Any performance optimization for slow storage device?
        - 스토리지 디바이스에 접근할때 스토리지 내용을 dram에 캐싱했다가 페이지 캐싱
        - 소프트웨어에서 관리할 수 있도록 구현해야 한다.

## File System
- System Call layer 구성
    - 가상 파일 시스템(VFS) : POSIX 인터페이스(I/O open, read, write, fseek, close) 등이 있다.
    - 버퍼 캐시
- VFS가 왜 필요할까?
    - 복잡한 개별 파일 시스템의 추상화를 하나의 공통된 인터페이스로 가능하다.

## 버퍼 캐시를 사용했을 때 발생하는 문제점은 무엇일까?  
<img src="https://velog.velcdn.com/images/torrac9/post/f2280b85-5f80-45f6-8737-f1397bb42b5d/image.png"></img>
- 버퍼 캐시를 사용하면 왜 문제가 생길까?
- 데이터를 페이지 캐시에 성능 때문에 버퍼 캐시(DRAM)에 올린다. 이때, 파일 메타데이터와 인덱스도 올라간다.
- 어느 시점에 데이터가 persist해서 정보가 바뀌면서 storage device로 올라간다.
- 이때, 바뀐 최신 정보를 DRAM이 가지고 있다.
- 똑같은 정보가 서로 다른 형태로 저장되어 crush consistency가 발생한다.
- 이 문제는 파일 시스템에서만 발생하는 문제러, atomicity와 durability로 해결할 수 있다.<br><br>
- atomicity & durability
    - atomicity : 메모리의 데이터는 저장 장치에 원자적으로 적용되어야 합니다.
        - 데이터가 전부 써지던가 아니면 안써지던지 해야하며, 일부만 써지는 것은 Not Atomically한 것이다.
    - durability : storage에 반드시 persist 하는 것이다.

## Non-atomic update
- 각 스토리지에는 원자 업데이트 단위가 있습니다.
    - 예를 들어, 4 KB in harddisk.
- 원자 업데이트 크기보다 큰 데이터를 쓰는 것이 가능할까?
    - OS는 순서대로 저장하지 않고, 저장소에 쓸 때 데이터를 재정렬할 수 있기 때문에, 불가능하다.

## Crash consistency example
- 스토리지가 1B를 원자적으로 업데이트할 수 있다고 가정하자.
    - single write
        ```
        write(/a/file, “Bar”)
        ```
        - 중간에 crash가 발생하면, B, a, r중 뭐가 먼저 써질지도 모른다.(Fao, For ...)
            - 따라서, 우리는 Foo던 Bar던 하나만 출력하게 해야한다.
    - Rollback logging(WAL)
        ```
        creat(/a/log)
        write(/a/log, "Foo")
        write(/a/file, "Bar")
        unlink(/a/log)
        ```
        - 이렇게 해도 문제가 발생한다.
        - 왜냐하면, Reordered가 되기 때문에 또 Fao나 For 가 나올 수 있다.
    - 위 문제를 해결하기 위해 데이터에 있는 메모리가 스토리지 디바이스에 저장될 때 atomically하게 저장되어야 하거나 디스크로 저장되어야 한다.
        - Rollback logging with ordering
            ```
            creat(/a/log)
            write(/a/log, "Foo")
            fsync(/a/log)
            write(/a/file, "Bar")
            fsync(/a/file)
            unlink(/a/log)
            ```
            - fsync를 이용해서 durability 해준다.
            - vi로 directory 접근하면 어떻게 될까?
                - directory 정보가 나오고 disk로 안넘어간다.
                - 즉, /a/ may not contain /a/log로 file의 존재는 있는데 접근이 안된다.
    - 디렉토리 위치 저장을 추가해줌으로써 위 문제를 모두 해결할 수 있다.
        ```
        creat(/a/log)
        write(/a/log, “Foo”)
        fsync(/a/log)
        fsync(/a/)
        write(/a/file, “Bar”)
        fsync(/a/file)
        unlink(/a/log)
        ```
- 모든 데이터를 운영체제가 dram(buffer cache) 올려두고 사용하기 때문에 발생하는 문제라서 이걸 해결해줘야 한다.