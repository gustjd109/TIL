# WEEK05 DAY5 TIL
오늘은 어제에 이어서 레드 블랙 트리의 회전, 노드 찾기, 최대값 노드 찾기, 최소값 노드 찾기와 삭제 기능을 구현했다.

## 1. left_rotate(), right_rotate() 구현 - 노드 삽입 후 불균형 복구에 사용되는 함수
- 삽입 과정에서 회전을 해주는 이유
    - 부모 노드가 할아버지 노드의 왼쪽/오른쪽 자녀 & 삽입 노드가 부모 노드의 왼쪽/오른쪽 자녀인 경우인 CASE 2(오른쪽으로 꺽인 형태)를 해결하기 위함
    - 부모 노드 기준으로 왼쪽/오른쪽 회전을 통해 꺽인 형태를 펴서 CASE 3의 형태로 만들어 주기 위함
    - 펴진 CASE 3에서 다시 할아버지 노드를 기준으로 왼쪽/오른쪽 회전을 통해 불균형을 해결함
- 소스 코드
    ```c
    /* 왼쪽 회전 함수 */
    void left_rotate(rbtree *t, node_t *x) {
        node_t *y = x->right;
        x->right = y->left;

        if(y->left != t->nil) {
            y->left->parent = x;
        }

        y->parent = x->parent;

        if(x->parent == t->nil) {
            t->root = y;
        }
        else if(x == x->parent->left) {
            x->parent->left = y;
        }
        else {
            x->parent->right = y;
        }

        y->left = x;
        x->parent = y;
    }

    /* 오른쪽 회전 함수 */
    void right_rotate(rbtree *t, node_t *x) {
        node_t *y = x->left;
        x->left = y->right;

        if(y->right != t->nil) {
            y->right->parent = x;
        }

        y->parent = x->parent;

        if(x->parent == t->nil) {
            t->root = y;
        }
        else if(x == x->parent->left) {
            x->parent->left = y;
        }
        else {
            x->parent->right = y;
        }

        y->right = x;
        x->parent = y;
    }
    ```

## 2. rbtree_find() 구현 - 키에 해당하는 노드 반환 함수
- 구현 과정
    - 이진 검색 트리에서 찾고자하는 키의 노드를 찾는 방법과 동일
    - 루트 노드부터 사작하여 루트 노드의 왼쪽, 오른쪽 값과 비교하면서 찾고자하는 키 값의 노드를 찾기 위해 탐색
- 소스코드
    ```c
    /* 키에 해당하는 노드 반환 함수 */
    node_t *rbtree_find(const rbtree *t, const key_t key) {
        // 루트 노드부터 시작하여 루트 노드의 왼, 오른쪽 값과 비교하면서 찾고자하는 키 값의 노드 탐색
        node_t *current = t->root;

        while(current != t->nil) {
            if(key == current->key) {
            return current;
            }
            else {
                current = (key < current->key) ? current->left : current->right;
            }
        }
        return NULL;
    }
    ```

## 3. rbtree_min(), rbtree_max() 구현 - 트리의 최대, 최소값 탐색 함수
- 구현 과정
    - 트리의 최대, 최소값 찾는 방식 또한, 이진 검색 트리에서 사용하는 방법과 동일
    - 최대값은 트리외 오른쪽 서브 트리의 마지막 값을, 최소값은 트리의 왼쪽 서브 트리의 마지막 값을 찾기 위해 탐색
- 소스코드
    ```c
    /* 트리 최소값 탐색 함수 */
    node_t *rbtree_min(const rbtree *t) {
        // 트리의 왼쪽 서브 트리의 마지막 값 탐색
        node_t *current = t->root;

        while(current->left != t->nil) {
            current = current->left; 
        }
        return current;
    }

    /* 트리 최대값 탐색 함수 */ 
    node_t *rbtree_max(const rbtree *t) {
        // 트리의 오른쪽 서브 트리의 마지막 값 탐색
        node_t *current = t->root;
  
        while(current->right != t->nil) {
            current = current->right;
        }
        return current;
    }
    ```

## 4. rbtree_erase(), rbtree_erase_fixup() 구현 - 노드 삭제 및 삭제 후 불균형 복구 함수
- 두 기능 모두 구현했지만, 오류 발생으로 인해 수정 진행 중

## 5. 5주차 5일차를 마치며...
삭제 기능을 알고리즘 책에 슈도 코드를 보고 구현했지만, 오류가 발생했다.

노드 삽입 부분에서는 노드들을 삽입한 후 트리가 균형 있게 잘 만들어지지 않은 경우, 삭제 부분에서는 successor 노드를 구하는 기능이 제대로 구현되지 못했을 경우와 삽입과 삭제에서 오타가 있을 경우에 문제가 발생했을 것이라고 판단했다.

오류를 해결하기 위해 계속 코드를 수정하고 혹시 빼먹은 부분이 없는지 슈도 코드를 보면서 기존 코드와 비교했다.
하지만, 결국 해결하지 못하고 너무 피곤해서 3시 넘어서 기숙사로 돌아왔다.

내일 아침에 맑은 정신으로 다시 보면서 오류를 해결해야겠다...

I will find you, and I will fix you!!!🔥