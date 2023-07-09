# JavaScript에서 DOM으로 작업하기(브라우저 HTML 코드)

## 1. DOM(Document Object Model)
1. DOM이란?
    - 브라우저는 자바스크립트가 이용할 수 있는 기능들인 API를 제공한다.
    - 따라서, 자바스크립트가 브라우저와 상호작용할 수 있게 된다.
    - 브라우저가 기능을 노출해서 자바스크립트가 렌더링된 HTML 코드와 상호작용하게 하며, 이것을 문서 객체 모델(DOM, Document Object Model)이라고 한다.
    - 즉, DOM은 로드 및 렌더링된 HTML 코드이며 정확히 말하면, 자바스크립트와 이용할 수 있는 브라우저가 배후에서 만든 코드를 나타내 주는 것이다.

## 2. DOM 쿼리 방법
1. 요소 또는 노드에 퀴리하는 방법
    - HTML 페이지, 즉 DOM 내에서 렌더링된 HTML 페이지인 콘텐츠를 쿼리하기 위한 몇 가지 메서드가 있다.
        - querySelector() & getElementById()
            - 한 번에 하나의 요소를 선택한다.
            - 단일 요소에 액세스할 수 있는데 이 메서드들은 그저 요소를 쿼리하는 다른 방법들일 뿐이다.
            - getElementById()는 HTML 요소에 할당되었을 ID를 가지고 요소를, querySelector()는 DOM 페이지에서 맨 처음 일치하는 요소로 액세스한다.
        - querySelectorAll() & getElementsByTagName()
            - 다중 요소를 선택한다.
            - 배열 객체인 요소의 집합을 반환한다.
            - 일반적으로 NodeList를 반환하는데 실제 배열이 아닌 유사 배열 객체로써 배열의 특정 동작만을 지원한다.
            - querySelectorAll()는 선택자와 일치하는 모든 요소를, getElementsByTagName()는 특정 HTML 태그가 있는 모든 요소를 제공한다.

## 3. 노드 & 요소
1. 노드란?
    - DOM을 구성하는 객체이며 DOM은 모두 노드로 이루어져 있다.<br><br>
2. 요소란?
    - 요소 노드와 같다.
    - 렌더링된 HTML의 태그에서 생성된 노드이며, 내부에는 텍스트가 없다.
    - 요소와 상호 작용하고, 요소의 스타일 및 콘텐츠 등을 변경할 때 사용할 수 있는 메서드가 있다.

## 4. DOM 트래버싱
1. DOM 트래버싱이란?
    - querySelector 등을 사용하여 관심 있는 모든 요소를 수동으로 선택하는 게 아니라 이미 선택한 요소를 이용해서 이 요소를 기반으로 자식 혹은 형제 요소 등으로 옮겨 갈 수 있는 것이다.<br><br>
2. 자식 노드 탐색
    - children & childNodes
        - children의 경우 자식 요소 노드만을 선택하고, childNodes는 택스트 노드(공백 포함)를 포함한다.
    - firstElementChild & lastElementChild
        - 첫 번째와 마지막 번째 요소의 자식 노드를 얻을 수 있다.<br><br>
3. 부모 노드 탐색
    - parentNode & parentElement<br><br>
4. 형제 노드 탐색
    - previousSibling & previousElementSibling / nextSibling & nextElementSibling

## 5. 새로운 요소 생성 및 삽입
1. 새로운 요소 생성 방법
    - createElement() : 새로운 노드를 생성해 문서 어딘가에 수동으로 삽입할 수 있는 메서드이다.
    - insertAdjacentHTML() & insertAdjacentElement() : 콘텐츠를대체하는 대신 렌더링 된 HTML 콘텐츠를 기존의 콘텐츠 옆에 추가하고자 할 때 사용할 수 있는 메서드이다.<br><br>
2. 생성한 요소 삽입 방법
    - appendChild() / append() : 생성한 요소를 삽입할 수 있는 메서드이다.
    - prepend(), before(), after(), insertBefore() : 기존 노드 리스트 끝에 삽입하는 대신 원하는 특정 위치에 삽입할 수 있는 메서드이다.
    - replaceChild(), replaceWith() : 기존의 노드를 변경할 수 있는 메서드이다.<br><br>
3. 노드 복사 방법
    - cloneNode()
        - 노드를 복제해서 새로운 노드를 반환하는 것이며, 참이나 거짓이 되는 불리언이라는 1개의 선택적 인수를 취한다.
        - 기본값은 거짓이며, 깊은 복제 여부만 결정한다.
        - 따라서, 자식 요소와 자손 요소로 실행되거나 실행되지 않는다.<br><br>
4. 노드 삭제 방법
    - remove(), removeChild()