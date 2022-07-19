// 닷홈 주소 및 토근에 대한 부분 ~~ 시작 ~~
var hipark_url = "http://zktyvod.dothome.co.kr";//혜인


var DOTHOME_URL = "";

// 네이버 api 키
var hipark_naver_key = "클라이언트 아이디";//혜인


var NAVER_API_KEY = "";

// 카톡 api 키
var hipark_kakao_key = "JavaScript 키";//혜인

var KAKAO_API_KEY = "";

function set_URL()
{
    DOTHOME_URL = hipark_url;//혜인
    NAVER_API_KEY = hipark_naver_key;//혜인
    KAKAO_API_KEY = hipark_kakao_key;//혜인
}
set_URL();
// 닷홈 주소 및 토근에 대한 부분 ~~ 끝 ~~


//사용자의 기본 정보
var USER_DATA = {
    EMAIL : "",
    NICK_NAME : "",
    MILEAGE : 0
}


// 현재 나의 ID 및 닉네임을 저장 
USER_DATA.EMAIL = localStorage.getItem('email');
USER_DATA.NICK_NAME = localStorage.getItem('nick_name');