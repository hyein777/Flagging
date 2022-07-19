<?php

// 자기꺼에 맞게 DB 주석 해제
	$DB_NAME = "ds6546";//용현
	// $DB_NAME = "belikhs";//희수
	// $DB_NAME = "zktyvod";//혜인
	// $DB_NAME = "dlscjf351";//인철
	// $DB_NAME = "ksy990609";//수연

	$db_con = mysqli_connect("localhost", $DB_NAME, "비밀번호");
	$db_select = mysqli_select_db($db_con,$DB_NAME);
	mysqli_query($db_con,"set names utf8");

	function db_close()
	{
		$db_close = mysqli_close($db_con);
	}	

?>