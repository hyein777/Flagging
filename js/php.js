var PHP =
{
};


PHP.get_user_data = function()
{
   var server_url = DOTHOME_URL+"/Team_project2/php/get_user_data.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
       //여기 전달할 값을 넣는다
      'user_email' : USER_DATA.EMAIL,
      'user_nick_name' : USER_DATA.NICK_NAME,
      'user_mileage' : USER_DATA.MILEAGE,
   },
   function(data) // first success
   {
       //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_user_data ~ data : "+data);
      //만약에 데이터가 없어서 X가 오면 put을 실행해서 신규 입력을 한다.
      if(data == 'X'){
        PHP.put_user_data();
      } else
         USER_DATA_GET_CHECK = true;
   })
   .fail(function(e){
       //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_user_data().fail:"+e); 
      // console.log(e); 
   });
}


PHP.put_user_data = function()
{
   var server_url = DOTHOME_URL+"/Team_project2/php/put_user_data.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
       //여기 전달할 값을 넣는다
      'user_email' : USER_DATA.EMAIL,
      'user_nick_name' : USER_DATA.NICK_NAME,
      'user_mileage' : USER_DATA.MILEAGE,
   },
   function(data) // first success
   {
      //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.put_user_data ~ data : "+data);
      USER_DATA_GET_CHECK = true;
   })
   .fail(function(e){
       //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.put_user_data().fail:"+e); 
      // console.log(e); 
   });
}

/********************************************************
                              마일리지  ~ 시작 ~
 *******************************************************/
PHP.get_user_mileage = function(){
   var server_url = DOTHOME_URL+"/Team_project2/php/get_user_mileage.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url, // POST 방식으로 서버에 HTTP Request를 보냄.
   //$.post(URL 주소[,데이터][,콜백함수]);
   {
         //여기 전달할 값을 넣는다
      'EMAIL' : USER_DATA.EMAIL
   },
   function (data) // first success
   {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_user_mileage ~ data : "+ data);
      var mileage_data = data;
      $('.saveMileage').text(utilGetNumber_withComma(mileage_data+"")+" M");
      //천단위 콤마 찍어주는 함수
      function utilGetNumber_withComma(value)
      {
         var str1, str2, str3, str;
         var num1, num2, strLen;
         strLen = value.length;
         if (strLen > 6)
         {
               num1 = strLen - 3;
               str1 = value.slice(num1, strLen);
               num2 = strLen - 6;
               str2 = value.slice(num2, num1);
               str3 = value.slice(0, num2);
               str = str3+','+ str2 + ',' + str1;
         } else if (strLen > 3)
         {
               num1 = strLen - 3;
               str1 = value.slice(num1, strLen);
               str2 = value.slice(0, num1);
               str = str2 + ',' + str1;
         } else
         {
               str = value;
         }
               return str;

      }
   })
   .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_user_mileage().fail:"+e); 
      // console.log(e); 
   });
}


var mileageHistory = null;
PHP.get_mileage_history = function(){
   var server_url = DOTHOME_URL+"/Team_project2/php/get_mileage_history.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url, // POST 방식으로 서버에 HTTP Request를 보냄.
   //$.post(URL 주소[,데이터][,콜백함수]);
   {
         //여기 전달할 값을 넣는다
      'EMAIL' : USER_DATA.EMAIL
   },
   function (data) // first success
   {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_mileage_history ~ data : "+ data);
      mileageHistory  = data;
   })
   .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_mileage_history().fail:"+e); 
      // console.log(e); 
   });
}
/********************************************************
                              마일리지  ~ 끝 ~
 *******************************************************/








var course_data = null;
PHP.get_user_course_list = function()
{
   var server_url = DOTHOME_URL+"/Team_project2/php/get_user_course_list.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
         //여기 전달할 값을 넣는다
      'EMAIL' : USER_DATA.EMAIL
   },
   function(data) // first success
   {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_user_course_list ~ data : ");
      //   console.log("~success~ PHP.get_user_course_list ~ data : "+data);
      course_data = data;
      if(course_data == '')
      {
         if(location.href.indexOf("s_index.html") == -1)
         {
            if(!alert("코스 목록이 없습니다."))
               location.href = "index.html";
         }
      }
   })
   .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_user_course_list().fail:"+e); 
      // console.log(e); 
   });
}

//get_user_data.php 파일에서 "heesoo"라는 이름을 DB에서 찾는 거를 실행한다

var course_name = null;

PHP.get_user_coursename = function()
{
   var server_url = DOTHOME_URL+"/Team_project2/php/get_user_coursename.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
         //여기 전달할 값을 넣는다
      'EMAIL' : USER_DATA.EMAIL
   },
   function(coursename) // first success
   {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_user_coursename ~ data : "+coursename);
      //   console.log("~success~ PHP.get_user_coursename ~ data : "+data);
      course_name = coursename;
   })
   .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_user_coursename().fail:"+e); 
      // console.log(e); 
   });
}





PHP.put_user_course = function(XY, pName, category_num, pPhone, pUrl, praddress, paddress, Ucoursename)
      {
      var server_url = DOTHOME_URL+"/Team_project2/php/put_user_course.php";

      //server_url에 해당하는 주소로 접속을 하고
      $.post(server_url,
      {
         //여기 전달할 값을 넣는다
         'user_email' : USER_DATA.EMAIL,
         'course_name' : Ucoursename,
         'course1' : XY[0]+"||"+category_num[0]+"__"+pName[0]+"||"+pUrl[0]+"||"+pPhone[0]+"||"+praddress[0]+"||"+paddress[0]+"||코스QR인증여부||선택여부||0",
         'course2' : XY[1]+"||"+category_num[1]+"__"+pName[1]+"||"+pUrl[1]+"||"+pPhone[1]+"||"+praddress[1]+"||"+paddress[1]+"||코스QR인증여부||선택여부||0",
         'course3' : XY[2]+"||"+category_num[2]+"__"+pName[2]+"||"+pUrl[2]+"||"+pPhone[2]+"||"+praddress[2]+"||"+paddress[2]+"||코스QR인증여부||선택여부||0",
         'course4' : XY[3]+"||"+category_num[3]+"__"+pName[3]+"||"+pUrl[3]+"||"+pPhone[3]+"||"+praddress[3]+"||"+paddress[3]+"||코스QR인증여부||선택여부||0",
         'course5' : XY[4]+"||"+category_num[4]+"__"+pName[4]+"||"+pUrl[4]+"||"+pPhone[4]+"||"+praddress[4]+"||"+paddress[4]+"||코스QR인증여부||선택여부||0",
      },
      function(data) // first success
      {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
         console.log("~success~ PHP.put_user_course ~ data : "+data);
      })
      .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
         console.log("Error in PHP.put_user_course().fail:"+e); 
         // console.log(e); 
      });
      }


PHP.update_challenge_cancel = function(course, cancelTime)
      {
      var server_url = DOTHOME_URL+"/Team_project2/php/update_challenge_cancel.php";

      //server_url에 해당하는 주소로 접속을 하고
      $.post(server_url,
      {
         //여기 전달할 값을 넣는다
         'user_email' : USER_DATA.EMAIL,
         'course_name' : course.courseName,
         'course1' : course.detailCourse[1].detailCourseLongitude+"||"+course.detailCourse[1].detailCourseLatitude+"||"+course.detailCourse[1].detailCourseOrderNum+"__"+course.detailCourse[1].detailCourseName+"||"+course.detailCourse[1].detailCourseUrl+"||"+course.detailCourse[1].detailCourseTel+"||"+course.detailCourse[1].detailCourseRaddress+"||"+course.detailCourse[1].detailCourseAddress+"||코스QR인증여부||선택여부||"+cancelTime,
         'course2' : course.detailCourse[2].detailCourseLongitude+"||"+course.detailCourse[2].detailCourseLatitude+"||"+course.detailCourse[2].detailCourseOrderNum+"__"+course.detailCourse[2].detailCourseName+"||"+course.detailCourse[2].detailCourseUrl+"||"+course.detailCourse[2].detailCourseTel+"||"+course.detailCourse[2].detailCourseRaddress+"||"+course.detailCourse[2].detailCourseAddress+"||코스QR인증여부||선택여부||"+cancelTime,
         'course3' : course.detailCourse[3].detailCourseLongitude+"||"+course.detailCourse[3].detailCourseLatitude+"||"+course.detailCourse[3].detailCourseOrderNum+"__"+course.detailCourse[3].detailCourseName+"||"+course.detailCourse[3].detailCourseUrl+"||"+course.detailCourse[3].detailCourseTel+"||"+course.detailCourse[3].detailCourseRaddress+"||"+course.detailCourse[3].detailCourseAddress+"||코스QR인증여부||선택여부||"+cancelTime,
         'course4' : course.detailCourse[4].detailCourseLongitude+"||"+course.detailCourse[4].detailCourseLatitude+"||"+course.detailCourse[4].detailCourseOrderNum+"__"+course.detailCourse[4].detailCourseName+"||"+course.detailCourse[4].detailCourseUrl+"||"+course.detailCourse[4].detailCourseTel+"||"+course.detailCourse[4].detailCourseRaddress+"||"+course.detailCourse[4].detailCourseAddress+"||코스QR인증여부||선택여부||"+cancelTime,
         'course5' : course.detailCourse[5].detailCourseLongitude+"||"+course.detailCourse[5].detailCourseLatitude+"||"+course.detailCourse[5].detailCourseOrderNum+"__"+course.detailCourse[5].detailCourseName+"||"+course.detailCourse[5].detailCourseUrl+"||"+course.detailCourse[5].detailCourseTel+"||"+course.detailCourse[5].detailCourseRaddress+"||"+course.detailCourse[5].detailCourseAddress+"||코스QR인증여부||선택여부||"+cancelTime,
      },
      function(data) // first success
      {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
         console.log("~success~ PHP.update_challenge_cancel ~ data : "+data);
      })
      .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
         console.log("Error in PHP.update_challenge_cancel().fail:"+e); 
         // console.log(e); 
      });
      }


PHP.update_challenge_course = function(course,challengeTime)
      {
      var server_url = DOTHOME_URL+"/Team_project2/php/update_challenge_course.php";

      //server_url에 해당하는 주소로 접속을 하고
      $.post(server_url,
      {
         //여기 전달할 값을 넣는다
         'user_email' : USER_DATA.EMAIL,
         'course_name' : course.courseName,
         'course1' : course.detailCourse[1].detailCourseLongitude+"||"+course.detailCourse[1].detailCourseLatitude+"||"+course.detailCourse[1].detailCourseOrderNum+"__"+course.detailCourse[1].detailCourseName+"||"+course.detailCourse[1].detailCourseUrl+"||"+course.detailCourse[1].detailCourseTel+"||"+course.detailCourse[1].detailCourseRaddress+"||"+course.detailCourse[1].detailCourseAddress+"||코스QR인증여부||선택||"+challengeTime,
         'course2' : course.detailCourse[2].detailCourseLongitude+"||"+course.detailCourse[2].detailCourseLatitude+"||"+course.detailCourse[2].detailCourseOrderNum+"__"+course.detailCourse[2].detailCourseName+"||"+course.detailCourse[2].detailCourseUrl+"||"+course.detailCourse[2].detailCourseTel+"||"+course.detailCourse[2].detailCourseRaddress+"||"+course.detailCourse[2].detailCourseAddress+"||코스QR인증여부||선택||"+challengeTime,
         'course3' : course.detailCourse[3].detailCourseLongitude+"||"+course.detailCourse[3].detailCourseLatitude+"||"+course.detailCourse[3].detailCourseOrderNum+"__"+course.detailCourse[3].detailCourseName+"||"+course.detailCourse[3].detailCourseUrl+"||"+course.detailCourse[3].detailCourseTel+"||"+course.detailCourse[3].detailCourseRaddress+"||"+course.detailCourse[3].detailCourseAddress+"||코스QR인증여부||선택||"+challengeTime,
         'course4' : course.detailCourse[4].detailCourseLongitude+"||"+course.detailCourse[4].detailCourseLatitude+"||"+course.detailCourse[4].detailCourseOrderNum+"__"+course.detailCourse[4].detailCourseName+"||"+course.detailCourse[4].detailCourseUrl+"||"+course.detailCourse[4].detailCourseTel+"||"+course.detailCourse[4].detailCourseRaddress+"||"+course.detailCourse[4].detailCourseAddress+"||코스QR인증여부||선택||"+challengeTime,
         'course5' : course.detailCourse[5].detailCourseLongitude+"||"+course.detailCourse[5].detailCourseLatitude+"||"+course.detailCourse[5].detailCourseOrderNum+"__"+course.detailCourse[5].detailCourseName+"||"+course.detailCourse[5].detailCourseUrl+"||"+course.detailCourse[5].detailCourseTel+"||"+course.detailCourse[5].detailCourseRaddress+"||"+course.detailCourse[5].detailCourseAddress+"||코스QR인증여부||선택||"+challengeTime,
      },
      function(data) // first success
      {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
         console.log("~success~ PHP.update_challenge_course ~ data : "+data);
         location.href='s_index.html';
      })
      .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
         console.log("Error in PHP.update_challenge_course().fail:"+e); 
         // console.log(e); 
      });
      }


      //마일리지 보내는 부분
      PHP.put_challenge_mileage = function(get_time, umail, get_point)
      {
      var server_url = DOTHOME_URL+"/Team_project2/php/put_challenge_mileage.php";

      //server_url에 해당하는 주소로 접속을 하고
      $.post(server_url,
      {
         //여기 전달할 값을 넣는다
         'user_email' : umail,
         'mileage_num' : get_point,
         'mileage_getTime' : get_time,
      },
      function(data) // first success
      {
         //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
         console.log("~success~ PHP.put_challenge_mileage ~ data : "+data);
         location.href = 'index.html';
      })
      .fail(function(e){
         //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
         console.log("Error in PHP.put_challenge_mileage().fail:"+e); 
         // console.log(e); 
      });
      }




//0627_희수_수정
PHP.delete_course = function(courseName)
{
   var server_url = DOTHOME_URL+"/Team_project2/php/delete_course.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
      //여기 전달할 값을 넣는다
      'user_email' : USER_DATA.EMAIL,
      'course_name' : courseName,
   },
   function(data) // first success
   {
      //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.delete_course ~ data : "+data);
      course_data = null;
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
   .fail(function(e){
      //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.delete_course().fail:"+e); 
      // console.log(e); 
   });
}

PHP.delete_course_QR = function(courseName)
{
   var server_url = DOTHOME_URL+"/Team_project2/php/delete_course.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
      //여기 전달할 값을 넣는다
      'user_email' : USER_DATA.EMAIL,
      'course_name' : courseName,
   },
   function(data) // first success
   {
      //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.delete_course_QR ~ data : "+data);
   })
   .fail(function(e){
      //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.delete_course_QR().fail:"+e); 
      // console.log(e); 
   });
}
      

// QR인증 부분에 관련한 php부분 추가~~시작~~
var course_data_QR = null;
PHP.get_QR_user_course_list = function()
{
   var server_url = DOTHOME_URL+"/Team_project2/php/get_QR_user_course_list.php";

   //server_url에 해당하는 주소로 접속을 하고
   $.post(server_url,
   {
       //여기 전달할 값을 넣는다
      'EMAIL' : USER_DATA.EMAIL
   },
   function(data) // first success
   {
       //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
      console.log("~success~ PHP.get_QR_user_course_list ~ ");
      course_data_QR = data;
   })
   .fail(function(e){
       //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
      console.log("Error in PHP.get_QR_user_course_list().fail:"+e); 
      // console.log(e); 
   });
}



PHP.update_QR_state = function(course,course_name)
{
    var server_url = DOTHOME_URL+"/Team_project2/php/update_QR_state.php";

    //server_url에 해당하는 주소로 접속을 하고
    $.post(server_url,
    {
        //여기 전달할 값을 넣는다
        'user_email' : USER_DATA.EMAIL,
        'course_name' : course_name,
        'course1' : course_join(course,1),
        'course2' : course_join(course,2),
        'course3' : course_join(course,3),
        'course4' : course_join(course,4),
        'course5' : course_join(course,5),
    },
    function(data) // first success
    {
        //정상적으로 실행이 완료가 되었을 때 data에 그 값이 들어오고 콘솔에 이렇게 적힌다.
        console.log("~success~ PHP.update_QR_state ~ data : "+data);
        window.location.href = "s_index.html";
    })
    .fail(function(e){
        //실패할 경우는 e로 값을 받아서 콘솔에 이렇게 적힌다.
        console.log("Error in PHP.update_QR_state().fail:"+e); 
        // console.log(e); 
    });
}

function course_join(course,i){
    return course.detailCourse[i].detailCourseLongitude+"||"+course.detailCourse[i].detailCourseLatitude+"||"+course.detailCourse[i].detailCourseOrderNum+"__"+course.detailCourse[i].detailCourseName+"||"+course.detailCourse[i].detailCourseUrl+"||"+course.detailCourse[i].detailCourseTel+"||"+course.detailCourse[i].detailCourseRaddress+"||"+course.detailCourse[i].detailCourseAddress+"||"+course.detailCourse[i].detailCourseQRcheck+"||"+course.detailCourse[i].detailCourseCheck+"||"+course.detailCourse[i].detailCourseStartTime;
}
// QR인증 부분에 관련한 php부분 추가~~끝~~


