<?php
/*
	파일명: get_user_data.php
	하는일:
		서버에 사용자 정보가 있는가?
*/
	header("Content-Type: text/html; charset=UTF-8");
	header('Access-Control-Allow-Origin: *');
	header('Access-Control-Allow-Methods: GET, POST, OPTIONS');

	include './config.php';

	//기본값 설정
	$user_email = $_REQUEST["user_email"];
	$user_nick_name = $_REQUEST["user_nick_name"];
    $user_mileage = $_REQUEST["user_mileage"];
	//테이블정의
	$TABLE_A = $DB_NAME.".Team_project2_user_data";
	
	$query = "SELECT * FROM $TABLE_A WHERE EMAIL = '$user_email'";
	$result = mysqli_query($db_con,$query) or die("mysql_error");
	$row = mysqli_fetch_row($result);

	if($row[0])
		echo $row[0];
	else
		echo "X";

	//종료한다.
	$db_close = mysqli_close($db_con);
?>