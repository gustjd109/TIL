# Call by Value / Call by Reference
함수를 호출할 때, 함수에 인자를 넘겨주는 두 가지 방법이 있다.

## 1. Call by Value
- 아규먼트(argument)값을 파라미터(parameter)에 복사하여 넘겨주는 방식
    ```c
    int x = 2;

    // call by value
    void f(int v);
    f(x);   // 값을 인자에 전달
    ```
- 함수 내부에서 파라미터값을 수정하더라도 아규먼트에는 전혀 영향이 없음
    ```c
    #include <stdio.h>
        
    void swap(int x, int y) {
            
        int temp;
 
        temp = x;
        x = y;   
        y = temp;
   
        return;
    }
  
    int main () {

        int a = 100;
        int b = 200;
  
        printf("swap전, a : %d\n", a );
        printf("swap전, b : %d\n", b );
  
        // call by value로 함수호출
        swap(a, b);
  
        printf("swap후, a : %d\n", a );
        printf("swap후, b : %d\n", b );
  
        return 0;
    }
 
    >>> 실행결과
    swap전, a : 100
    swap전, b : 200
    swap후, a : 100
    swap후, b : 200
    ```

## 2. Call by Reference
- 아규먼트(argument)의 주소값을 파라미터(parameter)에 복사하여 넘겨주는 방식
    ```c
    int x = 2;

    // call by reference
    void f(int* v);
    f(&x);  // 주소를 인자에 전달
    ```
- 주소가 넘어갔으므로, 함수내부에서 파라미터가 가르키고 있는 주소의 내용을 변경하면, 아규먼트에 영향을 줌
    ```c
    #include <stdio.h>
  
    void swap(int* x, int* y) {
 
        int temp;
 
        temp = *x; 
        *x = *y;   
        *y = temp; 
   
        return;
    }
  
    int main () {

        int a = 100;
        int b = 200;
  
        printf("swap전, a : %d\n", a );
        printf("swap전, b : %d\n", b );
  
        // call by reference로 함수 호출
        swap(&a, &b);
  
        printf("swap후, a : %d\n", a );
        printf("swap후, b : %d\n", b );
  
        return 0;
    }
 
    >>> 실행결과
    swap전, a : 100
    swap전, b : 200
    swap후, a : 200
    swap후, b : 100
    ```