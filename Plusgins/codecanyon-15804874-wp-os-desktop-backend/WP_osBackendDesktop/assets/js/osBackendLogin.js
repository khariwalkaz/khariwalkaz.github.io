var wos_videoDone = false;
wos_data = wos_data[0];
jQuery(document).ready(function(){
    
    jQuery('body').bind('contextmenu.rightMenu', function() {
        return false;
    });
    jQuery('#login h1 a').attr('href','javascript:');
   if(wos_data.useVideoBackground == 1 && wos_data.backgroundVideo != ""){
        wos_initVideo();
    } 
});

function wos_initVideo(){      
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

function onYouTubeIframeAPIReady() {
    var url = wos_data.backgroundVideo;
    if(url.indexOf('?')>-1){
        url = url.substr(0,url.indexOf('?'));
    }     
    var videoID = url.substr(30,url.length);
    player = new YT.Player('wos_loginVideo', {
      height: jQuery(window).height(),
      width: jQuery(window).width(),
      videoId: videoID,
      playerVars :{'autoplay':1,'loop':1,'playlist':videoID,'vq':'hd1080'},
      events: {
        'onReady': function (event) {
        event.target.setVolume(0);
        event.target.playVideo();
         jQuery('#wos_loginVideo').fadeIn(5000);
        /*wos_backendContainer.animate({
           backgroundColor: 'transparent' 
        },5000);*/
       },
        'onStateChange': function (event) {
            if (event.data == YT.PlayerState.PLAYING && !wos_videoDone) {
                wos_videoDone = true;
            }
            event.target.setVolume(0);
          }
      }
        });
}