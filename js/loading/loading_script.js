// 20220610_yhlee 추가 
let EMAIL_GET_CHECK = false;

let USER_DATA_GET_CHECK =false;

//네이버 로그인 API 사용하여 로그인 후 정보 받아오기 ~~ 시작 ~~
var naver_id_login = new naver_id_login(NAVER_API_KEY, "");
// 접근 토큰 값 출력
// alert(naver_id_login.oauthParams.access_token);
// 네이버 사용자 프로필 조회
naver_id_login.get_naver_userprofile("naverSignInCallback()");
// 네이버 사용자 프로필 조회 이후 프로필 정보를 처리할 callback function
function naverSignInCallback() {
    console.log(naver_id_login.getProfileData('email'));
    console.log(naver_id_login.getProfileData('nickname'));
    


    // 정보를 받아오고나서 이메일과 닉네임을 변수에 저장 
    USER_DATA.EMAIL = "naver_"+naver_id_login.getProfileData('email');
    USER_DATA.NICK_NAME = naver_id_login.getProfileData('nickname');
    if(naver_id_login.getProfileData('nickname') == undefined)
        USER_DATA.NICK_NAME = naver_id_login.getProfileData('name');
    
    // 로컬스토리지에 저장하기
    localStorage.setItem("email",USER_DATA.EMAIL);
    localStorage.setItem("nick_name",USER_DATA.NICK_NAME);

    EMAIL_GET_CHECK = true;
}
//네이버 로그인 API 사용하여 로그인 후 정보 받아오기 ~~ 끝 ~~


$(function(){//html파일이 모두 로딩되고 해당 함수안의 내용을 실행

    // 만약 카카오 로그인을 하고 넘어온것인지 확인한다.
    const url = window.location.search;
	const urlParams = new URLSearchParams(url);
    if(urlParams.get('kakao_login') == 'o')
        EMAIL_GET_CHECK = true;
    
    let data_check_loop = function(){
        if(EMAIL_GET_CHECK) //로그인 후 이메일을 잘받아왔나?
        {
            USER_DATA.EMAIL = localStorage.getItem("email");
            USER_DATA.NICK_NAME = localStorage.getItem("nick_name");
            //잘받아왔다면 받아온 정보가 DB에 있는지 물어보고 없으면 등록 있으면 정보들을 받아오자.
            PHP.get_user_data();
    
        }
        else
        {
            setTimeout(data_check_loop,100);
        }
    }
    data_check_loop();    

    let user_data_check_loop = function(){
        if(USER_DATA_GET_CHECK) //로그인 후 이메일을 잘받아왔나?
        {
            PHP.get_user_mileage(USER_DATA.EMAIL);
            // 다음화면 넘기는 부분            
            setTimeout( function (){
                location.href = './index.html';
            } , 1000);
            
        }
        else
        {
            setTimeout(user_data_check_loop,100);
        }
    }
    user_data_check_loop();    

    $('.logoContainer').addClass("move");
    $('.logo').addClass("scale");
})

