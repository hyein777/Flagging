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
        let loop = function(){
            if(course_data != null){
                course_list_drow()
            } else{
                setTimeout(loop, 100)
            }
        }
        loop();
        PHP.get_user_course_list();
    })
}

var select_courseList = 0;
var pathDistance = 0;
var mapLevel = 0;
//내용이 너무 길어서 가독성이 떨어져서 함수로 밖으로 빼놨다.
let course_list_drow = () => {
        //지도 api를 그려주는 부분
        var mapContainer = document.getElementById('map') // 지도를 표시할 div 
        navigator.geolocation.getCurrentPosition((position) => {
            const 위도 = position.coords.latitude
            const 경도 = position.coords.longitude
            mapOption = {
                center: new kakao.maps.LatLng(Number(Latitude[select_courseList][2]),Number(Longitude[select_courseList][2])), //지도의 중심좌표.
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
            // map.removeControl(zoomControl, kakao.maps.ControlPosition.TOPLEFT);
            map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMLEFT);
    
            // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
            kakao.maps.event.addListener(map, 'zoom_changed', function () {
                // 지도의 현재 레벨을 얻어옵니다
                var level = map.getLevel();
            });
            // 선을 구성하는 좌표 배열입니다. 이 좌표들을 이어서 선을 표시합니다
            var linePath = new Array()
            for(let j = 0; j < course_list[select_courseList].detailCourse.length-2; j++){
                if(course_list[select_courseList].detailCourse[j+1].detailCourseOrderNum != "undefined"){
                    linePath.push(
                        new kakao.maps.LatLng(Number(Latitude[select_courseList][j]),Number(Longitude[select_courseList][j]))
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
                imageSize = new kakao.maps.Size(57, 33); // 마커이미지의 크기입니다
    
            // 마커의 이미지정보를 가지고 있는 마커이미지를 생성합니다
            var markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);
            var flagmarker = new Array()
            for(let j = 0; j < course_list[select_courseList].detailCourse.length-2; j++){
                if(course_list[select_courseList].detailCourse[j+1].detailCourseOrderNum != "undefined"){
                    flagmarker.push({
                        latlng: new kakao.maps.LatLng(Number(Latitude[select_courseList][j]),Number(Longitude[select_courseList][j]))
                    })
                }
            }

            for (var i = 0; i < flagmarker.length; i ++) {
                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    map: map, // 마커를 표시할 지도
                    position: flagmarker[i].latlng, // 마커를 표시할 위치
                    image : markerImage // 마커 이미지 
                });
            }

        })


    //받아온 데이터 문자열 가공시작 부분
    let course_data1 = course_data.split("(start)");
    //각 코스별로 배열에 담긴다.
    //코스이름/코스1정보/코스2정보/코스3정보/코스4정보/코스5정보/ 이렇게 각각 들어있다.
    //각 코스 정보에는 위도경도||카테고리넘버__코스이름||코스URL||코스연락처||코스도로명주소||코스지번주소||코스QR인증여부||선택여부 이렇게 들어있다.
    let course_data2 = [];
    //전체 코스별로 나눔
    for(let i = 0; i < course_data1.length; i++){
        if (course_data1[i] != false){
            course_data2.push(course_data1[i])
        }
    }
    let course_list = new Array(course_data2.length); //course_data2의 길이만큼 배열의 길이가 생성된다.
    //각 전체 코스를 다시 안의 세부 코스별로 나눔
    for(let i = 0; i < course_data2.length; i++){
        //course_list[i]가 객체라고 선언해줌
        course_list[i] = {}
        //course_data2[i]에 들어있는 전체 코스의 문자열을 !!를 기준으로 잘라주는 변수
        let course_split = course_data2[i].split("!!");
        //course_list[i].courseName에 전체 코스의 이름을 저장
        course_list[i].courseName = course_split[0];
        //course_list[i].detailCourse에 상세 코스들을 배열로 저장하기 위해 배열이라고 선언
        course_list[i].detailCourse = new Array(course_split.length); // course_split.length가 7이라 course_list[i].detailCourse의 개수도 7개가 생성됨
        //course_list[i].detailCourse의 개수가 7개라 빈 배열이 2개 더 생성이 되므로 항상 데이터를 가져올 때 빈 배열을 빼라고 해줘야함
        for(let j = 1; j < course_split.length-1; j++){ //course_split 생성 당시 "!!"로 나누다 보니 뒤에 빈 배열을 자르려고 -1을 해줌
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
    }

    
    //코스 위도, 경도 배열로 저장
    let Latitude = new Array(course_list.length);
    let Longitude = new Array(course_list.length);
    for(let i = 0; i < Latitude.length; i++){
        Latitude[i] = new Array();
        Longitude[i] = new Array();
        for(let j = 0; j < course_list[i].detailCourse.length-2; j++){
            Latitude[i].push(course_list[i].detailCourse[j+1].detailCourseLatitude);
            Longitude[i].push(course_list[i].detailCourse[j+1].detailCourseLongitude);
        }
    }

    //리스트에 db에서 받아온 코스 보여주기
    let resimg = (img) => {
        let imgdiv = "<img src='../src/usercourse/marker" + img + ".png'>";
        return imgdiv
    }
    let listmarkerimg = (img) => {
        let listimgdiv = "<div class='listimgdiv'><img src='../src/img/listmarker" + img + ".svg'></div>";
        return listimgdiv
    }
    let starmarker = "<img src='../src/usercourse/bookmark.png'>";
    function showList() {
        var list = "";
        for(var j = 0; j < course_list.length; j++){
                list += "<div id='course_list"+j+"'><div id = 'course_name'>"+course_list[j].courseName+"<div id='btn_wrap'><div id='delete_btn'><img src='../src/icon/delete.svg'></div><div id='course_btn"+j+"'><img src='../src/icon/list-check.svg'></div></div></div>";
                list += "<div id='detail_course_ul"+j+"'><ul>";
                for (var i = 1; i < course_list[j].detailCourse.length-1; i++) {
                    if(course_list[j].detailCourse[i].detailCourseOrderNum != "undefined"){
                        list += "<li id='shadow'>" + listmarkerimg(course_list[j].detailCourse[i].detailCourseOrderNum) + course_list[j].detailCourse[i].detailCourseName + "<span id='a" + i +
                        "' class='close'>" + starmarker + "</span></li>";
                    }
                }
                list += "</ul>";
                list += "<div id='btndiv'><button id = 'savebt'>챌린지 시작하기</button></div></div></div>"
        }
        document.querySelector('#detail_course_list').innerHTML = list;
    }
    showList()
    
    //버튼 눌러서 상세 코스 보여주는 부분
    for(var j = 0; j < course_list.length; j++){
        let ShowList=$("#detail_course_ul"+j);
        let ShowBtn=$("#course_btn"+j);
        ShowList.css("display","none");
        ShowList.css("padding","16px 0 0 0");
        ShowBtn.css("display","flex");
        ShowBtn.css("justify-content","center");
        ShowBtn.css("align-item","center");
        ShowBtn.css("padding","8px 16px 8px 8px");
        ShowBtn.css("cursor","pointer");
        $("#course_list"+j+" #delete_btn").on("click",DeleteToDb);
        if(j == 0){
            ShowList.css("display","block");
            $("#detail_course_ul0 #savebt").on("click",ChallengeToDb);
        }

        if(course_list.length == 1){
            $("#course_btn0").css("display","none");
        }

        ShowBtn.on("click",function (){
            let cur_id = $(this).attr('id');
            let id_num = cur_id.slice(10,cur_id.length);
            select_courseList = Number(id_num);
            course_list_drow()
            if($("#detail_course_ul"+id_num).css("display") == "none"){
                for(var i = 0; i < course_list.length; i++){
                    $("#detail_course_ul"+i).css("display","none");
                    $("#detail_course_ul"+id_num+" #savebt").off("click",ChallengeToDb);
                }
                $("#detail_course_ul"+id_num).css("display","block");
                $("#detail_course_ul"+id_num+" #savebt").on("click",ChallengeToDb);
            } 
        });

        map_Level()

    }

    //mapLevel 계산하는 부분
    function map_Level () {
        var pathCount = 0;
        pathDistance = 0;
        mapLevel = 0;
        for(var i = 0; i < Latitude[select_courseList].length; i++){
            if(isNaN(parseInt(Latitude[select_courseList][i])) == false){
                pathCount++
            }
        }
        for(var j = pathCount; j > 1; j--){
            pathDistance += getDistance(Number(Latitude[select_courseList][j-1]),Number(Longitude[select_courseList][j-1]),Number(Latitude[select_courseList][j-2]),Number(Longitude[select_courseList][j-2]));
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
            mapLevel = 4;
        }
    }

    //버튼으로 db에 보내는 부분
    let savebt = document.getElementById("savebt")
    function ChallengeToDb(){
        let challengeTime = new Date()
        PHP.update_challenge_course(course_list[select_courseList], challengeTime)
        location.href='s_index.html';
    }

    //0627_희수_수정
    //delete 버튼으로 db에서 삭제하는 부분
    let delete_btn = document.getElementById("delete_btn")
    function DeleteToDb(){
        PHP.delete_course(course_list[select_courseList].courseName);
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
}