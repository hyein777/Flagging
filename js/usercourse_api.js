$(function () {
    const script_element = document.createElement('script');
    script_element.setAttribute('src', '//dapi.kakao.com/v2/maps/sdk.js?appkey='+KAKAO_API_KEY+'&autoload=false&libraries=services');
    script_element.addEventListener('load',load_after)
    document.querySelector('head').appendChild(script_element);
})


function load_after(){
    // v3가 모두 로드된 후, 이 콜백 함수가 실행됩니다.
    kakao.maps.load(function() {
        // 마커를 클릭했을 때 해당 장소의 상세정보를 보여줄 커스텀오버레이입니다
        var placeOverlay = new kakao.maps.CustomOverlay({
            zIndex: 1
        }),
        contentNode = document.createElement('div'), // 커스텀 오버레이의 컨텐츠 엘리먼트 입니다 
        markers = [], // 마커를 담을 배열입니다
        currCategory = ''; // 현재 선택된 카테고리를 가지고 있을 변수입니다

        var mapContainer = document.getElementById('map') // 지도를 표시할 div 
        navigator.geolocation.getCurrentPosition((position) => {
            const 위도 = position.coords.latitude
            const 경도 = position.coords.longitude
            mapOption = {
                center: new kakao.maps.LatLng(위도, 경도), //지도의 중심좌표.
                level: 3 //지도의 레벨(확대, 축소 정도)
            };
            // 지도를 생성합니다    
            var map = new kakao.maps.Map(mapContainer, mapOption);

            //본인 위치 마커 생성
            const markerPosition = new kakao.maps.LatLng(위도, 경도);

            const marker = new kakao.maps.Marker({
                position: markerPosition
            });
            marker.setMap(map);

            // 장소 검색 객체를 생성합니다
            var ps = new kakao.maps.services.Places(map);

            // 지도에 idle 이벤트를 등록합니다
            kakao.maps.event.addListener(map, 'idle', searchPlaces);

            // 커스텀 오버레이의 컨텐츠 노드에 css class를 추가합니다 
            contentNode.className = 'placeinfo_wrap';

            // 커스텀 오버레이의 컨텐츠 노드에 mousedown, touchstart 이벤트가 발생했을때
            // 지도 객체에 이벤트가 전달되지 않도록 이벤트 핸들러로 kakao.maps.event.preventMap 메소드를 등록합니다 
            addEventHandle(contentNode, 'mousedown', kakao.maps.event.preventMap);
            addEventHandle(contentNode, 'touchstart', kakao.maps.event.preventMap);

            // 커스텀 오버레이 컨텐츠를 설정합니다
            placeOverlay.setContent(contentNode);

            // 각 카테고리에 클릭 이벤트를 등록합니다
            addCategoryClickEvent();

            // 엘리먼트에 이벤트 핸들러를 등록하는 함수입니다
            function addEventHandle(target, type, callback) {
                if (target.addEventListener) {
                    target.addEventListener(type, callback);
                } else {
                    target.attachEvent('on' + type, callback);
                }
            }

            // 카테고리 검색을 요청하는 함수입니다
            function searchPlaces() {
                if (!currCategory) {
                    return;
                }

                // 커스텀 오버레이를 숨깁니다 
                // placeOverlay.setMap(null);

                // 지도에 표시되고 있는 마커를 제거합니다
                removeMarker();

                ps.categorySearch(currCategory, placesSearchCB, {
                    useMapBounds: true
                });
            }

            // 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
            function placesSearchCB(data, status, pagination) {
                if (status === kakao.maps.services.Status.OK) {

                    // 정상적으로 검색이 완료됐으면 지도에 마커를 표출합니다
                    displayPlaces(data);
                } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
                    // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요

                } else if (status === kakao.maps.services.Status.ERROR) {
                    // 에러로 인해 검색결과가 나오지 않은 경우 해야할 처리가 있다면 이곳에 작성해 주세요

                }
            }

            // 지도에 마커를 표출하는 함수입니다
            function displayPlaces(places) {

                // 몇번째 카테고리가 선택되어 있는지 얻어옵니다
                // 이 순서는 스프라이트 이미지에서의 위치를 계산하는데 사용됩니다
                var order = document.getElementById(currCategory).getAttribute('data-order');
                resimg(order);



                for (var i = 0; i < places.length; i++) {

                    // 마커를 생성하고 지도에 표시합니다
                    var marker = addMarker(new kakao.maps.LatLng(places[i].y, places[i].x), order);

                    // 마커와 검색결과 항목을 클릭 했을 때
                    // 장소정보를 표출하도록 클릭 이벤트를 등록합니다
                    (function (marker, place) {
                        kakao.maps.event.addListener(marker, 'click', function () {
                            markerpanTo(place.x, place.y, function () {
                                setTimeout(() => {
                                    displayPlaceInfo(place)
                                }, 100)
                            })
                            // displayPlaceInfo(place);
                        });
                    })(marker, places[i]);
                }
            }
            // 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
            function addMarker(position, order) {
                var imageSrc = "../src/usercourse/marker" + order + ".png",
                    imageSize = new kakao.maps.Size(27, 28), // 마커 이미지의 크기
                    markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize),
                    marker = new kakao.maps.Marker({
                        position: position, // 마커의 위치
                        image: markerImage
                    });

                marker.setMap(map); // 지도 위에 마커를 표출합니다
                markers.push(marker); // 배열에 생성된 마커를 추가합니다

                return marker;
            }

            // 지도 위에 표시되고 있는 마커를 모두 제거합니다
            function removeMarker() {
                for (var i = 0; i < markers.length; i++) {
                    markers[i].setMap(null);
                }
                markers = [];
            }



            // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수입니다
            function displayPlaceInfo(place) {
                let order_num = document.getElementById(currCategory).getAttribute('data-order');
                var content = '<div class="placeinfo popup_bg' + order_num + '">' +
                    '   <div class="title"><div class="place_name">' + place.place_name + '</div><div class="popup_bookmark"></div><div id="popup_close" class="popup_close"></div></div>';

                if (place.road_address_name) {
                    content += '<div id="overlay_info"><div id="overlay_img"></div><div id="overlay_text"><span class="roadad" title="' + place.road_address_name + '">' + place
                        .road_address_name +
                        '</span>' +
                        '  <span class="jibun" title="' + place.address_name + '">(지번 : ' + place.address_name +
                        ')</span>';
                } else {
                    content += '    <span title="' + place.address_name + '">' + place.address_name +
                        '</span>';
                }

                content += '    <span class="tel">' + place.phone + '</span>' +
                    '<button id="linkbtn"><a href="' + place.place_url + '" target="_blank" title="' + place
                    .place_name + '">상세정보</a></button></div></div></div>' +
                    '<div class="after"></div>';

                contentNode.innerHTML = content;
                placeOverlay.setPosition(new kakao.maps.LatLng(place.y, place.x));
                placeOverlay.setMap(map);

                //북마크에 온클릭 이벤트 추가
                let bmark = document.querySelector(".popup_bookmark");
                bmark.onclick = function () {
                    paName(place.place_name, place.x, place.y, place.phone, place.place_url, place
                        .road_address_name, place.address_name)
                }

                //오버레이 X버튼으로 닫는 구간
                let closebtn = document.getElementById("popup_close");
                closebtn.addEventListener("click", function (e) {
                    overlay_close(e.currentTarget)
                })

                function overlay_close() {
                    placeOverlay.setMap(null);
                }

                //아래 리스트에 추가된 항목의 오버레이 북마크 버튼을 컬러로 바꾸는 구간
                for (i = 0; i < pName.length; i++) {
                    if (pName[i] == place.place_name) {
                        document.querySelector(".popup_bookmark").style.background = 'url(../src/icon/bookmark.svg)';
                    }
                }

                //오버레이에 들어갈 이미지검색API실행
                kakaoImgApiInsert(place.place_name);
            }

            function markerpanTo(x, y, callback) {
                // 이동할 위도 경도 위치를 생성합니다 
                var markermove = new kakao.maps.LatLng(y, x);
                // 지도 중심을 부드럽게 이동시킵니다
                // 만약 이동할 거리가 지도 화면보다 크면 부드러운 효과 없이 이동합니다
                map.panTo(markermove);
                callback();
            }

            // 각 카테고리에 클릭 이벤트를 등록합니다
            function addCategoryClickEvent() {
                var category = document.getElementById('category'),
                    children = category.children;

                for (var i = 0; i < children.length; i++) {
                    children[i].onclick = onClickCategory;
                }
            }

            // 카테고리를 클릭했을 때 호출되는 함수입니다
            function onClickCategory() {
                var id = this.id,
                    className = this.className;

                placeOverlay.setMap(null);

                if (className === 'on') {
                    currCategory = '';
                    changeCategoryClass();
                    removeMarker();
                } else {
                    currCategory = id;
                    changeCategoryClass(this);
                    searchPlaces();
                }
            }

            // 클릭된 카테고리에만 클릭된 스타일을 적용하는 함수입니다
            function changeCategoryClass(el) {
                var category = document.getElementById('category'),
                    children = category.children,
                    i;

                for (i = 0; i < children.length; i++) {
                    children[i].className = '';
                }

                if (el) {
                    el.className = 'on';
                }
            }

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



            // // 지도 확대, 축소 컨트롤에서 확대 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
            // var zoomIn1 = document.getElementById('qwe1');
            //   zoomIn1.addEventListener('click',zoomIn);
            // function zoomIn() {
            //     map.setLevel(map.getLevel() - 1);
            // }

            // // 지도 확대, 축소 컨트롤에서 축소 버튼을 누르면 호출되어 지도를 확대하는 함수입니다
            // var zoomIn2 = document.getElementById('qwe2');
            //   zoomIn2.addEventListener('click',zoomOut);
            // function zoomOut() {
            //     map.setLevel(map.getLevel() + 1);
            // }

            // 기본 지도 확대 축소를 제어할 수 있는  줌 컨트롤을 생성합니다
            var zoomControl = new kakao.maps.ZoomControl();
            map.addControl(zoomControl, kakao.maps.ControlPosition.BOTTOMRIGHT);

            // 지도가 확대 또는 축소되면 마지막 파라미터로 넘어온 함수를 호출하도록 이벤트를 등록합니다
            kakao.maps.event.addListener(map, 'zoom_changed', function () {
                // 지도의 현재 레벨을 얻어옵니다
                var level = map.getLevel();
                console.log("현재 지도 크기 레빌: " + level)
            });
        })

        //좌표랑 이름을 받아와서 리스트에 넣는 부분
        let XY = [];
        let pName = [];
        let category_num = [];
        let pPhone = [];
        let pUrl = [];
        let praddress = [];
        let paddress = [];
        let starmarker = "<img src='../src/usercourse/bookmark.png'>";

        let paName = (name, pX, pY, phone, url, roadaddress, address) => {
            for (i = 0; i < XY.length; i++) {
                let aa = XY[i].split("||");
                if (Number(aa[0]) == Number(pX) && Number(aa[1]) == Number(pY)) {
                    // alert("중복된 코스입니다.")
                    let bbb = "a"+i
                    console.log(bbb);
                    removeList(bbb);
                    return;
                }
                if (pName.length > 4) {
                    alert("목록의 최대 개수는 5개입니다.")
                    return;
                }
            }
            document.querySelector(".popup_bookmark").style.background = 'url(../src/icon/bookmark.svg)';
            pName.push(name);
            XY.push(pX + "||" + pY);
            category_num.push(document.getElementById(currCategory).getAttribute('data-order'))
            if (phone != false) {
                pPhone.push(phone);
            } else {
                pPhone.push("　");
            }
            if (url != false) {
                pUrl.push(url);
            } else {
                pUrl.push("　");
            }
            if (roadaddress != false) {
                praddress.push(roadaddress);
            } else {
                praddress.push("　");
            }
            if (address != false) {
                paddress.push(address)
            } else {
                paddress.push("　")
            }
            addList();
        }
        let resimg = (img) => {
            let imgdiv = "<img src='../src/usercourse/marker" + img + ".png'>";
            return imgdiv
        }

        let listmarkerimg = (img) => {
            let listimgdiv = "<div class='listimgdiv'><img src='../src/img/listmarker" + img + ".svg'></div>";
            return listimgdiv
        }


        //체크 되면 리스트에 넣고 해제되면 리스트에서 빠져야하고
        function addList() {
            showList();
        }

        function showList() {
            var list = "<ul>"
            for (var i = 0; i < pName.length; i++) {
                list += "<li id='shadow'>" + listmarkerimg(category_num[i]) + pName[i] + "<span id='a" + i +
                    "' class='close'>" + starmarker + "</span></li>";
            }
            list += "</ul>";
            document.querySelector('#checklist').innerHTML = list;
            for (var i = 0; i < pName.length; i++) {
                let listclise_id = "a" + i;
                let listclise = document.getElementById(listclise_id);
                listclise.addEventListener("click", function (e) {
                    removeList(e.currentTarget.id)
                });
            }
            if (pName.length >= 3) {
                document.getElementById("courseName").style.display = "block"
                document.getElementById("savebt").style.backgroundColor = "#000070"
                savebt.addEventListener("click", courseToDb);
            }
        }

        function removeList(i) {
            var bb = parseInt(i.substring(1, 2));
            pName.splice(bb, 1);
            XY.splice(bb, 1);
            category_num.splice(bb, 1);
            pPhone.splice(bb, 1);
            pUrl.splice(bb, 1);
            praddress.splice(bb, 1);
            paddress.splice(bb, 1);
            if (pName.length < 3) {
                document.getElementById("courseName").style.display = "none"
                document.getElementById("savebt").style.backgroundColor = "#8b8b8b"
                savebt.removeEventListener("click", courseToDb);
            }
            showList();
            document.querySelector(".popup_bookmark").style.background = 'url(../src/icon/bookmark_g.svg)';
        }


        //오버레이에 이미지 땡겨오는거
        function kakaoImgApiInsert(overlay_name) {
            //https://developers.kakao.com/tool/rest-api/open/get/v2-search-image
            console.log(overlay_name)
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
                        document.querySelector("#overlay_img").innerHTML = '<img src="' + this.image_url + '" onerror="this.src=`../src/img/noimage.png`" />'
                        // $("#overlay_img").append('<img src="'+this.image_url+'" />');
                    });
                },
                error: function (xhr, textStatus) {
                    console.log(xhr.responseText);
                    console.log("에러");
                    return;
                }
            });
        }

        //버튼으로 db에 보내는 부분
        let savebt = document.getElementById("savebt");

        function courseToDb() {
            let Ucoursename = document.getElementById("courseName").value
            if (Ucoursename == false) {
                alert("코스의 이름을 정해주세요.");
                return;
            }
            let loop = function () {
                if (course_name != null) {
                    let name_list = course_name.split("(start)");
                    console.log(name_list);
                    for (var i = 1; i < name_list.length; i++) {
                        if (name_list[i] == Ucoursename) {
                            alert("동일한 코스 이름이 있습니다.");
                            return;
                        }
                    }
                    PHP.put_user_course(XY, pName, category_num, pPhone, pUrl, praddress, paddress, Ucoursename)
                    btnconfirm();
                } else {
                    setTimeout(loop, 100)
                }
            }
            loop();
            PHP.get_user_coursename();

        }

        //0627_희수_수정
        function btnconfirm(){
            var confirmbtn = confirm("코스 목록으로 이동합니다.");
            if(confirmbtn == true){
                location.href =  'h_usercourslist.html';
            } else {
                location.reload();
            }
        }

        $("#header_img").on("click", function(){
            // history.back();
            window.location.href = "index.html";
        })
    });
}
