# WEEK10 DAY2 TIL

## 1. 오늘의 학습 목록
```
1. System Call 구현
    - CREATE, REMOVE, OPEN, FILESIZE, SEEK, TELL, CLOSE 시스템 콜 구현
    - add_file_to_fdt(), find_file_by_fd(), remove_file_from_fdt() 함수 구현
2. 지금까지 System Call 구현한 내용 정리
```

## 2. 10주차 2일차를 마치며...
오늘은 가장 구현하기 어려운 FORK, WAIT를 제외한 나머지 시스템 콜 함수들을 먼저 구현했다.  
파일 관련 시스템 콜 함수들은 카이스트 핀토스 PPT와 GitBook에 나와 있는 구현 방법대로 했을 때 어려움 없이 구현할 수 있었다.  
하지만, 함수 종류가 많다 보니 구현을 마치고 지금까지 진행한 내용을 정리하니 시간이 벌써 새벽 4시 30분이었고, 프로젝트2 마지막 날인 내일을 위해 기숙사로 복귀했다.

내일은 가장 구현하기 어렵다는 FORK 시스템 콜을 시작으로 WAIT, READ, WRITE 함수를 구현하고, 프로젝트2를 마무리할 계획이다.

진짜 요즘 체력적으로 너무 힘들어서 몸 관리를 더 철저하게 해야 할 것 같다...🫠