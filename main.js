// news 전역변수를 빈 배열로 선언
let news = [];
let page = 1;
let total_pages = 0;

// url을 전역변수로 선언하여 각 함수에 적용하게끔 한다.
let url;

// menus의 버튼을 여러개 가져오기 위해 querySelectorAll()을 통해서 가져오기
let menusButton = document.querySelectorAll(".menus button");

// 검색버튼 클릭 이벤트 주기
let searchButton = document.querySelector("#search-button");

// 엔터를 클릭했을때 검색 이벤트 작동하기
let searchEnter = document.querySelector("#search-input");

// 입력한 키워드값을 가져오기 위해 input.values를 가져온다


menusButton.forEach((menu) => menu.addEventListener("click", (event) => getNewsByTopic(event)))

// 각 함수에서 필요한 url 만들기.
// api 호출 함수를 부른다.
// 중복되는 코드들을 함수로 묶어준다.
const getNews = async() =>{
    
    try{
        // new Headers() 기능을 사용하여 key,value값을 넣어준다. (토큰)
        let header = new Headers(
            {'x-api-key': 'strtLJ_t-qztFwGhxuNS7HAgun0bSzbb4Q56ggHt4BU'}
        );


        // url에 쿼리를 더해준다.
        url.searchParams.set('page', page); // &page= (page전역변수)

        console.log("url은?",url);

        // await을 통해 fetch를 잠깐 대기 시킨다.
        let response = await fetch(url, {headers : header}); // ajax,http,fetch 를 사용할 수 있음

        // response 데이터를 json타입으로 변환한다.
        let data = await response.json();
        
        // response의 status가 200이면 ok
        if(response.status === 200){
            
            // total_hits 검색된 조회수가 0인 경우는 유저에게 아래와같은 메시지오류를 출력하여 보여주게 됨.
            if(data.total_hits == 0){
                throw new Error("검색된 결과값이 없습니다.");
            }
            
            news = data.articles;
            total_pages = data.total_pages;
            page = data.page;

            // 빈 배열에 data의 담겨진 articles 내용을 넣어준다.

            console.log(news);
            console.log("받는 데이터 확인하기",data)
            render();
            pageNation();
        }else{
            throw new Error(data.message)
        }
     
    }catch(error){
        console.log("잡힌 에러", error.message);
        errorRender(error.message);
    }
   
}



const getLatestNews = async() => { // 비동기 처리를 위한 async를 활용(async와 await은 셋트이다 !!)
   
    // new URL() 기능을 사용하여 url을 넣어준다. (url을 분석해주는 툴)
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=business&page_size=10`);
    
    getNews();

}   


const getNewsByTopic = async (event) =>{
    console.log("클릭됨", event.target.textContent); // 클릭된 text 요소만 가져오기 위해서 textContent를 사용한다.
    
    // 타겟 이벤트의 url은 소문자로 변환되어 가져오기위해 사용
    let topic = event.target.textContent.toLowerCase();
    
    url = new URL(`https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`);

    getNews();
}


const getNewsByKeyword = async() => {
    // 1. 검색키워드 읽어오기
    // 2. URL에 검색 키워드 붙이기 ~~~~
    // 3. Heard 준비 
    // 4. Url 부르기
    // 5. 데이터 가져오기
    // 6. 데이터 보여주기

    let keyword = document.querySelector("#search-input").value;

    // search Url을 생성하고 입력한 keyword값을 넣어준다.
    url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=1`);

    getNews();
}

const getNewsByEnter = async() => {

    // 엔터키를 텍스트창 input에서 작동했을때 조회하는 로직

    if(window.event.keyCode == 13){
        let keyword = document.querySelector("#search-input").value;

        // search Url을 생성하고 입력한 keyword값을 넣어준다.
        url = new URL(`https://api.newscatcherapi.com/v2/search?q=${keyword}&page_size=1`);

        getNews();
    }

}


const render = () => {
    let newsHTML = '';

    // newsHTML 변수에 맵을 통한 news값을 넣어준다.
    newsHTML = news.map((item) => { // item에 있는 아이템을 각각 호출한다.

        return `<div class="row news">
        <div class="col-lg-4">
            <img class="news-img-size" src="${item.media}" alt="고양이" >
        </div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>
                ${item.summary}
            </p>
            <div class="bottom-text">
                출처 : ${item.rights} / 게시일 : ${item.published_date}
            </div>
        </div>
     </div>`
    // 기본적으로 map 함수는 배열 타입이기에 ','값의 문자열을 동반한다.
    // 따라서 화면에 출력해줄 때 join('') 조인으로 빈 문자열을 줘서 ,값을 없애도록 조정하였다.
    // join은 배열을 String(문자열)로 변환하여 가져올 수 있다.
    }).join('');


    // 뉴스 내용이 들어갈 섹션의 아이디를 가져와서 뉴스의 내용을 넣는다.
    document.querySelector("#news-board").innerHTML = newsHTML;
};


const errorRender = (message) =>{

    let errorHTML = `<div class="alert alert-danger text-center" role="alert" >
     ${message}
    </div>`
    document.querySelector("#news-board").innerHTML = errorHTML;
}

const pageNation = () => {

    let pageNationHTML = ``;

    // total_page 
    // page
    // page_group
    let page_group = Math.ceil(page / 5);
    // last page
    let last =  page_group * 5;
        if(last > total_pages){
            // 마지막에 그룹이 5개 이하라면...
            last = total_pages;
        }

    // first page
    let first = last - 4 <= 0 ? 1 : last - 4; // 첫그룹이 5이하이면
    
    // total page 3일 경우 3개의 페이지만 프린트 하는법 last, first
    // << >> 버튼 만들어주기..


    if(first >= 6){
        pageNationHTML += `<li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(1)">
          <span aria-hidden="true">&lt&lt;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${page - 1})">
          <span aria-hidden="true">&lt;</span>
        </a>
        </li>
        `
    }
 

    
    // first page ~ last page 페이지 프린트
    for(let i=first; i<=last; i++){
        
        // pageNationHTML 값에 += 반복문을 통해 li값을 반복하여 넣어준다.
        // onclick 기능에 moveToPage() 함수를 넣고 기능작업을 해준다. 인자로 i(first)값을 넘겨준다.
        // 삼항연사자 활용 page의 값이 현재 페이지 i랑 같다면 ? "active":"" 같으면 표시를 해준다.
        pageNationHTML +=  `<li class="page-item ${page == i ? "active":""}"><a class="page-link" href="#" onclick="moveToPage(${i})">${i}</a></li>`

    }

    if(last < total_pages){
        pageNationHTML +=   `<li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick="moveToPage(${page + 1})">
          <span aria-hidden="true">&gt;</span>
        </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Previous" onclick="moveToPage(${total_pages})">
          <span aria-hidden="true">&gt&gt;</span>
        </a>
        </li>
        `
    }
  
   


    document.querySelector(".pagination").innerHTML = pageNationHTML;
}

const moveToPage = (pageNum) => {
    // 1. 이동하고 싶은 페이지를 확인해야함.
    

    page = pageNum;

    // 2. 이동하고 싶은 페이지를 가지고 api를 다시 호출해주자.

    getNews();

}


searchButton.addEventListener("click", getNewsByKeyword);
searchEnter.addEventListener("keyup", getNewsByEnter);

getLatestNews();