# WEEK07 DAY4 TIL
- 오늘의 학습 목록
```
1. echo 클라이언트와 서버 학습 및 구현
2. CSAPP 11장 11.6C 문제 풀이
3. 투 포인터 개념 정리
```

## 1. echo 클라이언트와 서버
### 11.4.9 예제 Echo 클라이언트와 서버
1. Echo 클라이언트의 메인 루틴
    - echo 클라이언트 메인 루틴 코드
        ```C
        #include "csapp.h"

        int main(int argc, char **argv)
        {
            int clientfd;
            char*host, *port, buf[MAXLINE];
            rio_t rio;

            if(argc != 3) {
                fprintf(stderr, "usage: %s <host> <port>\n", argv[0]);
                exit(0);
            }
            host = argv[1];
            port = argv[2];

            clientfd = Open_clientfd(host, port);
            Rio_readinitb(&rio, clientfd);

            while(Fgets(buf, MAXLINE, stdin) != NULL) {
                Rio_writen(clientfd, buf, strlen(buf));
                Rio_readlineb(&rio, buf, MAXLINE);
                Fputs(buf, stdout);
            }
            Close(clientfd);
            exit(0);
        }
        ```
    - echo 클라이언트 메인 루프 동작 과정
        - 서버와의 연결을 수립
        - 클라이언트 표준 입력에서 텍스트 줄을 반복해서 읽는 루프에 진입
        - 서버에 텍스트 줄을 전송
        - 서버에서 echo 줄을 읽어서 그 결과를 표준 출력으로 인쇄<br><br>
    - 루프 종료 과정
        - 루프는 fgets가 EOF 표준 입력(사용자가 Ctrl + D를 눌렀거나 파일로 텍스트 줄을 모두 소진했을 경우)을 만나면 종료
        - 루프가 종료한 후, 클라이언트는 식별자를 닫음
        - 이때 서버로 EOF라는 통지가 전송
        - 서버는 rio_realineb함수에서 리턴 코드 0을 받으면 이 사실을 감지하고, 자신의 식별자를 닫은 후에 클라이언트는 종료
        - 클라이언트의 커널이 프로세스가 종료할 때 자동으로 열었던 모든 식별자를 닫아주기 때문에 24번 줄의 Close는 불필요
            - 하지만, 열었던 모든 식별자를 명시적으로 닫아주는 것이 올바른 프로그래밍 습관이므로 명시해 주는 것이 좋음<br><br>
2. 반복적 echo 서버 메인 루틴
    - echo 서버 메인 루틴 코드
        ```C
        #include "csapp.h"

        int main(int argc, char **argv)
        {
            int listenfd, connfd;
            socklen_t clientlen;
            struct sockaddr_storage clientaddr; /* Enough space for any address */
            char client_hostname[MAXLINE], client_port[MAXLINE];

            if(argc != 2) {
                fprintf(stderr, "usage: %s <port>\n", argv[0]);
                exit(0);
            }

            listenfd = Open_listenfd(argv[1]);
            while(1) {
                clientlen = sizeof(struct sockaddr_storage);
                connfd = Accept(listenfd, (SA *)&clientaddr, &clientlen);
                Getnameinfo((SA *) &clientaddr, clientlen, client_hostname, MAXLINE, client_port, MAXLINE, 0);
                printf("Connected to (%s, %s)\n", client_hostname, client_port);
                echo(connfd);
                Close(connfd);
            }
            exit(0);
        }
        ```
    - echo 서버 메인 루프 동작 과정
        - 듣기 식별자(Open_listenfd) 오픈 후 무한 루프에 진입
        - 각각의 반복 실행은 클라이언트로부터 연결 요청 대기, 도메인 이름과 연결된 클라이언트의 포트 출력, 클라이언트를 서비스하는 echo 함수를 호출
        - echo 루틴이 리턴한 후 메인 루틴은 연결 식별자를 닫음
        - 클라이언트와 서버가 자신들의 식별자를 닫은 후 연결 종료<br><br>
    - 소켓 주소 구조체인 clientaddr 변수
        - accept가 리턴하기 전 clientaddr에는 연결의 다른 쪽 끝의 클라이언트의 소켓 주소로 채워짐
        - clientaddr이 struct sockaddr_in이 아닌 struct sockaddr_storage형으로 선언된 이유
            - 정의에 의해 sockaddr_storage 구조체는 모든 형태의 소켓 주소를 저장하기에 충분히 크며, 이것은 코드를 프로토콜-독립적으로 유지해줌<br><br>
    - 반복서버(iterative server)
        - 위와 같이 한 번에 한 개씩의 클라이언트를 반복해서 실행하는 종류의 echo 서버
        - 12장에서 다수의 클라이언트를 동시에 처리하는 복잡한 동시성 서버를 만드는 방법을 배울 예정<br><br>
3. 텍스트 줄을 읽고 echo해주는 echo 함수
    - echo 루틴 코드
        ```C
        #include "csapp.h"

        void echo(int connfd)
        {
            size_t n;
            char buf[MAXLINE];
            rio_t rio;

            Rio_readinitb(&rio, connfd);
            while((n = Rio_readlineb(&rio, buf, MAXLINE)) != 0) {
                printf("server received %d bytes\n", (int)n);
                Rio_writen(connfd, buf, n);
            }
        }
        ```
    - echo 루틴 동작 과정
        - 10번 줄에서 rio_readlineb 함수가 EOF를 만날 때까지 텍스트 줄을 반복해서 읽고 써줌<br><br>
4. echo 클라이언트와 서버 파일을 자동으로 컴파일 시켜주는 Makefile
    - Makefile이란?
        - shell에서 컴파일하는 방법 중 하나
        - makefile이라는 파일에 어떤 파일을 컴파일 하는지, 어떠한 방식으로 컴파일 할지 미리 작성해놓음
        - make라는 명령어를 통해 makefile이 들어있는 디렉토리에서 파일들의 종속관계를 파악하여 자동으로 컴파일 시켜줌<br><br>
    - Makefile의 장점
        - 여러 개의 파일을 컴파일할 경우, 자동화로 인해 시간 절약하고, 프로그램의 종속 구조를 쉽게 파악 가능
        - 프로그램이 일부 수정되었을 경우, 그 부분에 대해서만 컴파일 하도록 도와주기 때문에 훨씬 효율적<br><br>
    - Makefile 코드
        ```C
        CC = gcc
        CFLAGS = -O2 -Wall -I .
        LIB = -lpthread

        all: echo

        csapp.o: csapp.c
            $(CC) $(CFLAGS) -c csapp.c

        echoclient: echoclient.c csapp.o
            $(CC) $(CFLAGS) -o echoclient echoclient.c csapp.o $(LIB)

        echoserver: echoserver.c csapp.o
            $(CC) $(CFLAGS) -o echoserver echoserver.c csapp.o $(LIB)

        clean:
            rm -f *.o echo *~
            rm -f *.o echoclient *~
            rm -f *.o echoserver *~
        ```
5. echo 클라이언트와 서버 통신 방법
    - 서버를 먼저 실행시켜준 후, 클라이언트를 실행시켜 통신<br><br>
    - 서버 실행 방법
        - cd echo
        - make echoserver
        - ./echoserver 8000<br><br>
    - 클라이언트 실행 방법
        - cd echo
        - make echoclient
        - ./echoclient localhost 8000
    - make echoserver와 echoclient는 makefile을 따로 작성하여 사용한 것으로 사용자마다 다름<br><br>
6. 구현 결과
    - echo 클라이언트와 서버가 정상적으로 연결되었고, 서로 통신이 가능한 것을 확인했다.
    - 연결 및 통신 결과를 이미지로 넣으면 좋은데 아직 하는 방법을 몰라서 공부해야할 것 같다...😥<br><br>
    - 임시로 코드 블록을 통해 구현 결과를 확인해보자.
        ```
        - 클라이언트에서 아래 단어 입력
        hello
        hi

        - 서버 출력 결과
        server received 6 bytes
        server received 3 bytes
        ```

## 2. CSAPP 11장 11.6c 문제 풀이
1. Tiny의 출력을 조사해서 여러분이 사용하는 브라우저의 HTTP 버전을 결정하라.
    - 우선 CSAPP 솔루션이 나온 정답은 HTTP 1.1이지만, 1.0도 가능<br><br>
    - HTTP 버전 확인 방법
        - tiny 서버 실행
        - 브라우저에서 "AWS 퍼블릭 주소:포트번호"로 실행
        - 개발자 도구 실행
        - Network 항목 클릭
        - 마우스 오른쪽 클릭 -> header option 클릭 -> protocol 체크
        - 개발자 도구 인터페이스에 표시되는 protocol 항목에서 HTTP 버전 확인
        - 자세한 사항은 아래 사이트 참조
            - https://krksap.tistory.com/1152<br><br>
    - 1.0이 가능한 이유
        - serve_static 함수의 sprintf(buf, "HTTP/1.0 200 OK\r\n");을 그대로 사용하면 브라우저에서 HTTP 1.1을 전송해옴
        - sprintf(buf, "HTTP/1.1 200 OK\r\n");에서 HTTP 버전을 1.0로 변경하면 브라우저에서 HTTP 1.0을 전송해옴<br><br>
    - 그럼 2.0도 가능할까?
        - 가능할 것으로 보임
        - 하지만, tiny 서버를 이용하면 브라우저에서 HTTP 2.0을 전송받지 못함<br><br>
    - 왜 tiny 서버를 이용하면 브라우저에서 HTTP 2.0을 전송받지 못할까?
        - 헤더의 차이
            - HTTP/1.1
                - HTTP/1.1의 헤더는 평문이고, 크기가 500에서 800바이트 정도
                - 쿠키가 포함된 경우 킬로바이트까지 증가
                - 예를 들어, 네이버를 요청한 상태에서 또 다른 요청을 하게되면 헤더의 차이는 없음
                - 단, 중복된 필드가 존재할 것이고, 중복된 데이터를 다시 보낼 것
            - HTTP/2.0
                - HTTP/2.0에서는 헤더를 중복해서 전송하지 않고, 압축해서 전송
                - HTTP/1.1과 동일하게 네이버에 요청한 상태에서 또 다른 요청을 했다고 가정
                    - 첫 번째 요청에서는 모든 필드를 모두 전송
                    - 두 번째 요청에서는 중복되는 필드를 제외한 나머지 필드만을 전송
                - 이렇게 HTTP/2.0은 중복 헤더 데이터를 전송하지 않으므로 매 요청바다 오버헤드를 크게 줄일 수 있음
                    - 같은 요청을 폴링하는 경우, 헤더가 변한게 없으므로 헤더 오버헤드는 0바이트
                - 위와 같이 헤더 중복을 제거하고, 과거 포스팅한 허프만 코딩 방식으로 또 한번 압축을 진행
                - 이런 방식으로 HTTP/2.0에서는 헤더 필드를 압축하여 프로토콜 오버헤더를 줄일 수 있음
                - 헤더 압축에 대해 더 자세한 사항은 RFC7540 공식 문서 참고
        - 즉, tiny 서버에는 HTTP/2.0의 헤더를 중복해 주는 기능을 수행하는 함수가 없어서 그렇지 않을까 하는 생각?!🤔

## 3. 투 포인터 개념 정리
### 투 포인터 알고리즘
1. 투 포인터 알고리즘이란?
    - 리스트에 순차적으로 접근해야 할 때 2개의 점의 위치를 기록하면서 처리하는 알고리즘
    - 한 반에 학생이 40명이 있고, 2~7번 학생을 지목해야 할 때, 간단히 '2번부터 7번까지의 학생'이라고 부를 수도 있다.
    - 이처럼 리스트에 담긴 데이터에 순차적으로 접근해야 할 때는 '시작점'과 '끝점' 2개의 점으로 접근할 데이터의 범위를 표현할 수 있다.

### 특정한 합을 가지는 부분 연속 수열 찾기 문제
1. 특정한 합을 가지는 부분 연속 수열 찾기란?
    - 양의 정수로만 구성된 리스트가 주어졌을 때, 그 부분 연속 수열 중에서 '특정한 합'을 갖는 수열의 개수를 출력하는 문제<br><br>
2. 문제 설명
    - 예를 들어, 다음과 같이 1, 2, 3, 2, 5를 차례대로 원소를 갖는 리스트(N개의 자연수로 구성된 수열)가 주어져 있다고 하자.
    - 이때, 합이 5(M)인 부분 연속 수열의 개수를 구해보자.
    - 수행 시간 제한은 O(N)이다.  
    <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FmZ77y%2FbtqSATOPeoU%2FNYTJrfoQukTtW1iUNvhOg1%2Fimg.png" height="200"></img><br><br>
3. 문제 해결 아이디어
    - 투 포인터 알고리즘의 특징
        - 2개의 변수를 이용해 리스트 상의 위치를 기록
            - '특정한 합을 가지는 부분 연속 수열 찾기' 문제에서는 부분 연속 수열의 시작점(start)과 끝점(end)의 위치를 기록<br><br>
    - 특정한 부분합을 M이라고 할 때, 구체적인 알고리즘
        - 시작점(start)과 끝점(end)이 첫 번째 원소의 인덱스(0)를 가리키도록 한다.
        - 현재 부분합이 M과 같다면 카운트한다.
        - 현재 부분합이 M보다 작으면 end를 1 증가시킨다.
        - 현재 부분합이 M보다 크거나 같으면 start를 1 증가시킨다.
        - 모든 경우를 확인할 때까지 두 번째부터 네 번째까지의 과정을 반복한다.<br><br>
4. 구체적인 문제 해결 과정
    - 문제 해결 아이디어를 통해 부분합이 5인 부분 연속 수열의 수는 몇 개인지 계산해보자.  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb9LKEz%2FbtqSxA26YQn%2Fn2uliiFHWe7VeKstud2CWk%2Fimg.png" height="100"></img><br><br>
        - STEP0
            - M = 5
            - 시작점과 끝점이 첫 번째 원소의 인덱스를 가리키도록 한다.
            - 현재의 부분합은 1이므로 무시한다.
            - 현재 카운트 : 0  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fs7cCt%2FbtqSjBB3hlS%2Fyw4cdKIKzauPU1lfqeEfT0%2Fimg.png" height="150"></img><br><br>
        - STEP1
            - 이전 단계에서의 부분합이 1이었기 때문에 end를 1 증가시킨다.
            - 현재의 부분합은 3이므로 무시한다.
            - 현재 카운트 : 0  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fb2ebQb%2FbtqSpF4XAfj%2FQdZlLTXkd4kD0K6wNyilB0%2Fimg.png" height="150"></img><br><br>
        - STEP2
            - 이전 단계에서의 부분합이 3이었기 때문에 end를 1 증가시킨다.
            - 현재의 부분합은 6이므로 무시한다.
            - 현재 카운트 : 0  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlxEwk%2FbtqSjB29uzW%2Fv8kM14wTrceGCxlVHEmDL0%2Fimg.png" height="150"></img><br><br>
        - STEP3
            - 이전 단계에서의 부분합이 6이었기 때문에 start를 1 증가시킨다.
            - 현재의 부분합은 5이므로 카운트를 증가시킨다.
            - 현재 카운트 : 1  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fby9sIr%2FbtqSGi77a2r%2FbBPoOR5DWT4SYc6KUwKSl1%2Fimg.png" height="150"></img><br><br>
        - STEP4
            - 이전 단계에서의 부분합이 5이었기 때문에 start를 1 증가시킨다.
            - 현재의 부분합은 3이므로 무시한다.
            - 현재 카운트 : 1  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FlSS8A%2FbtqSDvfQCbm%2FqKfuTcENk9y3P6kbk86Qtk%2Fimg.png" height="150"></img><br><br>
        - STEP5
            - 이전 단계에서의 부분합이 3이었기 때문에 end를 1 증가시킨다.
            - 현재의 부분합은 5이므로 카운트를 증가시킨다.
            - 현재 카운트 : 2  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbD0TJq%2FbtqSEKjvjSj%2FOEK6GwawUKTQ1Q3xkz9p60%2Fimg.png" height="150"></img><br><br>
        - STEP6
            - 이전 단계에서의 부분합이 5이었기 때문에 start를 1 증가시킨다.
            - 현재의 부분합은 2이므로 무시한다.
            - 현재 카운트 : 2  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FFR7fq%2FbtqSDvz89n7%2FkQfxbBdyLL44k4kYBM3A41%2Fimg.png" height="150"></img><br><br>
        - STEP7
            - 이전 단계에서의 부분합이 2였기 때문에 end를 1 증가시킨다.
            - 현재의 부분합은 7이므로 무시한다.
            - 현재 카운트 : 2  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FXlFqP%2FbtqSmAQnAxL%2Fx5OKK8hKlFd97IF2PerSnk%2Fimg.png" height="150"></img><br><br>
        - STEP8
            - 이전 단계에서의 부분합이 7이었기 때문에 start를 1 증가시킨다
            - 현재의 부분합은 5이므로 카운트를 증가시킨다.
            - 현재 카운트 : 3  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fbm32FQ%2FbtqSpGpge76%2FKtsUTpY7kby8QVz0UnSlk1%2Fimg.png" height="150"></img><br><br>
5. 소스코드
    ```python
    n = 5 # 데이터의 개수 N
    m = 5 # 찾고자 하는 부분합 M
    data = [1, 2, 3, 2, 5] # 전체 수열

    count = 0
    interval_sum = 0
    end = 0

    # start를 차례대로 증가시키며 반복
    for start in range(n):
        # end를 가능한 만큼 이동시키기
        while interval_sum < m and end < n:
            interval_sum += data[end]
            end += 1
        # 부분합이 m일 때 카운트 증가
        if interval_sum == m:
            count += 1
        interval_sum -= data[start]

    print(count)

    >>> 3
    ```

## 4. 7주차 4일차를 마치며...
오늘은 CSAPP 11장에 해당하는 echo 클라이언트와 서버에 대해 학습 및 구현하고 테스트까지 완료했다.

이후에는 CSAPP 11장 숙제 문제인 11.6C번 문제를 풀었는데 HTTP/2.0 버전을 전송받지 못하는 문제에 대해 의문이 생겨 추가로 공부했다. 확실하지는 않지만, 어느정도 왜 HTTP/2.0 버전을 전송받지 못하는지 파악할 수 있었다.

저번에 알고리즘 문제를 풀면서 다시 배웠던 투 포인터 개념에 대해서도 다시 정리해서 깃허브 저장소에 올려뒀다.

내일은 나머지 CSAPP 11장 숙제 문제를 해결하고, Proxy 서버 구현 및 알고리즘 문제를 풀 계획이다.