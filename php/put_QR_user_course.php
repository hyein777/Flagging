<?php
/*
	파일명: put_QR_user_course.php
	하는일:
		서버에 사용자 정보를 등록
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
	$query = "INSERT INTO $TABLE_A (EMAIL,COURSE_NAME,COURSE1,COURSE2,COURSE3,COURSE4,COURSE5)
							VALUES ('$user_email', '$course_name', '$course1', '$course2', '$course3', '$course4', '$course5')";
	//이거는 $query에 넣은 값을 실행을 하는 것
	$result = mysqli_query($db_con, $query) or die("mysql_error");


	//종료한다.
	$db_close = mysqli_close($db_con);
?>