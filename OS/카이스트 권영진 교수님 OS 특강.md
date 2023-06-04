# 카이스트 권영진 교수님 OS 특강
top-down 방식으로 배우는 것이 OS를 배우기 더 좋다고 생각
design부터 요소기술을 이해하는 방식으로 진행


1. bird eye view of OS
user는 커널을 건들 수 없도록 만들어야 한다. -> user와 kernel level 경계를 protection boundary라고 한다

what's going on
2번째 시간이 1번째 시간보다 10배 빠르다 -> 1번은 메모리를 찾아서 돌리지만, 2번은 캐시에서 바로 쓰기 때문이다.
map size를 사용해도 두 번째가 2배 빠르다 -> demand paging 기법을 사용하기 때문이다.
즉, 첫 번째 시간은 메모리를 할당하기 위해 공간을 찾고, 페이지 테이블을 통해 찾는 등의 작업 시간이 있기 때문에 사간이 더 걸린다.
즉, 운영체제의 동작 원리가 이렇게 디자인 되어있기 때문이다.

2. why os is required?
하드웨어가 있다고 했을 떄 어플리게이션에서 하드웨어에 접근하기 위해 어머어마하게 어렵고 시간이 오래 걸린다.
즉, 하드웨어 기능을 어플리케이션에게 잘 짜여진 API를 expose하기 위해 운영체제가 만들어졌다. -> abstractions

3. key roles of os -> 설계 요소 requirement
abstractions
protection & isolation
sharing
이 있고, 이것들에 따라서 필요한 요소들을 하나씩 이해하는 것이 탑다운 방식으로 학습하는 것이다.

4. abstractions
스탠포드 john ousterhout 교수 유튜브 영상 시청
a  phyilosopy of software design
컴퓨터 사이언스에서 소프트웨어를 개발할 때 가장 중요한 것이 abstraction이다 -> 추상화 = layers of abstractions
추상화의 목적은 복잡한 내부 상황을 알지 않고 필요한 기능을 사용할 수 있도록 구현하는 것이다.
즉, 운영체제는 하드웨어를 abstractions해서 사용자에게 제공하는 것이다.
하드웨어 기능을 abstraction하고, 기능별로 problem complexity decomposition 하는 것이 중요하다. 이것이 divide and conquer이다.

추상화를 하기 위해서 디자인 관점에서 설명해보자.
운영체제를 만들기 위해 unit이 필요하고 protect application하기 위해 여러 것들이 필요하다고 느꼈다.
이러이러해서 프로세스를 만들었다.

How to make it easy to use hardware
각각의 기능을 추상화로 만들고, 추상화된 것을 api에 제공하는 것을 시스템 콜

프로세스는 컴퓨터를 추상화한 것이다. -> own view of machine or computer
즉, 프로세스 하나가 자신만이 쓰는 주소공간(메모리), cpu, 파일을 사용한다.
즉, 각각의 기능에 추상화된 기능을 붙여준다.

5. 주소공간 추상화
프로세스에서 사용하고 있는 address space를 물리메모리로 매핑해주겠다는 것이 주소공간을 추상화하는 것이다.
이것을 페이지라고 한다.
어떻게 물리주소로 가상주소를 매핑할까? 세그멘테이션, 페이징, 세그멘티드 페이징 등의 기법이 있다.(각각 공부 필요)
mmu가 세그멘테이션과 페이징 기법을 사용할 수 있고, 이 기법을 사용해서 물리메모리로 접근한다.
int *ptr만들고, 0으로 초기화한 다음 *ptr을 출력하면, 세그멘테이션 폴트 에러 발생 -> 사용자 모드에서 접근불가한 주소에 접근하여 접근 실패했다는 시그널을 보내고 에러를 출력한다.

주소공간을 추상화할 때 페이지 테이블은 dram에 저장
페이징 시스템을 했을 때 하드웨어 룰? mechanism of addr translation
페이징 시스템을 했을 떄 운영체제 룰? policy of addr traslation
변환과정을 mechanism(하드웨어)이라고 하고, 이 과정의 룰을 policy(운영체제)라고 한다.

언제 물리 메모리를 할당할 것인가?
내가 mmap을 통해서 가상주소를 만들고 물리메모리를 따줘도 된다.
하지만, 메모리 낭비가 심해서 정말 필요할 때만 할당할 수 있도록 해주는 demand paging이 생겼다.
즉, 디멘드 페이징은 어플리케이션이 처음 할당되지 않은 물리메모리에 접근할 때 cpu가 페이지 폴트를 보낸다.
zero page!!! 중요 -> zero page를 사용 안하면 protection rule에 위반된다
스레드간의 개념과 프로세스간의 개념의 차이 메모리 해제 시 0으로 바꿔주고 전달하는가? 스레드는 한 프로세스 안에서 스레드 간이 공유하기 때문에 0으로 바꿔줄 필요가 없음(보안 필요없음)

커널이 물리메모리를 관리하는 관점에서 생각했을 때, 물리메로리는 두 타입으로 나뉜다.
1. file-backed(code, data) / 2. anonymous(heap, stack) = 주인이 없기 때문에 0으로 만들어 준다.
두 타입이 데이터 타입을 다르게 쓴다.
map_anonymous 타입으로 해서 커널이 0으로 만들고 전달한다.

20
페이지 폴트 핸들라가 피일 시스템에게 블럭 주소를 알려준다.
주소를 받아와서 이 주소로 내 메모리 영역(dram)에 올려달라고 할때 dma가 발생한다. 이때 이 작업은 cpu가 모르기 때문에 메모리가 인터럽트를 발생하여 cpu에게 메모리가 들어왔다고 알려준다.

인터럽트와 익셉션(페이지 폴트) 두가지 요소가 커널에서 일관적으로 작업을 진행하다가 훅 띄어서 어디에 준다.

design principle, level of indirection(사진 찍은거 참고) -> 지금까지 배운 os 기본적인 동작 과정
가상 os를 진짜 os로 매핑시켜주는 것을 가성 머신 = level of indirection


21
storage abstraction
파일에서 하드웨어로 매핑시켜준다.
주소공간 추상화와 똑같은 관전과 뷰를 통해서 만들어짐

location of data is identified by offset(LSEEK)
let's call it file system

파일을 페이지워 마찬가지로 쪼개는 것을 block

파일의 offset을 받아서 물리 플럭으로 옮기는 기법 indexed allocation

페이지 테이블은 하드웨어가 하고,
Machanism 파트를 소프트웨어가 하면, 속도가 느리기 때문에 해도 괜찮다.

indirect inode pointer 기법 종류
extent tree
b tree
radix tree(page table)
FAT
offset해서 block으로 쪼개주는 기법

internal nodes는 storage에서 저장되었다가 dram(memory)에 올라와야 한다. -> 프로그램이 꺼졌을 때 기억해야되기 때문이다.

when to allocate physical block? 파일을 쓰고 저장할 때 물리적 블럭이 할당된다. = fsync가 불렸을 때
스토리지 디바이스에 접근할때 스토리지 내용을 dram에 캐싱한다. = 페이지 캐시 -> 소프트웨어에서 관리할 수 있도록 구현해야 한다.

file stystem overview
system call interface는 두 개의 layer로 구성
가상 파일 시스템(vfs) -> posix 인터페이스(I/O open, read, write, fseek, close)가 vfs에 있다.
buffer cache

26
버퍼 캐시를 사용했을 때 발생하는 문제점?
데이터가 있을 때 버퍼캐시(dram)에 올린다. 파일 메타데이터와 인덱스도 올라간다.
어느 시점에 데이터가 persist해서 정보가 바뀌면서 storage device로 옮긴다.
이때 바뀐 최신정보를 dram이 가지고 있다.
똑같은 정보가 서로 다른 형태로 저장되어 crush consistency가 발생한다. -> 파일 시스템에서만 발생하는 문제
이 문제를 해결하기 위해 atomicity and durability로 해결한다.

중하수
데이터에 있는 메모리가 스토리지 디바이스에 저장될 떄 atomically(원자성, 모두 다 저장되거나 안돼거나)하게 저장되어야 한다.
아니면 디스크로 저장되어야 한다. -> fsync로 해준다.

중수
트랜잭션 롤백과 로깅을 이용하여 해결할 수도 있지만, dram에서 뜰때 reordered가 되어 같은 문제가 발생한다.
그래서 fsync를 이용해서 durability해준다.
하지만, 파일이 저장되어 있는 파일에 접근할 수 있는 디렉토리 위치가 저장되지 않아서 복구할 수 없다.

고수
디렉토리 위치 저장을 추가해준다.

file system 시멘틱

모든 데이터를 운영체제가 dram(buffer cache) 올려두고 사용하기 때문에 발생하는 문제라서 이걸 해결해줘야 한다.

다시 정리 필요