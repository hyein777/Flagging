<?php
/*
	파일명: update_QR_state.php
	하는일:
		QR을 인증 완료 후 서버에 업데이트
*/
	header("Content-Type: text/html; charset=UTF-8");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

	include './config.php';

	//기본값 설정
	//테이블에 삽입할 데이터 값들
    $user_email = $_REQUEST["user_email"];
	$course_name = $_REQUEST["course_name"];
	$course1 = $_REQUEST["course1"];
	$course2 = $_REQUEST["course2"];
	$course3 = $_REQUEST["course3"];
	$course4 = $_REQUEST["course4"];
	$course5 = $_REQUEST["course5"];

	//테이블정의
	$TABLE_A = $DB_NAME.".Team_project2_course";

	//데이터를 insert(삽입)하는 쿼리의 형태
	//$TABLE_A 는 우리가 삽입해야 하는 테이블 명(19번줄)
	// (삽입할 컬럼 명들)
	//VALUES(어떤 값을 넣을 거냐)
	//UPDATE 테이블이름 SET column1='value', column2='value2',... WHERE 조건컬럼명='조건내용' AND 조건컬럼명2='조건내용'
	$query = "UPDATE $TABLE_A SET COURSE1='$course1',COURSE2='$course2',COURSE3='$course3',COURSE4='$course4',COURSE5='$course5'
						WHERE EMAIL='$user_email' AND COURSE_NAME='$course_name'";
	//이거는 $query에 넣은 값을 실행을 하는 것
	$result = mysqli_query($db_con, $query) or die("mysql_error");


	//종료한다.
	$db_close = mysqli_close($db_con);
?>