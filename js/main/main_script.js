// 20220610_yhlee 추가 
$(function(){//html파일이 모두 로딩되고 해당 함수안의 내용을 실행
    //php로 정보를 받아오는 속도보다 여기서 정보 처리하는 속도가 더 빨라서 순서가 꼬인다.
    //그래서 이런식으로 값이 null이냐 아니면 받아왔느냐를 가지고 판단하여 다음으로 넘어간다.
    let loop = function(){
        if(mileageHistory != null){
            course_list_drow()
        } else{
            setTimeout(loop, 100)
        }
    }
    loop();
    PHP.get_user_mileage();
    PHP.get_mileage_history();

    // 버튼 클릭시 링크 연결
    // 나만의 코스 만들기 연결
    $(".myCossContainer").on('click',function(){
        window.location.href = "./h_usercours.html";
    })

    // 내 코스 목록
    $(".myCossList").on('click',function(){
        window.location.href = "./h_usercourslist.html";
    })

    // QR스탬프 챌린지
    $(".stampChallenge").on('click',function(){
        window.location.href = "./s_index.html";
    })
})




let course_list_drow = () => {
    var iconUser = document.querySelector("#iconUser");
    var mypage = document.querySelector("#mypage");
    var arrow = document.querySelector(".arrow");
    var check = "move";
    
    // function move(){
    //     if(mypage.classList.contains(check)){
    //         mypage.classList.remove("move");
    //     } else {
    //         mypage.classList.add("move");
            
    //     }
    // }

    function move(){
            mypage.classList.add("move");
    }
    function move2(){
        mypage.classList.remove("move");
    }
    

    var name = localStorage.getItem('nick_name')

    $('.userInfoText01').text(`안녕하세요, ${name} 님!`);

    var mypageMileage = document.querySelector(".mypageMileage");
    var mileageH3 = document.querySelector(".mileageH3");
    var mypageH3 =document.querySelector(".mypageH3");
    var mypageContentWrapper = document.querySelector(".mypageContentWrapper");
    var mypageBtn = document.querySelector(".mypageBtn");
    var mileageText = document.querySelector(".mileageText");
    var arrowBack = document.querySelector(".arrowBack");

    function disapear(){
        
        if(mileageH3.classList.contains("click") == true){
            mypageContentWrapper.classList.add("click");
            mypageBtn.classList.add("click");
            mypageH3.classList.add("click");
            mileageText.classList.remove("click");
            mileageH3.classList.remove("click");
            arrowBack.style.display = "block";
            arrow.style.display = "none";
            // arrow.classList.replace("arrow","arrowBack");
            // console.log(arrowBack);
            
            // arrowBack.addEventListener("click",back);
        }else {
            mypageContentWrapper.classList.remove("click");
            mypageBtn.classList.remove("click");
            mypageH3.classList.remove("click");
            mileageText.classList.add("click");
            mileageH3.classList.add("click");
            arrowBack.style.display = "none";
            arrow.style.display = "block";
            arrowBack.classList.replace("arrowBack","arrow");
        }
    
    }

    // function back(){
    //         var arrowBack = document.querySelector(".arrowBack");
    //         mypageContentWrapper.classList.remove("click");
    //         mypageBtn.classList.remove("click");
    //         mypageH3.classList.remove("click");
    //         mileageText.classList.add("click");
    //         mileageH3.classList.add("click");
    //         // mypage.classList.add("move");
    //         arrowBack.classList.replace("arrowBack","arrow");

    // }

    iconUser.addEventListener("click", move);
    arrow.addEventListener("click", move2);
    mypageMileage.addEventListener("click", disapear);
    arrowBack.addEventListener("click", disapear);
    
    console.log(arrowBack);
    var email = localStorage.getItem('email')
    // var userInfoImgContainer = document.querySelector(".userInfoImgContainer");
    // var userSNS = document.querySelector(".userSNS");


    PHP.get_user_mileage();
    PHP.get_mileage_history();

    let mileageHistory1 = mileageHistory.split('(start)');
    let mileageHistory2 = new Array(mileageHistory1.length);

    for ( i=1; i < mileageHistory1.length; i++){
            if(mileageHistory1[i] != false ){
            let mileageHistory2_1 = mileageHistory1[i].split('(end)');
            mileageHistory2[i] = new Array(mileageHistory2_1.length);
            for( j=0; j < mileageHistory2_1.length; j++){
                mileageHistory2[i][j] = mileageHistory2_1[j];
            }
        }
    }

    function paintMileage(){
        for ( i =1; i< mileageHistory2.length; i++){
            var mileageText = document.querySelector("#mileageText");
            var mileageTextLinediv = document.createElement("div");
            var mileageTextListdiv = document.createElement("div");
            
            var mileageTextListDatediv = document.createElement("p");
            var mileageTextListPointdiv = document.createElement("p");
            var mileageTextListCleardiv = document.createElement("p");
            
            mileageTextLinediv.classList.add("mileageTextLine");
            mileageTextListdiv.classList.add("mileageTextList");
            
            mileageTextListDatediv.classList.add("mileageTextListDate");
            mileageTextListPointdiv.classList.add("mileageTextListPoint");
            mileageTextListCleardiv.classList.add("mileageTextListClear");
            
            if( isNaN(parseInt( mileageHistory2[i][1] )) == false){
                    mileageText.appendChild(mileageTextLinediv);
                    mileageText.appendChild(mileageTextListdiv);

                    mileageTextListdiv.appendChild(mileageTextListDatediv);
                    mileageTextListdiv.appendChild(mileageTextListPointdiv);
                    mileageTextListdiv.appendChild(mileageTextListCleardiv);

                    mileageTextListDatediv.innerText = mileageHistory2[i][0];
                    mileageTextListPointdiv.innerText = utilGetNumber_withComma(parseInt(mileageHistory2[i][1])+"")+" P";
                    mileageTextListCleardiv.innerText = "QR 스탬프 챌린지 완주";
                    // mileageTextListDatediv.innerText = mileageHistory2[i][0];
                    console.log( parseInt(mileageHistory2[i][1]));
            }
        }
    }
    paintMileage();


    //천단위 콤마 찍어주는 함수
    function utilGetNumber_withComma(value)
    {
        var str1, str2, str3, str;
        var num1, num2, strLen;
        strLen = value.length;
        if (strLen > 6)
        {
            num1 = strLen - 3;
            str1 = value.slice(num1, strLen);
            num2 = strLen - 6;
            str2 = value.slice(num2, num1);
            str3 = value.slice(0, num2);
            str = str3+','+ str2 + ',' + str1;
        } else if (strLen > 3)
        {
            num1 = strLen - 3;
            str1 = value.slice(num1, strLen);
            str2 = value.slice(0, num1);
            str = str2 + ',' + str1;
        } else
        {
            str = value;
        }
            return str;

    }

function changesnsNaver(){
    var snsdiv = document.querySelector(".userSNS");
    var snsimg = document.createElement("img");
    
    snsdiv.appendChild(snsimg);
    snsimg.setAttribute('src','../src/img/naver_icon.png');
    console.log(snsdiv);
}

function changesnsKakao(){
    var snsdiv = document.querySelector(".userSNS");
    var snsimg = document.createElement("img");
    
    snsdiv.appendChild(snsimg);
    snsimg.setAttribute('src','../src/img/kakao.png');
    console.log(snsdiv);
}

    if ( email.indexOf("naver") == 0){
        changesnsNaver();
    } else if( email.indexOf("kakao") == 0) {
        changesnsKakao();
    }

}











// 20220610_yhlee 추가 
// $(function(){//html파일이 모두 로딩되고 해당 함수안의 내용을 실행
//     var iconUser = document.querySelector("#iconUser");
//     var mypage = document.querySelector("#mypage");
//     var arrow = document.querySelector(".arrow");
    
//     function move(){
//         var check = "move";
//         if(mypage.classList.contains(check)){
//             mypage.classList.remove("move");
//         } else {
//             mypage.classList.add("move");
//         }
//     }
    
   

//     var name = localStorage.getItem('nick_name')

//     $('.userInfoText01').text(`안녕하세요, ${name}님!`);

//     var mypageMileage = document.querySelector(".mypageMileage");
//     var mileageH3 = document.querySelector(".mileageH3");
//     var mypageH3 =document.querySelector(".mypageH3");
//     var mypageContentWrapper = document.querySelector(".mypageContentWrapper");
//     var mypageBtn = document.querySelector(".mypageBtn");
//     var mileageText = document.querySelector(".mileageText");


//     function disapear(e){
//         e.preventDefault();

//         if(mileageH3.classList.contains("click")){
//             mypageContentWrapper.classList.add("click");
//             mypageBtn.classList.add("click");
//             mypageH3.classList.add("click");
//             mileageText.classList.remove("click");
//             mileageH3.classList.remove("click");
//             arrow.classList.replace("arrow","arrowBack");
//             var arrowBack = document.querySelector(".arrowBack");
//             console.log(arrowBack);
//             arrowBack.addEventListener("click",back);
//         } 
        
//     }
//     function back(e){
//         var arrowBack = document.querySelector(".arrowBack");
//         e.preventDefault();
//             mypageContentWrapper.classList.remove("click");
//             mypageBtn.classList.remove("click");
//             mypageH3.classList.remove("click");
//             mileageText.classList.add("click");
//             mileageH3.classList.add("click");
//             arrowBack.classList.replace("arrowBack","arrow");
//     }

//     iconUser.addEventListener("click", move);
//     arrow.addEventListener("click", move);
//     mypageMileage.addEventListener("click", disapear);


//     var email = localStorage.getItem('email')
//     var userInfoImgContainer = document.querySelector(".userInfoImgContainer");

//     if ( email.indexOf("naver") == 0){
//         console.log("( o ) _ ( o )");
//     } else if( email.indexOf("kakao") == 0) {
//         console.log("( X ) _ ( X )")
//     }


//     // 버튼 클릭시 링크 연결
//     // 나만의 코스 만들기 연결
//     $(".myCossContainer").on('click',function(){
//         window.location.href = "./h_usercours.html";
//     })

//     // 내 코스 목록
//     $(".myCossList").on('click',function(){
//         window.location.href = "./h_usercourslist.html";
//     })

//     // QR스탬프 챌린지
//     $(".stampChallenge").on('click',function(){
//         window.location.href = "./s_index.html";
//     })


// })
