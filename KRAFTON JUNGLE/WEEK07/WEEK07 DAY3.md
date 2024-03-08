# WEEK07 DAY3 TIL
- 오늘의 학습 목록
```
1. 컴퓨터 시스템 11장 네트워크 프로그래밍 학습
2. 컴퓨터 시스템 책에 있는 코드를 기반으로, tiny 웹서버 구현
```

## 1. 컴퓨터 시스템 11장 네트워크 프로그래밍 학습 내용
4. 이더넷(Ethernet)
    - LAN에서는 이더넷이라는 기술을 사용하여 통신<br><br>
    - 이더넷 세그먼트  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FZApKr%2FbtrQpJIB6Xh%2FKjBXlbyDWs22O5e63UkKR1%2Fimg.png"></img>
        - 꼬임쌍선(Twisted-pair cable) 즉, 랜 케이블과 허브로 구성
        - 방이나 빌딩의 층과 같이 작은 지역에 설치
        - 각 전선은 동일한 최대 비트 대역폭을 가짐(100Mb/s 또는 1Gb/s)
        - 한쪽 끝은 호스트의 어댑터에 연결되고, 다른 끝은 허브의 포트에 연결<br><br>
    - 이더넷 세그먼트 구성요소
        - 꼬임쌍선(Twisted-pair cable)  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkU7Xa%2FbtrQpSSMkEU%2F8knfsO4Mvbk4OmmuVq5lb0%2Fimg.png"></img>
            - 구리 선 여덟개를 두개씩 꼬아 만든 네 쌍의 전선
            - 구리선을 꼬는 이유는 노이즈를 방지하기 위함<br><br>
            - 꼬임쌍선 종류
                - 차폐 트위스티드 페어(STP, Shielded Twisted Pair)
                    - 두개씩 꼬아 만든 선을 실드(Shield)로 보호한 케이블
                    - 높은 대역폭과 실외 환경이 요구되는 하이엔드 제품에서 흔희 사용
                - 비차폐 트위스티드 페어(UTP, Unshielded Twisted Pair)
                    - 두개씩 꼬아 만든 선으로 된 케이블
                    - 가정, 사무실 및 대기업에서 흔히 사용<br><br>
        - 허브(Hub)  
            <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FcLFQLm%2FbtrQqLFqknN%2F7MD1LchxqzPMZyfyZowSt0%2Fimg.png"></img>
            - 랜을 구성할 때 가까운 거리에 있는 장비들을 케이블을 사용하여 연결하는 장치
            - 포트를 여러 개 가지고 있어 컴퓨터 여러 대와 통신 가능
            - 어떤 포트로부터 데이터를 받았을 때, 항상 나머지 모든 포트로 데이터를 전송<br><br>
    - 이더넷 프레임  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FkO83N%2FbtrQrt5iGKj%2Fh8n9J481HQp9TXNVPWX0iK%2Fimg.png"></img>
        - 허브는 한 포트에서 들어온 데이터를 나머지 모든 포트로 전달하는데 어떻게 다른 목적지 호스트로 전송할 수 있을까?🤔
            - 이더넷 프레임 이용
            - 이더넷 프레임은 프레임의 출처와 목적지를 명확하게 구분하고, 오류 검출 기능을 통해 신뢰성 있는 데이터 전송을 지원함므로 데이터를 안전하게 전달할 수 있음<br><br>
        - 이더넷 프레임이란?
            - 이더넷 기반의 네트워크에서 데이터를 전송할 때 사용되는 기본 단위
            - 컴퓨터와 네트워크 장치 간에 정보를 교환하기 위해 사용
            - 표준화된 구조를 가지고 있어 서로 다른 장치들 간의 데이터 전송을 원활하게 함<br><br>
        - 이더넷 프레임 구성 요소
            - 프리앰블(Preamble) : 프레임 시작을 알리는 동기화 비트 패턴으로, 수신 측에서 프레임의 시작을 인식 가능하게 함
            - 목적지 MAC 주소(Destination MAC Address) : 수신할 장치의 물리적 주소인 MAC 주소를 나타내며, 목적지 주소를 통해 프레임이 올바른 수신자에게 전달되도록 함
            - 소스 MAC 주소(Source MAC Address) : 데이터를 전송한 장치의 물리적 주소인 MAC 주소를 나타내며, 수신 측에서는 이를 통해 데이터의 출처를 확인할 수 있음
            - 이더타입(EtherType) : 프레임 내의 페이로드 데이터 형식을 식별하는 필드로, 상위 계층 프로토콜(예: IPv4, IPv6)의 종류를 알려줌
            - 페이로드(Payload) : 전송할 실제 데이터를 담고 있는 부분으로, 일반적으로 최대 1500바이트의 크기를 가짐
            - 프레임 체크 시퀀스(Frame Check Sequence) : 프레임의 무결성을 확인하기 위한 오류 검출 코드로, 수신 측에서 프레임의 오류를 검출하는데 사용<br><br>
        - 이더넷 어댑터는 어댑터의 비휘발성 메모리에 저장된 전체적으로 고유한 48비트 주소를 보유 = MAC 주소
        - MAC 주소의 앞쪽 24비트는 랜 카드 제조사 번호, 뒤쪽 24비트는 제조사가 붙인 일련번호<br><br>
        - 이더넷 세그먼트에 속한 호스트가 다른 호스트로 데이터를 전송할 경우, 데이터 앞에 헤더와 뒤에 트레일러를 같이 붙여 전송
            - 헤더 : 데이터(페이로드) 앞에 데이터의 출발지(소스 MAC 주소), 목적지(목적지 MAC 주소), 데이터 타입(이더타입) 정보가 있음
            - 트레일러 : 데이터(페이로드) 끝에 데이터 무결성을 보장하기 위한 프레임 체크 시퀀스가 있음<br><br>
    - 브릿지형 이더넷  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FbCQZdh%2FbtrQrGwAU7p%2F43kn69LzKE68RpTOeKWQk1%2Fimg.png"></img>
        - 브릿지형 이더넷이란?
            - 브릿지라는 장비를 사용해서 다수의 이더넷 세그먼트가 연결하여 더 큰 LAN을 구성한 것
            - 케이블이 허브와 브릿지를 연결하고, 브릿지와 브릿지를 연결함으로서 건물 전체나 캠퍼스 전체를 아우르는 더 큰 네트워크가 만들어질 수 있음<br><br>
5. 인터넷 프로토콜
    - LAN들은 라우터라고 부르는 특별한 장비를 통해 연결되어 internet을 형성
    - 라우터는 포트가 있어서 다른 네트워크들과 연결될 수 있는데, 라우터가 연결하는 네트워크들을 WAN이라고 하고, 라우터를 통해 수많은 LAN과 WAN이 연결되어 인터넷을 형성하게 되는 것<br><br>
    - 이렇듯 인터넷은 서로 다른 기술로 구성된 임의의 LAN과 WAN들로 구성되는데, 어떻게 하나의 호스트가 대이터를 목적지 호스트로 전송할 수 있을까?
        - 각 호스트와 라우터에서 실행되는 프로토콜 소프트웨어 단계가 서롤 다른 네트워크의 치아를 완화해주는 역할을 함으로써 해결
        - 프로토콜 소프트웨어는 호스트와 라우터가 서로 데이터를 전송할 수 있게 해주는 규칙(IP 프로토콜)을 실행하고, 아래 두 가지 기능을 제공해야 함<br><br>
    - 프로토콜 소프트웨어 기본 두 가지 기능
        - 명명법(Naming Scheme)
            - 각각의 호스트가 동일한 형식의 고유한 주소를 정해 줌
        - 전달기법(Delivery Mechanism)
            - 전달되는 모든 데이터는 패킷 단위로 전달
            - 패킷은 패킷 크기, 소스, 목적지 호스트 주소를 포함한 헤더와 데이터로 구성<br><br>
    - internet에서 데이터가 하나의 호스트에서 다른 호스트로 이동하는 방법(8단계)  
        <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2FwMnOd%2FbtrfDgWhV21%2FMQUNWUaPHitdHDUWZCwHA0%2Fimg.png"></img>
        - 1단계
            - 클라이언트는 시스템 콜을 호출하여 클라이언트의 가장 주소 공간의 데이터를 커널 버퍼로 복사
        - 2단계
            - 호스트 A의 프로토콜 소프트웨어는 internet 헤더와 LAN1 프레임 헤더를 데이터에 추가하여 LAN1 이더넷 프레임을 생성
            - 이 이더넷 프레임을 LAN1 네트워크 어댑터로 전송
        - 3단계
            - LAN1의 네트워크 어댑터는 프레임을 네트워크로 복사
        - 4단계
            - 프레임이 라우터로 도달하면, 라우터의 LAN1 어댑터는 전선에서 이것을 읽어서 프로토콜 소프트웨어로 전달
        - 5단계
            - 라우터는 이전의 LAN1 프레임 헤더를 벗겨내고, 호스트 B의 주소를 갖는 새로운 LAN2 프레임 헤더를 앞에 붙여서 이것을 어댑터로 전달
        - 6단계
            - LAN2 어댑터는 이 프레임을 네트워크로 복사
        - 7단계
            - 이 프레임이 호스트 B에 도착하면 어댑터는 이 프레임을 저넌에서 읽어들이고, 이것을 프로토콜 소프트웨어로 전달
        - 8단계
            - 호스트 B의 프로토콜 스프트웨어는 패킷 헤더와 프레임 헤더를 벗기고, 서버가 이 데이터를 읽는 시스템 콜을 호출할 때 서버의 가상 주소공간으로 복사

## 2. 컴퓨터 시스템 책에 있는 코드를 기반으로, tiny 웹서버 구현
1. Tiny 웹서버 소스코드
    ```C
    #include "csapp.h"

    void doit(int fd);
    void read_requesthdrs(rio_t *rp);
    int parse_uri(char *uri, char *filename, char *cgiargs);
    void serve_static(int fd, char *filename, int filesize);
    void get_filetype(char *filename, char *filetype);
    void serve_dynamic(int fd, char *filename, char *cgiargs);
    void clienterror(int fd, char *cause, char *errnum, char *shortmsg, char *longmsg);

    int main(int argc, char **argv) {
    int listenfd, connfd;
    char hostname[MAXLINE], port[MAXLINE];
    socklen_t clientlen;
    struct sockaddr_storage clientaddr;

    /* Check command line args */
    if (argc != 2) {
        fprintf(stderr, "usage: %s <port>\n", argv[0]);
        exit(1);
    }

    listenfd = Open_listenfd(argv[1]);
    while (1) {
        clientlen = sizeof(clientaddr);
        connfd = Accept(listenfd, (SA *)&clientaddr, &clientlen);  // line:netp:tiny:accept
        Getnameinfo((SA *)&clientaddr, clientlen, hostname, MAXLINE, port, MAXLINE, 0);
        printf("Accepted connection from (%s, %s)\n", hostname, port);
        doit(connfd);   // line:netp:tiny:doit
        Close(connfd);  // line:netp:tiny:close
    }
    }

    void doit(int fd)
    {
    int is_static;
    struct stat sbuf;
    char buf[MAXLINE], method[MAXLINE], uri[MAXLINE], version[MAXLINE];
    char filename[MAXLINE], cgiargs[MAXLINE];
    rio_t rio;
    
    /* Read request line and headers */
    Rio_readinitb(&rio, fd);
    Rio_readlineb(&rio, buf, MAXLINE);
    printf("Request headers:\n");
    printf("%s", buf);
    sscanf(buf, "%s %s %s", method, uri, version);
    if(strcasecmp(method, "GET")) {
        clienterror(fd, method, "501", "Not implemented", "Tiny does not implement this method");
        return;
    }
    read_requesthdrs(&rio);

    /* Parse URI from GET request */
    is_static = parse_uri(uri, filename, cgiargs);
    if(stat(filename, &sbuf) < 0) {
        clienterror(fd, filename, "404", "Not found", "Tiny couldn't find this file");
        return;
    }

    if(is_static) { /* Serve static content */
        if(!(S_ISREG(sbuf.st_mode)) || !(S_IRUSR & sbuf.st_mode)) {
        clienterror(fd, filename, "403", "Forbidden", "Tiny couldn't read the file");
        return;
        }
        serve_static(fd, filename, sbuf.st_size);
    }
    else { /* Serve dynamic content */
        if(!(S_ISREG(sbuf.st_mode)) || !(S_IXUSR & sbuf.st_mode)) {
        clienterror(fd, filename, "403", "Forbidden", "Tiny couldn't run the CGI program");
        return;
        }
        serve_dynamic(fd, filename, cgiargs);
    }
    }

    void clienterror(int fd, char *cause, char *errnum, char *shortmsg, char *longmsg)
    {
    char buf[MAXLINE], body[MAXBUF];

    /* Build the HTTP response body */
    sprintf(body, "<html><title>Tiny Error</title>");
    sprintf(body, "%s<body bgcolor=""ffffff"">\r\n", body);
    sprintf(body, "%s%s: %s\r\n", body, errnum, shortmsg);
    sprintf(body, "%s<p>%s: %s\r\n", body,longmsg, cause);
    sprintf(body, "%s<hr><em>The Web server</em>\r\n", body);

    /* Print the HTTP response */
    sprintf(buf, "HTTP/1.0 %s %s\r\n", errnum, shortmsg);
    Rio_writen(fd, buf, strlen(buf));
    sprintf(buf, "Content-type: text/html\r\n");
    Rio_writen(fd, buf, strlen(buf));
    sprintf(buf, "Content-length: %d\r\n\r\n", (int)strlen(body));
    Rio_writen(fd, buf, strlen(buf));
    Rio_writen(fd, body, strlen(body));
    }

    void read_requesthdrs(rio_t *rp)
    {
    char buf[MAXLINE];

    Rio_readlineb(rp, buf, MAXLINE);
    while(strcmp(buf, "\r\n")) {
        Rio_readlineb(rp, buf, MAXLINE);
        printf("%s", buf);
    }
    return;
    }

    int parse_uri(char *uri, char *filename, char *cgiargs)
    {
    char *ptr;

    if(!strstr(uri, "cgi-bin")) { /* Static content */
        strcpy(cgiargs, "");
        strcpy(filename, ".");
        strcat(filename, uri);
        if(uri[strlen(uri) - 1] == '/')
        strcat(filename, "home.html");
        return 1;
    }
    else { /* Dynamic content */
        ptr = index(uri, '?');
        if(ptr) {
        strcpy(cgiargs, ptr + 1);
        *ptr = '\0';
        }
        else
        strcpy(cgiargs, "");
        strcpy(filename, ".");
        strcat(filename, uri);
        return 0;
    }
    }

    void serve_static(int fd, char *filename, int filesize)
    {
    int srcfd;
    char *srcp, filetype[MAXLINE],buf[MAXBUF];

    /* Send response headers to client */
    get_filetype(filename, filetype);
    sprintf(buf, "HTTP/1.0 200 OK\r\n");
    sprintf(buf, "%sServer : Tiny Web Server\r\n", buf);
    sprintf(buf, "%sConnection : close\r\n", buf);
    sprintf(buf, "%sContent-length : %d\r\n", buf, filesize);
    sprintf(buf, "%sContent-type : %s\r\n\r\n", buf, filetype);
    Rio_writen(fd, buf, strlen(buf));
    printf("Response headers : \n");
    printf("%s", buf);

    /* Send response body to client */
    srcfd = Open(filename, O_RDONLY, 0);
    srcp = Mmap(0, filesize, PROT_READ, MAP_PRIVATE, srcfd, 0);
    Close(srcfd);
    Rio_writen(fd, srcp, filesize);
    Munmap(srcp, filesize);
    }

    /*
    * get_filetype - Derive file type from filename
    */
    void get_filetype(char *filename, char *filetype)
    {
    if(strstr(filename, ".html"))
        strcpy(filetype, "text/html");
    else if(strstr(filename, ".gif"))
        strcpy(filetype, "image/gif");
    else if(strstr(filename, ".png"))
        strcpy(filetype, "image/png");
    else if(strstr(filename, ".jpg"))
        strcpy(filetype, "image/jpg");
    else
        strcpy(filetype, "text/plain");
    }

    void serve_dynamic(int fd, char *filename, char *cgiargs)
    {
    char buf[MAXLINE], *emptylist[] = { NULL };

    /* Return first part of HTTP response */
    sprintf(buf, "HTTP/1.0 200 OK\r\n");
    Rio_writen(fd, buf, strlen(buf));
    sprintf(buf, "Server: Tiny Web Server\r\n");
    Rio_writen(fd, buf, strlen(buf));

    if(Fork() == 0) { /* Child */
        /* Real server would set all CGI vars here */
        setenv("QUERY_STRING", cgiargs, 1);
        Dup2(fd, STDOUT_FILENO);                /* Redirect stdout to client */
        Execve(filename, emptylist, environ);   /* Run CGI program */
    }
    Wait(NULL); /* Parent waits for and reaps child */
    }
    ```
    - 코드를 모두 작성하고 실행시켰을 때 오류가 발생했다.
        - 확인 결과, 프로그램으로부터 동적 컨텐츠를 처리하는 HTTP 트랜잭션 기능을 수행하는 adder.c 코드다 빠져있었다.
    - 트랜잭션 코드도 모두 작성하고 포트 8000으로 서버를 실행시켰는데, 파일 디렉토리를 찾을 수 없다는 오류가 발생했다.
        - 확인 결과, 프로그램 시작 전에 make를 하지 않았던 것과 EC2 인어바웃 규칙에서 포트 8000을 추가하지 않은 것을 발견했다.
    - make를 먼저 실행하고, 8000 포트를 추가한 후에 프로그램을 실행시켰더니 정상적으로 테스트가 가능해졌다.

## 3. 7주차 3일차 마무리...
7주차가 4일이 남았지만, 코드 제출 및 리뷰하는 날을 빼면 3일밖에 남지 않았다.
남은 3일 동안 집중해서 echo 클라이언트와 서버, 11장 숙제와 proxy 서버를 구현해야 한다.
화이팅~!🔥