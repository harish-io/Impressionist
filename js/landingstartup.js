      var fbid = "";
      $(document).ready( function (e)
      {
         //$("#loginbtn").css("display", "none");
         $(".landingsignincontainer").css("display", "none")
         $("#loginbtn").on("click", function(e)
         {
            FB.login();
         })
         $("#opendeck").on("click", function( e )
         {
            $.ajax({
                    type: 'POST',
                    url: "writeFBSession.php",
                    data: {fbsession:fbid},
                    dataType: "text",
                    success: function(msg)
                    {
                        console.log("Response: ", msg);
                        document.location.href = "app.html";
                    }
             });
         })

      });
      function showUserDetails( response )
      {
        console.log("resp", response);
        $(".landingsignincontainer").css("display", "block")
         $("#loginbtn").css("display", "none");
         $("#message").html("Howdy, <span style='color:black'><b>"+ response.name+"!</b> </span> ")
         $("#profilepic").attr("src", "http://graph.facebook.com/"+response.id+"/picture?type=normal")
         $("#profiledescription").html(response.bio);
         fbid = response.id
      }
      function enableLoginButton()
      {
        $("#loginbtn").css("display", "block");
      }