# WEEK09 DAY6 TIL

## 1. 오늘의 학습 목록
```
1. CPU Protection Ring 개념 학습
2. 핀토스에서 유저 프로그램이 시스템 콜을 호출하는 전체적인 과정 추가 보완
    - syscall_entry.S 파일이 호출되는 과정 추가 학습
3. 현재 핀토스 메모리 구성 확인
4. System Call 구현
    - syscall_handler() 기본 형식 switch 문으로 변경
    - 주소 값이 유저 영역에서 사용하는 주소 값인지 확인 하는 check_address() 함수 구현
    - HALT, EXIT 시스템 콜 함수 구현
5. 카이스트 권영진 교수님 OS 특강 내용 일부 정리
```

## 2. 9주차 6일차를 마치며...
오늘 팀원들과 학습하면서 새로운 사실을 알게 되어, 어제 학습한 핀토스에서 유저 프로그램이 시스템 콜을 호출하는 전체적인 과정 내용을 추가로 보완했다.
시스템 콜 구현을 위해 현재 핀토스에서 메모리가 어떻게 구성되어 있는지도 팀원들과 같이 학습하면서 파악했다.

현재 시스템 콜 구현 진행 상황은 주소 값이 유저 영역에서 사용하는 주소 값인지 확인하는 check_address() 함수와 HALT, EXIT 시스템 콜 함수를 구현했다.
앞으로 남은 프로젝트 기간동안 남은 시스템 콜 함수를 모두 구현해야 한다.

조금 미뤄뒀던 카이스트 권영진 교수님 OS 특강 내용도 반 정도 정리를 했고, 나머지 내용은 내일 정리할 계획이다.

내일 핀토스 프로젝트 과정 격려 차원에서 회식을 진행하는데 너무 기대된다~!🤩