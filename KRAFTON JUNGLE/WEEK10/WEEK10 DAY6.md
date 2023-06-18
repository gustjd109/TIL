# WEEK10 DAY6 TIL

## 1. 오늘의 학습 목록
```
1. 핀토스 프로젝트3 Supplemental Page Table 구현
    - supplementary page table에서 va에 해당하는 구조체 페이지를 찾아 반환하는 spt_find_page() 함수 구현
    - 페이지를 유효성 검사를 수행하여 supplemental page talbe에 삽입하는 spt_insert_page() 함수 구현
2. 핀토스 프로젝트3 Frame Table 구현
    - Frame 구조체에 프레임 리스트 추가
    - user pool에서 새로운 physical page를 가져와서 새로운 frame 구조체에 할당해서 반환하는 vm_get_frame() 함수 구현
    - 새 프레임을 가져와서 페이지와 매핑하는 vm_do_claim_page() 함수 구현
    - Supplemental page table에서 va에 해당하는 페이지를 가져와 프레임과 매핑을 요청하는 함수
3. 백준 알고리즘 문제 풀이
    - 1406번 에디터 문제 풀이
```

## 2. 10주차 6일차를 마치며...
어제에 이어서 supplemental page table 구현은 완료하고, frame table 구현을 시직했다.  
깃북과 PPT를 기반으로 구현을 했지만, 이전 프로젝트와는 다르게 테스트하면서 진행 내용을 확인할 수 없어 제대로 구현이 된 것이지 잘 모르겠다.  
아마, anonymous page까지 구현해야지 테스트가 가능한 것 같다.

내일은 구현한 내용 주석 처리 및 anonymous page 구현을 시작할 계획이다.