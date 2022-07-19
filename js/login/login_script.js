// 20220610_yhlee 추가 
$(function(){//html파일이 모두 로딩되고 해당 함수안의 내용을 실행

    //카카오 로그인 API 사용하여 로그인 진행 ~~ 시작 ~~
    //JavaScript 키 : 56d51771a4a9d45bce2747686afe4f96
    window.Kakao.init(KAKAO_API_KEY); // API Key 입력
    function kakaoLogin() { // 함수 선언
        window.Kakao.Auth.login({  // 카카오 연동 로그인을 위한 인증, 로그인 될 때 실행됨
            scope:'profile_nickname, account_email, gender', // 가져올 카카오 로그인 정보 중 동의항목 ID 설정
            success:function(authobj) { 
                console.log(authobj);  // 받아온 오브젝트 데이터를 콘솔로 출력해보기
                window.Kakao.API.request({ // 로그인 된 상태에서 유저의 로그인 정보(이메일, 닉네임 등) 값을 요청해서 받아오기
                    url:'/v2/user/me',  //로그인 한 사용자의 정보가 있는 url 지정
                    success: res =>{
                        const kakao_account = res.kakao_account; // account 정보 가져오기
                        // console.log(kakao_account);
                        // console.log(kakao_account.email);
                        // console.log(kakao_account.profile.nickname);

                        // 정보를 받아오고나서 이메일과 닉네임을 변수에 저장 
                        USER_DATA.EMAIL = "kakao_"+kakao_account.email;
                        USER_DATA.NICK_NAME = kakao_account.profile.nickname;                        

                        // 로컬스토리지에 저장하기
                        localStorage.setItem("email",USER_DATA.EMAIL);
                        localStorage.setItem("nick_name",USER_DATA.NICK_NAME);

                        location.href = "./loading.html?kakao_login=o";
                    }
                });
            }
        });
    }

    let kakaoLogin_btn = document.querySelector(".loginImg1");
    
    function kakaoLogin_start(e){
        e.preventDefault();
        kakaoLogin(); 
    }
    kakaoLogin_btn.addEventListener("click", kakaoLogin_start);
    //카카오 로그인 API 사용하여 로그인 진행 ~~ 끝 ~~   



    //네이버 로그인 API 사용하여 로그인 진행 ~~ 시작 ~~
    let url = DOTHOME_URL+"/Team_project2/html/loading.html";
    // console.log(url);
    var naver_id_login = new window.naver_id_login(NAVER_API_KEY, url);
    var state = naver_id_login.getUniqState();
    naver_id_login.setButton("green", 3,40);
    naver_id_login.setDomain(DOTHOME_URL);
    naver_id_login.setState(state);
    naver_id_login.init_naver_id_login();
    //네이버 로그인 API 사용하여 로그인 진행 ~~ 끝 ~~
    
})

