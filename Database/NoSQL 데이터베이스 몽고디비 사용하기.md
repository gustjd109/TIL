# NoSQL 데이터베이스 몽고디비 사용하기

## 1. 데이터베이스
1. 데이터베이스란?
    - 데이터를 체계화하여 관리하는 데이터의 집합 또는 해당 작업을 수행하는 응용 프로그램이다.<br><br>
2. 데이터베이스 기본 용어
    - 테이블
        - 특정 주제에 대한 행과 열로 이루어진 데이터의 모음이다.
    - 로우(행)
        - 관계형 데이터베이스의 테이블에서 단일 구조 데이터 항목을 의미하며, 레코드라고도 한다.
    - 컬럼(열)
        - 관계형 데이터베이스의 테이블에서 특정한 자료의 값 혹은 테이블에서의 열을 의미한다.
    - 기본키(프라이머리키)
        - 중복된 값을 가질 수 없다.
        - 데이터를 식별하는데 필요한 키다.
    - 외래키(포린키)
        - 두 테이블을 연결하는데 필요한 키다.
    - RDB
        - 관계형 데이터베이스라고 하며, 모든 데이터를 2차원 테이블에 저장한다.
        - 서로 다른 테이블 간에 조인 혹은 외래키로 관계를 맺을 수 있다.
    - 스키마
        - 데이터베이스 테이블의 명세를 기술한 데이터이다.
        - 예를 들어, user라는 테이블을 생성 시 해당 테이블에는 문자열 20자 user_name, 숫자 4자리 age 등과 같은 정보가 필요하며, 이런 정보를 정의한 것을 스키마라고 한다.
    - 모델
        - 데이터베이스의 특정 테이블과 테이블에 있는 컬럼들의 형태를 정의한 클래스이다.
        - user 테이블에 대하여 모델을 만든다면 User 클래스를 만들고, 변수로 String userName, int age를 선언해야 한다.
    - 컬렉션
        - 몽고디비에서 사용하는 용어로, 도큐먼트의 집합을 컬렉션이라고 한다.
        - 관계형 데이터베이스의 테이블과 동일한 의미로 사용한다.
    - 조인
        - 두 개 이상의 테이블 또는 컬렉션을 조합하여 데이터를 보여주기 위한 기법이다.
    - 트랜잭션
        - 데이터 변경을 수행하는 작업 단위이다.
    - 클러스터
        - 데이터 처리량을 높일 목적으로 데이터를 여러 서버(샤드)에 저장하는 기법이다.
    - 샤드
        - 큰 데이터베이스를 작은 단위로 분할하는 기능이다.
        - 데이터베이스를 작은 단위로 분할하여 노드(데이터를 가지고 있는 서버)에 분산시켜 저장할 수 있다.
        - 대규모 데이터베이스를 다루는 시스템에서 성능과 확장성을 향상시킬 수 있다.

## 2. 몽고디비
1. 몽고디비란?
    - NoSQL 데이터베이스이다.
    - NoSQL 데이터베이스는 데이터 모델에 따라 키-밸류, 컬럼, 도큐먼트, 그래프 타입으로 분류할 수 있다.
        - 몽고디비는 도큐먼트 타입이다.<br><br>
2. NoSQL 데이터베이스 타입 정리
    - 키-밸류 타입 : 키를 기준으로 데이터를 조회하고 값으로 데이터를 저장한다.
    - 도큐먼트 타입 : JSON과 유사한 형식의 객체를 담은 데이터를 저장한다.
    - 그래프 타입 : 노드를 사용하여 데이터를 저장하고, 에지를 사용해 데이터 관계를 저장한다.<br><br>
3. 몽고디비 특징
    - 몽고디비에서 문서는 BSON이라는 데이터 포맷이다.
        - BSON(Binary JSON)
            - JSON을 바이너리 형식으로 저장한 형태이다.
            - 기존 JSON에서 지원하지 않는 자료형인 Data(날짜와 시간을 표현하는 자료형)와 BinData(바이너리데이터이며 바이트의 배열로 표현) 타입을 지원한다.
            - JSON과 비슷한 형태이므로 이해하기 쉽고, 바이너리로 저장하기 때문에 용량이 문자열보다는 작고 성능이 좋다.
    - 따라서 자바스크립트와 호환성이 좋다.
    - 데이터를 조회할 때 사용하는 쿼리는 자바스크립트를 사용한다.<br><br>
    - 장점
        - 스키마를 지정하지 않아도 되므로 데이터 저장의 유연성이 있음
            - 즉, 모델에 필드를 추가할 때 DB에서는 추가로 할 일이 없음
        - 단일 문서 검색시 여러 테이블을 조인하는 것보다 빠른 경우가 많음
        - 클러스터를 지원해주기 때문에 스케일아웃이 쉬움
        - 다른 NoSQL 대비 인덱스 지원이 잘되어 있음<br><br>
    - 단점
        - 메모리를 많이 사용함
        - 디스크 저장 공간을 RDB에 비해 많이 씀
        - 복잡한 조인은 사용하기 힘듬
        - 트랜잭션 지원이 RDB에 비해 약함<br><br>
4. 몽고디비 아틀라스 설치 및 연결
    - 몽고디비 아틀라스 연결 소스 코드
        ```js
        const { MongoClient } = require('mongodb');
        const uri = "mongodb+srv://<username>:<password>@cluster0.c81cval.mongodb.net/?retryWrites=true&w=majority";

        const client = new MongoClient(uri);

        async function run() {
            await client.connect();
            const adminDB = client.db('test').admin();
            const listDatabases = await adminDB.listDatabases();
            console.log(listDatabases);
            return "OK";
        }

        run()
            .then(console.log)
            .catch(console.error)
            .finally(() => client.close());
        ```
        - 몽고디비 아틀라스를 설치하고, 연결을 클릭하면 애플리케이션에서 연결할 수 있도록 소스 코드를 알려준다.
        - 해당 코드를 생성한 js파일에 복사하여 실행시키면 된다.<br><br>
    - 몽고디비 아틀라스 연결 결과
        ```js
        {
        databases: [
            { name: 'admin', sizeOnDisk: 286720, empty: false },
            { name: 'local', sizeOnDisk: 2505355264, empty: false }
        ],
        totalSize: 2505641984,
        totalSizeMb: 2389,
        ok: 1,
        '$clusterTime': {
            clusterTime: new Timestamp({ t: 1689422868, i: 3 }),
            signature: {
            hash: Binary.createFromBase64("EiayljSBs62zGhLu3PvHfcWjIk8=", 0),
            keyId: new Long("7206369057220591618")
            }
        },
        operationTime: new Timestamp({ t: 1689422868, i: 3 })
        }
        OK
        ```

## 3. 몽고디비 CRUD(Create Read Update Delete) API 만들기
1. 몽고디비 CRUD 예제 소스 코드
    ```js
    const { MongoClient, ServerApiVersion } = require('mongodb');
    const uri = "mongodb+srv://<username>:<password>@cluster0.c81cval.mongodb.net/test?retryWrites=true&w=majority";

    // MongoClient 생성
    const client = new MongoClient(uri, {
        serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
        }
    });

    async function main() {
        try {
            // 커넥션을 생성하고 연결 시도
            await client.connect();

            console.log('MongoDB 접속 성공');

            // test 데이터베이스의 person 컬렉션 가져오기
            const collection = client.db('test').collection('person');

            // 문서 하나 추가
            await collection.insertOne({ name: 'Andy', age: '30'});
            console.log('문서 추가 완료');

            // 문서 찾기
            const documents = await collection.find({ name: 'Andy' }).toArray();
            console.log('찾은 문서:', documents);

            // 문서 갱신하기
            await collection.updateOne({ name: 'Andy' }, { $set: { age: 31 } });
            console.log('문서 업데이트');

            // 갱신된 문서 확인하기
            const updatedDocuments = await collection.find({ name: 'Andy' }).toArray();
            console.log('갱신된 문서:', updatedDocuments);

            // 문서 삭제하기
            // await collection.deleteOne({ name: 'Andy'});
            // console.log('문서 삭제');

            // 연결 끊기
            await client.close();
        } catch (err) {
            console.log(err);
        }
    }

    main();
    ```
    - 데이터베이스에서 문서를 추가, 찾기, 갱신, 갱신 확인, 삭제 결괏값을 확인할 수 있다.

## 4. 몽구스를 이용해 CRUD 만들기
1. 몽구스(Mongoose)란?
    - 네이티브 드라이브인 mongoDB 패키지보다 조금 더 편리한 기능을 제공하는 라이브러리다.
    - 대표적으로 객체를 도큐먼트로 매핑하는 기능이 있다.
    - 따라서, ODM(Object Document Mapper)라고도 한다.
    - 몽고디비 자체에는 스키마를 지정하는 기능은 없지만, 몽구스를 사용하면 스키마를 지정할 수 있다.
    - 스키마가 있으므로 필드 타입 지정 및 유효성 검증 등을 추가로 편하게 할 수 있다.<br><br>
2. 몽구스로 스키마 만들기
    - 스키마는 Schema의 인스턴스로 만들 수 있다.
    - 기존 몽고디비 예제에서 사용했던 Person 객체를 스키마로 생성
        - 스키마는 컬렉션과 매핑된다.
        - Person 모델 생성
            ```js
            var mongoose = require('mongoose');
            var Schema = mongoose.Schema;

            const personSchema = new Schema({ // 스키마 객체 생성
                name: String,
                age: Number,
                email: { type: String, required: true },
            });

            module.exports = mongoose.model('Person', personSchema); // 모델 객체 생성
            ```
            - 스키마 객체를 생성하고, 몽구스 모델 객체를 생성한다.
            - 몽구스 모델은 몽고디비 컬렉션과 연동되어 CRUD를 수행할 수 있다.
            - module.exports로 내보내기를 했기 때문에 다른 파일에서 require() 함수로 불러올 수 있다.<br><br>
3. 몽구스와 익스프레스로 CRUD API 만들기
    - 몽구스와 익스프레스로 CRUD API 만들기 예제 소스 코드
        ```js
        const express = require("express");
        const bodyParser = require("body-parser");
        const mongoose = require("mongoose");
        const Person = require("./person-model");

        mongoose.set("strictQuery", false); // Mongoose 7이상에서는 설정해줘야 경고가 뜨지 않음.

        const app = express();
        app.use(bodyParser.json());
        app.listen(3000, () => {
        console.log("Server started");
        const mongodbUri =
            "mongodb+srv://<username>:<password>@cluster0.c81cval.mongodb.net/test?retryWrites=true&w=majority";
        mongoose
            .connect(mongodbUri, { useNewUrlParser: true })
            .then(console.log("Connected to MongoDB"));
        });

        app.get("/person", async (req, res) => {
        const person = await Person.find({});
        res.send(person);
        });

        app.get("/person/:email", async (req, res) => {
        const person = await Person.findOne({ email: req.params.email });
        res.send(person);
        });

        app.post("/person", async (req, res) => {
        const person = new Person(req.body);
        await person.save();
        res.send(person);
        });

        app.put("/person/:email", async (req, res) => {
        const person = await Person.findOneAndUpdate(
            { email: req.params.email },
            { $set: req.body },
            { new: true }
        );
        console.log(person);
        res.send(person);
        });

        app.delete("/person/:email", async (req, res) => {
        await Person.deleteMany({ email: req.params.email });
        res.send({ success: true });
        });
        ```

## 5. REST 클라이언트로 API 테스트하기
1. REST 클라이언트로 mongoose crud 테스트
    - .http 파일로 코드를 작성하면 테스트에 사용한 코드가 남게 된다.
    - 그러면, 코드 저장소에 저장해 다시 재활용할 수 있어 편리하다.
    - VSCode 이외의 편집기에서도 동작하므로 익혀두면 유용하다.<br><br>
    - mongoose crud 테스트 소스 코드
        ```js
        # ❶ server 변수 설정 
        @server = http://localhost:3000

        ### ❷ GET 요청 보내기  
        GET {{server}}/person

        ### ❸ POST 요청 보내기 
        POST {{server}}/person
        Content-Type: application/json

        {
        "name": "Andy Park",
        "age": 30,
        "email": "andy@backend.com"
        }

        ### ❹ 생성한 문서 확인 
        GET {{server}}/person/andy@backend.com

        ### ❺ PUT 요청 보내기, 문서 수정하기 
        PUT {{server}}/person/andy@backend.com
        Content-Type: application/json

        {
        "age": 32
        }

        ### ❻ 문서 삭제하기 
        DELETE {{server}}/person/andy@backend.com
        ```
        - @ 변수명 = 값으로 변수 선언이 가능하며 {{ 변수명 }}으로도 변수를 사용한다.
            - 여기서는 server에 http://localhost:3000를 할당했다.
        - GET을 쓰고 URL을 써서 GET을 요청한다.
            - 그러면 위에 'Send Request'가 버튼이 나타난다.
            - 'Send Request' 버튼을 클릭하면, 결괏값을 VSCode의 새 창과 서버가 실행 중인 터미널에서 확인할 수 있다.
        - 헤더 정보 다음에 바디가 있는 경우 반드시 둘 사이에 빈 줄이 들어가야 한다.
        - 헤더 정보인 'Content-Type'에 'application/json'이라고 되어 있으므로 HTTP 요청의 body에는 JSON 형식의 문자열이 들어간다.