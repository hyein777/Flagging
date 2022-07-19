$(function () {
    const script_element = document.createElement('script');
    script_element.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey='+KAKAO_API_KEY+'&autoload=false&libraries=services');
    script_element.addEventListener('load',load_after)
    document.querySelector('head').appendChild(script_element);
})



function load_after(){
    kakao.maps.load(function() {
        //php로 정보를 받아오는 속도보다 여기서 정보 처리하는 속도가 더 빨라서 순서가 꼬인다.
        //그래서 이런식으로 값이 null이냐 아니면 받아왔느냐를 가지고 판단하여 다음으로 넘어간다.
        let loop = function () {
            if (course_data != null) {
                console.log(course_data)
                if(course_data == null || course_data == '')
                {
                    if(!alert("챌린지 시작한 코스가 없습니다."))
                    location.href = "index.html";
                }
                else
                    course_list_drow()
            } else {
                setTimeout(loop, 100)
            }
        }
        loop();
        PHP.get_user_course_list();
        Kakao.init(KAKAO_API_KEY)
    })
}

var challenge_course_index = 0;
var pathDistance = 0;
var mapLevel = 0;
var pathCount = 0;
//내용이 너무 길어서 가독성이 떨어져서 함수로 밖으로 빼놨다.
let course_list_drow = () => {
    //지도 api를 그려주는 부분
    var mapContainer = document.getElementById('map') // 지도를 표시할 div 
    navigator.geolocation.getCurrentPosition((position) => {
        const 위도 = position.coords.latitude
        const 경도 = position.coords.longitude
        map_Level()
        mapOption = {
            center: new kakao.maps.LatLng(Number(Latitude[2]), Number(Longitude[2])), //지도의 중심좌표.
            level: mapLevel //지도의 레벨(확대, 축소 정도)
        };
        // 지도를 생성합니다    
        var map = new kakao.maps.Map(mapContainer, mapOption);

        //중심으로 이동시킴
        var cbutton = document.getElementById('user_location');
        cbutton.addEventListener('click', panTo);

        function panTo() {
            // 이동할 위도 경도 위치를 생성합니다 
            var moveLatLon = new kakao.maps.LatLng(위도, 경도);
            // 지도 중심을 부드럽게 이동시킵니다
            // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
            map.panTo(moveLatLon);
        }

        // 기본 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
        var zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

        // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
        kakao.maps.event.addListener(map, 'zoom_changed', function () {
            // 지도의 현재 레벨을 얻어옵니다
            var level = map.getLevel();
            console.log("현재 지도 크기 레빌: " + level)
        });
        // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
        var linePath = new Array()
        for (let j = 0; j < course_list[challenge_course_index].detailCourse.length - 2; j++) {
            if(course_list[challenge_course_index].detailCourse[j+1].detailCourseOrderNum != "undefined"){
                linePath.push(
                    new kakao.maps.LatLng(Number(Latitude[j]), Number(Longitude[j]))
                )
            }
        }


        // 지도에 표시할 선을 생성합니다
        var polyline = new kakao.maps.Polyline({
            path: linePath, // 선을 구성하는 좌표배열 입니다
            strokeWeight: 2, // 선의 두께 입니다
            strokeColor: '#238CFA', // 선의 색깔입니다
            strokeOpacity: 0.7, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'solid' // 선의 스타일입니다
        });

        // 지도에 선을 표시합니다 
        polyline.setMap(map);


        //본인 위치 마커 생성
        const markerPosition = new kakao.maps.LatLng(위도, 경도);

        const marker2 = new kakao.maps.Marker({
            position: markerPosition
        });
        marker2.setMap(map);

        //코스 좌표들 마커 생성
        var imageSrc = '../src/icon/flag.svg', // 마커이미지의 주소입니다
             imageSrc2 = '../src/img/flag_finish.svg', // 인증 후 마커이미지의 주소입니다
            imageSize = new kakao.maps.Size(57, 33); // 마커이미지의 크기입니다

        // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
        var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
        var markerImage2 = new kakao.maps.MarkerImage(imageSrc2, imageSize);
        var flagmarker = new Array()
        for (let j = 0; j < course_list[challenge_course_index].detailCourse.length - 2; j++) {
                if(course_list[challenge_course_index].detailCourse[j+1].detailCourseOrderNum != "undefined"){
                    flagmarker.push({
                        latlng: new kakao.maps.LatLng(Number(Latitude[j]), Number(Longitude[j]))
                    })
                }
        }

        for (var i = 0; i < flagmarker.length; i++) {
            // 마커를 생성합니다
            if (course_list[challenge_course_index].detailCourse[i+1].detailCourseQRcheck == "코스QR인증여부") {
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: flagmarker[i].latlng, // 마커를 표시할 위치
                    image: markerImage // 마커 이미지 
                });
            } else{
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: flagmarker[i].latlng, // 마커를 표시할 위치
                    image: markerImage2 // 마커 이미지 
                });
            }
        }

    })


    //받아온 데이터 문자열 가공시작 부분
    let course_data1 = course_data.split("(start)");
    //각 코스별로 배열에 담긴다.
    //코스이름/코스1정보/코스2정보/코스3정보/코스4정보/코스5정보/ 이렇게 각각 들어있다.
    //각 코스 정보에는 위도경도||카테고리넘버__코스이름||코스URL||코스연락처||코스도로명주소||코스지번주소||코스QR인증여부||선택여부 이렇게 들어있다.
    let course_data2 = [];
    //전체 코스별로 나눔
    for (let i = 0; i < course_data1.length; i++) {
        if (course_data1[i] != false) {
            course_data2.push(course_data1[i])
        }
    }
    let course_list = new Array(course_data2.length); //course_data2의 길이만큼 배열의 길이가 생성된다.
    //각 전체 코스를 다시 안의 세부 코스별로 나눔
    for (let i = 0; i < course_data2.length; i++) {
        //course_list[i]가 객체라고 선언해줌
        course_list[i] = {}
        //course_data2[i]에 들어있는 전체 코스의 문자열을 !!를 기준으로 잘라주는 변수
        let course_split = course_data2[i].split("!!");
        //course_list[i].courseName에 전체 코스의 이름을 저장
        course_list[i].courseName = course_split[0];
        //course_list[i].detailCourse에 상세 코스들을 배열로 저장하기 위해 배열이라고 선언
        course_list[i].detailCourse = new Array(course_split.length); // course_split.length가 7이라 course_list[i].detailCourse의 개수도 7개가 생성됨
        //course_list[i].detailCourse의 개수가 7개라 빈 배열이 2개 더 생성이 되므로 항상 데이터를 가져올 때 빈 배열을 빼라고 해줘야함
        for (let j = 1; j < course_split.length - 1; j++) { //course_split 생성 당시 "!!"로 나누다 보니 뒤에 빈 배열을 자르려고 -1을 해줌
            //course_list[i].detailCourse[j]가 객체라고 선언을 해줘서 각 상세 코스의 정보를 객체 안에 담음
            course_list[i].detailCourse[j] = {};
            //상세 코스 정보를 "||" 형태로 DB에 넣어놔서 나누는 과정
            let course_detail_course = course_split[j].split("||");
            //오더번호__상세코스이름 이런 형태라 나눠주는 과정
            let course_detail_course_name = course_detail_course[2].split("__");
            course_list[i].detailCourse[j].detailCourseOrderNum = course_detail_course_name[0]; //상세 코스 오버 번호
            course_list[i].detailCourse[j].detailCourseName = course_detail_course_name[1]; //상세 코스 이름
            course_list[i].detailCourse[j].detailCourseLatitude = course_detail_course[1]; //상세 코스 위도
            course_list[i].detailCourse[j].detailCourseLongitude = course_detail_course[0]; //상세 코스 경도
            course_list[i].detailCourse[j].detailCourseUrl = course_detail_course[3]; //상세 코스 URL
            course_list[i].detailCourse[j].detailCourseTel = course_detail_course[4]; //상세 코스 연락처
            course_list[i].detailCourse[j].detailCourseRaddress = course_detail_course[5]; //상세 코스 도로명 주소
            course_list[i].detailCourse[j].detailCourseAddress = course_detail_course[6]; //상세 코스 지번 주소
            course_list[i].detailCourse[j].detailCourseQRcheck = course_detail_course[7]; //상세 코스 QR 인증여부
            course_list[i].detailCourse[j].detailCourseCheck = course_detail_course[8]; //상세 코스 선택여부
            course_list[i].detailCourse[j].detailCourseStartTime = course_detail_course[9]; //챌린지 시작 시간
        }
        if (course_list[i].detailCourse[1].detailCourseCheck == "선택") {
            challenge_course_index = i;
        }
    }

    //코스 위도, 경도 배열로 저장
    let Latitude = new Array();
    let Longitude = new Array();
    for (let j = 0; j < course_list[challenge_course_index].detailCourse.length - 2; j++) {
        Latitude.push(course_list[challenge_course_index].detailCourse[j + 1].detailCourseLatitude);
        Longitude.push(course_list[challenge_course_index].detailCourse[j + 1].detailCourseLongitude);
    }


    //리스트에 db에서 받아온 코스 보여주기
    function showList() {
        var content = '';
        for (var j = 1; j < course_list[challenge_course_index].detailCourse.length - 1; j++) {
            if (course_list[challenge_course_index].detailCourse[j].detailCourseOrderNum != "undefined") {
                content += '<div class="placeinfo_wrap"><div class="placeinfo popup_bg' + course_list[challenge_course_index].detailCourse[j].detailCourseOrderNum + '">' +
                    '   <div class="title"><div class="place_name">' + course_list[challenge_course_index].detailCourse[j].detailCourseName + '</div></div><div id="overlay_info"><div class="overlay_img" id="overlay_img' + j + '"></div><div class="overlay_QR" id="overlay_QR' + j + '"></div><div id="overlay_text">';
                if (course_list[challenge_course_index].detailCourse[j].detailCourseRaddress != "X") {
                    content += '<span title="' + course_list[challenge_course_index].detailCourse[j].detailCourseRaddress + '">' + course_list[challenge_course_index].detailCourse[j].detailCourseRaddress +
                        '</span>' +
                        '  <span class="jibun" title="' + course_list[challenge_course_index].detailCourse[j].detailCourseAddress + '">(지번 : ' + course_list[challenge_course_index].detailCourse[j].detailCourseAddress +
                        ')</span>';
                } else {
                    content += '    <span title="' + course_list[challenge_course_index].detailCourse[j].detailCourseAddress + '">' + course_list[challenge_course_index].detailCourse[j].detailCourseAddress +
                        '</span>';
                }
                content += '    <span class="tel">' + course_list[challenge_course_index].detailCourse[j].detailCourseTel + '</span>' +
                    '<button id="linkbtn"><a href="' + course_list[challenge_course_index].detailCourse[j].detailCourseUrl + '" target="_blank" title="' + course_list[challenge_course_index].detailCourse[j].detailCourseName + '">상세정보</a></button></div></div></div>' +
                    '<div class="placeinfo_side"><div class="QRscan" id="QRscan' + j + '"></div><div class="kakao_nav" id="kakao_nav' + j + '" ></div></div></div>';

                //placeinfo에 사진을 넣도록 이름이랑 인덱스 번호 보내는 부분
                kakaoImgApiInsert(course_list[challenge_course_index].detailCourse[j].detailCourseName, j);
            }
            document.querySelector('#course_name').innerHTML = course_list[challenge_course_index].courseName;
            document.querySelector('#detail_course_list').innerHTML = content;


            // QR스캔 클릭에 대한부분
            $(".QRscan").off("click");
            $(".QRscan").on("click", function(){
                //현재 클릭한 태그의 id를 확인
                var tmp_index = $(this).attr('id');  //this==QRscan1~5중의 하나
                //선택된 태그의 id의 menu번호를 확인
                tmp_index = tmp_index.slice("6", "7");  //menuX의 인덱스번호에서 X자리
                let check_state = course_list[challenge_course_index].detailCourse[tmp_index].detailCourseQRcheck;
                if (check_state != "인증") {
                    window.location.href = "s_index_QR.html?email="+USER_DATA.EMAIL+"&course_name="+course_list[challenge_course_index].courseName;
                }
            })

        }
    }
    showList()

    //오버레이에 이미지 땡겨오는거
    function kakaoImgApiInsert(overlay_name, j) {
        //https://developers.kakao.com/tool/rest-api/open/get/v2-search-image
        $.ajax({
            type: "GET",
            url: "https://dapi.kakao.com/v2/search/image",
            headers: {
                "Authorization": "KakaoAK dcf60f42241d951590f297d51ad83d0a" // 'KakaoAK 0000000000000000000000000000000000'
            },
            data: {
                'query': overlay_name,
                'sort': 'accuracy', //accuracy(정확도순) 또는 recency(최신순)
                'page': 1, //결과 페이지 번호, 1~50 사이의 값, 기본 값 1
                'size': 1 //한 페이지에 보여질 문서 수, 1~80 사이의 값, 기본 값 80
            },
            success: function (jdata) {
                $(jdata.documents).each(function (index) {
                    $("#overlay_img" + j).html('<img src="' + this.image_url + '" onerror="this.src=`../src/img/noimage.png`" />');
                });
            },
            error: function (xhr, textStatus) {
                console.log(xhr.responseText);
                console.log("에러");
                return;
            }
        });
    }

    //카카오 내비 연결하는 부분
    for (var i = 1; i < course_list[challenge_course_index].detailCourse.length - 1; i++) {
        $("#kakao_nav" + i).on("click", function () {
            let cur_id = $(this).attr('id');
            let id_num = cur_id.slice(9, cur_id.length);
            navi(course_list[challenge_course_index].detailCourse[id_num].detailCourseName, Number(course_list[challenge_course_index].detailCourse[id_num].detailCourseLatitude), Number(course_list[challenge_course_index].detailCourse[id_num].detailCourseLongitude))
        })
    }

    function navi(coursename, coursex, coursey) {
        Kakao.Navi.start({
            name: coursename,
            x: coursey,
            y: coursex,
            coordType: 'wgs84'
        })
    }

    //챌린지 시작부터 남은 카운트다운 계산하는 부분
    function remaindTime() {
        var now = new Date(); //현재시간을 구한다. 
        var open = new Date(course_list[challenge_course_index].detailCourse[1].detailCourseStartTime);

        open.setDate(open.getDate() + 1); //입력받은 챌린지 시작 시간에 하루를 더하는 부분

        var nt = now.getTime(); // 현재의 시간만 가져온다
        var ot = open.getTime(); // 오픈시간만 가져온다

        if (nt < ot) { //현재시간이 오픈시간보다 이르면 오픈시간까지의 남은 시간을 구한다.   
            sec = parseInt(ot - nt) / 1000;
            hour = parseInt(sec / 60 / 60);
            sec = (sec - (hour * 60 * 60));
            min = parseInt(sec / 60);
            sec = parseInt(sec - (min * 60));

            if (hour < 10) {
                hour = "0" + hour;
            }
            if (min < 10) {
                min = "0" + min;
            }
            if (sec < 10) {
                sec = "0" + sec;
            }
            $("#d-day-hour").html(hour);
            $("#d-day-min").html(min);
            $("#d-day-sec").html(sec);
        } else { //현재시간이 종료시간보다 크면
            $("#d-day-hour").html('00');
            $("#d-day-min").html('00');
            $("#d-day-sec").html('00');
        }
    }
    setInterval(remaindTime, 1000); //1초마다 검사를 해주면 실시간으로 시간을 알 수 있다. 

    //챌린지를 취소하면 날짜를 하루 더하고 선택을 선택여부로 바꾼다.
    const btnCancelPopup = document.querySelector('#mdObt');
    btnCancelPopup.addEventListener('click', () => {
        location.href = 'index.html';
        var cancelTime = new Date(course_list[challenge_course_index].detailCourse[1].detailCourseStartTime);
        cancelTime.setDate(cancelTime.getDate() + 1);
        PHP.update_challenge_cancel(course_list[challenge_course_index], cancelTime);
    });

    //선택된 코스가 없으면 뒤로가기 시키는 부분
    var selectCount = 0;
    for (let i = 0; i < course_list.length; i++) {
        for (var j = 1; j < course_list[i].detailCourse.length - 1; j++) {
            if (course_list[i].detailCourse[j].detailCourseCheck == "선택") {
                selectCount++
            }
        }
    }
    if (selectCount == 0) {
        alert("선택된 코스가 없습니다.");
        // history.back();
        window.location.href = "index.html";
    }

    //QR이 다 인증되면 페이지 넘어감
    var QRCount = 0;

    for (var j = 1; j < course_list[challenge_course_index].detailCourse.length - 1; j++) {
        if (course_list[challenge_course_index].detailCourse[j].detailCourseQRcheck == "인증") {
            QRCount++
        }
    }

    var ordernum = 0;
    for (var k = 1; k < course_list[challenge_course_index].detailCourse.length - 1; k++) {
        if(course_list[challenge_course_index].detailCourse[k].detailCourseOrderNum != "undefined"){
            ordernum++
        }
    }

    if (QRCount == ordernum) {
        location.href = 's_pointGet.html';
        PHP.delete_course_QR(course_list[challenge_course_index].courseName);
    }

    //QR인증이 있는 상세 코스의 이미지 바꾸는 부분
    for (var j = 1; j < course_list[challenge_course_index].detailCourse.length - 1; j++) {
        if (course_list[challenge_course_index].detailCourse[j].detailCourseQRcheck != "코스QR인증여부") {
            $("#QRscan" + j).css("background","url('../src/img/QRscan_g.svg')");
            $("#QRscan" + j).css("background-size","cover");
            $("#overlay_QR" + j).css("display","block");
        }
    }

    //mapLevel 계산하는 부분
    function map_Level () {
        pathCount = 0;
        pathDistance = 0;
        mapLevel = 0;
        for(var i = 0; i < Latitude.length; i++){
            if(isNaN(parseInt(Latitude[i])) == false){
                pathCount++
            }
        }
        for(var j = pathCount; j > 1; j--){
            var distance = getDistance(Number(Latitude[j-1]),Number(Longitude[j-1]),Number(Latitude[j-2]),Number(Longitude[j-2]));
            if(isNaN(distance) == false ){
                pathDistance += distance
            }
        }
        if(pathDistance > 0 && 0.5 > pathDistance){
            mapLevel = 4;
        } else if(pathDistance < 1 && 0.5 < pathDistance){
            mapLevel = 5;
        } else if(pathDistance < 2 && 1 < pathDistance){
            mapLevel = 6;
        } else if(pathDistance < 4 && 2 < pathDistance){
            mapLevel = 7;
        } else if(pathDistance > 4){
            mapLevel = 8;
        } else {
            mapLevel = 5;
        }
    }

    //세부 코스 거리 계산
    //두 좌표간 거리 계산 함수
    function getDistance(lat1,lng1,lat2,lng2) {
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }
    
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lng2-lng1);
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c; // Distance in km
        return d;
    }




    
    // TEST를 위해 키값을 추가하여 편하게 TEST를 하게합니다~~시작~~
    window.removeEventListener("keyup", index_keyUp);
    window.addEventListener('keyup',index_keyUp);
    function index_keyUp(){
        let keyCode = event.keyCode;
        console.log("~~"+keyCode);
        switch(keyCode)
        {
            case 49://숫자 1 버튼
                if(course_list[challenge_course_index].detailCourse[1].detailCourseQRcheck != "인증")
                {
                    course_list[challenge_course_index].detailCourse[1].detailCourseQRcheck = "인증";
                    PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                }
                break;
            case 50://숫자 2 버튼
                if(course_list[challenge_course_index].detailCourse[2].detailCourseQRcheck != "인증")
                {
                    course_list[challenge_course_index].detailCourse[2].detailCourseQRcheck = "인증";
                    PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                }
                break;
            case 51://숫자 3 버튼
                if(course_list[challenge_course_index].detailCourse[3].detailCourseQRcheck != "인증")
                {
                    course_list[challenge_course_index].detailCourse[3].detailCourseQRcheck = "인증";
                    PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                }
                break;
            case 52://숫자 4 버튼
                if(course_list[challenge_course_index].detailCourse[4].detailCourseQRcheck != "인증")
                {
                    course_list[challenge_course_index].detailCourse[4].detailCourseQRcheck = "인증";
                    PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                }
                break;
            case 53://숫자 5 버튼
                if(course_list[challenge_course_index].detailCourse[5].detailCourseQRcheck != "인증")
                {
                    course_list[challenge_course_index].detailCourse[5].detailCourseQRcheck = "인증";
                    PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                }
                break;
            case 48://숫자 0 버튼
                for(let iii = 1; iii < course_list[challenge_course_index].detailCourse.length-2; iii++)
                {
                    course_list[challenge_course_index].detailCourse[iii].detailCourseQRcheck = "코스QR인증여부";
                }
                PHP.update_QR_state(course_list[challenge_course_index],course_list[challenge_course_index].courseName);
                break;
        }   
    }

    // TEST를 위해 키값을 추가하여 편하게 TEST를 하게합니다~~끝~~
    



}