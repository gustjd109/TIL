# WEEK08 DAY4 TIL
- 오늘의 학습 목록
```
1. PintOS GitBook 읽기(Appendix Synchronization)
2. PintOS Priority Scheduling 구현 및 기존 함수 수정
    - cmp_priority() 함수 구현
    - test_max_priority() 함수 구현
    - thread_create() 함수 수정
    - thread_unblock() 함수 수정
    - thread_yield() 함수 수정
    - thread_set_priority() 함수 수정
```

## 8주차 4일차를 마치며...
오늘은 PintOS 프로젝트1의 두 번째 과제를 시작했다.  
두 번째 과제의 목표는 FIFO 스케줄링(=라운드 로빈 스케줄링)으로 구현되어 있는 스케줄러를 우선순위 스케줄링 방식으로 재구현하는 것이다.  
먼저 과제를 해결하기 위해 GitBook 추가 내용을 학습하고, 구현 및 기존 함수를 수정했다.  
함수 수정 및 구현은 어렵지 않게 할 수 있었고, 다행히 문제없이 테스트 케이스를 통과할 수 있었다.😙  
내일은 두 번째 과제에서 좀 더 나아가 동기화 부분을 해결하기 위해 학습하고, 구현을 진행할 계획이다.