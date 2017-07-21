var wos_windowID = '';

if(wos_data.loadPageBackend == '1'){
    window.parent.wos_loadPageOnBackend(document.location.href);     
}
jQuery(document).ready(function(){   
    if(!wos_inIframe()){
        var url = document.location.href;
        if(url.indexOf('?')<0){
            url += '?wos-reload=1';
        } else {
            url += '&wos-reload=1';            
        }
        document.location.href = url;
    }
   jQuery('*').click(function(){
       window.parent.wos_clickWindow(wos_windowID); 
   });
   window.parent.wos_pageChanged(wos_windowID,document.location.href); 
   Mousetrap.bind(wos_data.key_nextWin_1+'+'+wos_data.key_nextWin_2, function(e) {
        window.parent.wos_sortWindowsView(false);             
        return false;
    });
     Mousetrap.bind(wos_data.key_prevWin_1+'+'+wos_data.key_prevWin_2+'+'+wos_data.key_prevWin_3, function(e) {
        window.parent.wos_sortWindowsView(true);             
        return false;
    });
    if(jQuery('#wos_browserFrame').length>0){
        if(window.parent.wos_data.canEditShortcuts == 0){
           jQuery('#wos_browserBookmarkBtn').hide();
           jQuery('#wos_browserRefreshBtn').css('width','100%');           
        }
        jQuery('#wos_browserFrame').on('load',wos_browserFrameChange);
        jQuery('#wpfooter').hide();
        jQuery(window).resize(wos_browserResize);
        jQuery('#wos_browserUrlField').change(wos_refreshBrowser);
        jQuery('#wos_browserUrlField').keyup(function(e){
            var keyCode = e.keyCode || e.which;
            if(keyCode == 13){
                wos_refreshBrowser();
            }
        });
        wos_browserResize();        
        
    }
});
jQuery(window).load(function(){     
    jQuery('body').animate({
       opacity: 1 
    },300);
});

function wos_inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}
function wos_refreshBrowser(){
    jQuery('#wos_browserUrlField').focusout();
    wos_checkURL();
}
function wos_browserResize(){
    jQuery('#wos_browserFrame').css({
       height: jQuery('#osdb_bootstraped.wos_browserPanel').innerHeight() - (jQuery('#wos_browserTopPanel').outerHeight() + jQuery('#wos_browserFooter').outerHeight())
    });
}
function wos_checkURL(){
    var url = jQuery('#wos_browserUrlField').val();
     var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
     if(!regex .test(url)) {
       jQuery('#wos_browserUrlField').addClass('wos_error');
    } else {
       jQuery('#wos_browserUrlField').removeClass('wos_error');
    
    jQuery.ajax({
      url: ajaxurl,
      type: 'post',
      data: {
        action: 'wos_checkURL',
        url: url
      },
      success: function(rep) {          
           rep = JSON.parse(rep);
           if(!rep.error){
                jQuery('#wos_browserUrlField').removeClass('wos_error');
                jQuery('#wos_browserFrame').attr('src',jQuery('#wos_browserUrlField').val());               
           }else {
                jQuery('#wos_browserUrlField').focus();
                jQuery('#wos_browserUrlField').addClass('wos_error');               
           }
       }
   });
    }
}
function wos_bookmarkUrl(){
   var url = jQuery('#wos_browserUrlField').val();
   window.parent.wos_bookmarkUrl(url);    
}
function wos_browserFrameChange(e){    
    jQuery('#wos_browserUrlField').val(jQuery('#wos_browserFrame').get(0).contentWindow.location.href);
}