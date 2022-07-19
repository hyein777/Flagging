<?php
/*
	파일명: get_user_coursename.php
	하는일:
		서버에 사용자 정보가 있는가?
*/
	//utf8로 데이터를 받겠다는 뜻
	header("Content-Type: text/html; charset=UTF-8");
	//접속을 모든 브라우저에서 허용한다
	header('Access-Control-Allow-Origin: *');
	//GET,POST,OPTIONS 메서드 모두 접속을 허용한다.
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

	//이 php파일을 실행하기 전에 config.php를 실행하겠다.
	include './config.php';

	//기본값 설정
	//변수명 선언은 앞에 $표시를 무조건 붙인다
	//$_REQUEST는 GET,POST를 둘 다 엑세스 할 수 있는 메소드
    $EMAIL = $_REQUEST["EMAIL"];

	//테이블정의
	//25번 설명처럼 "닷홈DB의ID.그안에테이블명";
	// $TABLE_A = "닷홈ID.테이블명";
	$TABLE_A = $DB_NAME.".Team_project2_course";
	
	//$query는 변수명이라 바꿔도 되지만 실질적으로 검색을 하거나 업데이트하거나
	//새로 등록을 하는 등의 쿼리문을 여기에 넣는다.
	//자바스크립트에서 특정 무언가를 if나 for문으로 찾는 그런거
	//$query = "SELECT(선택을한다) 
	//*(모든 컬럼에서 이 자리에 특정 컬럼 이름,이름 이런식으로 
	//여러개를 넣어도 되고 하나를 넣어도 된다) 
	//FROM $TABLE_A(어떤 테이블을 검색할 것이냐(그 컬럼이 있는)) 
	//WHERE TEL = '$TEL'";(TEL이라는 컬럼에서 '$TEL'값이 있는지를 검색한다 *있는 자리에 선택한 범위에)
	// $query = "SELECT * FROM $TABLE_A WHERE TEL = '$TEL'";
	$query = "SELECT * FROM $TABLE_A WHERE EMAIL = '$EMAIL'";
	//36번 줄에 있는 해당 쿼리문을 실행하겠다.
	//or은 해당 쿼리가 오류가 날 경우 (괄호)안의 내용을 출력하겠다.
	//die는 함수의 return과 같은 역할로 뒤에 있는거를 실행을 안 하고 (괄호)안의 문구를 내보낸다.
	//$db_con은 config.php에 있는 변수로 아이디랑 비번이 담겨있었다.
	$result = mysqli_query($db_con,$query) or die("mysql_error");
	//$result에 담긴 실행 결과를 배열에 담아서 $row라는 변수에 담는다


	while($row = mysqli_fetch_row($result)){ //while문을 쓰면 코스 데이터가 다 들어온다.
            //echo는 document.write같은거로 화면에 보여주겠다는 뜻
            //$row[2]로 [2]는 테이블에서 해당 컬럼의 인덱스 값
            //만약 *이면 전체 기준으로 인덱스가 정해지는데,
            //몇 개중에서 검색하면 그거 순서로 인덱스가 정해진다.
            $course_name = $course_name."(start)".$row[2];
        }
    echo $course_name;


	//종료한다.
	$db_close = mysqli_close($db_con);
	// http://belikhs.dothome.co.kr/project2_test/php/get_user_coursename.php?EMAIL=naver_belikhs@hanmail.net
	// 이런식으로 들어가서 정보를 확인할 수 있다.
?>