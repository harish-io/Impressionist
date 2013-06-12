
    $(document).ready( function (e)
    {
        
        // checkLogin();
        /** uncomment for fb login stuff **/
        //setTimeout(redirectApp, 10000)
        $("#loginbtn").on("click", function( e )
        {
           FB.login();
        })
        impressionist();

    });
    var loggedinstate;
    function showUserDetails( response )
    {
        impressionist();
    };
    function impressionist()
    {
         impressionist = new Impressionist();
         impressionist.initialize();
         impressionist.addSettingsPanel( " " )
         loggedinstate = true
         //$(".preloaderviewport").css("display", "none");
         setTimeout(showViewport, 1000);
     }
      function showViewport()
      {
        $(".preloaderviewport").css("display", "none");
      }
      function redirectApp()
      {
        if(!loggedinstate)
        {
           $("#loginbtn").css("display", "inline-block");
          // document.location.href = "landing.html";
        }
        
      }