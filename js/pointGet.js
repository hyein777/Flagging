$(function(){
    
    //변수지정
      const Alert = document.querySelector('#mileAlert'); //모달
      const openBt = document.querySelector('#box_openBt'); // 박스 열기 버튼
      const animation = document.querySelector('#boxOpen'); // 열리는 박스
      const NopenBox = document.querySelector('#notOpen'); // 안 열린 박스
    
    
      let mileage_num = 0;
      //애니메이션 2초뒤 마일리지 모달 오픈
      openBt.addEventListener('click', () => {
        mileage_num = randomMileage();
          $("#howMile").html(utilGetNumber_withComma(mileage_num+""))
          NopenBox.style.display = 'none';
          animation.style.display = 'block';
          setTimeout(function () {
              Alert.style.display = "block";
          }, 2000);
      });
    
      //획득 마일리지의 랜덤 함수
      function randomMileage() {
          var mileage = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
          return mileage * 3000;
      }
    
    $("#mileGet").on("click", function(){
        var getTime = new Date();
        var mileage_getTime = getTime.toISOString().replace("T", " ").replace(/\..*/, '');
        var userEmail = USER_DATA.EMAIL;
        PHP.put_challenge_mileage(mileage_getTime, userEmail, mileage_num);
    })


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