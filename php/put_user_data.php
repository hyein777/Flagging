<?php
/*
	파일명: put_user_data.php
	하는일:
		서버에 사용자 정보를 등록
*/
	header("Content-Type: text/html; charset=UTF-8");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

	include './config.php';

	//기본값 설정
	$user_email = $_REQUEST["user_email"];
	$user_nick_name = $_REQUEST["user_nick_name"];
	date_default_timezone_set('Asia/Seoul');
	$DATE = date("Y-m-d H:i:s"); 

	//테이블정의
	$TABLE_A = $DB_NAME.".Team_project2_user_data";
	$query = "INSERT INTO $TABLE_A (EMAIL,NAME,MILEAGE)
							VALUES ('$user_email', '$user_nick_name',0)";
	$result = mysqli_query($db_con, $query) or die("mysql_error");

	$TABLE_A = $DB_NAME.".Team_project2_mileage_history";
	$query = "INSERT INTO $TABLE_A (DATE,EMAIL,MAILEAGE_HISTORY)
							VALUES ('$DATE','$user_email', '최초 접속')";
	$result = mysqli_query($db_con, $query) or die("mysql_error");


	//종료한다.
	$db_close = mysqli_close($db_con);
?>