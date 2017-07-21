var wos_backendContainer;
var wos_winDragging = false;
var wos_mousePosition = false;
var wos_backendInit = false;
var wos_currentShortcut = false;
var wos_sortIndex = 0;
var wos_winTimer=  null;
var wos_lastSort = new Date().getTime();
var wos_videoDone = false;
var wos_initialWinLoaded = false;
wos_data = wos_data[0];

jQuery(document).ready(function () {
    if(jQuery(window).width()>782){
        wos_initBackend();
    } else {        
        jQuery('#wpbody').show();
    }
    jQuery(window).resize(function(){        
        if(!wos_backendInit && jQuery(window).width()>782){
            wos_initBackend();
        }
    });
     Mousetrap.bind(wos_data.key_nextWin_1+'+'+wos_data.key_nextWin_2, function(e) {
        wos_sortWindows(false);             
        return false;
    });
     Mousetrap.bind(wos_data.key_prevWin_1+'+'+wos_data.key_prevWin_2+'+'+wos_data.key_prevWin_3, function(e) {
        wos_sortWindows(true);             
        return false;
    });    
});

function wos_initBackend() {
    wos_backendInit = true;
    wos_initMenu();
    jQuery('#collapse-menu').click(function(){
        setTimeout(wos_checkMenuCollaspe,400);
    });
    jQuery('body').mousemove(function(e){
        wos_mousePosition = {x:e.pageX,y:e.pageY};
    });
    jQuery('body').click(function(e){
        wos_closeRightMenu();
    });
    window.wos_clickWindow = function(winID){ 
        if(winID != ''){
            var win = jQuery('#'+winID+'.wos-window');
            if(win.length>0){
                wos_winShowFront(win);            
            }
        }
    };
    
    window.wos_reloadPage = function(){
        var newUrl = document.location.href += '?wos-reload=1';
        if(document.location.href.indexOf('?')>-1){
            newUrl = document.location.href += '&wos-reload=1';
        }
        document.location.href = newUrl;
    };
    window.wos_loadPageOnBackend= function(url){
        if(url.indexOf('?')>-1){
            document.location.href = url+'&wos-reload=1';               
        } else {
            document.location.href = url+'?wos-reload=1';               
        }     
    }
    window.wos_pageChanged = function(winID,url){
        var win = false;
        if(url.indexOf('plugins.php?action=activate')>-1){
            document.location.href = url+'&wos-reload=1';
        } else {
            if(!winID){
                jQuery('.wos-window-content').each(function(){
                    if(jQuery(this).get(0).contentWindow.location.href == url){
                        win = jQuery(this).closest('.wos-window');
                    }
                });
            }else {
                win = jQuery('#'+winID+'.wos-window');
            }
            if(win != false){
                wos_onWinLoaded(win);            
            }
        }
    };
    wos_backendContainer = jQuery('<div id="osdb_bootstraped" class="wos-backendContainer"></div>');
    wos_backendContainer.css({
       top: jQuery('#wpadminbar').height() 
    });
    wos_initRightMenu();
    wos_backendContainer.disableSelection();
    
    window.wos_sortWindowsView = function(mode){
        wos_sortWindows(mode);
    };
    
    
    
    
    var winEditShortcut = jQuery('<div id="wos_winEditShortcut" class="modal fade" tabindex="-1" role="dialog"></div>');
    winEditShortcut.append('<div class="modal-dialog">'+
    '<div class="modal-content">'+
      '<div class="modal-header">'+
        '<a href="javascript:" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true" class="glyphicon glyphicon-remove"></span></a>'+
        '<h4 class="modal-title">'+wos_data.texts['EditShortcut']+'</h4>'+
      '</div>'+
      '<div class="modal-body">'+
        '<div class="form-group">'+        
            '<label>'+wos_data.texts['Title']+' : </label>'+
            '<input type="text" class="form-control" name="title" />'+
        '</div>'+  
        '<div class="form-group">'+  
            '<label>'+wos_data.texts['Icon']+' : </label>'+
            '<input type="hidden" class="form-control" name="icon" />'+
        '<div class="btn-group">'+
        '<button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown">'+
        wos_data.texts['SelectIcon']+'<span class="caret"></span>'+
        '</button>'+
        '<ul class="dropdown-menu" role="menu" id="wos_iconslist">'
          +'<li><a href="javascript:" data-icon="fa-adjust"> <i class="fa fa-adjust"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-asterisk"> <i class="fa fa-asterisk"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-bar-chart"> <i class="fa fa-bar-chart"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-barcode"> <i class="fa fa-barcode"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-beaker"> <i class="fa fa-beaker"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-beer"> <i class="fa fa-beer"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-bell"> <i class="fa fa-bell"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-bolt"> <i class="fa fa-bolt"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-book"> <i class="fa fa-book"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-bookmark"> <i class="fa fa-bookmark"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-briefcase"> <i class="fa fa-briefcase"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-bullhorn"> <i class="fa fa-bullhorn"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-calendar"> <i class="fa fa-calendar"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-camera"> <i class="fa fa-camera"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-camera-retro"> <i class="fa fa-camera-retro"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-certificate"> <i class="fa fa-certificate"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-check"> <i class="fa fa-check"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-circle"> <i class="fa fa-circle"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-cloud"> <i class="fa fa-cloud"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-cloud-download"> <i class="fa fa-cloud-download"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-cloud-upload"> <i class="fa fa-cloud-upload"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-coffee"> <i class="fa fa-coffee"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-cog"> <i class="fa fa-cog"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-cogs"> <i class="fa fa-cogs"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-comment"> <i class="fa fa-comment"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-comments"> <i class="fa fa-comments"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-credit-card"> <i class="fa fa-credit-card"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-dashboard"> <i class="fa fa-dashboard"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-desktop"> <i class="fa fa-desktop"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-download"> <i class="fa fa-download"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-edit"> <i class="fa fa-edit"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-envelope"> <i class="fa fa-envelope"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-exchange"> <i class="fa fa-exchange"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-external-link"> <i class="fa fa-external-link"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-eye-close"> <i class="fa fa-eye-close"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-eye-open"> <i class="fa fa-eye-open"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-facetime-video"> <i class="fa fa-facetime-video"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-fighter-jet"> <i class="fa fa-fighter-jet"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-film"> <i class="fa fa-film"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-filter"> <i class="fa fa-filter"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-fire"> <i class="fa fa-fire"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-flag"> <i class="fa fa-flag"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-folder-close"> <i class="fa fa-folder-close"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-folder-open"> <i class="fa fa-folder-open"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-folder-close-alt"> <i class="fa fa-folder-close-alt"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-folder-open-alt"> <i class="fa fa-folder-open-alt"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-food"> <i class="fa fa-food"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-gift"> <i class="fa fa-gift"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-glass"> <i class="fa fa-glass"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-globe"> <i class="fa fa-globe"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-group"> <i class="fa fa-group"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-hdd"> <i class="fa fa-hdd"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-headphones"> <i class="fa fa-headphones"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-heart"> <i class="fa fa-heart"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-heart-empty"> <i class="fa fa-heart-empty"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-home"> <i class="fa fa-home"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-inbox"> <i class="fa fa-inbox"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-info-sign"> <i class="fa fa-info-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-key"> <i class="fa fa-key"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-leaf"> <i class="fa fa-leaf"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-laptop"> <i class="fa fa-laptop"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-legal"> <i class="fa fa-legal"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-lemon"> <i class="fa fa-lemon"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-lightbulb"> <i class="fa fa-lightbulb"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-lock"> <i class="fa fa-lock"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-unlock"> <i class="fa fa-unlock"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-magic"> <i class="fa fa-magic"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-magnet"> <i class="fa fa-magnet"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-map-marker"> <i class="fa fa-map-marker"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-minus"> <i class="fa fa-minus"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-minus-sign"> <i class="fa fa-minus-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-mobile-phone"> <i class="fa fa-mobile-phone"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-money"> <i class="fa fa-money"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-move"> <i class="fa fa-move"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-music"> <i class="fa fa-music"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-off"> <i class="fa fa-off"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-ok"> <i class="fa fa-ok"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-ok-circle"> <i class="fa fa-ok-circle"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-ok-sign"> <i class="fa fa-ok-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-pencil"> <i class="fa fa-pencil"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-picture"> <i class="fa fa-picture"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-plane"> <i class="fa fa-plane"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-plus"> <i class="fa fa-plus"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-plus-sign"> <i class="fa fa-plus-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-print"> <i class="fa fa-print"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-pushpin"> <i class="fa fa-pushpin"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-qrcode"> <i class="fa fa-qrcode"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-question-sign"> <i class="fa fa-question-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-quote-left"> <i class="fa fa-quote-left"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-quote-right"> <i class="fa fa-quote-right"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-random"> <i class="fa fa-random"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-refresh"> <i class="fa fa-refresh"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-remove"> <i class="fa fa-remove"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-remove-circle"> <i class="fa fa-remove-circle"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-remove-sign"> <i class="fa fa-remove-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-reorder"> <i class="fa fa-reorder"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-reply"> <i class="fa fa-reply"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-resize-horizontal"> <i class="fa fa-resize-horizontal"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-resize-vertical"> <i class="fa fa-resize-vertical"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-retweet"> <i class="fa fa-retweet"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-road"> <i class="fa fa-road"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-rss"> <i class="fa fa-rss"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-screenshot"> <i class="fa fa-screenshot"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-search"> <i class="fa fa-search"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-share"> <i class="fa fa-share"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-share-alt"> <i class="fa fa-share-alt"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-shopping-cart"> <i class="fa fa-shopping-cart"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-signal"> <i class="fa fa-signal"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-signin"> <i class="fa fa-signin"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-signout"> <i class="fa fa-signout"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-sitemap"> <i class="fa fa-sitemap"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-sort"> <i class="fa fa-sort"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-sort-down"> <i class="fa fa-sort-down"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-sort-up"> <i class="fa fa-sort-up"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-spinner"> <i class="fa fa-spinner"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-star"> <i class="fa fa-star"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-star-empty"> <i class="fa fa-star-empty"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-star-half"> <i class="fa fa-star-half"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-tablet"> <i class="fa fa-tablet"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-tag"> <i class="fa fa-tag"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-tags"> <i class="fa fa-tags"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-tasks"> <i class="fa fa-tasks"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-thumbs-down"> <i class="fa fa-thumbs-down"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-thumbs-up"> <i class="fa fa-thumbs-up"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-time"> <i class="fa fa-time"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-tint"> <i class="fa fa-tint"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-trash"> <i class="fa fa-trash"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-trophy"> <i class="fa fa-trophy"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-truck"> <i class="fa fa-truck"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-umbrella"> <i class="fa fa-umbrella"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-upload"> <i class="fa fa-upload"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-upload-alt"> <i class="fa fa-upload-alt"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-user"> <i class="fa fa-user"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-user-md"> <i class="fa fa-user-md"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-volume-off"> <i class="fa fa-volume-off"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-volume-down"> <i class="fa fa-volume-down"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-volume-up"> <i class="fa fa-volume-up"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-warning-sign"> <i class="fa fa-warning-sign"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-wrench"> <i class="fa fa-wrench"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-zoom-in"> <i class="fa fa-zoom-in"></i></a></li>'
+'<li><a href="javascript:" data-icon="fa-zoom-out"> <i class="fa fa-zoom-out"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-file"> <i class="fa fa-file"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-file-alt"> <i class="fa fa-file-alt"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-cut"> <i class="fa fa-cut"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-copy"> <i class="fa fa-copy"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-paste"> <i class="fa fa-paste"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-save"> <i class="fa fa-save"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-undo"> <i class="fa fa-undo"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-repeat"> <i class="fa fa-repeat"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-text-height"> <i class="fa fa-text-height"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-text-width"> <i class="fa fa-text-width"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-align-left"> <i class="fa fa-align-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-align-center"> <i class="fa fa-align-center"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-align-right"> <i class="fa fa-align-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-align-justify"> <i class="fa fa-align-justify"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-indent-left"> <i class="fa fa-indent-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-indent-right"> <i class="fa fa-indent-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-font"> <i class="fa fa-font"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-bold"> <i class="fa fa-bold"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-italic"> <i class="fa fa-italic"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-strikethrough"> <i class="fa fa-strikethrough"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-underline"> <i class="fa fa-underline"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-link"> <i class="fa fa-link"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-paper-clip"> <i class="fa fa-paper-clip"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-columns"> <i class="fa fa-columns"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-table"> <i class="fa fa-table"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-th-large"> <i class="fa fa-th-large"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-th"> <i class="fa fa-th"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-th-list"> <i class="fa fa-th-list"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-list"> <i class="fa fa-list"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-list-ol"> <i class="fa fa-list-ol"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-list-ul"> <i class="fa fa-list-ul"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-list-alt"> <i class="fa fa-list-alt"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-angle-left"> <i class="fa fa-angle-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-angle-right"> <i class="fa fa-angle-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-angle-up"> <i class="fa fa-angle-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-angle-down"> <i class="fa fa-angle-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-arrow-down"> <i class="fa fa-arrow-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-arrow-left"> <i class="fa fa-arrow-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-arrow-right"> <i class="fa fa-arrow-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-arrow-up"> <i class="fa fa-arrow-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-caret-down"> <i class="fa fa-caret-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-caret-left"> <i class="fa fa-caret-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-caret-right"> <i class="fa fa-caret-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-caret-up"> <i class="fa fa-caret-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-chevron-down"> <i class="fa fa-chevron-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-chevron-left"> <i class="fa fa-chevron-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-chevron-right"> <i class="fa fa-chevron-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-chevron-up"> <i class="fa fa-chevron-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle-arrow-down"> <i class="fa fa-circle-arrow-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle-arrow-left"> <i class="fa fa-circle-arrow-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle-arrow-right"> <i class="fa fa-circle-arrow-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle-arrow-up"> <i class="fa fa-circle-arrow-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-double-angle-left"> <i class="fa fa-double-angle-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-double-angle-right"> <i class="fa fa-double-angle-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-double-angle-up"> <i class="fa fa-double-angle-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-double-angle-down"> <i class="fa fa-double-angle-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-hand-down"> <i class="fa fa-hand-down"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-hand-left"> <i class="fa fa-hand-left"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-hand-right"> <i class="fa fa-hand-right"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-hand-up"> <i class="fa fa-hand-up"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle"> <i class="fa fa-circle"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-circle-blank"> <i class="fa fa-circle-blank"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-play-circle"> <i class="fa fa-play-circle"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-play"> <i class="fa fa-play"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-pause"> <i class="fa fa-pause"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-stop"> <i class="fa fa-stop"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-step-backward"> <i class="fa fa-step-backward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-fast-backward"> <i class="fa fa-fast-backward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-backward"> <i class="fa fa-backward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-forward"> <i class="fa fa-forward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-fast-forward"> <i class="fa fa-fast-forward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-step-forward"> <i class="fa fa-step-forward"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-eject"> <i class="fa fa-eject"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-fullscreen"> <i class="fa fa-fullscreen"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-resize-full"> <i class="fa fa-resize-full"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-resize-small"> <i class="fa fa-resize-small"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-phone"> <i class="fa fa-phone"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-phone-sign"> <i class="fa fa-phone-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-facebook"> <i class="fa fa-facebook"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-facebook-sign"> <i class="fa fa-facebook-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-twitter"> <i class="fa fa-twitter"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-twitter-sign"> <i class="fa fa-twitter-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-github"> <i class="fa fa-github"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-github-alt"> <i class="fa fa-github-alt"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-github-sign"> <i class="fa fa-github-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-linkedin"> <i class="fa fa-linkedin"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-linkedin-sign"> <i class="fa fa-linkedin-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-pinterest"> <i class="fa fa-pinterest"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-pinterest-sign"> <i class="fa fa-pinterest-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-google-plus"> <i class="fa fa-google-plus"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-google-plus-sign"> <i class="fa fa-google-plus-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-sign-blank"> <i class="fa fa-sign-blank"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-ambulance"> <i class="fa fa-ambulance"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-h-sign"> <i class="fa fa-h-sign"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-hospital"> <i class="fa fa-hospital"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-medkit"> <i class="fa fa-medkit"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-plus-sign-alt"> <i class="fa fa-plus-sign-alt"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-stethoscope"> <i class="fa fa-stethoscope"></i></a></li>'
    +'<li><a href="javascript:" data-icon="fa-user-md"> <i class="fa fa-user-md"></i></a></li>'+
       ' </ul>'+
      '</div>'+
    '</div>'+  
    '</div>'+ 
      '<div class="modal-footer">'+
        '<a href="javascript:" onclick="wos_saveEditShortcut();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>'+wos_data.texts['Save']+'</a>'+
     ' </div>'+
    '</div><!-- /.modal-content -->'+
  '</div><!-- /.modal-dialog -->');
  wos_backendContainer.append(winEditShortcut);
  
    winEditShortcut.find('#wos_iconslist li a').click(function(){
        winEditShortcut.find('input[name="icon"]').val(jQuery(this).attr('data-icon'));
        winEditShortcut.find('#wos_iconslist li.wos_active').removeClass('wos_active');
        jQuery(this).closest('li').addClass('wos_active');
    });
    
    wos_backendContainer.droppable({
        drop: function (event, ui) {
            if(ui.draggable.is('.wos-window')){
                if (event.pageX <= wos_backendContainer.offset().left) {
                    ui.draggable.addClass('wos-window-splited');
                    ui.draggable.css({
                        left: 0,
                        top: jQuery('#wos-backendHeader').outerHeight(),
                        width: wos_backendContainer.width() / 2,
                        height: wos_getAvailableScreenHeight()
                    });
                }
                if (event.pageX >= wos_backendContainer.width()) {
                    ui.draggable.addClass('wos-window-splited');
                    ui.draggable.css({
                        left: wos_backendContainer.width() / 2,
                        top: jQuery('#wos-backendHeader').outerHeight(),
                        width: wos_backendContainer.width() / 2,
                        height: wos_getAvailableScreenHeight()
                    });
                }
                wos_onResizeWindows();
            } else if(ui.draggable.is('a')){
                var url = ui.draggable.attr('href');
                if(jQuery('.wos-shortcut[href="'+url+'"]').length == 0){
                    
                    if(jQuery('.wos-shortcut[data-href="'+url+'"]').length == 0){
                        ui.draggable.draggable( "disable" );
                        var title = ui.draggable.clone();
                        title.find('*:not(.wp-menu-name)').remove();
                        title = title.text();
                        if (ui.draggable.closest('.wp-has-submenu').length>0 && ui.draggable.closest('.wp-has-submenu').children('a.wp-has-submenu').children('.wp-menu-name').length >0){
                            var catTitle = ui.draggable.closest('.wp-has-submenu').children('a.wp-has-submenu').clone();
                            catTitle.find('*:not(.wp-menu-name)').remove();
                            title = catTitle.text() +' > '+title;
                            catTitle.remove();
                        }

                        var shortcut = wos_createShortcut(title,url);
                        var posX = event.pageX-wos_backendContainer.offset().left;
                        posX = parseInt(posX/100)*100+18;
                        var posY = event.pageY-wos_backendContainer.offset().top;
                        posY = parseInt(posY/100)*100+18;
                        shortcut.css({
                            position: 'absolute',
                            left:  posX,
                            top:  posY
                         });
                         var shortcutA = shortcut.clone();
                         shortcutA.removeAttr('style');
                        shortcutA.attr('class','wos-shortcut');
                        jQuery.ajax({
                           url: ajaxurl,
                           type: 'post',
                           data: {
                               action: 'wos_saveShortcut',
                               url: url,
                               html: shortcutA[0]['outerHTML'],
                               posX: posX,
                               posY:posY
                           },
                           success: function(){
                               shortcutA.remove();
                           }
                        });
                        ui.draggable.draggable( "enable" );
                    }
                }
            }
        }
    });
    jQuery('body').append(wos_backendContainer);    
    wos_backendContainer.before('<div id="osdb_videoBg"><div id="wos_videoYT"><iframe src="" frameborder="0" allowfullscreen volume="0"></iframe></div></div>');
    if(wos_data.useVideoBackground == 1 && wos_data.backgroundVideo != ""){
        wos_initVideo();
    }
    jQuery('*').mouseup(function(){
       if(wos_winDragging != false && jQuery(this).closest('.osdb_bootstraped').length ==0){
           if(wos_mousePosition.x <= wos_backendContainer.offset().left){
               wos_winDragging.draggable( "disable" );
               wos_winDragging.addClass('wos-window-splited');
               wos_winDragging.css({
                    left: 0,
                    top: jQuery('#wos-backendHeader').outerHeight(),
                    width: wos_backendContainer.width() / 2,
                    height: wos_getAvailableScreenHeight()
                });
               wos_winDragging.draggable( "enable" );
           } else if (wos_mousePosition.x >= (wos_backendContainer.offset().left+wos_backendContainer.width()-7)){
               wos_winDragging.draggable( "disable" );
               wos_winDragging.addClass('wos-window-splited');
                wos_winDragging.css({
                    left: wos_backendContainer.width() / 2,
                    top: jQuery('#wos-backendHeader').outerHeight(),
                    width: wos_backendContainer.width() / 2,
                    height: wos_getAvailableScreenHeight()
                });
               wos_winDragging.draggable( "enable" );
           }
            wos_onResizeWindows();
       } 
    });
    var shortcutTrash = jQuery('<div id="wos-shortcut-trash"></div>');
    shortcutTrash.append('<span class="glyphicon glyphicon-trash"></span>');
    wos_backendContainer.append(shortcutTrash);
    shortcutTrash.droppable({
        drop: function (event, ui) {
             if(ui.draggable.is('a.wos-shortcut')){                 
                     ui.draggable.remove();
                  jQuery.ajax({
                   url: ajaxurl,
                   type: 'post',
                   data: {
                       action: 'wos_deleteShortcut',
                       url: ui.draggable.attr('data-href')
                   }
                });
             }
        }
    });

    var closedWinsContainer = jQuery('<div id="wos-closedWindows-container"></div>');
    wos_backendContainer.append(closedWinsContainer);
    var backendHeader = jQuery('<div id="wos-backendHeader"></div>');
    wos_backendContainer.append(backendHeader);
    wos_initDefaultWindow();
    jQuery(window).resize(wos_onResize);
    wos_onResize();
    
    setTimeout(function(){
        jQuery.each(wos_data.links,function(){
        this.html = this.html.replace(/\\/g,'');
        initShortcut(this);
    });
    },300);
       
}
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
            player = new YT.Player('wos_videoYT', {
              height: jQuery(window).height(),
              width: jQuery(window).width(),
              videoId: videoID,
              playerVars :{'autoplay':1,'loop':1,'playlist':videoID,'vq':'hd720'},
              events: {
                'onReady': function (event) {
                event.target.setVolume(0);
                event.target.playVideo();
                 jQuery('#osdb_videoBg').fadeIn(5000);
                wos_backendContainer.animate({
                   backgroundColor: 'transparent' 
                },5000);
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
function initShortcut(element){
    
        var shortcut = jQuery(element.html);
      
        shortcut.draggable({
            start: function(){
              jQuery(this).attr('data-zindex',jQuery(this).css('zIndex'));
              jQuery(this).css({
                 zIndex: 1000 
              });
              jQuery('#osdb_bootstraped #wos-shortcut-trash').animate({height:64},300);  
            },
            stop: function(event,ui){    
                var posX = parseInt(jQuery(this).css('left'));
                posX = parseInt(posX/100)*100+18;
                var posY = parseInt(jQuery(this).css('top'));
                posY = parseInt(posY/100)*100+18;
                jQuery(this).css({
                   left: posX,
                   top: posY
                });
                if(jQuery(this).is('[data-zindex]')){
                jQuery(this).css({
                    zIndex: jQuery(this).attr('data-zindex') 
                 });
                }
                jQuery.ajax({
                   url: ajaxurl,
                   type: 'post',
                   data: {
                       action: 'wos_saveShortcut',
                       url: jQuery(this).attr('data-href'),
                       posX: posX,
                       posY:posY
                   }
                });
                jQuery('#osdb_bootstraped #wos-shortcut-trash').animate({height:0},300);                      
                
            }
        });
        wos_backendContainer.append(shortcut);
        shortcut.find('.wos_editShortcutIcon').remove();
        if(shortcut.find('.wos_editShortcutIcon').length == 0) {
          var editIcon = jQuery('<span class="wos_editShortcutIcon" ><span class="glyphicon glyphicon-pencil"></span></span>');
           editIcon.click(function(event){
                event.stopPropagation();
                wos_editShortcut(this);
            });
          shortcut.prepend(editIcon);
        }
        shortcut.css({
           position: 'absolute',
           left: parseInt(element.posX),
           top: parseInt(element.posY)
        });     
        var chkWin = false;
        shortcut.click(function(){
            var chkWin = false;
            var title = jQuery(this).find('.wos-shortcut-title').text();
            jQuery('.wos-window').each(function(){
                var url = jQuery(this).find('.wos-window-content').attr('src');
                url = url.replace('&wos-view=1','');
                url = url.replace('?wos-view=1','');               
                if(url == shortcut.attr('data-href')){
                    chkWin = true;
                    if(jQuery('.wos-window-minified[data-win="'+jQuery(this).attr('id')+'"]').length >0){
                        wos_unminifyWin(jQuery(this));
                    }else {
                        wos_expandWin(jQuery(this));
                    }       
                 } 
            });
            if(!chkWin){
               wos_createWindow(shortcut.attr('data-href'),title);     
            }
        });
}
function wos_checkMenuCollaspe(){
    if(jQuery(window).width() > 782){
        if(jQuery('body').is('.rtl')){
            wos_backendContainer.css({
               right:  jQuery('#adminmenu').width(),
               left: 0
            });            
        }else {
            wos_backendContainer.css({
               left:  jQuery('#adminmenu').width(),
               right: 0
            });        
        }
    } else {
        if(jQuery('body').is('.rtl')){
            wos_backendContainer.css({
              right:  0,
              left: 0
           });   
            
        } else {
         wos_backendContainer.css({
           left:  0,
           right:  0
        });        
        }
    }
}
function wos_editShortcut(shortcut){
    wos_currentShortcut = jQuery(shortcut).closest('.wos-shortcut').attr('data-href');
    jQuery('#wos_winEditShortcut').find('input[name="title"]').val(jQuery(shortcut).closest('.wos-shortcut').find('.wos-shortcut-title').text());
    var icon = 'dashicons-desktop';
    var iconClasses = jQuery(shortcut).closest('.wos-shortcut').find('.wp-menu-image').attr('class').split(' ');
    jQuery.each(iconClasses,function(){
       if(this.substr(0,10) == 'dashicons-' && this != 'dashicons-before'){
           icon = this;
       }
       if(this.substr(0,3) == 'fa-'){
           icon = this;
       }
    });
    if(jQuery('#wos_iconslist li a[data-icon="'+icon+'"]').length>0){
        jQuery('#wos_iconslist li a[data-icon="'+icon+'"]').closest('li').addClass('wos_active');
    }
    jQuery('#wos_winEditShortcut').find('input[name="icon"]').val(icon);
    jQuery('#wos_winEditShortcut').modal('show');
    setTimeout(function(){        
        jQuery('#wos_iconslist').closest('.btn-group').addClass('open');
        jQuery('#wos_iconslist').find('i.fa').each(function(){
            if(jQuery(this).width()<10){
                jQuery(this).closest('li').remove();
            } 
        });     
        jQuery('#wos_iconslist').closest('.btn-group').removeClass('open');
        
    },600);
}
function wos_saveEditShortcut(){
    if(wos_currentShortcut != false && jQuery('.wos-shortcut[data-href="'+wos_currentShortcut+'"]').length>0){
        var shortcut = jQuery('.wos-shortcut[data-href="'+wos_currentShortcut+'"]');
        var icon =  jQuery('#wos_winEditShortcut').find('input[name="icon"]').val();
        if(icon == ""){
            icon = 'dashicons-desktop';
        }
        if (icon.substr(0,10) == 'dashicons-'){
            icon = 'dashicons-before '+icon;
        }
        if (icon.substr(0,3) == 'fa-'){
            icon = 'fa '+icon;
        }
        var iconEl = shortcut.find('.wp-menu-image');
        iconEl.attr('class','wp-menu-image '+icon);
        jQuery(shortcut).closest('.wos-shortcut').find('.wos-shortcut-title').html(jQuery('#wos_winEditShortcut').find('input[name="title"]').val());
        
        shortcut.draggable( "disable" );
        var shortcutA = shortcut.clone();
        shortcutA.removeAttr('style');
        shortcutA.attr('class','wos-shortcut');
         jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'wos_saveShortcut',
                url: wos_currentShortcut,
                posX: parseInt(shortcut.css('left')),
                posY:parseInt(shortcut.css('top')),
                html: shortcutA[0]['outerHTML']
            },
            success:function(){                
                shortcut.draggable( "enable" );
            }
         });
        jQuery('#wos_winEditShortcut').modal('hide');
     }
}
function wos_createShortcut(title,url){
    var icon = wos_getIconFromLink(url);
    if(icon == ''){
        icon = '<div class="wp-menu-image dashicons-before "></div>';
    }
    var shortcut = jQuery('<a href="javascript:" data-href="'+url+'" class="wos-shortcut"></a>');
    var editIcon = jQuery('<span class="wos_editShortcutIcon" ><span class="glyphicon glyphicon-pencil"></span></span>');
     editIcon.click(function(event){
            event.stopPropagation();
            wos_editShortcut(this);
        });
    shortcut.append(editIcon);
    shortcut.append(icon);    
   if(shortcut.find('.wp-menu-image').length>1){
     shortcut.find('.wp-menu-image:eq(0)').remove();                       
   }
   var nbDashicons = 0;
   if(shortcut.find('.wp-menu-image').attr('class')){
    var classes = shortcut.find('.wp-menu-image').attr('class');
    if(classes.length >0){
     classes = classes.split(' ');
     jQuery.each(classes,function(){
         if(this.indexOf('dashicons-')==0){
             nbDashicons++;
         }
     });
    }
   }
   if(nbDashicons <2){
       shortcut.find('.wp-menu-image').addClass('dashicons-desktop');
   }
   shortcut.find('.wp-menu-image').find('img,div').remove();
    shortcut.append('<span class="wos-shortcut-title">'+title+'</span>');    
    shortcut.draggable({
        start: function(){
            jQuery('#osdb_bootstraped #wos-shortcut-trash').animate({height:64},300);  
          },
        stop: function(event,ui){    
            var posX = parseInt(jQuery(this).css('left'));
            posX = parseInt(posX/100)*100+18;
            var posY = parseInt(jQuery(this).css('top'));
            posY = parseInt(posY/100)*100+18;
                jQuery(this).css({
                   left: posX,
                   top: posY
                });
            jQuery.ajax({
               url: ajaxurl,
               type: 'post',
               data: {
                   action: 'wos_saveShortcut',
                   url: url,
                   posX: posX,
                   posY:posY
               }
            });
            jQuery('#osdb_bootstraped #wos-shortcut-trash').animate({height:0},300);   
        }
    });
    wos_backendContainer.append(shortcut);
    shortcut.click(function(){
        var chkWin = false;
       var title = jQuery(this).find('.wos-shortcut-title').text();
            jQuery('.wos-window').each(function(){
                var url = jQuery(this).find('.wos-window-content').attr('src');
                url = url.replace('&wos-view=1','');
                url = url.replace('?wos-view=1','');              
                if(url == shortcut.attr('data-href')){
                    chkWin = true;
                    if(jQuery('.wos-window-minified[data-win="'+jQuery(this).attr('id')+'"]').length >0){
                        wos_unminifyWin(jQuery(this));
                    }else {
                        wos_expandWin(jQuery(this));
                    }       
                    wos_winShowFront(jQuery(this));
                 } 
            });
            if(!chkWin){
               wos_createWindow(shortcut.attr('data-href'),title);     
            }
       
       
    });
    return shortcut;
}
function wos_initMenu() {
    if(wos_data.canEditShortcuts == 1){
        jQuery('#adminmenu a[href!="javascript:"]').draggable({
            helper: 'clone',
            start: function(event,ui){
               jQuery(this).addClass('wos_draggedLink');
            },
            drag:function(){            
                jQuery('#adminmenu .opensub').removeClass('opensub');
            },
            stop: function(event,ui){
                jQuery(this).removeClass('wos_draggedLink');
            }
        });
    }
    jQuery('#adminmenu a[href!="javascript:"]').click(function (e) {
        e.preventDefault();
        jQuery('#adminmenu .opensub').removeClass('opensub');
        var titleClone = jQuery(this).clone();        
        titleClone.find('span').remove();
        var _this = this;
         var chkWin = false;
            //var title = jQuery(this).find('.wos-shortcut-title').text();
            jQuery('.wos-window').each(function(){
                var url = jQuery(this).find('.wos-window-content').attr('src');
                if(url){
                    url = url.replace('&wos-view=1','');
                    url = url.replace('?wos-view=1','');               
                    if(url == jQuery(_this).attr('href')){
                        chkWin = true;
                        if(jQuery('.wos-window-minified[data-win="'+jQuery(this).attr('id')+'"]').length >0){
                            wos_unminifyWin(jQuery(this));
                        }else {
                            wos_expandWin(jQuery(this));
                        }       
                        wos_winShowFront(jQuery(this));
                     } 
                 }
            });
            if(!chkWin){
               wos_createWindow(jQuery(this).attr('href'),(titleClone.text()));     
            }
         //wos_createWindow(jQuery(this).attr('href'),(titleClone.text()));
        
        if(jQuery(this).parent().closest('.wp-has-submenu').length>0){
            jQuery('#adminmenu .current').removeClass('current');
            jQuery('#adminmenu .wp-has-current-submenu').removeClass('wp-has-current-submenu').removeClass('wp-menu-open').addClass('wp-not-current-submenu');
            jQuery(this).parent().closest('.menu-top').removeClass('wp-not-current-submenu').addClass('wp-has-current-submenu').addClass('wp-menu-open');
            jQuery(this).removeClass('wp-not-current-submenu').addClass('wp-has-current-submenu').addClass('wp-menu-open');
            if(jQuery(this).is('.menu-top')){
                jQuery(this).parent().find('.wp-submenu .wp-first-item>a').trigger('click');
            }
            
        }else if(jQuery(this).parent().is('.menu-top')){
            jQuery('#adminmenu .current').removeClass('current');
            jQuery('#adminmenu .wp-has-current-submenu').removeClass('wp-has-current-submenu').removeClass('wp-menu-open').addClass('wp-not-current-submenu');
            jQuery(this).addClass('current');
            
        }/*else if(jQuery(this).parent().is('li') && jQuery(this).parent().parent().is('ul.wp-submenu') ){
            jQuery('#adminmenu .current').removeClass('current');
            jQuery('#adminmenu .wp-has-current-submenu').removeClass('wp-has-current-submenu').removeClass('wp-menu-open');
            jQuery(this).addClass('current');
        }*/
    });
}
function wos_checkWinClosedContainerHeight(){
    if(jQuery('#wos-closedWindows-container>a').length == 0){
        jQuery('#wos-closedWindows-container').css({
           padding: 0 
        });
    } else {
        jQuery('#wos-closedWindows-container').css({
           padding: 2 
        });
    }
}
function wos_getAvailableScreenHeight() {
    var height = wos_backendContainer.height() - (jQuery('#wos-backendHeader').outerHeight() + jQuery('#wos-closedWindows-container').outerHeight());
    return height;
}
function wos_initDefaultWindow() {
    var titleClone = jQuery('head>title').clone();
        titleClone.find('span').remove();
    var title = titleClone.text();
    var url = document.location.href.replace('?wos-view=1', '');    
    url = url.replace('&wos-view=1', '');
    url = url.replace('?wos-reload=1', '');
    url = url.replace('&wos-reload=1', '');
    if(url.indexOf('wp-admin/')>0){
        url = url.substr(url.indexOf('wp-admin/')+9,url.length);
    }
    if(url != '' && url != '/'){
     if(jQuery('#adminmenu a[href="'+url+'"]').length >0){        
         titleClone = jQuery('#adminmenu a[href="'+url+'"]').clone();
         titleClone.find('span').remove();
         title = titleClone.text();
     } else if (url.indexOf('?')>-1){
         var tmpUrl = url.substr(0,url.indexOf('?'));
         if(jQuery('#adminmenu a[href="'+tmpUrl+'"]').length >0){
         titleClone = jQuery('#adminmenu a[href="'+tmpUrl+'"]').clone();
         titleClone.find('span').remove();
             title = titleClone.text();
         }
     }
    wos_createWindow(url);
    } else {
        wos_initialWinLoaded = true;
    }
    wos_onResizeWindows();     
    wos_checkWinClosedContainerHeight();

}
function wos_createWindow(url) {
    var win = jQuery('<div class="wos-window"></div>');
    win.uniqueId();
    var winHeader = jQuery('<div class="wos-window-header"></div>');
    var winHeaderIcons = jQuery('<div class="wos-window-header-icons"></div>');
    var btnClose = jQuery('<a href="javascript:" class="wos-window-header-icon"><span class="glyphicon glyphicon-remove"></span></a>');
    var btnMin = jQuery('<a href="javascript:" class="wos-window-header-icon"><span class="glyphicon glyphicon-chevron-down"></span></a>');
    var btnFullScreen = jQuery('<a href="javascript:" class="wos-window-header-icon"><span class="glyphicon glyphicon-fullscreen"></span></a>');
    btnClose.click(function () {
        wos_closeWin(jQuery(this).closest('.wos-window'));
    });
    btnFullScreen.click(function () {
        if (jQuery(this).closest('.wos-window').is('.wos_fullscreen')) {
            wos_unExpandWin(jQuery(this).closest('.wos-window'));
        } else {
            wos_expandWin(jQuery(this).closest('.wos-window'));
        }
    });
     winHeader.dblclick(function(){
         btnFullScreen.trigger('click');
     });
    btnMin.click(function(){
        wos_minifyWin(jQuery(this).closest('.wos-window'));
    });
    winHeaderIcons.prepend(btnClose);
    winHeaderIcons.prepend(btnMin);
    winHeaderIcons.prepend(btnFullScreen);
    winHeaderIcons.children('a').hover(function(){
       jQuery(this).addClass('wos-hover'); 
    },function(){
       jQuery(this).removeClass('wos-hover');         
    });
    winHeader.append(winHeaderIcons);
    winHeader.append('<h1 class="wos-window-title"></h1>');
    url = url.replace('?wos-reload=1','');
    url = url.replace('&wos-reload=1','');
    if (url.indexOf('?') > -1) {
        url += '&wos-view=1';
    } else {
        url += '?wos-view=1';
    }
    var winContent = jQuery('<iframe  class="wos-window-content"></iframe>');
    win.append(winHeader);
    win.append(winContent);
    var winOverlay = jQuery('<div class="wos-window-overlay"></div>');
    win.append(winOverlay);
    var winLoader = jQuery('<div class="wos-window-loader"><div class="wos-spinner"></div></div>');
        wos_winShowFront(win);
        
    title = wos_getWinTitle(null,url);
    winHeader.find('.wos-window-title').html(title);
    setTimeout(function(){
        win.append(winLoader);    
        wos_onResizeWindows();    
        winContent.load(function () {
           wos_onWinLoaded(win);
        });
        winContent.attr('src',url);
        if(wos_getWinTitle(win) != ''){
            title = wos_getWinTitle(win);
            winHeader.find('.wos-window-title').html(title);
        }
    },500);
    wos_backendContainer.append(win);
    win.click(function () {        
       wos_winShowFront(win);
    });
    win.draggable({
        start: function (event, ui) { 
            if(jQuery(window).width()<=782){
                event.preventDefault();
            } else if(win.find('.wos-window-header-icons>a.wos-hover').length>0){
                event.preventDefault();
                win.find('.wos-window-header-icons>a.wos-hover').trigger('click');
            } else {
                wos_winDragging = win;
                wos_winShowFront(win);
                jQuery('.wos-window-overlay').show();
                if(win.is('.wos-window-splited')){
                    win.removeClass('wos-window-splited');
                    win.css({
                       height: (wos_backendContainer.height()/3)*2 
                    });
                }
            }
            
        },
        drag: function (event, ui) {       
            if(jQuery(window).width()<=782){
                event.preventDefault();
            } 
            if(win.height() >= wos_getAvailableScreenHeight()-30){
                win.css({
                   height: (wos_backendContainer.height()/3)*2 
                });
            }            
        },
        stop: function (event, ui) {
            wos_winDragging = false;
            jQuery('.wos-window-overlay').hide();
        }
    });
    win.resizable({
        handles: 'all',
        minHeight: 100,
        minWidth: 250,
        start: function (event, ui) {
            wos_winShowFront(win);
            jQuery('.wos-window-overlay').show();
        },
        stop: function (event, ui) {
            jQuery('.wos-window-overlay').hide();
        }
    });
    var icon = wos_getIconFromLink(url);
    if (icon != '') {        
        icon.addClass('wos-window-icon');
        win.children('.wos-window-header').prepend(icon);
    }
     var newWidth = wos_backendContainer.width()/2;
    var newHeight = (wos_backendContainer.height()/3)*2 ;
    
    /*win.css({
       top:  wos_backendContainer.height()/2-newHeight/2,
       left:  wos_backendContainer.width()/2-newWidth/2,
       height: newHeight,
       width: newWidth
    });*/
   /* jQuery('.wos-window').each(function(i){       
        if(jQuery(this).prop('id') != win.prop('id')){
            jQuery(this).stop();
            if (jQuery('.wos-window-minified[data-win="'+jQuery(this).prop('id')+'"]').length ==0){
                wos_minifyWin(jQuery(this),true);
            }        
        }        
    });*/
    wos_winShowFront(win);   
    if(!wos_initialWinLoaded){
        wos_expandWin(win);
        wos_initialWinLoaded = true;
    } else {
      //  wos_expandWin(win);
    }
    win.hide();
    win.slideDown();
    wos_onResizeWindows();
}
function wos_getIconFromLink(url){
        var icon = '';
        url = url.replace('?wos-view=1', '');
        url = url.replace('&wos-view=1', '');
        url = url.replace('&wos-reload=1', '');
        url = url.replace('?wos-reload=1', '');
        if(url.indexOf('wp-admin/')>0){
            url = url.substr(url.indexOf('wp-admin/')+9,url.length);
        }
        if(url == ''){
            url = 'admin.php?page=wos_menu';
        }
        if(jQuery('.wos-shortcut[data-href="'+url+'"]').length >0){
             icon = jQuery('.wos-shortcut[data-href="'+url+'"] .wp-menu-image').clone();
        }else if (jQuery('#adminmenu a[href="' + url + '"]').length > 0) {
            if (jQuery('#adminmenu a[href="' + url + '"]').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + url + '"] > .wp-menu-image.dashicons-before').clone();
            } else if (jQuery('#adminmenu a[href="' + url + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + url + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').clone();
            }        
        }else if (url.indexOf('?')>-1){
            var tmpUrl = url.substr(0,url.indexOf('?'));
            if(jQuery('#adminmenu a[href="'+tmpUrl+'"]').find('.wp-menu-image.dashicons-before').length >0){
                icon = jQuery('#adminmenu a[href="' + tmpUrl + '"] > .wp-menu-image.dashicons-before').clone();
            }else if (jQuery('#adminmenu a[href="' + tmpUrl + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + tmpUrl + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').clone();
            }
        }
        return icon;
}
function wos_closeWin(win) {
    win.slideUp();
    setTimeout(function () {
        win.remove();
    }, 1000);
}
function wos_winShowFront(win){
     jQuery('.wos-window').removeClass('wos-window-focus').css({
        zIndex: 10
    });
    win.addClass('wos-window-focus');
    win.css({
        zIndex: 20
    });
    if(win.children('.wos-window-content').get(0).contentWindow){        
        if(win.is('.wos-loaded')){
            var url =  win.children('.wos-window-content').get(0).contentWindow.location.href;
            if(url.indexOf(wos_data.adminUrl)==0){
                url = url.replace('?wos-view=1','');
                url = url.replace('&wos-view=1','');                
                url = url.replace('&wos-reload=1', '');
                url = url.replace('?wos-reload=1', '');
                window.history.pushState(win.find('.wos-window-title').text(), win.find('.wos-window-title').text(), url);   
            }
        }
    }
}
function wos_expandWin(win) {
    win.children('.wos-window-content').fadeOut(150);
    wos_checkWinClosedContainerHeight();
    win.animate({
        top: jQuery('#wos-backendHeader').height(),
        left: 0,
        width: wos_backendContainer.width(),
        height: wos_getAvailableScreenHeight()
    },300);
    setTimeout(function(){
        win.addClass('wos_fullscreen');
        wos_onResizeWindows();
    win.children('.wos-window-content').fadeIn(150);
    },400);    
    win.removeClass('wos-window-splited');
    win.draggable('disable');
    win.find('.glyphicon-fullscreen').parent('a').addClass('wos_iconActivated');
}
function wos_unExpandWin(win) {
    var newWidth = wos_backendContainer.width()/2;
    var newHeight = wos_backendContainer.height()/2;
    wos_checkWinClosedContainerHeight();
    win.children('.wos-window-content').fadeOut(150);
    win.animate({
        width: newWidth,
        height: newHeight,
        left:  wos_backendContainer.width()/2-newWidth/2,
        top:  wos_backendContainer.height()/2-newHeight/2
    },300);
    
    setTimeout(function(){
        win.removeClass('wos_fullscreen');
         win.removeClass('wos-window-splited');
        win.draggable('enable');
        win.find('.glyphicon-fullscreen').parent('a').removeClass('wos_iconActivated');
        wos_onResizeWindows();
    win.children('.wos-window-content').fadeIn(150);
    },400);

}
function wos_minifyWin(win,modeSpeed) {
    var chkExists = false;
    var minBtn = null;
    jQuery('#wos-closedWindows-container > a.wos-window-minified').each(function(){
        var tmpClone = jQuery(this).clone();
        tmpClone.find('.wos-window-icon').remove();
       if(tmpClone.html() == win.find('.wos-window-title').html()) {
           chkExists = true;
           minBtn = jQuery(this);
       }
       tmpClone.remove();
    });
    if (!chkExists){
        minBtn = jQuery('<a href="javascript:" class="wos-window-minified"></a>');
        minBtn.html(win.find('.wos-window-icon').clone());
        var title = win.find('.wos-window-title').html();
        if(title.length > 20){
            title = title.substr(0,20)+'...';
        }
        minBtn.append(title);
        minBtn.attr('data-win', win.attr('id'));
        minBtn.click(function(){
            wos_unminifyWin(win);
        });
        jQuery('#wos-closedWindows-container').append(minBtn);
    }
    wos_checkWinClosedContainerHeight();
    win.removeClass('wos_fullscreen');
    win.removeClass('wos-window-splited');
    win.draggable('enable');
    win.find('.glyphicon-fullscreen').parent('a').removeClass('wos_iconActivated');
    var speed = 300;
    if(modeSpeed){
        speed = 0;
         win.css({
            width: minBtn.width(),
            height: minBtn.height(),
            left: minBtn.offset().left,
            top: minBtn.offset().top,
            opacity: 0,
            visibility: 'hidden'
        });
    } else {
        win.animate({
            width: minBtn.width(),
            height: minBtn.height(),
            left: minBtn.offset().left,
            top: minBtn.offset().top,
            opacity: 0
        },speed);
        wos_winTimer = setTimeout(function(){
            win.css('visibility','hidden');
        },speed);
    }
    if (chkExists){
        wos_winTimer = setTimeout(function(){
            win.remove();
        },speed+100);
    }

}
function wos_unminifyWin(win,modeSpeed) {
    var newWidth = wos_backendContainer.width()/2;
    var newHeight = wos_backendContainer.height()/2;
    win.css('visibility','visible');
     var speed = 300;
    if(modeSpeed){
        speed = 0;
        win.css({
            width: newWidth,
            height: newHeight,
            left:  wos_backendContainer.width()/2-newWidth/2,
            top:  wos_backendContainer.height()/2-newHeight/2,
            opacity: 1
        });
    } else {
        win.animate({
            width: newWidth,
            height: newHeight,
            left:  wos_backendContainer.width()/2-newWidth/2,
            top:  wos_backendContainer.height()/2-newHeight/2,
            opacity: 1
        },speed);
    }
    wos_checkWinClosedContainerHeight();
    wos_winShowFront(win);
    wos_onResizeWindows();
    jQuery('#wos-closedWindows-container > a[data-win="'+win.attr('id')+'"]').fadeOut();
    wos_winTimer = setTimeout(function(){
        jQuery('#wos-closedWindows-container > a[data-win="'+win.attr('id')+'"]').remove();
        wos_onResizeWindows();  
    },speed+10);
    
}
function wos_getWinTitle(win,url){
    if(win != null){
        var url = win.children('.wos-window-content').get(0).contentWindow.location.href;        
    }
    
    if(url.indexOf('wp-admin/')>0){
        url = url.substr(url.indexOf('wp-admin/')+9,url.length);
    }
    var title = '';
    if(win != null && win.children('.wos-window-content').contents().find('head>title').length>0){
        title = win.children('.wos-window-content').contents().find('head>title').text();
    }
    if (win != null && win.children('.wos-window-content').contents().find('.wrap > h1:first-child').length > 0) {
         var titleClone = win.children('.wos-window-content').contents().find('.wrap > h1:first-child').clone();
        titleClone.find('*').remove();
        title = titleClone.text();
    }
    url =url.replace('?wos-view=1', '');
    url = url.replace('&wos-view=1', '');          
    url = url.replace('&wos-reload=1', '');
    url = url.replace('?wos-reload=1', '');
    if(url.indexOf('wp-admin/')>0){
        url = url.substr(url.indexOf('wp-admin/')+9,url.length);
    }
    if(jQuery('#adminmenu a[href="'+url+'"]').length >0){       
        if (jQuery('#adminmenu a[href="'+url+'"].wp-has-submenu').length == 0 && jQuery('#adminmenu a[href="'+url+'"]').closest('.wp-has-submenu').length>0 && jQuery('#adminmenu a[href="'+url+'"]').closest('.wp-has-submenu').children('a.wp-has-submenu').children('.wp-menu-name').length >0){
            var catTitle = jQuery('#adminmenu a[href="'+url+'"]').closest('.wp-has-submenu').children('a.wp-has-submenu').clone();
            catTitle.find('*:not(.wp-menu-name)').remove();
            var linkClone = jQuery('#adminmenu a[href="'+url+'"]').clone();
            linkClone.remove('span');
            title = catTitle.text() +' > '+linkClone.text();
            catTitle.remove();
            linkClone.remove();
        } else {        
            titleClone = jQuery('#adminmenu a[href="'+url+'"] .wp-menu-name').clone();
            titleClone.find('*').remove();
            title = titleClone.text();
        }
    
        
    } else if (url.indexOf('?')>-1){
        var tmpUrl = url.substr(0,url.indexOf('?'));
        if(jQuery('#adminmenu a[href="'+tmpUrl+'"]').length >0){
            if (jQuery('#adminmenu a[href="'+tmpUrl+'"].wp-has-submenu').length == 0 &&jQuery('#adminmenu a[href="'+tmpUrl+'"]').closest('.wp-has-submenu').length>0 && jQuery('#adminmenu a[href="'+tmpUrl+'"]').closest('.wp-has-submenu').children('a.wp-has-submenu').children('.wp-menu-name').length >0){
                 var catTitle = jQuery('#adminmenu a[href="'+tmpUrl+'"]').closest('.wp-has-submenu').children('a.wp-has-submenu').clone();
                    catTitle.find('*:not(.wp-menu-name)').remove();
                    var linkClone = jQuery('#adminmenu a[href="'+tmpUrl+'"]').clone();
                    linkClone.remove('span');
                    title = catTitle.text() +' > '+linkClone.text();
                    catTitle.remove();
                    linkClone.remove();
            } else {
                titleClone = jQuery('#adminmenu a[href="'+tmpUrl+'"]').clone();
                titleClone.find('*').remove();
                title = titleClone.text();
            }
        }
    }
    return title;
}
function wos_onWinLoaded(win) {
    var title = wos_getWinTitle(win);
    win.addClass('wos-loaded');
     var url = win.children('.wos-window-content').get(0).contentWindow.location.href.replace('?wos-view=1', '');
        win.children('.wos-window-header').children('.wos-window-title').html(title);        
        var icon = '';
        url = url.replace('&wos-view=1', '');
        if(url.substr(url.length-10,url.length) == '/wp-admin/'){
            url = 'index.php';
        }
        if(url.indexOf('wp-admin/')>0){
            url = url.substr(url.indexOf('wp-admin/')+9,url.length);
        }
        if(jQuery('.wos-shortcut[data-href="'+url+'"]').length >0){
             icon = jQuery('.wos-shortcut[data-href="'+url+'"] .wp-menu-image').clone();
        }else if (jQuery('#adminmenu a[href="' + url + '"]').length > 0) {
            if (jQuery('#adminmenu a[href="' + url + '"]').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + url + '"] > .wp-menu-image.dashicons-before').clone();
            } else if (jQuery('#adminmenu a[href="' + url + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + url + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').clone();
            }        
        }else if (url.indexOf('?')>-1){
            var tmpUrl = url.substr(0,url.indexOf('?'));
            if(jQuery('#adminmenu a[href="'+tmpUrl+'"]').find('.wp-menu-image.dashicons-before').length >0){
                icon = jQuery('#adminmenu a[href="' + tmpUrl + '"] > .wp-menu-image.dashicons-before').clone();
            }else if (jQuery('#adminmenu a[href="' + tmpUrl + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').length > 0) {
                icon = jQuery('#adminmenu a[href="' + tmpUrl + '"]').closest('.wp-submenu').prev('a.wp-has-submenu').find('.wp-menu-image.dashicons-before').clone();
            }
        }
        if(icon == ''){
            icon = jQuery('<div class="wp-menu-image dashicons-before dashicons-desktop"></div>');
        }
        if (icon != '') {        
            icon.addClass('wos-window-icon');     
            win.children('.wos-window-header').children('.wos-window-icon').remove();     
            win.children('.wos-window-header').prepend(icon); 
        } 
    if(win.children('.wos-window-content').get(0).contentWindow){
        var url =  win.children('.wos-window-content').get(0).contentWindow.location.href;
        if(url.indexOf(wos_data.adminUrl)==0){
        url = url.replace('?wos-view=1','');
        url = url.replace('&wos-view=1','');
        if(url.indexOf('?')>0){
            url+= '&wos-reload=1';
        } else {
            url+= '?wos-reload=1';            
        }
        setTimeout(function(){
                window.history.pushState(win.find('.wos-window-title').text(), win.find('.wos-window-title').text(), url);  
        },1000);
            }
    }
    win.children('.wos-window-loader').fadeOut();
    wos_onResizeWindows();
    win.children('.wos-window-content').get(0).contentWindow.wos_windowID = win.attr('id');
}

function wos_onResize() {
    wos_onResizeBackend();
    wos_onResizeWindows();
    wos_checkMenuCollaspe();
    
}
function wos_onResizeBackend() {
    jQuery('#osdb_bootstraped').css({
       top: jQuery('#wpadminbar').height() 
    });
}
function wos_onResizeWindows() {
    jQuery('.wos-window:not(.wos_minified)').each(function () {
        if (jQuery(this).is('.wos_fullscreen')) {
            jQuery(this).css({
                top: jQuery('#wos-backendHeader').height(),
                left: 0,
                width: wos_backendContainer.width(),
                height:wos_getAvailableScreenHeight()
            });
        } else {
            if (jQuery(this).position().top < jQuery('#wos-backendHeader').height()) {
                jQuery(this).css({top: jQuery('#wos-backendHeader').height()});
            }
        }
        jQuery(this).children('.wos-window-content').css({
                height: jQuery(this).height() - jQuery(this).children('.wos-window-header').outerHeight(),
                top: jQuery(this).children('.wos-window-header').outerHeight()
            });
            jQuery(this).children('.wos-window-loader').css({
                height:  jQuery(this).height() - jQuery(this).children('.wos-window-header').outerHeight(),
                top: jQuery(this).children('.wos-window-header').outerHeight()
            });

    });
}
function wos_sortWindows(reverse){    
    if(new Date().getTime()  - wos_lastSort > 100){
        wos_lastSort =new Date().getTime(); 
        if(reverse){
            wos_sortIndex--;
            if(wos_sortIndex<0){
                wos_sortIndex = jQuery('.wos-window').length-1;
            }
        } else {
            wos_sortIndex++;
            if(wos_sortIndex >= jQuery('.wos-window').length){
                wos_sortIndex = 0;
            }
        }
        clearTimeout(wos_winTimer);
        jQuery('.wos-window').each(function(i){
            jQuery(this).stop();
            if(i != wos_sortIndex){
                if (jQuery('.wos-window-minified[data-win="'+jQuery(this).prop('id')+'"]').length ==0){
                    wos_minifyWin(jQuery(this),true);
                }
            } else {
                if (jQuery('.wos-window-minified[data-win="'+jQuery(this).prop('id')+'"]').length > 0){
                    jQuery(this).addClass('wos_fullscreen');
                    jQuery(this).find('.glyphicon-fullscreen').parent('a').addClass('wos_iconActivated');
                    wos_unminifyWin(jQuery(this),true);
                } else {
                    wos_winShowFront(jQuery(this));                
                    wos_expandWin(jQuery(this));

                }
            }
        });
    }
}
function wos_bookmarkUrl(url){
    if(wos_backendContainer.children('a.wos-shortcut[data-href="'+url+'"]').length == 0){
        var posX = jQuery('#osdb_bootstraped.wos-backendContainer').width()/2-24;
        posX = parseInt(posX/100)*100+18;
        var posY = jQuery('#osdb_bootstraped.wos-backendContainer').height()/2-24;
        posY = parseInt(posY/100)*100+18;
        var shortcut = '<a href="javascript:" data-href="'+url+'" class="wos-shortcut ui-draggable ui-draggable-handle"><div class="wp-menu-image dashicons-before dashicons-admin-site"><br></div><span class="wos-shortcut-title">'+url+'</span></a>';
        initShortcut({
            html: shortcut,
            posX: posX,
            posY: posY
        });
        
        wos_notification('<span class="glyphicon glyphicon-info-sign"></span>'+wos_data.texts.PageBookmarked);
        jQuery.ajax({
            url: ajaxurl,
            type: 'post',
            data: {
                action: 'wos_saveShortcut',
                url: url,
                html: jQuery(shortcut)[0]['outerHTML'],
                posX: posX,
                posY:posY
            },
            success: function(){
                
            }
         });
     }
}

function wos_notification(text){
    var notice = jQuery('<div class="wos_notification"></div>');
    notice.html(text);
    wos_backendContainer.append(notice);
    setTimeout(function(){
        notice.addClass('wos_show');
        setTimeout(function(){
            notice.removeClass('wos_show');
            setTimeout(function(){
                notice.remove();
            },800);        
        },4000);    
    },300);
}
function wos_initRightMenu(){
    var rightMenu = jQuery('<div id="wos_rightMenu"></div>');
    var ul = jQuery('<ul></ul>');
    
    if(wos_data.canEditSettings == 1){
        ul.append('<li><a href="javascript:" onclick="wos_editDesktopSettings();"><span class="fa fa-cogs"></span>'+wos_data.texts['Edit the settings']+'</a></li>');
    }
    if(wos_data.canEditStyles == 1){
        ul.append('<li><a href="javascript:" onclick="wos_editDesktopStyles();"><span class="fa fa-tint"></span>'+wos_data.texts['Desktop appearance']+'</a></li>');
    }
    if(wos_data.canEditShortcuts == 1){
        ul.append('<li><a href="javascript:" onclick="wos_deleteAllShortcuts();"><span class="fa fa-trash"></span>'+wos_data.texts['Delete all shortcuts']+'</a></li>');
    }
    rightMenu.append(ul);
    wos_backendContainer.append(rightMenu);
    if(ul.children().length>0){
        wos_backendContainer.bind('mousedown.rightMenu',function(e)
        { 
            if (wos_backendContainer.find('*:hover').length == 0 && e.button == 2)
            {
               wos_showRightMenu();
            }/*else {
                wos_closeRightMenu();
            }*/                 
        });
    }
    wos_backendContainer.bind('contextmenu.rightMenu', function() {
        return false;
    });
}
function wos_showRightMenu(){
    jQuery('#wos_rightMenu').css({
        left: wos_mousePosition.x +8,
        top: wos_mousePosition.y +8
    });
    jQuery('#wos_rightMenu').slideDown(150);
}
function wos_editDesktopSettings(){
    jQuery('#adminmenu [href="admin.php?page=wos_menu"]').trigger('click');    
}
function wos_editDesktopStyles(){
    jQuery('#adminmenu [href="admin.php?page=wos_design"]').trigger('click');
}
function wos_deleteAllShortcuts(){
    wos_backendContainer.children('.wos-shortcut').fadeOut();
    setTimeout(function(){
        wos_backendContainer.children('.wos-shortcut').remove();
    },350);
    jQuery.ajax({
        url: ajaxurl,
        type: 'post',
        data: {
            action: 'wos_deleteAllShortcuts'
        }
     });
}
function wos_closeRightMenu(){
    jQuery('#wos_rightMenu').slideUp(150);    
}