# WEEK07 DAY2 TIL
- 오늘의 학습 목록
```
1. 네트워크 개론 특강 2부 강의 영상 시청 및 학습
2. 백준 알고리즘 13300번 방 배정, 10807번 개수 세기, 3273번 두 수의 합 문제 풀이
3. 컴퓨터 시스템 11장 네트워크 프로그래밍 학습
```

## 1. 네트워크 개론 특강 2부 학습 내용
- Ethernet, UDP, TCP, IP
    - OSI 7계층의 각 계층을 L을 붙여서 표현한다.
        - Application : L7
        - Presentation : L6
        - Session : L5
        - Transport : L4
        - Network : L3
        - Data Link : L2
        - Pysical : L1
        - L7(L5, 6, 7 통합), L4(L3, 4 통합), L2(L1, 2 통합)   
        <br/>
    - Switch
        - Switch란?
            - 일반적인 switch : 전환하는 것이다.
            - 네트워크에서의 switch : "이쪽으로 저쪽으로 가라" 트래픽의 방향을 전환하는 것이다.
                - 어디로 보낼지 판단하기 위해서는 "판든 근거"가 있어야 한다.
                    - 네트워크 스위치에서의 판단근거는 "해당 계층의 헤더"가 된다.
                    - 그리고, 그 계층의 숫자를 붙여서 "L숫자 스위치"라고 부른다.
            - Switch는 기능을 의미하며 꼭 물리적인 장치를 뜻하지는 않는다.
                - Cloud에서는 대부분 소프트웨어로 이 기능을 제공한다.
        - 연습문제
            - Ethernet frame의 목적지 정보에 따라 출력 포트를 선택해서 트래픽을 전달하는 장비가 있다. 이 장비는 넓게 봐서 뭐라고 부르면 좋을까? L2 switch
            - IP Packet 의 목적지 정보에 따라 출력 포트를 선택하는 장비가 있다. 이 장비는 같은 목적지라도 해당 패킷의 출처(=송신자) 가 사내인지 아니면 사외인지에 따라 다시 출력 포트를 조정한다. 이 장비는 넓게 봐서 어떻게 부르면 좋을까? L3 switch
                - 방화벽 장비 혹은 침입 탐지 시스템(IDS, Intrusion Detection System) 등이 여기에 해당한다. 그들이 크게는 L3 스위치 기능을 가지고 있는 것이라는 것에 주목해야 한다.
            - HTTP 요청은 이를 처리하는 동등한 역할의 서버를 여러 대 운용한다 (pooling 이라고 하고, HTTP server pool 이 있다라고 한다) 한 서버만 과부하가 걸리는 것을 막기 위해서 이 앞단에 pool 내 서버들에 round-robin 방식으로 분산해주는 장비가 있다. 이는 크게 봐서 뭐라고 부를 수 있을까? L7 switch
                - Load balancer(LB)가 여기 해당한다. LB역시 스위치이다. 그리고 밸런싱 기준 layer를 명시해서 여기서는 L7 LB이다.   
                <br/>
    - 각 프로토콜 1개 데이터 단위의 이름
        - Protocol Data Unit(PDU) : 각 프로토콜의 1개 데이터를 지칭힌다.
        ```
        - Frame -> Ethernet 데이터 단위
        - Packet or Datagram -> IP 데이터 단위
        - Segement -> TCP 데이터 단위
        - User Datagram -> UDP 데이터 단위
        - Message or Data -> HTTP 데이터 단위
        ```   
        <br/>
    - 프로토콜이 할 수 있는 것과 할 수 없는 것은 무엇에 의해 결정될까?
        - 헤더에 의해 결정된다.   
        <br/>
    - Data Link Layer : Ethernet Frame
        - 헤더 구조를 봤을 때, Ethernet은 frame 오류를 걸러낼 수 있을까?
            - CRC에 의해 오류를 걸러낼 수 있다.
        - 헤더 구조를 봤을 때, 최대 보낼 수 있는 길이는 얼마일까? 그 길이를 넘으면 어떻게 될까?
            - 최대 길이는 정해져 있고(frame은 변하지 않는 틀), 일반적으로 최대 데이터는 1500 바이트이다.
            - 최대 길이를 넘으면 버려지므로 상위 계층에서 쪼개서 보내야 한다.   
            <br/>
    - Network Layer : IP Packet(Datagram)  
        <img src="https://download.huawei.com/mdl/image/download?uuid=6e4a16b3531945e1bab99da6b34b74e6"></img>
        - IP Packet의 최대 길이는 얼마인가?
            - Total length가 16bits이므로 header를 포함해서 64KB이다.
        - 64KB 보다 큰 데이터를 보내려면 어떻게 해야 될까?
            - 소켓이 상위 계층에서 64KB 단위로 쪼개서 보내야 한다.
        - Ethernet에서 data의 최대가 1500B라고 했는데 어떻게 64KB까지 담을 수 있을까?
            - Fragmentation : IP Packet 하나가 여러 Ethernet frame으로 쪼개지기 때문에 가능하다.
        - IP는 에러를 검출할 수 있을까?
            - header checksum으로 header 영역의 에러만 제한적으로 검출할 수 있다.
            - IP는 왜 header의 오류만 체크할까?
                - 효율성 때문이다.
                - 왜냐하면, Hop-by-Hop방식인 IP는 hop을 지날 때마다(= gateway 를 거칠 때마다) header필드 중 TTL을 변경하기 때문이다.
                - 즉, checksum은 무조건 변경됨에 따라 전체를 매번 다시 계산하는 것이 부담된다.
        - IP는 전송을 보장할까?
            - header에 그런 field가 없으므로 보장하지 않는다.
        - 64KB까지(헤더 포함) 한 번에 보내고 한 번에 받을 수 있다.
            - 100 bytes를 보내면 받는 쪽에서 정확히 100 bytes를 읽을 수 있다.
        - 그러나 하위 data link layer의 payload 길이 제한을 넘는 경우 여러 개의 frame으로 쪼개져서 전송된다.
        - 받는 쪽에서는 쪼개진 data link layer의 payload를 재결합해서 IP packet으로 복원한다.
        - 이 때 하나라도 누락이 되면 IP packet은 전체 누락된다.
            - 누락 이유 : Congestion, bit error
        - IP는 최선을 다해 전송을 시도할 뿐 전송을 보장하지는 않는다.
            - 이를 best-effort 라고 한다.   
        <br/>
    - Transport Layer
        - Transport Layer : UDP(User Datagram Protocol) Datagram  
            <img src="https://evan-moon.github.io/static/f9ccf1094e8f9f057d72c004d4f0e0e8/73dae/udp-header.png"></img>
            - UDP 헤더를 볼 때 IP 위에 어떤 부가 기능을 제공하는가?
                - 포트를 구분하는 것과 checksum 외에 IP 속성을 그대로 갖게 된다.
            - IP와 마찬가지로 datagram이라는 이름을 사용한다.
                - IP와 구분하기 위해서 User를 붙여서 User Datagram 이라고 부른다.
            - Port를 제공하고 checksum 계산하는 것 외에 특별한 기능이 없다.
                - 이는 L3 layer(network layer)인 IP의 기능을 L4(transport layer)에서 그대로 가져다 쓰게 하기 위해서 만들어진 프로토콜이기 때문이다.
            - IP의 속성을 갖기 때문에 IP 헤더 포함 64KB 이내에서는 보낸 그대로 수신 측에서 받게 된다.
                - 100 bytes를 보내면 받는 쪽에서 read할 때 100 bytes를 읽는다.
            - 독자적으로 쪼개고 재결합하는 기능을 제공하지 않는다.(IP 에 의존함)
            - IP와 마찬가지로 best-effort이다.
        - Transport Layer : TCP(Transmission Control Protocol) Segment  
            <img src="https://evan-moon.github.io/static/ac69210c44cd473bcb737665d590b124/c7bb6/tcp-header.png"></img>
            - 특징 1 : 데이터가 연속적인 것 같은 환상을 지원한다. -> stream
            - 특징 2 : 받았는지 안 받았는지 체크한다.
            - 특징 3 : 수신자의 여력을 체크한다.
            - TCP는 연속되는 Data Stream이다.
                - TCP의 sequence 번호 (그리고 ACK 번호)는 전송되는 데이터를 byte 단위로 트래킹한다.
                - IP packet이 헤더 포함 64KB 까지이므로 TCP는 전송하는 데이터 양에 따라 IP packet을 여러 개로 쪼개서 전송한다.
                - 수신 측에서는 여러 IP에 걸쳐 있는 TCP segment를 sequence 번호를 이용해 결합해서 복원한다.
                - 이 때문에 TCP는 하나씩 끊겨서 전송되는 IP 위에서 마치 data 가 연속으로 흐르는 것 같은(stream) 환경을 지원할 수 있다.
            - TCP는 Connection 기반이다.
                - 앞의 설명에서 보듯 TCP는 특정 상대방을 가정하고 전송한 data의 byte 단위인 sequence 번호, 어디까지 수신했는지 byte 단위인 ack 번호를 관리한다.
                - 이렇게 통신 양 끝단(end-point)의 state를 관리하기 때문에, TCP는 stateful하고 connection 기반이 된다.
            - TCP는 전송 제어를 해준다.
                - TCP의 전송 제어가 신경쓰는 것
                    - 수신자의 여력(버퍼 크기)
                        - TCP header 중 Window Size 필드를 이용한다.
                            -  TCP Window Size
                                - 상대방에게 자신이 얼마나 큰 데이터를 한 번에 받을 수 있는지 advertise 한다.
                                    - receive window size 라고도 한다.
                                - Socket library로는 setsockopt으로 변경이 가능하다.
                                - 그러나 여기서 advertise된 window size 단위로 데이터가 전송되지 않고, 뒤에 설명하는 혼잡 제어 알고리즘에 따른 window 크기와 비교해서 둘 중 작은 사이즈로 데이터를 전송한다.
                    - 중간에 거쳐가는 게이트웨어(라우터)들의 여력(버퍼 크기)
                        - TCP header 중 SEQ/ACK 필드를 이용한다.
            - 혼잡
                - 네트워크 혼잡(Network Congestion)
                    - 네트워크 결로상의 장비나 회선의 과부하로 트래픽을 포기하는 것이다.
                - TCP의 혼잡 제어(Congestion Control)
                    - 수신자는 data 를 받으면 송신자에게 “다음에 보낼 SEQ를 의미하는 ACK”를 전송한다.
                    - 송신자는 한번에 보낼 수 있는 데이터 양만큼 보내고 ACK를 기다린다.
                    - 이 때 ACK를 받을 때마다 이 “한번에 보낼 수 있는 데이터 양”을 증가시킨다.(ACK 가 잘 오면, 1B, 2B, 4B, 8B, 이런 식으로...)
                    - 그러다가 ACK가 누락되거나 순서가 뒤집혀 오면 혼잡이라고 판단한다.
                        - 한번에 보낼 수 있는 데이터 크기를 리셋한다.
                        - 이전에 보낸 데이터를 재전송한다.
                    - 이 “한번에 보낼 수 있는 데이터 크기”라는 것을 congestion window라고 한다.
                - TCP 혼잡 제어의 영향
                    - 처음부터 full speed로 데이터를 전송하지 않는다.
                        - congestion window 를 ACK에 따라 증가시키므로 전송 속도가 점점 증가한다.
                    - Congestion이라고 생각하면 congestion window를 줄이므로 전송 속도가 줄어든다.
                    - 그런데 congestion이 발생하지 않으면 congestion이 발생할 때까지 계속 congestion window를 올려가기 때문에 TCP의 전송 속도는 일정하지 않고 오락가락하게 된다.   
                    <br/>
    - UDP와 TCP의 차이
        - UDP
            - IP와 마찬가지로 best-effort다.
            - 안정성이 희생되더라도 빠른 통신에 적합하다.
            - End-to-end로 관리되는 state가 없으므로 연결 기반이 아니다.
        - TCP
            - 전송 속도를 서서히 올린다.
            - 재전송을 제공한다.
            - 혼잡 제어를 통해 트래픽을 양보한다.
            - 위의 특성들 때문에 전송 속도는 진동한다.
            - 위의 특성들 때문에 end-to-end의 state를 관리하므로 연결 기반이다.
            - 속도 상관없이 안정적인 통신에 적합하다.   
            <br/>
- Client-Server와 Peer-to-Peer
    - Client-Server 모델
        - Client란?
            - 작업을 요청하는 쪽이다.
        - Server?
            - 작업을 처리하는 쪽이다.
        - 서버 쪽은 많은 state를 관리한다.
            - 유저 별 독점적 state : 유저 정보
            - 유저간 공유 state : 텍스트 채팅에서 메시지를 주고 받은 지금까지의 상황 등
        - 서버가 실행되고 있는 동안에만 유효하면 되는 state와 서버가 리부팅 되더라도 유효해야 하는 state가 있다.
        - state 관리 목적으로 서버는 어딘가에 호스팅 될 수 밖에 없다.
        - 따라서 서버를 호스팅 하는 주체는 높은 IDC 비용을 부담하게 된다.
            - 서버 비용, 망 비용 등
        - 서비스가 IDC에서 고정적으로 서비스되기 때문에 클라이언트가 접근해야 되는 IP, Port가 명확하다.   
        <br/>
    - Peer-to-Peer 모델
        - 각각의 참여자(peer)가 동등하게 클라이언트 역할도 하고 서버 역할도 한다.
        - 참여자간 통신이 이루어지므로 서비스 제공자는 IDC 비용을 줄일 수 있다.
        - 서버를 거치는 것보다 참여자간의 직접 통신이 latency가 적을 수도 있다.
            - 가능성일 뿐 반드시 적다고 보장할 수는 없다.
        - 서비스를 위한 state의 저장 방법이 마땅치 않다.
            - 독점적 state, 공유 state 모두...
        - 서비스 참여자가 그때그때 서비스의 일부를 담당하므로 특정 서비스를 위해 누구를 접근해야 되는지 모호하다.
            - 이 때문에 “상대방 찾기(peer discovery)”가 필요해진다.   
            <br/>
    - P2P 구현에서의 도전
        - 통신 가능성 문제
            - NAT 뒤에 존재할 때 통신이 가능하다는 보장이 없다.
        - Service discovery와 peer discovery
            - Client-server 구조에서는 처음에 접속해야 되는 상대가 명확하다.
            - 그러나 P2P에서는 서비스를 받기 위해 어디에 접속해야되는지 알 수 없다.
            - Service discovery : 어디에 가면 서비스를 받을 수 있는지 찾는 것이다.
            - Peer discovery : 내 이웃들이 누가 있는지 찾는 것이다.
        - Churn에 의한 낮은 service stability
            - Churn은 들락날락 거리는 것을 의미한다.
            - Peer가 들락날락 할 때마다 새로 peer discovery를 하고 연결을 복구해야 된다.
            - 이는 심각한 서비스 안정성 저해를 유발한다.   
            <br/>
    - NAT(Network Address Translation)
        - 이름에서 알 수 있듯 네트워크 주소를 변환해주는 것이다.
        - 인터넷 상에서의 주소, 즉 L3주소는 IP이므로 NAT는 IP 주소를 변환하는 것이다.
        - IPv4에는 각 네트워크가 임의로 사용할 수 있는 사설(private) 주소 범위가 정의되어 있다.  
            <img src="https://preview.redd.it/studying-ipv4-private-ip-ranges-explain-this-please-v0-u7adw7d52uw91.png?width=1071&format=png&auto=webp&v=enabled&s=aa79e466cf2e12d949a435e78341f1d4cc995e75"></img>
            - 사설 주소 범위는 각 네트워크 안에서만 유효하다.
            - 즉, 서로 다른 네트워크가 같은 사설 주소를 사용할 수도 있다.
                - 순이네 집의 IP도 192.168.0.1, 철이네 집의 IP도 192.168.0.1
        - 사설 IP는 특정 네트워크 안에서만 유효하므로, 이 IP를 달고 있는 IP packet이 해당 네트워크를 벗어나기 위해서는 공용 IP 또는 진입할 네트워크의 사설 IP 로 변환해줄 필요가 있다.
            - 이를 위한 것이 NAT 장치이다.
                - 즉, IP 주소 영역을 다른 IP 주소 영역으로 바꿔주면 모두 NAT 장비다.
                - 또한 이는 “장치”라고 해서 반드시 하드웨어를 의미하지는 않으며, 소프트웨어 역시 NAT 장치가 될 수 있다.
        - Network A의 주소와 network B의 주소간 1:1 맵핑을 한다.
        - 따라서 NAT 장치가 network B의 IP 주소 pool을 확보하고 있다.
        - 많은 수의 IP가 필요하다는 단점이 있다.
        - 이를 만회하기 위해서 Network Address(=IP) 뿐만 아니라 Port까지 변환 대상으로 하는 NAPT(Network Address Port Translation)이 도입됐다.   
        <br/>
    - NAT 순회(Traversal)
        - NAT 안에서 밖으로 통신을 시작하는 것은 가능하다.
        - NAT 밖에서 안으로 통신을 시작하는 것은 어떻게 하면 될까?
            - 먼저 안에서 밖으로 패킷을 쏜다.
            - 이를 NAT 에 구멍을 뚫는다는 의미로 홀 펀칭(hole punching)이라고 부른다.   
            <br/>
    - 홀 펀칭(Hole Punching)
        - NAT 안에 있는 서버는 NAT 바깥에 있는 홀펀칭용 서버로 패킷을 보낸다.
            - 이로써 NAT에 IP 주소 맵핑을 미리 생성한다.
            - 홀펀칭용 서버는 도착한 패킷으로부터 맵핑된 IP 주소를 알아낼 수 있다.
        - 이제 NAT 외부의 참여자는 홀펀칭용 서버에 저장되어있는 맵핑 정보를 이용해 NAT 안에 있는 서버에 접속을 시도한다.
            - 만일 NAT 상의 맵핑이 계속 유효하다면 통신이 될 것이다.   
            <br/>
    - 홀 펀칭의 문제점
        - NAT 장비에 대한 표준이 없다.
        - 그 때문에 홀펀칭 성공률은 점점 떨어진다.
        - TRUN Server : 이를 만회하기 위해 중간에 패킷을 중계하는 “릴레이” 서버를 두기도 한다.
        - 그러나 이 방법은 릴레이 자체가 또 다른 client-server 모델이 된다.
            - P2P가 되지 못하고 릴레이를 거치는 통신이 된다.
            - 릴레이 서버 운영을 위한 IDC 비용이 발생한다는 문제점이 생긴다.

## 2. 백준 3273번 두 수의 합 문제 풀이
- 반복문을 이용한 풀이
    - python3는 시간초과가 발생하며, pypy3로 하면 통과된다.
    - 소스코드
        ```python
        import sys

        n = int(sys.stdin.readline())
        num_list = sorted(list(map(int, sys.stdin.readline().split())))
        x = int(sys.stdin.readline())
        result = 0

        for i in range(n - 1):
            for j in range(i + 1, n):
                if num_list[i] + num_list[j] == x:
                    result += 1
                if num_list[i] + num_list[j] > x:
                    break

        print(result)
        ```   
        <br/>
- 투 포인터를 이용한 풀이
    - start 값이 end값 보다 클때까지 while문을 반복한다.
    - 이때 num_list에서 start와 end 인덱스 값을 더한 값이 x값과 같다면, 결과값과 start값을 1 증가시켜 준다.
    - 만약 num_list에서 start와 end 인덱스 값을 더한 값이 x값 보다 크다면, end값을 1 감소시켜 준다.
    - 위 두 조건에 만족하지 않으면, num_list에서 start와 end 인덱스 값을 더한 값이 x값 보다 작은 경우이므로 start값만 1 증가시켜 준다.
    - start 값이 end값 보다 크면, 반복문을 빠져나와 결과값을 출력해준다.
    - 소스코드
        ```python
        import sys

        n = int(sys.stdin.readline())
        num_list = sorted(list(map(int, sys.stdin.readline().split())))
        x = int(sys.stdin.readline())

        result = 0
        start = 0
        end = n - 1

        while start < end:
            num_sum = num_list[start] + num_list[end]
            if num_sum == x:
                result += 1
                start += 1
            elif num_sum > x:
                end -= 1
            else:
                start += 1

        print(result)
        ```

## 3. 컴퓨터 시스템 11장 네트워크 프로그래밍 학습 내용
### 11.1 클라이언트-서버 프로그래밍 모델
1. 네트워크 응용 프로그램
    - 클라이언트-서버 모델에 기초
    - 한 개의 서버와 한 개 이상의 클라이언트로 구성   
    <br/>
2. 서버
    - 리소스를 관리
    - 리소스를 조작해서 클라이언트를 위한 일부 서비스를 제공
        - 웹 서버 : 디스크 파일들을 관리하고, 클라이언트를 대신해서 이들을 가져오고 실행
        - FTP 서버 : 클라이언트를 위해 저장하고 읽어오는 디스크 파일들을 관리
        - 이메일 서버 : 클라이언트를 위해 읽고 갱신하는 스풀 파일을 관리   
        <br/>
3. 트랜잭션  
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FRIdXo%2FbtqUo8QX1Nc%2Fq9037xdAkTh142pwvFlia1%2Fimg.png"></img>
    - 트랜잭션 : 클라이언트-서버 모델에서의 근본적인 연산   
    <br/>
    - 트랜잭션의 4단계 구성
        - 1단계 : 클라이언트가 서비스를 필요로 할 때, 한 개의 요청을 서버로 전송
        - 2단계 : 서버는 요청을 받고, 해석하고, 자신의 자원들을 적절한 방법으로 조작
        - 3단계 : 서버는 응답을 클라이언트로 보내고, 다음 요청이 있을 때까지 대기
        - 4단계 : 클라이언트는 응답을 받고 처리

### 11.2 네트워크
1. 호스트(아래 내용에서 호스트가 자주 나와서 함 찾아봤심😒)
    - IP를 가지고 있는 양방향 통신이 가능한 네트워크에 연결된 컴퓨터나 기타 장치
        - 인터넷은 TCP/IP 프로토콜을 이용하여 통신하는데, 통신을 하려고 해도 목적지와 출발지가 없으면 어디로 데이터를 보낼지 받을지 모름
        - IP라는 고유한 주소를 통해 목적지와 출발지를 구할 수 있으며 호스트는 IP 주소를 가지고 있음   
        <br/>
2. 네트워크 호스트의 하드웨어 구성  
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbHOW89%2FbtrfsdR0uGB%2FHRzacch5rDKNKZNpjUkFK1%2Fimg.png"></img>
    - 클라이언트와 서버는 종종 별도의 호스트에서 돌아가며, 컴퓨터 네트워크의 하드웨어 및 소프트웨어 자원을 사용해서 통신 수행   
    <br/>
    - 호스트 입장에서 네트워크 뭘까?
        - 단지 또 다른 입출력 장치
        - 컴퓨터에 데이터가 들어오거나 나가는 지점(소스와 싱크)이 되는 입출력 장치와 같은 것
        - 호스트 컴퓨터 확장 슬록에는 네트워크 어댑터(=랜카드)가 꽂혀있고, 이는 컴퓨터와 네트워크 사이에 물리적인 인터페이스를 제공
        - 네트워크에서 수신한 데이터는 I/O와 메모리 버스를 거쳐 메모리로 대개 DMA 전송으로 복사 <-> 메모리에서 네트워크로도 복사 가능   
        <br/>
3. 네트워크 범위 : LAN, WAN, internet
    - 네트워크는 물리적으로 지리적 근접성(nearness)에 따라 계층구조를 갖는 시스템   
    <br/>
    - 네트워크 분류
        - LAN(Local Area Network)
            - 비교적 가까운 거리에 위치한 장치들을 서로 연결한 네트워크
            - 집, 사무실, 학교 등의 건물과 같이 가까운 지역을 연결하는 네트워크
            - 각자의 컴퓨터를 연결하는 fully connected와 한 곳에 모아 사용하는 star 연결 방식을 사용
            - 근거리 통신이라 덜 복잡하므로 속도가 빠르고 오류가 적음
        - WAN(Wide Area Network)
            - 랜과 랜의 연결된 형태로, ISP가 제공하는 서비스를 사용하여 구축된 네트워크
            - 특정 도시, 국가, 대륙과 같이 매우 넓은 범위를 연결하는 네트워크
            - 어려 노드들이 서로 그물처럼 연결되는 mesh 연결 방식을 사용
            - 원거리 통신이라 LAN에 비해 복잡하므로 속도가 느리고, 여러 물리적 상황과 환경에 영향을 많이 받으므로 오류가 많음
        - 인터넷
            - TCP/IP 프로토콜을 사용하는 세계 최대 규모의 네트워크
            - 네트워크의 한 종류로, 전 세계의 큰 네트워크부터 작은 네트워크까지를 연결하는 거대한 네트워크
            - 인터넷은 여러 형태를 혼합한 형태의 연결 방식을 사용(start + mesh 등의 조합)   
            <br/>
    - ISP(Internet Service Provider)
        - 인터넷에 접속하는 수단을 제공하는 주체
        - 일반 사용자, 기업체, 기간, 단체 등이 인터넷에 접속하여 인터넷을 이용할 수 있도록 돕는 사업자
        - KT, LG U+, SKT와 같은 ISP가 인터넷 서비스를 제공   
        <br/>
    - WAN이 망가지면 어떻게 될까?(궁금해서 찾아봄🧐)
        - 2018년 11월 24일 KT 아현 지사 화재 때 인터넷이 먹통되는 문제 발생
        - ISP인 KT에서 대신 연결해 주었던 케이블들과 장비들이 망가지는 바람에 발생한 문제

## 4. 7주차 2일차를 마치며...
PPT 페이지 수가 많아서 그런지 네트워크 개론 특강을 정리하는데 은근히 시간이 오래 결렸다.
알고리즘 문제도 풀고, 컴퓨터 시스템 11장 네트워크 프로그래밍도 학습했는데 이것저것 하다 보니 머릿속이 정리가 안 된 느낌이지만 그래도 계속 앞으로~!!!🏃🏻
내일은 종일 컴퓨터 시스템 11장 네트워크 프로그램을 학습할 계획이며, 시간적 여유가 있다면 어제 알고리즘 문제를 풀면서 다시 복습하는 느낌으로 투 포인터에 대해 정리할 것이다.