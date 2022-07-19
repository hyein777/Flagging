$(function () {

	const url = window.location.search;
	const urlParams = new URLSearchParams(url);
	USER_DATA.EMAIL = urlParams.get('email');
	// urlParams.get('course_name');

	// 일단 QR 인증을 하기전에 서버에 나의 모든 정보 데이터를 가져옵니다.
	PHP.get_QR_user_course_list();
	let loop = function(){
		if(course_data_QR == null)
			setTimeout(loop,100);
		else
			user_data_parse();
	}
	loop();

	let my_lat = 0;
	let my_lng = 0;
	// 나의 현재 위도 경도를 받아온다.
	navigator.geolocation.getCurrentPosition((position) => {
		my_lat = position.coords.latitude;//위도
		my_lng = position.coords.longitude;//경도
	})
	
	
	
	// QR 코드 부분 추가 ~~ 시작 ~~
	var video = document.createElement("video");
	var canvasElement = document.getElementById("canvas");
	var canvas = canvasElement.getContext("2d");

	function drawLine(begin, end, color) {
		canvas.beginPath();
		canvas.moveTo(begin.x, begin.y);
		canvas.lineTo(end.x, end.y);
		canvas.lineWidth = 4;
		canvas.strokeStyle = color;
		canvas.stroke();
	}

	// Use facingMode: environment to attemt to get the front camera on phones
	navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
		video.srcObject = stream;
		video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
		video.play();
		requestAnimationFrame(tick);
	});

	function tick() {
		if (video.readyState === video.HAVE_ENOUGH_DATA) {
			canvasElement.hidden = false;

			canvasElement.height = video.videoHeight;
			canvasElement.width = video.videoWidth;
			canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
			var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
			var code = jsQR(imageData.data, imageData.width, imageData.height, {
				inversionAttempts: "dontInvert",
			});
			if (code) {
				drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
				drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
				drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
				drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
				// outputData.parentElement.hidden = false;
				// outputData.innerText = code.data;
				//여기서 QR 코드에 대한 부분을 넘기면 됨
				// document.body.innerHTML = code.data;
				// console.log(code.data);

				// QR에서 넘어오는 위도 경도 값
				// code.data에 전달되는 값은   상호명||위도||경도
				let targer_data = code.data.split("||")
				const target_name = targer_data[0];//상호명
				const target_lat = targer_data[1];//위도
				const target_lng = targer_data[2];//경도

				// document.body.innerHTML = getDistanceFromLatLonInKm(my_lat,my_lng,target_lat,target_lng)+" km";
				// console.log("위도~"+my_lat);
				// console.log("경도~"+my_lng);

				// console.log("타켓 상호~"+target_name);
				// console.log("타켓 위도~"+target_lat);
				// console.log("타켓 경도~"+target_lng);
				
				console.log(getDistanceFromLatLonInKm(my_lat,my_lng,target_lat,target_lng));
				if(getDistanceFromLatLonInKm(my_lat,my_lng,target_lat,target_lng) <= 0.005)//5m 근처에 있을때만 QR 인증을 받도록 하자.
				{
					// PHP.update_QR_state(urlParams.get('course_name'),);
					// course_list[i].detailCourse[j].detailCourseQRcheck

					// 넘어온 값이랑 현재 찍은 QR이랑 같은 상호인지 확인한다.
					for (let i = 0; i < course_list.length; i++) 
					{
						if(urlParams.get('course_name') == course_list[i].courseName)
						{
							for (let j = 1; j < course_list[i].detailCourse.length - 1; j++) 
							{
								if(course_list[i].detailCourse[j].detailCourseName == target_name)
								{
									course_list[i].detailCourse[j].detailCourseQRcheck = "인증";
									PHP.update_QR_state(course_list[i],course_list[i].courseName);
								}							
							}
						}
					}

					// document.body.innerHTML = code.data;
					// window.location.href = "s_index.html";
				}
				else
				{
					console.log("인식은 하였지만 5m이상 벗어났습니다");
					// document.body.innerHTML = "인식은 하였지만 5m이상 벗어났습니다";
				}
			} else {
			}
		}
		requestAnimationFrame(tick);
	}


	//2개의 위도,경도간의 거리를 계산하기 위한 함수
	function getDistanceFromLatLonInKm(lat1,lng1,lat2,lng2) {
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
	// QR 코드 부분 추가 ~~ 끝 ~~
})





let course_list = null;
function user_data_parse(){	

    //받아온 데이터 문자열 가공시작 부분
    let course_data_QR1 = course_data_QR.split("(start)");
    //각 코스별로 배열에 담긴다.
    //코스이름/코스1정보/코스2정보/코스3정보/코스4정보/코스5정보/ 이렇게 각각 들어있다.
    //각 코스 정보에는 위도경도||카테고리넘버__코스이름||코스URL||코스연락처||코스도로명주소||코스지번주소||코스QR인증여부||선택여부 이렇게 들어있다.
    let course_data_QR2 = [];
    //전체 코스별로 나눔
    for (let i = 0; i < course_data_QR1.length; i++) {
        if (course_data_QR1[i] != false) {
            course_data_QR2.push(course_data_QR1[i])
        }
    }
    course_list = new Array(course_data_QR2.length); //course_data_QR2의 길이만큼 배열의 길이가 생성된다.
    //각 전체 코스를 다시 안의 세부 코스별로 나눔
    for (let i = 0; i < course_data_QR2.length; i++) {
        //course_list[i]가 객체라고 선언해줌
        course_list[i] = {}
        //course_data_QR2[i]에 들어있는 전체 코스의 문자열을 !!를 기준으로 잘라주는 변수
        let course_split = course_data_QR2[i].split("!!");
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
            // console.log(course_list[challenge_course_index])
        }
    }
}