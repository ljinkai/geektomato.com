window.fInitFlag = false;
window.fbAsyncInit = function() {
    window.fInitFlag = true;
    // $(".com_btn_facebook").removeClass('com_btn_facebook-unavailable');
    // $("#facebookLogin").removeClass('disabled');
    FB.init({
        appId      : '805850072798512',  // 805850072798512,1470295603243325
        //appId      : '1239009236149258',
        cookie     : true,  // enable cookies to allow the server to access
        // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.7' // use version 2.7
    });
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
