const express = require("express") // 라이브러리 로드
const app = express(); // 서버생성
/*
    서버구동
    bind() => IP, PORT를 연결(개통)
    listen() => 대기 상태
    accept() => 클라이언트가 접속시에 처리
*/
app.listen(3355,()=>{
    console.log("server start... ","http://localhost:3355")
})

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// mongodb 연결
const Client=require("mongodb").MongoClient

// 클라이언트와 통신
app.get('/recipe', (request, response)=>{
    var page = request.query.page;
    var rowSize=12;
    var skip = (page*rowSize)-rowSize;
    /*
          1 page => 0  0~11
          2 page => 12 12~23
     */
    var url="mongodb://211.238.142.181:27017";
    Client.connect(url,(err,client)=>{
        var db=client.db("mydb");
        db.collection("recipe").find({}).skip(skip).limit(rowSize).
        toArray(function(err,docs){
            response.json(docs)
            client.close();
        })
    })
})

app.get('/recipe_total', (request, response)=>{
    var url="mongodb://211.238.142.181:27017";
    Client.connect(url,(err,client)=>{
        var db=client.db("mydb");
        db.collection("recipe").find({}).count((err,count)=>{
            response.json({total:Math.ceil(count/12.0)})
            client.close();
            return count;
        })
    })
})