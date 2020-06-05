const express=require("express")
// 라이브러리 로드
// 서버 생성
const app=express();
// 서버를 구동
/*
    bind() => IP,PORT를 연결 => 개통
    listen() => 대기 상태
    accept() => 클라이언트가 접속시에 처리
 */
app.listen(3355,()=>{
    console.log("Server Start...","http://localhost:3355")
})

app.all('/*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
// 클라이언트와 통신
// 사용자의 URI
// 몽고디비 연결
const Client=require("mongodb").MongoClient;
//MongoDB Connection
/*
      MongoClient mc=new MongoClient("localhost",27017)
      DB db=mc.getDB("mydb")
      DBCollection dbc=db.getCollection('recipe')
 */
// /recipe?page=1
app.get('/recipe',(request,response)=>{
    // request=사용자가 보내준 요청 정보 : page,id,pwd
    // 요청을 처리
    // 결과를 전송 ==> ,response
    var page=request.query.page;//request.getParameter("page")
    var rowSize=12;
    var skip=(page*rowSize)-rowSize;
    /*
       1page => skip=0
       2page => 12(버림) ==> 13
     */
    var url="mongodb://211.238.142.181:27017";//몽고디비 주소
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        // SELECT * FROM recipe  => find({})
        // SELECT * FROM recipe WHERE no=1 => find({no:1})
        // SELECT * FROM recipe WHERE title LIKE '%값%'
        // find({"title":{"$regex":".*"+값}}
        /*
             [{}
             {}
             {}
             {}]
             ...
         */
        db.collection('recipe').find({}).skip(skip).limit(rowSize)
            .toArray((err,docs)=>{
                // 요청한 사용자 => 데이터 전송
                response.json(docs);
                console.log(docs)
                client.close();
            })
    })
})
// SELECT CEIL(COUNT(*)/12.0) FROM recipe
app.get('/recipe_total',(request,response)=>{
    var url="mongodb://211.238.142.181:27017"
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        // count() ==> return
        db.collection('recipe').find({}).count((err,count)=>{
            response.json({total:Math.ceil(count/12.0)})
            client.close();
            return count;
        })
    })
})
/*
       http://localhost:3355  /recipe_detail ? no=1&page=1
       =====================  ==============   ==== request에 담겨서
         서버 주소               URI
         request.query.no;
         request.query.page
 */
app.get('/recipe_detail',(request,response)=>{
    // 요청 => 처리 => 결과값 전송
    var no=request.query.no;
    // 몽고디비에 연결
    var url="mongodb://211.238.142.181:27017";
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        // WHERE no=2
        db.collection('recipe_detail').find({no:parseInt(no)})
            .toArray((err,docs)=>{
                // 전송
                response.json(docs[0]);
                client.close();
            })
    })

})

app.get('/chef',(request,response)=>{
    // request=사용자가 보내준 요청 정보 : page,id,pwd
    // 요청을 처리
    // 결과를 전송 ==> ,response
    var page=request.query.page;//request.getParameter("page")
    var rowSize=50;
    var skip=(page*rowSize)-rowSize;
    /*
       1page => skip=0
       2page => 12(버림) ==> 13
     */
    var url="mongodb://211.238.142.181:27017";//몽고디비 주소
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        // SELECT * FROM recipe  => find({})
        // SELECT * FROM recipe WHERE no=1 => find({no:1})
        // SELECT * FROM recipe WHERE title LIKE '%값%'
        // find({"title":{"$regex":".*"+값}}
        /*
             [{}
             {}
             {}
             {}]
             ...
         */
        db.collection('chef').find({}).skip(skip).limit(rowSize)
            .toArray((err,docs)=>{
                // 요청한 사용자 => 데이터 전송
                response.json(docs);
                console.log(docs)
                client.close();
            })
    })
})
// SELECT CEIL(COUNT(*)/12.0) FROM recipe
app.get('/chef_total',(request,response)=>{
    var url="mongodb://211.238.142.181:27017"
    Client.connect(url,(err,client)=>{
        var db=client.db('mydb');
        // count() ==> return
        db.collection('chef').find({}).count((err,count)=>{
            response.json({total:Math.ceil(count/50.0)})
            client.close();
            return count;
        })
    })
})
/*
  @RequestMapping("/recipe_news")
  public String recipe_news(request,response)
  {
  }
 */
const xml2js=require("xml2js")
// XML => JSON
const request=require("request")
// 외부 서버에서 데이터를 읽어 올때
app.get('/recipe_news',(req,res)=>{
    var query=encodeURIComponent("야구");
    var url="http://newssearch.naver.com/search.naver?where=rss&query="+query
    // xml을 JSON으러 변경하는 파서기
    var parser=new xml2js.Parser({
        explicitArray:false
    })
    request({url:url},(err,request,xml)=>{
        parser.parseString(xml,function(err,pJson){
            console.log(pJson.rss.channel.item)
        })
    })
})

