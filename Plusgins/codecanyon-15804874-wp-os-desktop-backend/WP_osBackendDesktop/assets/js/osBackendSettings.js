var wos_field = false;
wos_data = wos_data[0];
jQuery(document).ready(function(){
 jQuery('.wos_colorpicker').each(function () {
        var $this = jQuery(this);
        if( jQuery(this).prev('.wos_colorPreview').length ==0){
         jQuery(this).before('<div class="wos_colorPreview" style="background-color:#'+$this.val().substr(1, 7)+'"></div>');
        }
        jQuery(this).prev('.wos_colorPreview').click(function(){
            jQuery(this).next('.wos_colorpicker').trigger('click');
        });
        jQuery(this).colpick({
            color: $this.val().substr(1, 7),
            onChange: function (hsb, hex, rgb, el, bySetColor) {
                jQuery(el).val('#' + hex);
                 jQuery(el).prev('.wos_colorPreview').css({
                    backgroundColor: '#'+hex 
                 });
            }
        });
        jQuery(this).on('change',function(){
             jQuery(this).prev('.wos_colorPreview').css({
                backgroundColor: '#'+jQuery(this).val() 
             });
        });
    });
    
    jQuery("#osdb_bootstraped [data-toggle='switch']").bootstrapSwitch();
    jQuery('.imageBtn').click(function () {
        wos_formfield = jQuery(this).prev('input');
        tb_show('', 'media-upload.php?TB_iframe=true');

        return false;

    });
    if(jQuery('#osdb_bootstraped [name="useVideoBackground"]').length>0){
        jQuery('#osdb_bootstraped [name="useVideoBackground"]').bootstrapSwitch('onSwitchChange', function () {
            if(jQuery('#osdb_bootstraped [name="useVideoBackground"]').is(':checked')){
                jQuery('#osdb_bootstraped [name="backgroundImage"]').closest('.form-group').slideUp();
                jQuery('#osdb_bootstraped [name="backgroundVideo"]').closest('.form-group').slideDown();
            } else {
                jQuery('#osdb_bootstraped [name="backgroundImage"]').closest('.form-group').slideDown();
                jQuery('#osdb_bootstraped [name="backgroundVideo"]').closest('.form-group').slideUp();            
            }
        });
        
         jQuery('#osdb_bootstraped [name="login_useVideoBackground"]').bootstrapSwitch('onSwitchChange', function () {
            if(jQuery('#osdb_bootstraped [name="login_useVideoBackground"]').is(':checked')){
                jQuery('#osdb_bootstraped [name="login_backgroundImage"]').closest('.form-group').slideUp();
                jQuery('#osdb_bootstraped [name="login_backgroundVideo"]').closest('.form-group').slideDown();
            } else {
                jQuery('#osdb_bootstraped [name="login_backgroundImage"]').closest('.form-group').slideDown();
                jQuery('#osdb_bootstraped [name="login_backgroundVideo"]').closest('.form-group').slideUp();            
            }
        });
        
         var tooltip = jQuery('<div class="tooltip top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>').css({
                position: 'absolute',
                top: -55,
                left: -20,
                opacity: 1
            }).hide();
        jQuery('#wos_colorBottomAlpha').slider({
            min: 0,
            max: 1,
            value: jQuery('[name="colorBottomAlpha"]').val(),
            step : 0.1,
            orientation: "horizontal",
            range: "min",
            change: function(event, ui){
                jQuery('[name="colorBottomAlpha"]').val(ui.value);
                tooltip.find('.tooltip-inner').html(parseFloat(ui.value));                
                tooltip.show();
            },
            slide: function(event, ui){
                jQuery('[name="colorBottomAlpha"]').val(ui.value);
                tooltip.find('.tooltip-inner').html(parseFloat(ui.value));                
                tooltip.show();
            }
        }).find(".ui-slider-handle").append(tooltip).hover(function () {           
            tooltip.show();
        }, function () {
            tooltip.hide();
        });
        setTimeout(function(){
            tooltip.hide();            
        },500);
        
        if(jQuery('.wos_topBar').length >0){
            jQuery('.wos_topBar a[data-tab]').click(function(){
               if(jQuery(this).attr('data-tab') == 'desktop') {
                   if(document.location.href.indexOf('tab=settings')==-1){
                        //document.location.href = 'admin.php?page=wos_design&tab=settings';
                        window.history.pushState('Settings', 'Settings', 'admin.php?page=wos_design&tab=settings');   
                    }
                   jQuery('.wos_topBar a[data-tab="desktop"]').addClass('wos-active');
                   jQuery('.wos_topBar a[data-tab="adminskin"]').removeClass('wos-active');
                   jQuery('#wos_designDesktopTab').slideDown();
                   jQuery('#wos_designSkinTab').slideUp();                   
               } else {
                   if(document.location.href.indexOf('tab=adminskin')==-1){
                  // document.location.href = 'admin.php?page=wos_design&tab=adminskin';
                     window.history.pushState('Settings', 'Settings', 'admin.php?page=wos_design&tab=adminskin');   
                 }
                   jQuery('.wos_topBar a[data-tab="desktop"]').removeClass('wos-active');
                   jQuery('.wos_topBar a[data-tab="adminskin"]').addClass('wos-active');
                   jQuery('#wos_designDesktopTab').slideUp();
                   jQuery('#wos_designSkinTab').slideDown();                     
               }
            });
            if(document.location.href.indexOf('tab')==-1 || document.location.href.indexOf('tab=settings')>0){
                jQuery('.wos_topBar a[data-tab]').first().trigger('click');
            }else if(document.location.href.indexOf('tab=adminskin')>0 && jQuery('.wos_topBar a[data-tab="adminskin"]').length > 0){
                jQuery('.wos_topBar a[data-tab="adminskin"]').trigger('click');       
            }
        }
    }
    window.old_tb_remove = window.tb_remove;
    window.tb_remove = function () {
        window.old_tb_remove();
        wos_formfield = null;
    };
    window.original_send_to_editor = window.send_to_editor;
    window.send_to_editor = function (html) {
        if (wos_formfield) {
            var alt = jQuery('img', html).attr('alt');
            fileurl = jQuery('img', html).attr('src');
            if(jQuery('img', html).length==0){
                fileurl = jQuery(html).attr('src');  
                alt = jQuery(html).attr('alt');                   
            }
            wos_formfield.val(fileurl);
            tb_remove();
        } else {
            window.original_send_to_editor(html);
        }
    };
    wos_loadSettings();
});
function wos_inIframe () {
    try {
        return window.self !== window.top;
    } catch (e) {
        return true;
    }
}

function wos_loadSettings(){
    var modeDesign = 0;
    if(jQuery('[name="colorWinHeaderBg"]').length>0){
        modeDesign = 1;
    }
    jQuery.ajax({
      url: ajaxurl,
      type: 'post',
      data: {
        action: 'wos_loadSettings',
        modeDesign: modeDesign
      },
      success: function(rep) {          
           rep = JSON.parse(rep);
           jQuery('#wos_settings [name="rolesAllowed"] option').removeAttr('selected');
          jQuery('#wos_settings').find('input,select,textarea').each(function () {
              if(jQuery(this).attr('name') == 'rolesAllowed'){
                  var roles = rep.rolesAllowed.split(',');
                  jQuery.each(roles,function(){
                      jQuery('#wos_settings [name="rolesAllowed"] option[value="'+this+'"]').attr('selected','selected');
                  });
              }else {
                if(jQuery(this).is('[data-toggle="switch"]')){
                    var value = false;
                    eval('if(rep.' + jQuery(this).attr('name') + ' == 1 && jQuery(this).attr(\'checked\') != \'checked\'){jQuery(this).trigger(\'click\');}');
                    eval('if(rep.' + jQuery(this).attr('name') + ' == 0 && jQuery(this).attr(\'checked\') == \'checked\'){jQuery(this).trigger(\'click\');}');
                    var self = this;
                    if (jQuery(self).closest('.form-group').find('small').length > 0) {
                        jQuery(self).closest('.has-switch').tooltip({
                            title: jQuery(self).closest('.form-group').find('small').html()
                        });
                    }
                }else {
                    eval('jQuery(this).val(rep.' + jQuery(this).attr('name') + ');');
                    jQuery(this).change();
                }
            }
            });   
             if(jQuery('#osdb_bootstraped [name="useVideoBackground"]').is(':checked')){
                jQuery('#osdb_bootstraped [name="backgroundImage"]').closest('.form-group').slideUp();
                jQuery('#osdb_bootstraped [name="backgroundVideo"]').closest('.form-group').slideDown();
            } else {
                jQuery('#osdb_bootstraped [name="backgroundImage"]').closest('.form-group').slideDown();
                jQuery('#osdb_bootstraped [name="backgroundVideo"]').closest('.form-group').slideUp();            
            }
             if(jQuery('#osdb_bootstraped [name="login_useVideoBackground"]').is(':checked')){
                jQuery('#osdb_bootstraped [name="login_backgroundImage"]').closest('.form-group').slideUp();
                jQuery('#osdb_bootstraped [name="login_backgroundVideo"]').closest('.form-group').slideDown();
            } else {
                jQuery('#osdb_bootstraped [name="login_backgroundImage"]').closest('.form-group').slideDown();
                jQuery('#osdb_bootstraped [name="login_backgroundVideo"]').closest('.form-group').slideUp();            
            }
            if(rep.purchaseCode == ""){
                jQuery('#wos_settings [name="purchaseCode"]').closest('.form-group').addClass('has-error');
            }
            if(jQuery('#wos_colorBottomAlpha').length>0){
                jQuery('#wos_colorBottomAlpha').slider('value',parseFloat(rep.colorBottomAlpha));
            }
      }
  });
}

function wos_saveSettings(){
    var formData = {};
    jQuery('#wos_settings').find('input[name],select[name],textarea[name]').each(function () {
        if(jQuery(this).attr('name') != 'rolesAllowed'){
            if (!jQuery(this).is('[data-toggle="switch"]')) {           
              eval('formData.' + jQuery(this).attr('name') + ' = jQuery(this).val();');
            } else {
              var value = 0;
              if (jQuery(this).is(':checked')){
                value = 1;
              }
              eval('formData.' + jQuery(this).attr('name') + ' = value;');
            } 
        }      
    });
    var rolesAllowed = '';
    jQuery('#wos_settings [name="rolesAllowed"] option:selected').each(function(){
       rolesAllowed += jQuery(this).attr('value')+',';
    });
    if(rolesAllowed.length>0){
        rolesAllowed = rolesAllowed.substr(0,rolesAllowed.length-1);
    }
    if(jQuery('#wos_colorBottomAlpha').length>0){
        if(formData.backgroundVideo.indexOf('https://www.youtube.com/watch?v=') == 0){
            var videoID = formData.backgroundVideo.substr(formData.backgroundVideo.indexOf('=')+1,formData.backgroundVideo.length);
            formData.backgroundVideo = 'https://www.youtube.com/embed/'+videoID;
        } else if(formData.backgroundVideo.indexOf('https://youtu.be/') == 0){
            var videoID = formData.backgroundVideo.substr(formData.backgroundVideo.indexOf('.be/')+4,formData.backgroundVideo.length);
            formData.backgroundVideo = 'https://www.youtube.com/embed/'+videoID;
        }
    }
    
    if(jQuery('[name="login_backgroundVideo"]').length>0){
        if(formData.login_backgroundVideo.indexOf('https://www.youtube.com/watch?v=') == 0){
            var videoID = formData.login_backgroundVideo.substr(formData.login_backgroundVideo.indexOf('=')+1,formData.login_backgroundVideo.length);
            formData.login_backgroundVideo = 'https://www.youtube.com/embed/'+videoID;
        } else if(formData.login_backgroundVideo.indexOf('https://youtu.be/') == 0){
            var videoID = formData.login_backgroundVideo.substr(formData.login_backgroundVideo.indexOf('.be/')+4,formData.login_backgroundVideo.length);
            formData.login_backgroundVideo = 'https://www.youtube.com/embed/'+videoID;
        }
    }
    formData.rolesAllowed = rolesAllowed;
    formData.action = 'wos_saveSettings';
    if(jQuery('[name="colorWinHeaderBg"]').length>0){
        formData.action = 'wos_saveDesign';
    }
    jQuery.ajax({
        url: ajaxurl,
        type: 'post',
        data: formData,
        success: function () {
            if(wos_inIframe()){
                window.parent.wos_reloadPage();
            } else {
                document.location.href = document.location.href;
            }
        }
    });
}
function wos_resetColors(){
    jQuery('#wos_settings [name="colorBg"]').val('#2c3e50').prev('.wos_colorPreview').css({
        backgroundColor: '#2c3e50'
     });
    jQuery('#wos_settings [name="colorWinHeaderBg"]').val('#1cccaa').prev('.wos_colorPreview').css({
        backgroundColor: '#1cccaa'
     });
    jQuery('#wos_settings [name="colorWinHeader"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="colorWinIconsBg"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="colorWinIconsSelected"]').val('#95a5a6').prev('.wos_colorPreview').css({
        backgroundColor: '#95a5a6'
     });
    jQuery('#wos_settings [name="colorWinIcons"]').val('#95a5a6').prev('.wos_colorPreview').css({
        backgroundColor: '#95a5a6'
     });
    jQuery('#wos_settings [name="colorShortcuts"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });     
     
    jQuery('#wos_settings [name="colorContextmenuBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
     
    jQuery('#wos_settings [name="colorContextmenuLinks"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
     
    jQuery('#wos_settings [name="colorContextmenuLinksHover"]').val('#1cccaa').prev('.wos_colorPreview').css({
        backgroundColor: '#1cccaa'
     });
    jQuery('#wos_settings [name="colorBottomBar"]').val('#000000').prev('.wos_colorPreview').css({
        backgroundColor: '#000000'
     });
    jQuery('#wos_settings [name="colorBottomAlpha"]').val(0.6);
    jQuery('#wos_colorBottomAlpha').slider('value',0.6);
    
    
    jQuery('#wos_settings [name="skin_topBarColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColorBgHover"]').val('#22313F').prev('.wos_colorPreview').css({
        backgroundColor: '#22313F'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColor"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColorHover"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColorSubmenu"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_topBarLinksColorSubmenuHover"]').val('#1cccaa').prev('.wos_colorPreview').css({
        backgroundColor: '#1cccaa'
     });
    jQuery('#wos_settings [name="skin_sideBarColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorBgHover"]').val('#22313F').prev('.wos_colorPreview').css({
        backgroundColor: '#22313F'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorSubmenu"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorSubmenuActive"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_sideBarHeaderColorSubmenuActiveBg"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="skin_sideBarHeaderColorSubmenuActive"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorSubmenuHover"]').val('#1cccaa').prev('.wos_colorPreview').css({
        backgroundColor: '#1cccaa'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColor"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="skin_sideBarLinksColorHover"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });     
     
     
    
    
    jQuery('#wos_settings [name="skin_googleFont"]').val('Work Sans');
    jQuery('#wos_settings [name="skin_colorBtnPrimary"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_colorBtnPrimaryBg"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="skin_colorBtnSecondary"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_colorBtnSecondaryBg"]').val('#f39c12').prev('.wos_colorPreview').css({
        backgroundColor: '#f39c12'
     });
    jQuery('#wos_settings [name="skin_colorBtnDefault"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_colorBtnDefaultBg"]').val('#bdc3c7').prev('.wos_colorPreview').css({
        backgroundColor: '#bdc3c7'
     });
    jQuery('#wos_settings [name="skin_pageBg"]').val('#ecf0f1').prev('.wos_colorPreview').css({
        backgroundColor: '#ecf0f1'
     });
    jQuery('#wos_settings [name="skin_linksColor"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="skin_headersColor"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="skin_headersColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="login_useVideoBackground"]').bootstrapSwitch('state',false);
    
    // TODO
    jQuery('#wos_settings [name="login_backgroundVideo"]').val('');
    jQuery('#wos_settings [name="login_backgroundImage"]').val('');
    jQuery('#wos_settings [name="login_colorBg"]').val('#2c3e50').prev('.wos_colorPreview').css({
        backgroundColor: '#2c3e50'
     });
    jQuery('#wos_settings [name="login_mainColor"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="login_panelColor"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="login_panelColorBg"]').val('#34495e').prev('.wos_colorPreview').css({
        backgroundColor: '#34495e'
     });
    jQuery('#wos_settings [name="login_linksColor"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="login_buttonColor"]').val('#ffffff').prev('.wos_colorPreview').css({
        backgroundColor: '#ffffff'
     });
    jQuery('#wos_settings [name="login_buttonColorBg"]').val('#1abc9c').prev('.wos_colorPreview').css({
        backgroundColor: '#1abc9c'
     });
    jQuery('#wos_settings [name="login_logo"]').val(wos_data.assetsUrl+'img/businessman-256.png');
     
     
}
function wos_applyShortCutsRole(){
    var role = jQuery('#wos_applyshortcutsToRole').val();
    if(role != ""){
        jQuery.ajax({
           url: ajaxurl,
            type:'post',
            data:{
               action: 'wos_applyShortcutsRole',
               role: role
            },
            success: function(rep){
                jQuery('#wos_applyshortcutsToRole').val('');
                jQuery('#wos_applyShortcutsRoleBtn').addClass('btn-primary');
                setTimeout(function(){
                    jQuery('#wos_applyShortcutsRoleBtn').removeClass('btn-primary');
                },2000);
            }
        });
    }
}