<?php
/*
	파일명: put_challenge_mileage.php
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
	$challenge_mileage = $_REQUEST["mileage_num"];
	// $mileage_get_time = $_REQUEST["mileage_getTime"];
	date_default_timezone_set('Asia/Seoul');
	$mileage_get_time = date("Y-m-d H:i:s"); 

	//테이블정의
	$TABLE_A = $DB_NAME.".Team_project2_user_data";
	$query = "SELECT * FROM $TABLE_A WHERE EMAIL = '$user_email'";
	$result = mysqli_query($db_con,$query) or die("mysql_error1");
	$row = mysqli_fetch_row($result);
	if($row[0])
	{
		$mileage_tot = (int)$row[3] + (int)$challenge_mileage;
		$query = "UPDATE $TABLE_A SET MILEAGE='$mileage_tot' WHERE EMAIL='$user_email' ";
		$result = mysqli_query($db_con,$query) or die("mysql_error2");
	}

	$TABLE_A = $DB_NAME.".Team_project2_mileage_history";
	//데이터를 insert(삽입)하는 쿼리의 형태
	//$TABLE_A 는 우리가 삽입해야 하는 테이블 명(19번줄)
	// (삽입할 컬럼 명들)
	//VALUES(어떤 값을 넣을 거냐)
	$query = "INSERT INTO $TABLE_A (DATE,EMAIL,MAILEAGE_HISTORY)
							VALUES ('$mileage_get_time','$user_email', '$challenge_mileage')";
	//이거는 $query에 넣은 값을 실행을 하는 것
	$result = mysqli_query($db_con, $query) or die("mysql_error3");


	//종료한다.
	$db_close = mysqli_close($db_con);
?>