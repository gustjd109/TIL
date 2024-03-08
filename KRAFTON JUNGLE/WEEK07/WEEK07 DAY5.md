# WEEK07 DAY5 TIL
- 오늘의 학습 목록
```
1. CSAPP 숙제 문제 풀이(11.7, 11.9, 11.10, 11.11)
2. 시스템 콜 mmap() 함수와 munmap() 함수 학습
3. rio_readn()과 rio_writen() 함수 학습
4. HTML form 태그 학습
5. HTTP HEAD 메서드 학습
```

## 1. CSAPP 11장 숙제 문제 풀이
### 11.7 문제 풀이
1. 문제
    - Tiny를 확장해서 MPG 비디오 파일을 처리하도록 하시오. 실제 브라우저를 사용해서 여러분의 결과를 체크하시오.<br><br>
1. 문제 풀이 과정
    - get_filetype 함수에 MPG 비디오 파일을 처리하기 위한 코드 추가
    - 비디오가 브라우저에 표시될 수 있도록 home.html 파일에 video 태그 코드 추가
    - 두 파일 수정 후, 서버를 실행하여 브라우저에서 영상이 잘 나오는지 확인<br><br>
2. 수정된 get_filetype 함수
    ```C
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
    // 숙제 문제 11.7 : Tiny를 확장해서 MPG 비디오 파일 처리하기 위한 코드 추가
    else if(strstr(filename, ".mp4"))
        strcpy(filetype, "video/mp4");
    else
        strcpy(filetype, "text/plain");
    }
    ```
3. 수정된 home.html 파일
    ```HTML
    <html>
        <head><title>Tiny Web Sever Test</title></head>
        <body>
            <h2>Dave O'Hallaron</h2>
            <img align="middle" src="godzilla.gif">
            <br>
            <!-- 숙제 문제 11.7 : Tiny를 확장해서 MPG 비디오 파일 처리하기 위한 코드 추가 -->
            <h2>Thunder</h2>
            <video width="300" height="300" controls : autoplay>
                <source src="Thunder.mp4" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </body>
    </html>
    ```

### 11.9 문제 풀이
1. 문제
    - Tiny를 수정해서 정적 컨텐츠를 처리할 때 요청한 파일을 mmap과 rio_readn 대신에 malloc, rio_readn, rio_writen을 사용해서 연결 식별자에게 복사하도록 하시오.<br><br>
    - 문제가 좀 이상하다...😒
        - 원서에 있는 문제를 찾아보니 문제가 다르다는 것을 찾았고, 원서의 문제는 다음과 같다.
            - Modify Tiny so that when it serves static content, it copies the requested file to the connected descriptor using malloc, rio_readn, and rio_writen, instead of mmap and rio_writen.
            - 해석하면, Tiny를 수정해서 정적 컨텐츠를 처리할 때 요청한 파일을 mmap과 rio_writen 대신에 malloc, rio_readn, rio_writen을 사용해서 연결 식별자에게 복사하도록 하시오.(문제가 다르잖아?!...😑)
            - 즉, mmap과 munmap을 이용해서 메모리를 매핑하고 연결 식별자에게 복사하는 것을 malloc, free를 이용해서 메모리를 동적 할당 및 해제하고, rio_readn과 rio_writen을 사용해서 연결 식별자를 복사할 수 있도록 코드를 수정하면 될 것 같다.<br><br>
2. 수정된 serve_static 함수
    ```C
    void serve_static(int fd, char *filename, int filesize)
    {
    int srcfd;
    char *srcp, filetype[MAXLINE],buf[MAXBUF];

    /* Send response headers to client */
    get_filetype(filename, filetype);
    sprintf(buf, "HTTP/1.1 200 OK\r\n");
    sprintf(buf, "%sServer : Tiny Web Server\r\n", buf);
    sprintf(buf, "%sConnection : close\r\n", buf);
    sprintf(buf, "%sContent-length : %d\r\n", buf, filesize);
    sprintf(buf, "%sContent-type : %s\r\n\r\n", buf, filetype);
    Rio_writen(fd, buf, strlen(buf));
    printf("Response headers : \n");
    printf("%s", buf);

    /* Send response body to client */
    // 숙제 문제 11.9 : 정적 컨텐츠를 처리할 때 요청한 파일을 mmap과 rio_readn 대신에 malloc, rio_readn, rio_writen을 사용해서 연결 식별자에게 복사 처리 추가
    srcfd = Open(filename, O_RDONLY, 0);
    // srcp = Mmap(0, filesize, PROT_READ, MAP_PRIVATE, srcfd, 0);
    srcp = (char*)Malloc(filesize);
    Rio_readn(srcfd, srcp, filesize);
    Close(srcfd);
    Rio_writen(fd, srcp, filesize);
    // Munmap(srcp, filesize);
    free(srcp);
    }
    ```
3. 시스템 콜 mmap() 함수와 munmap() 함수
    - 6주차 malloc-lab 구현할 때, 공부했어야 하는 부분인데 하지 못해서 마침 문제에 언급이 있어서 학습했고, 내용은 다음과 같다.<br><br>
    - mmap() 함수
        - mmap() 함수 원형
            ```C
            #include <unistd.h>
            #include <sys/mman.h>
            
            void* mmap(void* start, size_t length, int prot, int flags, int fd, off_t offset);
            ```
        - mmap() 함수 설명
            - 파일이나 디바이스를 응용 프로그램의 주소 공간 메모리에 대응시키기 위해 사용하는 시스템 호출
            - fd로 저장된 디바이스 파일에서 offset에 해당하는 물리 주소에서 시작하여 length 바이트 만큼을 start 주소로 대응시킴
            - start 주소는 보통 0으로 지정하고, 강제적인 요구가 아니기 때문에 다른 값을 지정해도 꼭 그 값으로 대응시켜 반환되지는 않음
            - offset과 length는 PAGE_SIZE 단위여야 함
            - 지정된 영역에 대응되는 응용 프로그램에서 사용 가능한 실제 시작 위치를 반환
            - 성공하면 mmap은 대응된 영역의 포인터를 반환
            - 에러가 발생하면 MAP_FAILED(-1)이 반환되며, errno는 적당한 값으로 설정<br><br>
        - mmap() 함수 매개변수
            - start : 요청한 물리 주소 공간을 매핑하고자 하는 주소(보통은 0을 사용)
            - length : 매핑하고자 하는 주소 공간의 크기(PAGE_SIZE의 배수)
            - prot : 메모리 보호 모드 설정
                - PROT_EXEC : 페이지 실행 가능
                - PROT_READ : 페이지 읽기 가능
                - PROT_WRITE : 페이지 쓰기 가능
                - PROT_NONE : 페이지 접근 불가능
            - flag : 대응된 객체 타입, 옵션, 페이지 복사본에 대한 수정을 그 프로세스에만 보일 것인지 참조하는 다른 프로세스와 공유할 것인지 설정
                - MAP_FIXED : 지정된 주소 이외에는 선택하지 않음
                    - 지정된 주소를 사용할 수 없으면 mmap 실패
                - MAX_SHARED : 이 객체를 대응시키는 다른 프로세스와 대응 영역을 공유
                - MAX_PRIVATE : 다른 프로세스와 대응 영역을 공유하지 않음
            - fd : 디바이스 파일의 파일 디스크립터
            - offset : 매핑시키고 싶은 물리 주소<br><br>
        - mmap() 함수 반환값
            - 성공하면 대응된 영역의 포인터를 반환하고, 실패하면 MAP_FILED(-1)이 반환되고, errno는 다음 값으로 설정
            - EBADF: fd가 유효한 파일 디스크립터가 아님
            - EACCES: MAP_PRIVATE가 설정되었지만, fd가 읽을 수 있도록 열려있지 않음 / MAP_SHARED와 PROT_WRITE가 설정되었지만, fd가 쓸 수 있도록 열려있지 않음
            - EINVAL: start나 length나 offset이 적당하지 않음(즉, 너무 크거나 PAGESIZE 경계로 정렬되어 있지 않음)
            - ETXTBUSY: MAP_DENYWRITE가 설정되었으나 fd로 지정된 객체가 쓸수 있도록 열려있음
            - EAGAIN: 파일이 잠겨있거나 너무 많은 메모리가 잠겨있음
            - ENOMEM: 사용할 수 있는 메모리가 없음<br><br>
    - munmap() 함수
        - munmap() 함수 원형
            ```C
            #include <unistd.h>
            #include <sys/mman.h>
            
            int munmap(void* start, size_t length);
            ```
        - munmap() 함수 설명
            - 할당된 메모리 영역을 해제시키는데 사용하는 시스템 호출
            - start와 length는 mmap() 함수에 의해 반환된 주소와 매개변수로 지정한 length 값이어야 함<br><br>
        - munmap() 함수 매개변수
            - start : mmap에 의해서 반환된 주소
            - length : mmap에 의해서 지정된 크기<br><br>
        - munmap() 반환값
            - 성공하면 0을 반환하고, 실패하면 -1을 반환하며, errno가 설정(보통 EINVAL이 설정)
            - EBADF : fd가 유효한 파일 디스크립터가 아님
            - EINVAL : start나 length 혹은 offset이 적당하지 않음(즉, 너무 크거나 PAGESIZE 경계로 정렬되어 있지 않음)<br><br>
4. rio_readn()과 rio_writen() 함수
    - 문제를 풀면서 rio_readn()과 rio_writen() 함수가 어떤 기능을 수행하는지 궁금해져서 학습했다.
    - rio_readn()과 rio_writen() 함수 소스코드는 csapp.c에 정의되어 있다.
    - 하지만, 아래 사이트(펜실베이니아 주립대학교에서 제공하는 사이트인듯)의 코드에 좀 더 자세하게 주석처리가 되어있어서 참고하여 학습했고, 해당 내용은 다음과 같다.
        - https://www.cse.psu.edu/~deh25/cmpsc311/Lectures/System-Level-I_O.html<br><br>
    - rio_readn() 함수
        - rio_readn() 함수 소스코드
            ```C
            ssize_t rio_readn(int fd, void *usrbuf, size_t n)
            {
            size_t nleft = n;        /* 0 <= nleft == n */
            char *bufp = usrbuf;

            while (nleft > 0) {      /* loop invariant: 0 <= nleft <= n */
                ssize_t rc = read(fd, bufp, nleft);
                if (rc < 0) {          /* read() error */
                if (errno == EINTR)  /* interrupted by a signal */
                    continue;          /* no data was read, try again */
                else
                    return -1;         /* errno set by read(), give up */
                    /* ??? It may be that some data was read successfully
                    * on a previous iteration.  Is it correct to give up
                    * entirely?  In some cases, yes, but always?
                    */
                }
                if (rc == 0)           /* EOF */
                break;
                bufp += rc;            /* read() success, 0 < rc <= nleft */
                nleft -= rc;           /* 0 <= new nleft < old nleft <= n */
            }

            return (n - nleft);      /* return >= 0 */
            }
            ```
        - rio_readn() 함수 설명
            - 견고하게 n 바이트를 읽는 함수(버퍼링되지 않음)
            - 바이트 수를 반환하거나 EOF의 경우 0, 오류의 경우 -1을 반환
            - n 바이트 미만을 사용할 수 있으면, 정상적으로 반환
            - n 바이트가 요청되면(n = 0) rio_ 함수는 아무 작업도 수행하지 않음
            - 표준 함수 read() 및 write()는 다른 인수의 유효성을 확인한 다음 다른 작업을 수행하지 않음<br><br>
    - rio_writen() 함수
        - rio_writen() 함수 소스코드
            ```C
            ssize_t rio_writen(int fd, void *usrbuf, size_t n)
            {
            size_t nleft = n;        /* 0 <= nleft == n */
            char *bufp = usrbuf;

            while (nleft > 0) {      /* loop invariant: 0 <= nleft <= n */
                ssize_t rc = write(fd, bufp, nleft);
                if (rc < 0) {          /* write() error */
                if (errno == EINTR)  /* interrupted by a signal */
                    continue;          /* no data was written, try again */
                else
                    return -1;         /* errno set by write(), give up */
                    /* ??? It may be that some data was written successfully
                    * on a previous iteration.  Is it correct to give up
                    * entirely?  In some cases, yes, but always?
                    */
                }
                if (rc == 0)           /* nothing written, but not an error */
                continue;            /* try again */
                bufp += rc;            /* write() success, 0 < rc <= nleft */
                nleft -= rc;           /* 0 <= new nleft < old nleft <= n */
            }

            return n;
            }
            ```
        - rio_writen() 함수 설명
            - 견고하게 n 바이트를 씁는 함수(버퍼링되지 않음)
            - 바이트 수를 반환하거나 오류 시 -1을 반환
            - n 바이트 미만이 기록되면 오류를 반환

### 11.10 문제 풀이
1. 문제 A
    - 그림 11.27의 CGI adder 함수에 대한 HTML 형식을 작성하시오.
    - 이 형식은 사용자가 함께 더할 두 개의 숫자로 채우는 두 개의 텍스트 상자를 포함해야 한다.
    - 여러분의 형식은 GET 메소드를 사용해서 컨텐츠를 요청해야 한다.<br><br>
    - form-adder.html 소스코드
        ```html
        <html>
            <head><title>Tiny Sever</title></head>
            <body>
                <form action="/cgi-bin/form-adder" method="GET">
                    <p>First Number : <input type="text" name="first"/></p>
                    <p>Second Number : <input type="text" name="second"/></p>
                    <input type="submit" value="Submit"/>
                </form>
            </body>
        </html>
        ```
    - HTML form 태그
        - 사용자가 입력하거나 선택한 정보를 서버로 전송하기 위해서 쓰는 태그
        - 사용자 입력을 위한 요소로 사용자로부터 정보를 수집하는 역할 수행
        - 주로, 웹페이지 상에서 로그인, 회원가입 등에 사용<br><br>
        - form 태그 속성
            - action : 폼 전송 버튼을 눌렀을 때 이동하는 페이지의 경로를 지정
            - name : 폼을 식별하기 위한 이름을 지정
            - accept-charset : 폼 전송에 사용할 문자 인코딩 지정
            - target : action에서 지정한 파일을 현재 창이 아닌 다른 위치에 열도록 지정
                - target 속성
                    - _blank : 서버로부터 받은 응답을 새로운 윈도우나 탭에서 보여줌
                    - _self : 서버로부터 받은 응답을 링크가 위치한 현재 프레임에서 보여줌(기본값으로 생략 가능)
                    - _parent : 서버로부터 받은 응답을 현재 프레임의 부모 프레임에서 보여줌
                    - _top : 서버로부터 받은 응답을 명시된 프레임에서 보여줌
            - method : 폼을 서버에 전송할 http 메소드 지정(GET 또는 POST)
                - GET
                    - URL 끝에 데이터를 붙여 전송하는 방법
                    - 데이터가 외부에 노출되어 보안에 취약
                    - 지정된 리소스에서 데이터를 요청하는 경우인 읽을 때 사용하는 메소드
                - POST
                    - URL에 보이지 않게 데이터를 전성하는 방법
                    - 보내려는 데이터가 개인 정보나 보안을 요구하는 경우 사용
                    - 지정된 리소스에서 데이터를 처리할 경우인 쓰기, 수정, 삭제할 때 사용<br><br>
2. 문제 B
    - 실제 브라우저를 사용해서 Tiny로부터 이 형식을 요청하고, 채운 형식을 Tiny에 보내고, adder가 생성한 동적 컨텐츠를 표시하는 방법으로 작업을 체크하라.
    - form-adder 함수 소스코드
        ```C
        #include "csapp.h"

        int main(void) {
        char *buf, *p;
        char arg1[MAXLINE], arg2[MAXLINE], content[MAXLINE];
        int n1 = 0, n2 = 0;

        /* Extract the two arguments */
        if((buf = getenv("QUERY_STRING")) != NULL) {
            p = strchr(buf, '&');
            *p = '\0';
            // strcpy(arg1, buf);
            // strcpy(arg2, p + 1);
            // n1 = atoi(arg1);
            // n2 = atoi(arg2);
            sscanf(buf, "first = %d", &n1);
            sscanf(p + 1, "second = %d", &n2);
        }

        /* Make the response body */
        // sprintf(content, "QUERY_STRING = %s", buf);
        sprintf(content, "Welcome to add.com: ");
        sprintf(content, "%sTHE Internet addition portal. \r\n<p>", content);
        sprintf(content, "%sThe answer is : %d + %d = %d\r\n<p>", content, n1, n2, n1 + n2);
        sprintf(content, "%sThanks for visiting!\r\n", content);

        /* Generate the HTTP response */
        printf("Connection: close\r\n");
        printf("Content-length: %d\r\n", (int)strlen(content));
        printf("Content-type: text/html\r\n\r\n");
        printf("%s", content);
        fflush(stdout);
        
        exit(0);
        }
        ```

### 11.11 문제 풀이
1. 문제
    - Tiny를 확장해서 HTTP HEAD 메소드를 지원하도록 하라.
    - TELNET을 웹 클라이언트로 사용해서 작업 결과를 체크하시오.<br><br>
2. HTTP HEAD 메서드
    - 문제를 풀기 전에 먼저 HTTP HEAD 메소드에 대해 알아보자.<br><br>
    - HEAD 메서드란?
        - 특정 리소스를 GET 메서드로 요청했을 때 돌아올 헤더 부분만를 요청
            - 이것이 GET 메서드와의 차이
            - 즉, GET과 동일한 응답을 요구하지만, 서버의 응답의 본문은 리턴되지 않고, HEAD값만 넘겨오기 때문에 GET 메서드보다 속도가 더 빠름
        - HEAD 메서드에 대한 응답은 본문을 가져선 안되며, 본문이 존재하더라도 무시해야 함
        - 그러나, 응답으로 받는 헤더에는 Content-Length처럼 본문 콘텐츠를 설명하는 개체 헤더는 포함할 수 있음
        - 이 때, 개체 헤더는 비어있어야 하는 HEAD의 본문과는 관련이 없고, GET 메서드로 동일한 리소스를 요청했을 때의 본문을 설명하는 것
        - HEAD 요청의 응답이 캐시했던 이전 GET 메서드의 응답을 유효하지 않다고 표시할 경우, 새로운 GET 요청을 생성하지 않더라도 캐시를 무효화 함<br><br>
    - HEAD 메서드는 왜 사용하는 것일까?🧐
        - HEAD 메서드는 종종 캐싱을 사용하는 클라이언트가 가장 최근에 접속한 이후로 문서가 바뀌었는지를 보기 위해 사용
        - 요청에 쓰인 하이퍼텍스트 링크(hypertext link), 타당성(validity), 접근성(accessibility), 최근 수정사항(recent modification)을 테스트하기 위해 사용<br><br>
    - 위 내용은 아래 사이트에서 참고하였음
        - https://developer.mozilla.org/ko/docs/Web/HTTP/Methods/HEAD<br><br>
3. HEAD 메서드를 사용하기 위해 수정된 tiny.c의 doit() 함수
    ```C
    void serve_static(int fd, char *filename, int filesize, char *method);
    void serve_dynamic(int fd, char *filename, char *cgiargs, char *method);

    ...

    if(!(strcasecmp(method, "GET") == 0 || strcasecmp(method, "HEAD") == 0)) {
        clienterror(fd, method, "501", "Not implemented", "Tiny does not implement this method");
        return;
    }

    ...

    serve_static(fd, filename, sbuf.st_size, method);

    ...

    serve_dynamic(fd, filename, cgiargs, method);
    ```
    - serve_static()과 serve_dynamic() 함수 정의에 method 포인터 변수 추가
    - doit() 함수에서 HEAD 메서드도 받을 수 있도록 추가
    - serve_static()과 serve_dynamic() 함수 수행 시, method 포인터 변수 인자 추가<br><br>
4. response header 부분만 보낼 수 있도록 수정된 정적인 파일을 제공해주는 serve_static() 함수
    ```C
    void serve_static(int fd, char *filename, int filesize, char *method)
    {
    int srcfd;
    char *srcp, filetype[MAXLINE],buf[MAXBUF];

    /* Send response headers to client */
    get_filetype(filename, filetype);
    sprintf(buf, "HTTP/1.1 200 OK\r\n");
    sprintf(buf, "%sServer : Tiny Web Server\r\n", buf);
    sprintf(buf, "%sConnection : close\r\n", buf);
    sprintf(buf, "%sContent-length : %d\r\n", buf, filesize);
    sprintf(buf, "%sContent-type : %s\r\n\r\n", buf, filetype);
    Rio_writen(fd, buf, strlen(buf));
    printf("Response headers : \n");
    printf("%s", buf);

    if(strcasecmp(method, "HEAD") == 0)
        return;

    /* Send response body to client */
    // if(strcasecmp(method, "GET") == 0) {
    //   srcfd = Open(filename, O_RDONLY, 0);
    //   srcp = Mmap(0, filesize, PROT_READ, MAP_PRIVATE, srcfd, 0);
    //   Close(srcfd);
    //   Rio_writen(fd, srcp, filesize);
    //   Munmap(srcp, filesize);
    // }

    /* Send response body to client */
    srcfd = Open(filename, O_RDONLY, 0);
    srcp = Mmap(0, filesize, PROT_READ, MAP_PRIVATE, srcfd, 0);
    Close(srcfd);
    Rio_writen(fd, srcp, filesize);
    Munmap(srcp, filesize);
    }
    ```
    - serve_static() 함수에서 method 포인터 변수를 인자로 받을 수 있도록 추가
    - response body를 HEAD메서드를 받았을 경우에만 전송할 수 있도록 추가해야하며, 두 가지 방법이 있음 
        - 인자로 method를 받도록 해주고, method가 HEAD일 경우 리턴
        - 인자로 method를 받도록 해주고, method가 GET일 때만 response body를 보낼 수 있도록 조건문 추가<br><br>
5. 요청 메서드를 cgi-bin/head-adder.c에 넘겨주기 위해 환경변수가 추가된 동적인 파일을 제공해주는 serve_dynamic() 함수
    ```C
    void serve_dynamic(int fd, char *filename, char *cgiargs, char *method)

    ...

    setenv("QUERY_METHOD", method, 1);

    ...
    ```
    - 요청 메서드를 cgi-bin/head-adder.c에 넘겨주기 위해 환경변수 추가<br><br>
6. HEAD 메서드일 경우에만 본문를 같이 출력할 수 있도록 수정된 head-adder 함수
    ```C
    char *buf, *p, *method;

    ...

    method = getenv("REQUEST_METHOD");

    ...

    if (strcasecmp(method, "HEAD") != 0)
    printf("%s", content);
  
    // if (strcasecmp(method, "GET") == 0) {
    //   printf("%s", content);
    // }

    ...
    ```
    - HEAD 메서드를 사용하기 위해 포인터 변수 추가
    - 환경 변수로 넣어둔 요청 메서드를 확인하기 위해 추가
    - 응답시 HEAD 메서드가 아닐 경우에만 본문을 같이 출력할 수 있도록 추가해야하며, 두 가지 방법이 있음
        - HEAD 메서드가 아닐 경우만 응답시 본문을 같이 출력
        - 메서드가 GET일 경우만 응답시 본문을 같이 출력<br><br>
7. 결과
    - 해당 결과는 정적일 때 테스트한 결과이다.<br><br>
    - GET 메서드 사용
        - 클라이언트 요청
            ```C
            GET / HTTP/1.1
            ```
        - 클라이언트 출력
            ```C
            HTTP/1.1 200 OK
            Server : Tiny Web Server
            Connection : close
            Content-length : 165
            Content-type : text/html

            <html>
                <head><title>Tiny Web Sever</title></head>
                <body>
                    <h2>Dave O'Hallaron</h2>
                    <img align="middle" src="godzilla.gif">
                </body>
            </html>Connection closed by foreign host.
            ```
    - HEAD 메서드 사용
        - 클라이언트 요청
            ```C
            HEAD / HTTP/1.1
            ```
        - 클라이언트 출력
            ```C
            HTTP/1.1 200 OK
            Server : Tiny Web Server
            Connection : close
            Content-length : 165
            Content-type : text/html

            Connection closed by foreign host.
            ```

## 2. 7주차 5일차를 마치며...
오늘은 CSAPP 11장 연습 문제를 집중적으로 풀었다.  
풀면서 시스템 콜 mmap()과 munmap() 함수, rio_readn()과 rio_writen() 함수, HTML form 태그와 HTTP HEAD 메서드에 대해 하나씩 파고들면서 추가로 학습했다.  
학습하다 보니 위와 같이 끝없이 공부해야 할 부분들이 많다...😂  
하지만, 오히려 집중적으로 깊게 공부할 기회가 되어서 좋았다.

내일은 구현한 echo, tiny 서버에 대해 주석 처리 및 남은 CSAPP 11장 읽고 정리하고, 추가로 Pintos 프로젝트 대비 12장 학습까지 할 계획이다.

요즘 집중력이 많이 떨어져서 다시 마음 다잡고 첫째도 집중! 둘째도 집중! 셋째도 집중!!!🔥