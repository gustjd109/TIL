# WEEK05 DAY4 TIL
간단하게 오전에는 백준 2752번 세수정렬, 2480번 주사위 세개 문제를 풀었다.
2480번은 엄청 간단한 기본 문제였는데 이전에 풀었던 어려운 문제들을 다루다 보니 너무 복잡하게 생각해서 접근 방법이나 풀이를 바로 못 했다...
알고봤더니 정말 간단하게 if 문을 여러 개 사용하면 쉽게 풀 수 있는 문제였다.

오늘부터 레드 블랙 트리 구현을 시작했고, nil 노드 생성 및 초기화 구현 완료 및 노드 삽입 기능을 구현 중이다.
우선 노드 삽입 기능 함수와 노드 삽입 후, 불균형 복구 기능 함수까지는 구현을 완료하였다. 내일부터 불균형 복구를 진행하면서 추가로 진행하는 회전 기능 함수와 나머지 기능을 구현할 예정이다.

## 1. new_tree() 구현 - nil 노드 생성 및 초기화
- 구현 과정
    - 트리 구조체 동적 할당
        - 여러 개의 tree를 생성할 수 있어야 하며 각각 다른 내용들을 저장할 수 있어야 한다.
    - nil 노드 생성 및 초기화
    - nil 노드 색 검은색으로 정의
        - 레드 블랙 트리의 속성 3에 의해 모든 nil 노드의 색은 블랙이어야 한다.
    - 트리의 nil과 root를 nil 노드로 설정
        - 트리가 빈 경우에는 root는 nil 노드여야 한다.
- 소스코드
    ```c
    // 새 트리 생성 함수
    rbtree *new_rbtree(void) {
        rbtree *p = (rbtree *)calloc(1, sizeof(rbtree)); // tree의 구조체 동적 할당
        node_t *nil_node = (node_t *)calloc(1, sizeof(node_t)); // nil 노드 생성 및 초기화

        nil_node->color = RBTREE_BLACK; // nil 노드의 색 정의
        p->nil = p->root = nil_node; // tree의 nil과 root에 nil 노드로 설정

        return p;
        }
    ```

## 2. rbtree_insert() 구현 - 노드 삽입 함수
- 구현 과정
    - 삽입할 새 노드 생성 및 동적 할당
    - 삽입할 새 노드 설정
        - 삽입할 새 노드에 입력받은 키 값 삽입
        - 삽입되는 새 노드의 색은 항상 레드이므로 색을 레드로 설정
        - 삽입할 새 노드의 왼쪽과 오른쪽 자식을 nil 노드로 설정
    - 새 노드를 삽입할 위치를 찾기 위한 포인터 변수 생성
    - 노드를 삽입할 위치 탐색
        - 트리가 비어 있는 경우, 삽입할 노드를 루트 노드로 설정
        - 트리가 비어 있지 않은 경우
            - 삽입할 노드의 값의 현재 노드의 값보다 작으면, 삽입할 노드를 현재 노드의 왼쪽 서브 트리에 삽입
            - 위와 반대면, 오른쪽 서브 트리에 삽입
    - 삽입할 노드의 위치를 찾았으면, 삽입한 노드를 현재 위치 노드로 설정
        - 삽입한 노드가 트리의 마지막 노드가 됨
    - 노드 삽입 후, 불균형 복구 기능 함수 수행
- 소스코드
    ```c
    // 노드 삽입 함수
    node_t *rbtree_insert(rbtree *t, const key_t key) {
        node_t *new_node = (node_t *)calloc(1, sizeof(node_t)); // 새 노드 생성 및 동적 할당

        new_node->key = key; // 새 노드의 값을 입력 값으로 설정
        new_node->color = RBTREE_RED; // 노드 삽입 규칙에 의해 새 노드의 색을 레드로 설정
        new_node->left = new_node->right = t->nil; // 새 노드의 왼쪽, 오른쪽 자식을 nil 노드로 설정

        // 노드를 삽입할 위치 탐색
        node_t *current = t->root; // 노드를 삽입할 위치를 찾기 위해 현재 위치 노드를 루트 노드로 설정한 포인트 변수 생성
 
        if(current == t->nil) { // 트리가 비어 있는 경우
            t->root = new_node; // 삽입할 노드를 루트 노드로 설정
            new_node->parent = t->nil;
        }
        else {
            while(current != t->nil) { // 트리가 비어있지 않은 경우
                if(key < current->key) { // 삽입할 노드의 값이 현재 노드의 값보다 작으면, 삽입할 노드를 현재 노드의 왼쪽 서브 트리에 삽입하는 경우
                    if(current->left == t->nil) { // 현재 위치 노드의 왼쪽 자녀가 nil 노드인 경우
                        current->left = new_node; // 현재 위치 노드의 왼쪽 자녀로 노드 삽입
                        break; // 노드를 삽입할 위치를 찾았으므로 if문 탈출
                    }
                    current = current->left; // 현재 위치 노드의 왼쪽 자녀가 nil 노드가 아닌 경우, 현재 위치 노드를 현재 위치 노드의 왼쪽 자녀로 설정
                }
                else { // 삽입할 노드의 값이 현재 노드의 값보다 크면, 삽입할 노드를 현재 노드의 오른쪽 서브 트리에 삽입하는 경우
                    if(current->right == t->nil) { // 현재 위치 노드의 오른쪽 자녀가 nil 노드인 경우
                        current->right = new_node; // 현재 위치 노드의 오른쪽 자녀로 노드 삽입
                        break; // 노드를 삽입할 위치를 찾았으므로 if문 탈출
                    }
                    current = current->right; // 현재 위치 노드의 오른쪽 자녀가 nil 노드가 아닌 경우, 현재 위치 노드를 현재 위치 노드의 오른쪽 자녀로 설정
                }
            }
            new_node->parent = current; // 삽입한 노드의 부모 설정
        }
        rbtree_insert_fixup(t, new_node); // 노드 삽입 후 불균형 복구 수행

        return new_node;
        }
        ```

## 3. rbtree_insert_fixup() - 노드 삽입 후 불균형 복구 함수
- 구현 과정
    - 삽입한 노드의 부모, 할아버지, 삼촌 노드 포인터 변수 생성 및 설정
    - CASE 1 : 부모 노드와 삼촌 노드의 색이 레드인 경우
        - 부모와 삼촌 노드의 색을 블랙으로 변경, 할아버지 노드의 색을 레드로 변경
    - CASE 2 : 삼촌 노드의 색이 블랙이고, 부모 노드가 할아버지 노드의 왼쪽/오른쪽 자녀이고, 삽입한 노드가 부모 노드의 왼쪽/오른쪽 자녀인 경우
        - 왼쪽 회전 수행 또는 부모 노드의 색을 블랙으로 변경 + 할아버지 노드의 색을 레드로 변경한 후, 오른쪽 회전 수행
- 소스코드
    ```c
    // 노드 삽입 후 불균형 복구 함수
    void rbtree_insert_fixup(rbtree *t, node_t *node) {
        node_t *uncle; // 삽입한 노드의 부모의 형제 노드(삼촌) 설정

        while(node->parent->color == RBTREE_RED) { // 삽입한 노드의 부모 노드의 색이 레드인 경우
            node_t *parent = node->parent; // 삽입한 노드의 부모 노드 설정
            node_t *grand_parent = parent->parent; // 삽입한 노드의 부모의 부모 노드(할아버지) 설정
            // 삽입한 노드의 부모 노드가 할아버지 노드의 오른쪽 자녀이면, 삼촌 노드를 할아버지 노드의 왼쪽 자녀로 설정
            // 삽입한 노드의 부모 노드가 할아버지 노드의 왼쪽 자녀이면, 삼촌 노드를 할아버지 노드의 오른쪽 자녀로 설정
            uncle = ((parent == grand_parent->right) ? grand_parent->left : grand_parent->right);
            if(uncle == grand_parent->right) { // 삼촌 노드가 할아버지 노드의 오른쪽 자녀인 경우
                // CASE 1 : 부모 노드와 삼촌 노드의 색이 레드인 경우
                if(uncle->color == RBTREE_RED) {
                    parent->color = uncle->color = RBTREE_BLACK; // 부모와 삼촌 노드의 색을 블랙으로 변경
                    grand_parent->color = RBTREE_RED; // 할아버지 노드의 색을 레드로 변경
                    node = grand_parent; // 할아버지 노드가 루트 노드가 아니고, 할아버지 노드 위에 색이 레드인 노드가 있다면 연속적인 레드가 오기 때문에 속성 4를 위반하므로 노드의 위치를 할아버지 노드로 설정
                }
                else { // 삼촌 노드의 색이 블랙인 경우
                    // CASE 2 : 삼촌 노드의 색이 블랙 & 부모 노드가 할아버지 노드의 왼쪽 자녀 & 삽입한 노드가 부모 노드의 오른쪽 자녀인 경우
                    if(node == parent->right) {
                        left_rotate(t, node); // 왼쪽 회전 수행
                    }
                    // CASE 3 : 삼촌 노드의 색이 블랙 & 부모 노드가 할아버지 노드의 왼쪽 자녀 & 삽입한 노드가 부모 노드의 왼쪽 자녀인 경우
                    else {
                        parent->color = RBTREE_BLACK; // 부모 노드의 색을 블랙으로 변경
                        grand_parent->color = RBTREE_RED; // 할아버지 노드의 색을 레드로 변경
                        right_rotate(t, parent); // 오른쪽 회전 수행
                    }
                }
            }
            else { // 삼촌 노드가 할아버지 노드의 왼쪽 자녀인 경우
                // CASE 1 : 부모 노드와 삼촌 노드의 색이 레드인 경우
                if(uncle->color == RBTREE_RED) {
                parent->color = uncle->color = RBTREE_BLACK; // 부모와 삼촌 노드의 색을 블랙으로 변경
                grand_parent->color = RBTREE_RED; // 할아버지 노드의 색을 레드로 변경
                node = grand_parent; // 할아버지 노드가 루트 노드가 아니고, 할아버지 노드 위에 색이 레드인 노드가 있다면 연속적인 레드가 오기 때문에 속성 4를 위반하므로 노드의 위치를 할아버지 노드로 설정
                }
                else { // 삼촌 노드의 색이 블랙인 경우
                    // CASE 2 : 삼촌 노드의 색이 블랙 & 부모 노드가 할아버지 노드의 오른쪽 자녀 & 삽입한 노드가 부모 노드의 왼쪽 자녀인 경우
                    if(node == parent->left) { // 삽입한 노드가 부모 노드의 왼쪽 자녀인 경우
                        right_rotate(t, node); // 오른쪽 회전 수행
                    }
                    // CASE 3 : 삼촌 노드의 색이 블랙 & 부모 노드가 할아버지 노드의 오른쪽 자녀 & 삽입한 노드가 부모 노드의 오른쪽 자녀인 경우
                    else {
                        parent->color = RBTREE_BLACK; // 부모 노드의 색을 블랙으로 변경
                        grand_parent->color = RBTREE_RED; // 할아버지 노드의 색을 레드로 변경
                        left_rotate(t, parent); // 왼쪽 회전 수행
                    }
                }
            }
        }
        t->root->color = RBTREE_BLACK; // 루트 노드의 색을 블랙으로 변경
    }
    ```

## 4. 5주차 4일차를 마치며...
레드 블랙 트리 노드 삽입 기능을 다 끝내고 가고 싶어서 계속하다 보니 새벽 5시가 됐다...
그래도 구현하면서 이번 주 과제의 목표인 C언어, 특히 포인터와 메모리 할당 및 해제 개념 및 사용법을 예전보다 많이 배울 수 있는 시간이었다.
학부 때는 정말 포인터를 공부하다가 너무 어렵고 이해하기가 힘들어서 포기했었는데, 지금은 짧은 기간 동안 해야 된다는 압박과 책임감 때문인지 스스로 공부하고 구현하게 되는 것 같다.
물론, 아직 최대값, 최소값, 키 값 찾기와 노드 삭제, 메모리 할당 해제 등 구현해야 할 많은 기능이 있지만 끝까지 꼭 구현할 수 있도록 할 것이다.