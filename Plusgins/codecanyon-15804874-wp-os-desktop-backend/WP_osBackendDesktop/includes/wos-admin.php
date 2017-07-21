<?php

if (!defined('ABSPATH'))
    exit;

class WOS_admin {

    /**
     * The single instance
     * @var    object
     * @access  private
     * @since    1.0.0
     */
    private static $_instance = null;

    /**
     * The main plugin object.
     * @var    object
     * @access  public
     * @since    1.0.0
     */
    public $parent = null;

    /**
     * Prefix for plugin settings.
     * @var     string
     * @access  publicexport
     * Delete
     * @since   1.0.0
     */
    public $base = '';

    /**
     * Available settings for plugin.
     * @var     array
     * @access  public
     * @since   1.0.0
     */
    public $settings = array();

    public function __construct($parent) {
        $this->parent = $parent;
        $this->base = 'wos_';
        $this->dir = dirname($this->parent->file);
        add_action('admin_menu', array($this, 'add_menu_item'));
        add_action('admin_print_scripts', array($this, 'admin_scripts'));
        add_action('admin_print_styles', array($this, 'admin_styles'));
        add_action('wp_ajax_nopriv_wos_saveSettings', array($this, 'saveSettings'));
        add_action('wp_ajax_wos_saveSettings', array($this, 'saveSettings'));
        add_action('wp_ajax_nopriv_wos_saveDesign', array($this, 'saveDesign'));
        add_action('wp_ajax_wos_saveDesign', array($this, 'saveDesign'));

        add_action('wp_ajax_nopriv_wos_loadSettings', array($this, 'loadSettings'));
        add_action('wp_ajax_wos_loadSettings', array($this, 'loadSettings'));
        add_action('wp_ajax_nopriv_wos_saveShortcut', array($this, 'saveShortcut'));
        add_action('wp_ajax_wos_saveShortcut', array($this, 'saveShortcut'));
        add_action('wp_ajax_nopriv_wos_deleteShortcut', array($this, 'deleteShortcut'));
        add_action('wp_ajax_wos_deleteShortcut', array($this, 'deleteShortcut'));
        add_action('wp_ajax_nopriv_wos_deleteAllShortcuts', array($this, 'deleteAllShortcuts'));
        add_action('wp_ajax_wos_deleteAllShortcuts', array($this, 'deleteAllShortcuts'));

        add_action('wp_ajax_nopriv_wos_applyShortcutsRole', array($this, 'applyShortcutsRole'));
        add_action('wp_ajax_wos_applyShortcutsRole', array($this, 'applyShortcutsRole'));
        add_action('wp_ajax_nopriv_wos_checkURL', array($this, 'checkURL'));
        add_action('wp_ajax_wos_checkURL', array($this, 'checkURL'));

        add_action('admin_head', array($this, 'options_custom_styles'));
        add_action('init', array($this, 'detectPluginActivation'));
        add_action('init', array($this, 'initAdmin'));
        add_action('admin_init', array($this, 'checkAutomaticUpdates'));
        add_action('wp_logout', array($this, 'endSession'));
        add_action('wp_login', array($this, 'endSession'));
    }

    public function wos_SkinBodyClass($classes) {
        return $classes . ' wos_skin';
    }
    public function wos_ViewBodyClass($classes) {
        return $classes . ' wos_view';
    }
    
    public function initAdmin (){
        $settings = $this->getSettings();
         if ($settings->enableWOS && $this->checkRolesRight() && !is_network_admin()) {
            if (!isset($_GET['wos-reload'])) {
                add_filter('admin_body_class', array($this, 'wos_ViewBodyClass'));                
            }
         }
         
        if ($settings->useAdminSkin) {
            add_filter('admin_body_class', array($this, 'wos_SkinBodyClass'));
        }
    }

    /**
     * Add menu to admin
     * @return void
     */
    public function add_menu_item() {
        $settings = $this->getSettings();
        if (current_user_can('manage_options')) {
            add_menu_page('WP OS Desktop', __("WP OS Desktop", 'wos'), 'manage_options', 'wos_menu', array($this, 'view_settings_wos'), 'dashicons-welcome-view-site');
            if (current_user_can('manage_options') && $settings->useAdminSkin) {
                add_submenu_page('wos_menu', __('Desktop appearance', 'wos'), __('Appearance', 'wos'), 'manage_options', 'wos_design', array($this, 'view_design_wos'));
            }
        } elseif ($settings->enableWOS && $this->checkRolesRight() && $settings->usersCanChangeStyles && !is_network_admin()) {
            add_menu_page('WP OS Desktop', __("Desktop appearance", 'wos'), 'read', 'wos_design', array($this, 'view_design_wos'), 'dashicons-welcome-view-site');
        }
        //add_menu_page('WP OS Desktop', __("WP OS Desktop", 'wos'), 'manage_options', 'wos_menu', array($this, 'view_settings_wos'), 'dashicons-welcome-view-site');

        if ($settings->enableWOS && $this->checkRolesRight() && !is_network_admin()) {
            add_menu_page('WP OS Desktop Browser', __("Web Browser", 'wos'), 'read', 'wos_browser', array($this, 'web_browser'), 'dashicons-admin-site');
        }
        $menuSlag = 'wos_menu';
    }

    public function getSettings() {
        global $wpdb;
        $table_name = $wpdb->prefix . "wos_settings";
        $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
        $settings = $settings[0];
        return $settings;
    }

    public function loadSettings() {
        $modeDesign = sanitize_text_field($_POST['modeDesign']);
        $settings = $this->getSettings();
        if ($modeDesign == 1) {
            unset($settings->purchaseCode);
            if (get_user_option('colorWinHeader') != false) {
                $settings->colorWinHeader = get_user_option('colorWinHeader');
            }
            if (get_user_option('colorWinHeaderBg') != false) {
                $settings->colorWinHeaderBg = get_user_option('colorWinHeaderBg');
            }
            if (get_user_option('colorWinIconsBg') != false) {
                $settings->colorWinIconsBg = get_user_option('colorWinIconsBg');
            }
            if (get_user_option('colorWinIcons') != false) {
                $settings->colorWinIcons = get_user_option('colorWinIcons');
            }
            if (get_user_option('colorWinIconsSelected') != false) {
                $settings->colorWinIconsSelected = get_user_option('colorWinIconsSelected');
            }
            if (get_user_option('colorWPMenuLinks') != false) {
                $settings->colorWPMenuLinks = get_user_option('colorWPMenuLinks');
            }
            if (get_user_option('colorWPMenuBadges') != false) {
                $settings->colorWPMenuBadges = get_user_option('colorWPMenuBadges');
            }
            if (get_user_option('colorShortcuts') != false) {
                $settings->colorShortcuts = get_user_option('colorShortcuts');
            }
            if (get_user_option('colorContextmenuBg') != false) {
                $settings->colorContextmenuBg = get_user_option('colorContextmenuBg');
            }
            if (get_user_option('colorContextmenuLinks') != false) {
                $settings->colorContextmenuLinks = get_user_option('colorContextmenuLinks');
            }
            if (get_user_option('colorContextmenuLinksHover') != false) {
                $settings->colorContextmenuLinksHover = get_user_option('colorContextmenuLinksHover');
            }
            if (get_user_option('fxWinGray') != false) {
                $settings->fxWinGray = get_user_option('fxWinGray');
                if (get_user_option('fxWinGray') == 'false') {
                    $settings->fxWinGray = 0;
                }
            }
            if (get_user_option('fxWinBlur') != false) {
                $settings->fxWinBlur = get_user_option('fxWinBlur');
                if (get_user_option('fxWinBlur') == 'false') {
                    $settings->fxWinBlur = 0;
                }
            }
            if (get_user_option('fxWinDark') != false) {
                $settings->fxWinDark = get_user_option('fxWinDark');
                if (get_user_option('fxWinDark') == 'false') {
                    $settings->fxWinDark = 0;
                }
            }
            if (get_user_option('useVideoBackground') != false) {
                $settings->useVideoBackground = get_user_option('useVideoBackground');
            }
            if (get_user_option('backgroundImage') != false) {
                $settings->backgroundImage = get_user_option('backgroundImage');
            }
            if (get_user_option('backgroundVideo') != false) {
                $settings->backgroundVideo = get_user_option('backgroundVideo');
            }
            if (get_user_option('colorBottomBar') != false) {
                $settings->colorBottomBar = get_user_option('colorBottomBar');
            }
            if (get_user_option('colorBottomAlpha') != false) {
                $settings->colorBottomAlpha = get_user_option('colorBottomAlpha');
                if (get_user_option('colorBottomAlpha') == 'false') {
                    $settings->colorBottomAlpha = 0;
                }
            }
            if (get_user_option('colorBg') != false) {
                $settings->colorBg = get_user_option('colorBg');
            }
            
            if (get_user_option('skin_topBarColorBg') != false) {
                $settings->skin_topBarColorBg = get_user_option('skin_topBarColorBg');
            }
            if (get_user_option('skin_topBarLinksColorBg') != false) {
                $settings->skin_topBarLinksColorBg = get_user_option('skin_topBarLinksColorBg');
            }
            if (get_user_option('skin_topBarLinksColorBgHover') != false) {
                $settings->skin_topBarLinksColorBgHover = get_user_option('skin_topBarLinksColorBgHover');
            }
            if (get_user_option('skin_topBarLinksColor') != false) {
                $settings->skin_topBarLinksColor = get_user_option('skin_topBarLinksColor');
            }
            if (get_user_option('skin_topBarLinksColorSubmenu') != false) {
                $settings->skin_topBarLinksColorSubmenu = get_user_option('skin_topBarLinksColorSubmenu');
            }
            if (get_user_option('skin_topBarLinksColorSubmenuHover') != false) {
                $settings->skin_topBarLinksColorSubmenuHover = get_user_option('skin_topBarLinksColorSubmenuHover');
            }
            if (get_user_option('skin_sideBarColorBg') != false) {
                $settings->skin_sideBarColorBg = get_user_option('skin_sideBarColorBg');
            }
            if (get_user_option('skin_sideBarLinksColorBg') != false) {
                $settings->skin_sideBarLinksColorBg = get_user_option('skin_sideBarLinksColorBg');
            }
            if (get_user_option('skin_sideBarLinksColorBgHover') != false) {
                $settings->skin_sideBarLinksColorBgHover = get_user_option('skin_sideBarLinksColorBgHover');
            }
            if (get_user_option('skin_sideBarLinksColorSubmenu') != false) {
                $settings->skin_sideBarLinksColorSubmenu = get_user_option('skin_sideBarLinksColorSubmenu');
            }
            if (get_user_option('skin_sideBarLinksColorSubmenuActive') != false) {
                $settings->skin_sideBarLinksColorSubmenuActive = get_user_option('skin_sideBarLinksColorSubmenuActive');
            }       
            if (get_user_option('skin_sideBarHeaderColorSubmenuActiveBg') != false) {
                $settings->skin_sideBarHeaderColorSubmenuActiveBg = get_user_option('skin_sideBarHeaderColorSubmenuActiveBg');
            }       
            if (get_user_option('skin_sideBarHeaderColorSubmenuActive') != false) {
                $settings->skin_sideBarHeaderColorSubmenuActive = get_user_option('skin_sideBarHeaderColorSubmenuActive');
            }       
            
            
            if (get_user_option('skin_sideBarLinksColorSubmenuHover') != false) {
                $settings->skin_sideBarLinksColorSubmenuHover = get_user_option('skin_sideBarLinksColorSubmenuHover');
            }      
            if (get_user_option('skin_sideBarLinksColor') != false) {
                $settings->skin_sideBarLinksColor = get_user_option('skin_sideBarLinksColor');
            }     
            if (get_user_option('skin_sideBarLinksColorHover') != false) {
                $settings->skin_sideBarLinksColorHover = get_user_option('skin_sideBarLinksColorHover');
            }     
            
            
            if (get_user_option('skin_googleFont') != false) {
                $settings->skin_googleFont = get_user_option('skin_googleFont');
            }     
            if (get_user_option('skin_colorBtnPrimary') != false) {
                $settings->skin_colorBtnPrimary = get_user_option('skin_colorBtnPrimary');
            }     
            if (get_user_option('skin_colorBtnPrimaryBg') != false) {
                $settings->skin_colorBtnPrimaryBg = get_user_option('skin_colorBtnPrimaryBg');
            }     
            if (get_user_option('skin_colorBtnSecondary') != false) {
                $settings->skin_colorBtnSecondary = get_user_option('skin_colorBtnSecondary');
            }     
            if (get_user_option('skin_colorBtnSecondaryBg') != false) {
                $settings->skin_colorBtnSecondaryBg = get_user_option('skin_colorBtnSecondaryBg');
            }     
            if (get_user_option('skin_colorBtnDefault') != false) {
                $settings->skin_colorBtnDefault = get_user_option('skin_colorBtnDefault');
            }     
            if (get_user_option('skin_colorBtnDefaultBg') != false) {
                $settings->skin_colorBtnDefaultBg = get_user_option('skin_colorBtnDefaultBg');
            }     
            if (get_user_option('skin_pageBg') != false) {
                $settings->skin_pageBg = get_user_option('skin_pageBg');
            }     
            if (get_user_option('skin_linksColor') != false) {
                $settings->skin_linksColor = get_user_option('skin_linksColor');
            }     
            if (get_user_option('skin_headersColor') != false) {
                $settings->skin_headersColor = get_user_option('skin_headersColor');
            }     
            if (get_user_option('skin_headersColorBg') != false) {
                $settings->skin_headersColorBg = get_user_option('skin_headersColorBg');
            }     
            
            
            
        } else if (!current_user_can('manage_options')) {
            $settings = new stdClass();
        }

        echo(json_encode($settings));

        die();
    }

    public function detectPluginActivation() {
        if (!session_id()) {
            session_start();
        }
        if (isset($_GET['action']) && ($_GET['action'] == 'activate' || $_GET['action'] == 'deactivate')) {
            $_SESSION['wos_loadPageBackend'] = 1;
        }
    }

    /*
     * Check for updates
     */

    function checkAutomaticUpdates() {
        $settings = $this->getSettings();
        if ($settings && $settings->purchaseCode != "") {
            require_once('plugin_update_check.php');
            $updateCheckerWos = new PluginUpdateChecker_2_0(
                    'https://kernl.us/api/v1/updates/5718cb711e14737d770078b8/', $this->parent->file, 'wos', 1
            );
            $updateCheckerWos->purchaseCode = $settings->purchaseCode;
        }
    }

    public function endSession() {
        session_destroy();
    }

    private function hex2rgba($color, $opacity = false) {

        $default = 'rgb(0,0,0)';

        //Return default if no color provided
        if (empty($color))
            return $default;

        //Sanitize $color if "#" is provided 
        if ($color[0] == '#') {
            $color = substr($color, 1);
        }

        //Check if color has 6 or 3 characters and get values
        if (strlen($color) == 6) {
            $hex = array($color[0] . $color[1], $color[2] . $color[3], $color[4] . $color[5]);
        } elseif (strlen($color) == 3) {
            $hex = array($color[0] . $color[0], $color[1] . $color[1], $color[2] . $color[2]);
        } else {
            return $default;
        }

        //Convert hexadec to rgb
        $rgb = array_map('hexdec', $hex);

        //Check if opacity is set(rgba or rgb)
        if ($opacity) {
            if (abs($opacity) > 1)
                $opacity = 1.0;
            $output = 'rgba(' . implode(",", $rgb) . ',' . $opacity . ')';
        } else {
            $output = 'rgb(' . implode(",", $rgb) . ')';
        }

        //Return rgb(a) color string
        return $output;
    }

    public function options_custom_styles() {
        $settings = $this->getSettings();
        if (current_user_can('manage_options') || $settings->usersCanChangeStyles) {
            if (get_user_option('colorWinHeader') != false) {
                $settings->colorWinHeader = get_user_option('colorWinHeader');
            }
            if (get_user_option('colorWinHeaderBg') != false) {
                $settings->colorWinHeaderBg = get_user_option('colorWinHeaderBg');
            }
            if (get_user_option('colorWinIconsBg') != false) {
                $settings->colorWinIconsBg = get_user_option('colorWinIconsBg');
            }
            if (get_user_option('colorWinIcons') != false) {
                $settings->colorWinIcons = get_user_option('colorWinIcons');
            }
            if (get_user_option('colorWinIconsSelected') != false) {
                $settings->colorWinIconsSelected = get_user_option('colorWinIconsSelected');
            }
            if (get_user_option('colorWPMenuLinks') != false) {
                $settings->colorWPMenuLinks = get_user_option('colorWPMenuLinks');
            }
            if (get_user_option('colorWPMenuBadges') != false) {
                $settings->colorWPMenuBadges = get_user_option('colorWPMenuBadges');
            }
            if (get_user_option('colorShortcuts') != false) {
                $settings->colorShortcuts = get_user_option('colorShortcuts');
            }
            if (get_user_option('colorContextmenuBg') != false) {
                $settings->colorContextmenuBg = get_user_option('colorContextmenuBg');
            }
            if (get_user_option('colorContextmenuLinks') != false) {
                $settings->colorContextmenuLinks = get_user_option('colorContextmenuLinks');
            }
            if (get_user_option('colorContextmenuLinksHover') != false) {
                $settings->colorContextmenuLinksHover = get_user_option('colorContextmenuLinksHover');
            }
            if (get_user_option('fxWinGray') != false) {
                $settings->fxWinGray = get_user_option('fxWinGray');
            }
            if (get_user_option('fxWinBlur') != false) {
                $settings->fxWinBlur = get_user_option('fxWinBlur');
            }
            if (get_user_option('fxWinDark') != false) {
                $settings->fxWinDark = get_user_option('fxWinDark');
            }
            if (get_user_option('backgroundImage') != false) {
                $settings->backgroundImage = get_user_option('backgroundImage');
            }
            if (get_user_option('useVideoBackground') != false) {
                $settings->useVideoBackground = get_user_option('useVideoBackground');
            }
            if (get_user_option('backgroundVideo') != false) {
                $settings->backgroundVideo = get_user_option('backgroundVideo');
            }
            if (get_user_option('colorBottomBar') != false) {
                $settings->colorBottomBar = get_user_option('colorBottomBar');
            }
            if (get_user_option('colorBottomAlpha') != false) {
                $settings->colorBottomAlpha = get_user_option('colorBottomAlpha');
            }
            if (get_user_option('colorBg') != false) {
                $settings->colorBg = get_user_option('colorBg');
            }

            if ($settings->useAdminSkin) {
                if (get_user_option('skin_topBarColorBg') != false) {
                    $settings->skin_topBarColorBg = get_user_option('skin_topBarColorBg');
                }
                if (get_user_option('skin_topBarLinksColorBg') != false) {
                    $settings->skin_topBarLinksColorBg = get_user_option('skin_topBarLinksColorBg');
                }
                if (get_user_option('skin_topBarLinksColorBgHover') != false) {
                    $settings->skin_topBarLinksColorBgHover = get_user_option('skin_topBarLinksColorBgHover');
                }
                if (get_user_option('skin_topBarLinksColor') != false) {
                    $settings->skin_topBarLinksColor = get_user_option('skin_topBarLinksColor');
                }
                if (get_user_option('skin_topBarLinksColorSubmenu') != false) {
                    $settings->skin_topBarLinksColorSubmenu = get_user_option('skin_topBarLinksColorSubmenu');
                }
                if (get_user_option('skin_topBarLinksColorSubmenuHover') != false) {
                    $settings->skin_topBarLinksColorSubmenuHover = get_user_option('skin_topBarLinksColorSubmenuHover');
                }
                if (get_user_option('skin_sideBarColorBg') != false) {
                    $settings->skin_sideBarColorBg = get_user_option('skin_sideBarColorBg');
                }
                if (get_user_option('skin_sideBarLinksColorBg') != false) {
                    $settings->skin_sideBarLinksColorBg = get_user_option('skin_sideBarLinksColorBg');
                }
                if (get_user_option('skin_sideBarLinksColorBgHover') != false) {
                    $settings->skin_sideBarLinksColorBgHover = get_user_option('skin_sideBarLinksColorBgHover');
                }
                if (get_user_option('skin_topBarLinksColorSubmenu') != false) {
                    $settings->skin_topBarLinksColorSubmenu = get_user_option('skin_topBarLinksColorSubmenu');
                }
                if (get_user_option('skin_sideBarLinksColorSubmenuHover') != false) {
                    $settings->skin_sideBarLinksColorSubmenuHover = get_user_option('skin_sideBarLinksColorSubmenuHover');
                }
                if (get_user_option('skin_sideBarLinksColor') != false) {
                    $settings->skin_sideBarLinksColor = get_user_option('skin_sideBarLinksColor');
                }
                if (get_user_option('skin_sideBarLinksColorHover') != false) {
                    $settings->skin_sideBarLinksColorHover = get_user_option('skin_sideBarLinksColorHover');
                }
                
                
            
            if (get_user_option('skin_googleFont') != false) {
                $settings->skin_googleFont = get_user_option('skin_googleFont');
            }     
            if (get_user_option('skin_colorBtnPrimary') != false) {
                $settings->skin_colorBtnPrimary = get_user_option('skin_colorBtnPrimary');
            }     
            if (get_user_option('skin_colorBtnPrimaryBg') != false) {
                $settings->skin_colorBtnPrimaryBg = get_user_option('skin_colorBtnPrimaryBg');
            }     
            if (get_user_option('skin_colorBtnSecondary') != false) {
                $settings->skin_colorBtnSecondary = get_user_option('skin_colorBtnSecondary');
            }     
            if (get_user_option('skin_colorBtnSecondaryBg') != false) {
                $settings->skin_colorBtnSecondaryBg = get_user_option('skin_colorBtnSecondaryBg');
            }     
            if (get_user_option('skin_colorBtnDefault') != false) {
                $settings->skin_colorBtnDefault = get_user_option('skin_colorBtnDefault');
            }     
            if (get_user_option('skin_colorBtnDefaultBg') != false) {
                $settings->skin_colorBtnDefaultBg = get_user_option('skin_colorBtnDefaultBg');
            }     
            if (get_user_option('skin_pageBg') != false) {
                $settings->skin_pageBg = get_user_option('skin_pageBg');
            }     
            if (get_user_option('skin_linksColor') != false) {
                $settings->skin_linksColor = get_user_option('skin_linksColor');
            }     
            if (get_user_option('skin_headersColor') != false) {
                $settings->skin_headersColor = get_user_option('skin_headersColor');
            }     
            if (get_user_option('skin_headersColorBg') != false) {
                $settings->skin_headersColorBg = get_user_option('skin_headersColorBg');
            }     
                
            }
        }

        $settings->colorBottomBar = $this->hex2rgba($settings->colorBottomBar, $settings->colorBottomAlpha);
        $output = '';

        if ($settings->enableWOS) {
            $output .= '#osdb_bootstraped.wos-backendContainer,#osdb_videoBg {';
            $output .= ' background-color: ' . $settings->colorBg . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-window {';
            $output .= ' border-color: ' . $settings->colorWinHeaderBg . ';';
            $output .= ' background-color: ' . $settings->colorWinHeaderBg . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-shortcut .wos_editShortcutIcon {';
            $output .= ' background-color: ' . $settings->colorWinHeaderBg . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-window > .wos-window-header,#osdb_bootstraped #wos-closedWindows-container > a {';
            $output .= ' background-color: ' . $settings->colorWinHeaderBg . ';';
            $output .= ' color: ' . $settings->colorWinHeader . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-window > .wos-window-header .wos-window-title, #osdb_bootstraped .wos-window > .wos-window-header .wos-window-icon:before {';
            $output .= ' color: ' . $settings->colorWinHeader . ';';
            $output .= '}';
            $output .= "\n";


            $output .= '#osdb_bootstraped .wos-window .wos-window-loader {';
            $output .= ' background-color: ' . $settings->colorWinHeaderBg . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-window .wos-window-loader .wos-spinner{';
            $output .= ' background-color: ' . $settings->colorWinHeader . ';';
            $output .= '}';
            $output .= "\n";


            $output .= '#osdb_bootstraped .wos-window > .wos-window-header > .wos-window-header-icons > a.wos-window-header-icon {';
            $output .= ' background-color: ' . $settings->colorWinIconsBg . ';';
            $output .= ' color: ' . $settings->colorWinIcons . ';';
            $output .= '}';
            $output .= "\n";


            $output .= '#osdb_bootstraped .wos-window > .wos-window-header > .wos-window-header-icons > a.wos-window-header-icon.wos_iconActivated,'
                    . '#osdb_bootstraped .wos-window > .wos-window-header > .wos-window-header-icons > a.wos-window-header-icon:active  {';
            $output .= ' background-color: ' . $settings->colorWinIconsSelected . ';';
            $output .= ' color: ' . $settings->colorWinHeader . ';';
            $output .= '}';
            $output .= "\n";


            $output .= '#osdb_bootstraped .wos-window > .wos-window-header > .wos-window-header-icons > a.wos-window-header-icon:hover {';
            $output .= ' color: ' . $settings->colorWinHeaderBg . ';';
            $output .= '}';
            $output .= "\n";


            $output .= '#osdb_bootstraped #wos_rightMenu {';
            $output .= ' background-color: ' . $settings->colorContextmenuBg . ';';
            $output .= '}';
            $output .= "\n";
            $output .= '#osdb_bootstraped #wos_rightMenu ul li a {';
            $output .= ' color: ' . $settings->colorContextmenuLinks . ';';
            $output .= '}';
            $output .= "\n";
            $output .= '#osdb_bootstraped #wos_rightMenu ul li a:hover,#osdb_bootstraped #wos_rightMenu ul li a:active {';
            $output .= ' color: ' . $settings->colorContextmenuLinksHover . ';';
            $output .= '}';
            $output .= "\n";
            $output .= '#osdb_bootstraped #wos-closedWindows-container{';
            $output .= ' background-color: ' . $settings->colorBottomBar . ';';
            $output .= '}';
            $output .= "\n";

            $fxGray = '0';
            $fxBlur = '0';
            $fxBrightness = '100';
            if ($settings->fxWinGray) {
                $fxGray = '100';
            }
            if ($settings->fxWinBlur) {
                $fxBlur = '0.7';
            }
            if ($settings->fxWinDark) {
                $fxBrightness = '90%';
            }

            $defaultWinFilters = 'blur(' . $fxBlur . 'px) grayscale(' . $fxGray . '%) brightness(' . $fxBrightness . '%);';
            $output .= '#osdb_bootstraped .wos-window {';
            $output .= ' -webkit-filter: ' . $defaultWinFilters . ';';
            $output .= ' filter: ' . $defaultWinFilters . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-shortcut-title{';
            $output .= ' color: ' . $settings->colorShortcuts . ';';
            $output .= '}';
            $output .= "\n";

            $output .= '#osdb_bootstraped .wos-shortcut .wp-menu-image:before{';
            $output .= ' color: ' . $settings->colorShortcuts . ';';
            $output .= '}';
            $output .= "\n";


            if ($settings->backgroundImage != "" && (!$settings->useVideoBackground|| $settings->useVideoBackground == 'false')) {
                $output .= '#osdb_bootstraped.wos-backendContainer {';
                $output .= ' background-image: url(' . $settings->backgroundImage . ');';
                $output .= '}';
                $output .= "\n";
            }

            if ($settings->hideWPMenu && !current_user_can('manage_options')) {
                $output .= '#adminmenumain {';
                $output .= ' display: none !important;';
                $output .= '}';
                $output .= "\n";
                $output .= '#osdb_bootstraped.wos-backendContainer {';
                $output .= ' left: 0px !important;';
                $output .= '}';
                $output .= "\n";
            }
            if (!$settings->usersCanEditShortcut && !current_user_can('manage_options')) {
                $output .= '#osdb_bootstraped .wos-shortcut .wos_editShortcutIcon{';
                $output .= ' display: none !important;';
                $output .= '}';
                $output .= "\n";
                $output .= '#osdb_bootstraped #wos-shortcut-trash{';
                $output .= ' display: none !important;';
                $output .= '}';
                $output .= "\n";
            }
        }

        if ($settings->useAdminSkin) {
            
            $fontname = str_replace(' ', '+',$settings->skin_googleFont);
            $output .= '@import url(https://fonts.googleapis.com/css?family='.$fontname.':400,700);';

            $output .= 'body {';
            $output .= ' font-family:"' . $settings->skin_googleFont . '", sans-serif; ';
            $output .= '}';
            
            
            $output .= '#body.wos_skin #wpcontent {';
            $output .= ' background-color: ' . $settings->colorBg . ';';
            $output .= '}';
            $output .= "\n";
                        
            $output .= 'body.wos_skin #wpadminbar{';
            $output .= ' background-color: ' . $settings->skin_topBarColorBg . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #wpadminbar .quicklinks>ul>li>a {';
            $output .= ' background-color: ' . $settings->skin_topBarLinksColorBg . ';';
            $output .= ' color: ' . $settings->skin_topBarLinksColor . ';';
            $output .= '}';
            $output .= 'body.wos_skin #wpadminbar #adminbarsearch:before,body.wos_skin  #wpadminbar a .ab-icon:before, #wpadminbar  a .ab-item:before {';
            $output .= ' color: ' . $settings->skin_topBarLinksColor . ';';
            $output .= '}';
            $output .= 'body.wos_skin #wpadminbar .quicklinks>ul>li>a:hover,body.wos_skin #wpadminbar .quicklinks>ul>li.hover>a,body.wos_skin #wpadminbar .menupop .ab-sub-wrapper,'
                    . 'body.wos_skin #wpadminbar .quicklinks .menupop ul.ab-sub-secondary, body.wos_skin  #wpadminbar .quicklinks .menupop ul.ab-sub-secondary .ab-submenu {';
            $output .= ' background-color: ' . $settings->skin_topBarLinksColorBgHover . ' !important;';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #wpadminbar .quicklinks>ul>li>a:hover,body.wos_skin #wpadminbar .quicklinks>ul>li.hover>a,body.wos_skin #wpadminbar .quicklinks>ul>li.hover>a > .ab-label,body.wos_skin #wpadminbar>#wp-toolbar a:hover span.ab-label,'
                    . 'body.wos_skin  #wpadminbar  .ab-icon:hover:before,body.wos_skin  #wpadminbar li.hover >.ab-icon:before,'
                    . 'body.wos_skin  #wpadminbar  li:hover .ab-item:before,body.wos_skin  #wpadminbar  li.hover > .ab-item:before{';
            $output .= ' color: ' . $settings->skin_topBarLinksColorHover . '!important;';            
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #wpadminbar.ab-submenu .ab-item {';
            $output .= ' color: ' . $settings->skin_topBarLinksColorSubmenu . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #wpadminbar .quicklinks>ul>li.hover>a {';
            $output .= ' color: ' . $settings->skin_topBarLinksColorSubmenu . ' !important;';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #wpadminbar .quicklinks .menupop ul li .ab-item:hover{';
            $output .= ' color: ' . $settings->skin_topBarLinksColorSubmenuHover . ' !important;';
            $output .= '}';
            $output .= "\n";
            
            
            $output .= 'body.wos_skin #adminmenuwrap, body.wos_skin #adminmenuback, body.wos_skin #adminmenu {';
            $output .= ' background-color: ' . $settings->skin_sideBarColorBg . ';';
            $output .= '}';
            
            $output .= 'body.wos_skin #adminmenu .menu-top > a, body.wos_skin #collapse-button {';
            $output .= ' background-color: ' . $settings->skin_sideBarLinksColorBg . ';';
            $output .= ' color: ' . $settings->skin_sideBarLinksColor . ';';
            $output .= ' border-top: 1px solid ' . $settings->colorBg . ';';
            
            $output .= '}';
            $output .= 'body.wos_skin #adminmenu .menu-top > a:hover , body.wos_skin #collapse-button:hover{';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorHover . ';';
            $output .= '}';
            
            $output .= 'body.wos_skin .wp-responsive-open #wpadminbar #wp-admin-bar-menu-toggle .ab-icon:before {';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorHover . ';';
            $output .= '}';
            
            $output .= 'body.wos_skin #adminmenu .wp-has-current-submenu .wp-submenu, body.wos_skin #adminmenu .current-submenu a.current{';
            $output .= ' background-color: ' . $settings->skin_sideBarLinksColorBgHover . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #adminmenu .wp-has-current-submenu .wp-submenu a:not(.wp-has-current-submenu){';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenu . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #adminmenu .wp-has-current-submenu .wp-submenu a:not(.wp-has-current-submenu):hover{';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenuHover . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #adminmenu .wp-has-current-submenu .wp-submenu a.current,body.wos_skin #adminmenu .wp-has-current-submenu .wp-submenu a.current:hover{';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenuActive . ' !important;';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin ul#adminmenu .wp-submenu .wp-has-current-submenu ,body.wos_skin ul#adminmenu .wp-submenu .wp-has-current-submenu:hover , body.wos_skin #adminmenu li > a.current {';
            $output .= ' background-color: ' . $settings->skin_sideBarHeaderColorSubmenuActiveBg . ';';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenuActive . ';';            
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #adminmenu .wp-submenu,body.wos_skin .folded #adminmenu .wp-has-current-submenu .wp-submenu,body.wos_skin .folded #adminmenu a.wp-has-current-submenu:focus+.wp-submenu{';
            $output .= ' background-color: ' . $settings->skin_sideBarLinksColorBgHover . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'body.wos_skin #adminmenu .wp-not-current-submenu li>a,body.wos_skin  .folded #adminmenu .wp-has-current-submenu li>a {';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenu . ';';
            $output .= '}';
            $output .= 'body.wos_skin #adminmenu .wp-not-current-submenu li>a:hover,body.wos_skin  .folded #adminmenu .wp-has-current-submenu li>a:hover {';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorSubmenuHover . ';';
            $output .= '}';
            $output .= 'body.wos_skin ul#adminmenu a.wp-has-current-submenu:after,body.wos_skin ul#adminmenu>li.current>a:after {';
            $output .= ' border-right-color: ' . $settings->skin_sideBarLinksColorBgHover . ' !important;';
            $output .= '}';
            $output .= 'body.wos_skin ul#adminmenu .wp-has-submenu:after {';
            $output .= ' border-right-color: ' . $settings->skin_sideBarLinksColorBgHover . ' !important;';
            $output .= '}';
            $output .= 'body.wos_skin #adminmenu a:hover div.wp-menu-image:before,body.wos_skin #adminmenu a:active div.wp-menu-image:before, body.wos_skin #adminmenu .opensub a div.wp-menu-image:before,body.wos_skin #adminmenu .wp-has-submenu:hover a  div.wp-menu-image:before,'
                    . 'body.wos_skin #adminmenu li a:focus div.wp-menu-image:before,body.wos_skin  #adminmenu li.opensub div.wp-menu-image:before{';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorHover . ';';
            $output .= '}';
            $output .= 'body.wos_skin #adminmenu .wp-has-current-submenu > a:not(.current) > .wp-menu-name,body.wos_skin #adminmenu .wp-has-current-submenu > a:not(.current) > .wp-menu-image:before, #adminmenu li:hover div.wp-menu-image:before {';
            $output .= ' color: ' . $settings->skin_sideBarLinksColorHover . ';';
            $output .= '}';
            $output .= 'body.wos_skin #adminmenu li a.wp-has-current-submenu .update-plugins,body.wos_skin #adminmenu li.current a .awaiting-mod,body.wos_skin #adminmenu .awaiting-mod,body.wos_skin  #adminmenu .update-plugins {';
            $output .= ' background-color: ' . $settings->skin_sideBarHeaderColorSubmenuActiveBg . ';';
            $output .= ' color: ' . $settings->skin_sideBarHeaderColorSubmenuActive . ';';
            $output .= '}';
            
            $output .= 'body.wos_skin {';
            $output .= ' background-color: ' . $settings->skin_pageBg . ';';
            $output .= '}';
            $output .= 'body.wos_skin .wrap .add-new-h2,body.wos_skin  .wrap .add-new-h2:active,body.wos_skin .wrap .page-title-action,body.wos_skin  .wrap .page-title-action:active, body.wos_skin .wrap .add-new-h2,body.wos_skin .wrap .wrap .page-title-action,body.wos_skin .wrap .add-new-h2:hover,body.wos_skin .wrap .wrap .page-title-action:hover, body.wos_skin a.button-primary,body.wos_skin a.button-primary:hover,body.wos_skin a.button-primary:active,body.wos_skin a.button-primary:visited,body.wos_skin a.button-primary:focus,'
                    . 'body.wos_skin.wp-core-ui .button-primary,body.wos_skin.wp-core-ui .button-primary:hover,body.wos_skin.wp-core-ui .button-primary:hover, body.wos_skin.wp-core-ui .button.button-primary.button-hero {';
            $output .= ' border-color: ' . $settings->skin_colorBtnPrimaryBg . ' !important;';
            $output .= ' background-color: ' . $settings->skin_colorBtnPrimaryBg . ' !important;';
            $output .= ' color: ' . $settings->skin_colorBtnPrimary . '!important;';
            $output .= '}';
            
            
            
            $output .= 'body.wos_skin #screen-meta-links .show-settings:after,body.wos_skin #post-body #visibility:before,body.wos_skin  #post-body .misc-pub-post-status:before,body.wos_skin  #post-body .misc-pub-revisions:before,body.wos_skin  .curtime #timestamp:before,body.wos_skin  span.wp-media-buttons-icon:before{';
            $output .= ' color: ' . $settings->skin_colorBtnPrimary . '!important;';
            $output .= '}';
            
            
            $output .= 'body.wos_skin a.button-secondary,body.wos_skin a.button-secondary:hover,body.wos_skin a.button-secondary:active,body.wos_skin a.button-secondary:visited,body.wos_skin a.button-secondary:focus {';
            $output .= ' border-color: ' . $settings->skin_colorBtnSecondaryBg . ' !important;';
            $output .= ' background-color: ' . $settings->skin_colorBtnSecondaryBg . ' !important;';
            $output .= ' color: ' . $settings->skin_colorBtnSecondary . ' !important;';
            $output .= '}';
            $output .= 'body.wos_skin input[type="submit"],body.wos_skin input[type="submit"]:hover,body.wos_skin input[type="submit"]:active,body.wos_skin input[type="submit"]:focus,body.wos_skin a.button,body.wos_skin a.button:hover,body.wos_skin a.button:active,body.wos_skin a.button:visited,body.wos_skin a.button:focus,'
                    . 'body.wos_skin button.button,body.wos_skin button.button:hover,body.wos_skin button.button:active,body.wos_skin button.button:visited,body.wos_skin button.button:focus    {';
            $output .= ' border-color: ' . $settings->skin_colorBtnDefaultBg . ' !important;';
            $output .= ' background-color: ' . $settings->skin_colorBtnDefaultBg . ' !important;';
            $output .= ' color: ' . $settings->skin_colorBtnDefault . ' !important;';
            $output .= '}';
            $output .= 'body.wos_skin a,body.wos_skin a:hover,body.wos_skin a:active,body.wos_skin a:visited,body.wos_skin .sorting-indicator:before {';
            $output .= ' color: ' . $settings->skin_linksColor . ';';
            $output .= '}';
            $output .= 'body.wos_skin thead,body.wos_skin thead tr th,body.wos_skin tfoot,body.wos_skin tfoot tr th,body.wos_skin th .comment-grey-bubble:before,body.wos_skin th .sorting-indicator:before   {';
            $output .= ' background-color: ' . $settings->skin_headersColorBg . ';';
            $output .= ' color: ' . $settings->skin_headersColor . ';';
            $output .= '}';
            $output .= 'body.wos_skin input[type=text]:focus,body.wos_skin  input[type=search]:focus,body.wos_skin  input[type=radio]:focus,body.wos_skin  input[type=tel]:focus,body.wos_skin  input[type=time]:focus,body.wos_skin  input[type=url]:focus,body.wos_skin  input[type=week]:focus,body.wos_skin  input[type=password]:focus,body.wos_skin  input[type=checkbox]:focus,body.wos_skin  input[type=color]:focus,body.wos_skin  input[type=date]:focus,body.wos_skin  input[type=datetime]:focus,body.wos_skin  input[type=datetime-local]:focus,body.wos_skin  input[type=email]:focus,body.wos_skin  input[type=month]:focus,body.wos_skin  input[type=number]:focus,body.wos_skin  select:focus,body.wos_skin  textarea {';
            $output .= ' border-color: ' . $settings->skin_colorBtnPrimaryBg . ';';
            $output .= '}';
            $output .= 'body.wos_skin input[type=checkbox]:checked:before {';
            $output .= ' color: ' . $settings->skin_colorBtnPrimaryBg . ';';
            $output .= '}';
            
            
        }

            $output .= "\n";
        if ($output != '') {
            $output = "\n<style id=\"wos_styles\" >\n" . $output . "</style>\n";
            echo $output;
        }
    }

    /*
     * Load admin styles
     */

    function admin_styles() {
        $url = '';
        if (isset($_SERVER['HTTP_REFERER'])) {
            $url = $_SERVER['HTTP_REFERER'];
        }
        $settings = $this->getSettings();
        if ($settings->enableWOS && $this->checkRolesRight() && !is_network_admin()) {
            if (isset($_GET['wos-reload']) || $settings->firstStart) {
                wp_register_style($this->parent->_token . '-jqueryui', esc_url($this->parent->assets_url) . 'css/jquery-ui-theme/jquery-ui.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-jqueryui');
                wp_register_style($this->parent->_token . '-bootstrap', esc_url($this->parent->assets_url) . 'css/bootstrap.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-bootstrap');
                wp_register_style($this->parent->_token . '-fontawesome', esc_url($this->parent->assets_url) . 'css/font-awesome.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-fontawesome');
                wp_register_style($this->parent->_token . '-flat-ui', esc_url($this->parent->assets_url) . 'css/flat-ui-pro.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-flat-ui');
                wp_register_style($this->parent->_token . '-osBackend', esc_url($this->parent->assets_url) . 'css/osBackend.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-osBackend');
            } else if (!isset($_GET['wos-reload'])) {
                wp_register_style($this->parent->_token . '-osBackendView', esc_url($this->parent->assets_url) . 'css/osBackendView.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-osBackendView');
                if (isset($_GET['page']) && strpos($_GET['page'], 'wos_menu') !== false ||
                        isset($_GET['page']) && strpos($_GET['page'], 'wos_design') !== false) {
                    wp_register_style($this->parent->_token . '-jqueryui', esc_url($this->parent->assets_url) . 'css/jquery-ui-theme/jquery-ui.min.css', array(), $this->parent->_version);
                    wp_enqueue_style($this->parent->_token . '-jqueryui');
                    wp_register_style($this->parent->_token . '-colpick', esc_url($this->parent->assets_url) . 'css/colpick.min.css', array(), $this->parent->_version);
                    wp_enqueue_style($this->parent->_token . '-colpick');
                    wp_register_style($this->parent->_token . '-bootstrap', esc_url($this->parent->assets_url) . 'css/bootstrap.min.css', array(), $this->parent->_version);
                    wp_enqueue_style($this->parent->_token . '-bootstrap');
                    wp_register_style($this->parent->_token . '-flat-ui', esc_url($this->parent->assets_url) . 'css/flat-ui-pro.min.css', array(), $this->parent->_version);
                    wp_enqueue_style($this->parent->_token . '-flat-ui');
                    wp_register_style($this->parent->_token . '-osBackendSettings', esc_url($this->parent->assets_url) . 'css/osBackendSettings.min.css', array(), $this->parent->_version);
                    wp_enqueue_style($this->parent->_token . '-osBackendSettings');
                }
            }
        } else if (!is_network_admin()) {
            if (isset($_GET['page']) && (strpos($_GET['page'], 'wos_menu') !== false || strpos($_GET['page'], 'wos_design') !== false)) {
                wp_register_style($this->parent->_token . '-jqueryui', esc_url($this->parent->assets_url) . 'css/jquery-ui-theme/jquery-ui.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-jqueryui');
                wp_register_style($this->parent->_token . '-colpick', esc_url($this->parent->assets_url) . 'css/colpick.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-colpick');
                wp_register_style($this->parent->_token . '-bootstrap', esc_url($this->parent->assets_url) . 'css/bootstrap.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-bootstrap');
                wp_register_style($this->parent->_token . '-flat-ui', esc_url($this->parent->assets_url) . 'css/flat-ui-pro.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-flat-ui');
                wp_register_style($this->parent->_token . '-osBackendSettings', esc_url($this->parent->assets_url) . 'css/osBackendSettings.min.css', array(), $this->parent->_version);
                wp_enqueue_style($this->parent->_token . '-osBackendSettings');
            }
        }
    }

    /*
     * Load admin scripts
     */

    function admin_scripts() {
        global $wpdb;
        $url = '';
        if (isset($_SERVER['HTTP_REFERER'])) {
            $url = $_SERVER['HTTP_REFERER'];
        }
        $settings = $this->getSettings();
        if ($settings->enableWOS && $this->checkRolesRight() && !is_network_admin()) {
            if (isset($_GET['wos-reload']) || $settings->firstStart) {
                wp_register_script($this->parent->_token . '-flatui', esc_url($this->parent->assets_url) . 'js/flat-ui-pro.min.js', array('jquery',
                    'jquery-ui-core',
                    'jquery-ui-mouse',
                    'jquery-ui-position',
                    'jquery-ui-droppable',
                    'jquery-ui-draggable',
                    'jquery-ui-resizable',
                    'jquery-effects-core',
                    'jquery-effects-drop',
                    'jquery-effects-fade',
                    'jquery-effects-bounce',
                    'jquery-ui-widget'), $this->parent->_version);
                wp_enqueue_script($this->parent->_token . '-flatui');
                wp_register_script($this->parent->_token . '-mousetrap', esc_url($this->parent->assets_url) . 'js/mousetrap.min.js', array('jquery'));
                wp_enqueue_script($this->parent->_token . '-mousetrap');
                wp_register_script($this->parent->_token . '-osBackend', esc_url($this->parent->assets_url) . 'js/osBackend.min.js', $this->parent->_token . '-flatui', $this->parent->_version);
                wp_enqueue_script($this->parent->_token . '-osBackend');


                $userID = get_current_user_id();
                $canEditShortcuts = $settings->usersCanEditShortcut;
                if (current_user_can('manage_options')) {
                    $canEditShortcuts = true;
                }
                $canEditStyles = $settings->usersCanChangeStyles;
                $canEditSettings = false;
                if (current_user_can('manage_options')) {
                    $canEditStyles = true;
                    $canEditSettings = true;
                }

                $table_name = $wpdb->prefix . "wos_shortcuts";
                $links = $wpdb->get_results("SELECT * FROM $table_name WHERE userID=$userID");
                $js_data[] = array(
                    'adminUrl' => admin_url(),
                    'links' => $links,
                    'canEditShortcuts' => $canEditShortcuts,
                    'canEditStyles' => $canEditStyles,
                    'canEditSettings' => $canEditSettings,
                    'texts' => array(
                        'Save' => __('Save', 'wos'),
                        'Title' => __('Title', 'wos'),
                        'EditShortcut' => __('Edit a shortcut', 'wos'),
                        'Icon' => __('Icon', 'wos'),
                        'SelectIcon' => __('Select an icon', 'wos'),
                        'PageBookmarked' => __('Page bookmarked', 'wos'),
                        'Desktop appearance' => __('Desktop appearance', 'wos'),
                        'Delete all shortcuts' => __('Delete all shortcuts', 'wos'),
                        'Edit the settings' => __('Edit the settings', 'wos'),
                    ),
                    'key_nextWin_1' => $settings->key_nextWin_1,
                    'key_nextWin_2' => $settings->key_nextWin_2,
                    'key_prevWin_1' => $settings->key_prevWin_1,
                    'key_prevWin_2' => $settings->key_prevWin_2,
                    'key_prevWin_3' => $settings->key_prevWin_3,
                    'useVideoBackground' => $settings->useVideoBackground,
                    'backgroundVideo' => $settings->backgroundVideo,
                );
                wp_localize_script($this->parent->_token . '-osBackend', 'wos_data', $js_data);
                $table_name = $wpdb->prefix . "wos_settings";
                $wpdb->update($table_name, array('firstStart' => 0), array('id' => 1));
            } else if (!isset($_GET['wos-reload']) && !is_network_admin()) {
                wp_register_script($this->parent->_token . '-mousetrap', esc_url($this->parent->assets_url) . 'js/mousetrap.min.js', array('jquery'));
                wp_enqueue_script($this->parent->_token . '-mousetrap');
                wp_register_script($this->parent->_token . '-osBackendView', esc_url($this->parent->assets_url) . 'js/osBackendView.min.js', array(), $this->parent->_version);
                wp_enqueue_script($this->parent->_token . '-osBackendView');

                $loadPageBackend = 0;
                if (isset($_SESSION['wos_loadPageBackend']) && $_SESSION['wos_loadPageBackend'] == 1) {
                    $_SESSION['wos_loadPageBackend'] = '';
                    $loadPageBackend = 1;
                }
                wp_localize_script($this->parent->_token . '-osBackendView', 'wos_data', array('loadPageBackend' => $loadPageBackend,
                    'key_nextWin_1' => $settings->key_nextWin_1,
                    'key_nextWin_2' => $settings->key_nextWin_2,
                    'key_prevWin_1' => $settings->key_prevWin_1,
                    'key_prevWin_2' => $settings->key_prevWin_2,
                    'key_prevWin_3' => $settings->key_prevWin_3));

                if (isset($_GET['page']) && strpos($_GET['page'], 'wos_menu') !== false ||
                        isset($_GET['page']) && strpos($_GET['page'], 'wos_design') !== false) {
                    wp_register_script($this->parent->_token . '-colpick', esc_url($this->parent->assets_url) . 'js/colpick.min.js', array('jquery'), $this->parent->_version);
                    wp_enqueue_script($this->parent->_token . '-colpick');
                    wp_register_script($this->parent->_token . '-flatui', esc_url($this->parent->assets_url) . 'js/flat-ui-pro.min.js', array('jquery',), $this->parent->_version);
                    wp_enqueue_script($this->parent->_token . '-flatui');
                    wp_register_script($this->parent->_token . '-osBackendSettings', esc_url($this->parent->assets_url) . 'js/osBackendSettings.min.js', array(), $this->parent->_version);

                    $js_data[] = array(
                        'assetsUrl' => esc_url($this->parent->assets_url),
                        'texts' => array(
                            'Yes' => __('Yes', 'wos'),
                            'No' => __('No', 'wos')
                        ),
                        'loadPageBackend' => $loadPageBackend
                    );

                    wp_localize_script($this->parent->_token . '-osBackendSettings', 'wos_data', $js_data);
                    wp_enqueue_script($this->parent->_token . '-osBackendSettings');
                }
            }
        } else if (!is_network_admin()) {
            if (isset($_GET['page']) && (strpos($_GET['page'], 'wos_menu') !== false|| strpos($_GET['page'], 'wos_design') !== false)) {
                wp_register_script($this->parent->_token . '-colpick', esc_url($this->parent->assets_url) . 'js/colpick.min.js', array('jquery'), $this->parent->_version);
                wp_enqueue_script($this->parent->_token . '-colpick');
                wp_register_script($this->parent->_token . '-flatui', esc_url($this->parent->assets_url) . 'js/flat-ui-pro.min.js', array('jquery'), $this->parent->_version);
                wp_enqueue_script($this->parent->_token . '-flatui');
                wp_register_script($this->parent->_token . '-osBackendSettings', esc_url($this->parent->assets_url) . 'js/osBackendSettings.min.js', array(), $this->parent->_version);

                $js_data[] = array(
                    'assetsUrl' => esc_url($this->parent->assets_url),
                    'texts' => array(
                        'Yes' => __('Yes', 'wos'),
                        'No' => __('No', 'wos')
                    )
                );
                wp_localize_script($this->parent->_token . '-osBackendSettings', 'wos_data', $js_data);
                wp_enqueue_script($this->parent->_token . '-osBackendSettings');
            }
        }
    }

    private function checkRolesRight() {
        $settings = $this->getSettings();
        $chkOK = false;
        if ($settings->rolesAllowed == "") {
            $chkOK = true;
        } else {
            $rolesAllowed = explode(',', $settings->rolesAllowed);
            if (is_user_logged_in()) {
                $user = new WP_User(get_current_user_id());
                if (!empty($user->roles) && is_array($user->roles)) {
                    foreach ($user->roles as $role) {
                        if (in_array($role, $rolesAllowed)) {
                            $chkOK = true;
                        }
                    }
                }
            }
        }
        return $chkOK;
    }

    public function saveShortcut() {
        global $wpdb;

        if (is_user_logged_in()) {
            $url = sanitize_text_field($_POST['url']);
            $posX = sanitize_text_field($_POST['posX']);
            $posY = sanitize_text_field($_POST['posY']);
            $userID = get_current_user_id();
            $html = ($_POST['html']);
            echo $html;

            $table_name = $wpdb->prefix . "wos_shortcuts";
            $existingLinks = $wpdb->get_results("SELECT * FROM $table_name WHERE url='$url' AND userID=$userID LIMIT 1");
            if (count($existingLinks) > 0) {
                $existingLink = $existingLinks[0];
                if (isset($_POST['html']) && $_POST['html'] != "") {
                    $wpdb->update($table_name, array('posX' => $posX, 'posY' => $posY, 'html' => $html), array('id' => $existingLink->id));
                } else {
                    $wpdb->update($table_name, array('posX' => $posX, 'posY' => $posY), array('id' => $existingLink->id));
                }
            } else {
                $wpdb->insert($table_name, array('userID' => $userID, 'url' => $url, 'html' => $html, 'posX' => $posX, 'posY' => $posY));
            }
        }
        die();
    }

    public function deleteShortcut() {
        global $wpdb;
        if (is_user_logged_in()) {
            $url = sanitize_text_field($_POST['url']);
            $userID = get_current_user_id();

            $table_name = $wpdb->prefix . "wos_shortcuts";
            $wpdb->delete($table_name, array('url' => $url, 'userID' => $userID));
        }
        die();
    }

    public function deleteAllShortcuts() {
        global $wpdb;
        if (is_user_logged_in()) {
            $userID = get_current_user_id();
            $table_name = $wpdb->prefix . "wos_shortcuts";
            $wpdb->delete($table_name, array('userID' => $userID));
        }
        die();
    }

    public function saveDesign() {
        global $wpdb;
        $settings = $this->getSettings();
        $currentCode = $settings->purchaseCode;
        if (current_user_can('manage_options')) {
            $table_name = $wpdb->prefix . "wos_settings";
            $sqlDatas = array();
            foreach ($_POST as $key => $value) {
                if ($key != 'action' && $key != 'id' && $key != 'pll_ajax_backend' && $key != "undefined" && $key != "files") {
                    $sqlDatas[$key] = (stripslashes($value));
                }
            }
            $wpdb->update($table_name, $sqlDatas, array('id' => 1));
        }
        $user_id = get_current_user_id();
        update_user_option($user_id, 'colorWinHeader', $_POST['colorWinHeader']);
        update_user_option($user_id, 'colorWinHeaderBg', $_POST['colorWinHeaderBg']);
        update_user_option($user_id, 'colorWinIconsBg', $_POST['colorWinIconsBg']);
        update_user_option($user_id, 'colorWinIcons', $_POST['colorWinIcons']);
        update_user_option($user_id, 'colorWinIconsSelected', $_POST['colorWinIconsSelected']);
        update_user_option($user_id, 'colorWPMenuLinks', $_POST['colorWPMenuLinks']);
        update_user_option($user_id, 'colorWPMenuBadges', $_POST['colorWPMenuBadges']);
        update_user_option($user_id, 'colorShortcuts', $_POST['colorShortcuts']);
        update_user_option($user_id, 'colorContextmenuBg', $_POST['colorContextmenuBg']);
        update_user_option($user_id, 'colorContextmenuLinks', $_POST['colorContextmenuLinks']);
        update_user_option($user_id, 'colorContextmenuLinksHover', $_POST['colorContextmenuLinksHover']);
        update_user_option($user_id, 'colorBg', $_POST['colorBg']);
        update_user_option($user_id, 'fxWinGray', $_POST['fxWinGray']);
        if ($_POST['fxWinGray'] == '0') {
            update_user_option($user_id, 'fxWinGray', 'false');
        }
        update_user_option($user_id, 'fxWinBlur', $_POST['fxWinBlur']);
        if ($_POST['fxWinBlur'] == '0') {
            update_user_option($user_id, 'fxWinBlur', 'false');
        }
        update_user_option($user_id, 'fxWinDark', $_POST['fxWinDark']);
        if ($_POST['fxWinDark'] == '0') {
            update_user_option($user_id, 'fxWinDark', 'false');
        }
        update_user_option($user_id, 'backgroundImage', $_POST['backgroundImage']);

        update_user_option($user_id, 'useVideoBackground', $_POST['useVideoBackground']);
        if ($_POST['useVideoBackground'] == '0') {
            update_user_option($user_id, 'useVideoBackground', 'false');
        }

        update_user_option($user_id, 'backgroundVideo', $_POST['backgroundVideo']);
        if ($_POST['backgroundVideo'] == '0') {
            update_user_option($user_id, 'backgroundVideo', 'false');
        }
        update_user_option($user_id, 'colorBottomBar', $_POST['colorBottomBar']);
        if ($_POST['colorBottomBar'] == '0') {
            update_user_option($user_id, 'colorBottomBar', 'false');
        }
        update_user_option($user_id, 'colorBottomAlpha', $_POST['colorBottomAlpha']);
        if ($_POST['colorBottomAlpha'] == '0') {
            update_user_option($user_id, 'colorBottomAlpha', 'false');
        }

        
        update_user_option($user_id, 'skin_topBarColorBg', $_POST['skin_topBarColorBg']);
        update_user_option($user_id, 'skin_topBarLinksColorBg', $_POST['skin_topBarLinksColorBg']);
        update_user_option($user_id, 'skin_topBarLinksColorBgHover', $_POST['skin_topBarLinksColorBgHover']);
        update_user_option($user_id, 'skin_topBarLinksColor', $_POST['skin_topBarLinksColor']);
        update_user_option($user_id, 'skin_topBarLinksColorSubmenu', $_POST['skin_topBarLinksColorSubmenu']);
        update_user_option($user_id, 'skin_topBarLinksColorSubmenuHover', $_POST['skin_topBarLinksColorSubmenuHover']);
        update_user_option($user_id, 'skin_sideBarColorBg', $_POST['skin_sideBarColorBg']);
        update_user_option($user_id, 'skin_sideBarLinksColorBg', $_POST['skin_sideBarLinksColorBg']);
        update_user_option($user_id, 'skin_sideBarLinksColorBgHover', $_POST['skin_sideBarLinksColorBgHover']);
        update_user_option($user_id, 'skin_sideBarLinksColorSubmenu', $_POST['skin_sideBarLinksColorSubmenu']);
        update_user_option($user_id, 'skin_sideBarLinksColorSubmenuActive', $_POST['skin_sideBarLinksColorSubmenuActive']);
        update_user_option($user_id, 'skin_sideBarHeaderColorSubmenuActiveBg', $_POST['skin_sideBarHeaderColorSubmenuActiveBg']); 
        update_user_option($user_id, 'skin_sideBarHeaderColorSubmenuActive', $_POST['skin_sideBarHeaderColorSubmenuActive']);        
        update_user_option($user_id, 'skin_sideBarLinksColorSubmenuHover', $_POST['skin_sideBarLinksColorSubmenuHover']);
        update_user_option($user_id, 'skin_sideBarLinksColor', $_POST['skin_sideBarLinksColor']);
        update_user_option($user_id, 'skin_sideBarLinksColorHover', $_POST['skin_sideBarLinksColorHover']);
        
        
        
        update_user_option($user_id, 'skin_googleFont', $_POST['skin_googleFont']);
        update_user_option($user_id, 'skin_colorBtnPrimary', $_POST['skin_colorBtnPrimary']);
        update_user_option($user_id, 'skin_colorBtnPrimaryBg', $_POST['skin_colorBtnPrimaryBg']);
        update_user_option($user_id, 'skin_colorBtnSecondary', $_POST['skin_colorBtnSecondary']);
        update_user_option($user_id, 'skin_colorBtnSecondaryBg', $_POST['skin_colorBtnSecondaryBg']);
        update_user_option($user_id, 'skin_colorBtnDefault', $_POST['skin_colorBtnDefault']);
        update_user_option($user_id, 'skin_colorBtnDefaultBg', $_POST['skin_colorBtnDefaultBg']);
        update_user_option($user_id, 'skin_pageBg', $_POST['skin_pageBg']);
        update_user_option($user_id, 'skin_linksColor', $_POST['skin_linksColor']);
        update_user_option($user_id, 'skin_headersColor', $_POST['skin_headersColor']);
        update_user_option($user_id, 'skin_headersColorBg', $_POST['skin_headersColorBg']);     
        
            
        
        die();
    }

    public function saveSettings() {
        global $wpdb;
        $settings = $this->getSettings();
        $currentCode = $settings->purchaseCode;
        if (current_user_can('manage_options')) {
            $table_name = $wpdb->prefix . "wos_settings";
            $sqlDatas = array();
            foreach ($_POST as $key => $value) {
                if ($key != 'action' && $key != 'id' && $key != 'pll_ajax_backend' && $key != "undefined" && $key != "files") {
                    $sqlDatas[$key] = (stripslashes($value));
                }
            }
            $wpdb->update($table_name, $sqlDatas, array('id' => 1));
        }
        if (isset($_POST['purchaseCode']) && $currentCode != $_POST['purchaseCode'] && $_POST['purchaseCode'] != "") {
            try {
                $url = 'http://www.loopus-plugins.com/updates/update.php?checkCode=15804874&code=' . sanitize_text_field($_POST['purchaseCode']);
                $ch = curl_init($url);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                $rep = curl_exec($ch);
                if ($rep != '0410') {
                    $table_name = $wpdb->prefix . "wos_settings";
                    $wpdb->update($table_name, array('purchaseCode' => sanitize_text_field($_POST['purchaseCode'])), array('id' => 1));
                } else {

                    $table_name = $wpdb->prefix . "wos_settings";
                    $wpdb->update($table_name, array('purchaseCode' => ""), array('id' => 1));
                    echo '1';
                }
            } catch (Exception $e) {
                $table_name = $wpdb->prefix . "wos_settings";
                $wpdb->update($table_name, array('purchaseCode' => sanitize_text_field($_POST['purchaseCode'])), array('id' => 1));
            }
        }
        die();
    }

    public function web_browser() {
        echo '<div id="osdb_bootstraped" class="wos_browserPanel">';
        echo '<table id="wos_browserTopPanel">';
        echo '<tr>';
        echo '<td><input type="text" id="wos_browserUrlField" class="form-control" placeholder="http://..." value="' . esc_url(home_url('/')) . '" /></td>';
        echo '<td style="width: 68px;">'
        . '<a href="javascript:" id="wos_browserRefreshBtn" onclick="wos_refreshBrowser();" ><img src="' . $this->parent->assets_url . 'img/refresh-64.png" alt="' . __('Refresh', 'wos') . '" /></a>'
        . '<a href="javascript:" id="wos_browserBookmarkBtn" onclick="wos_bookmarkUrl();" ><img src="' . $this->parent->assets_url . 'img/bookmark-64.png" alt="' . __('Bookmark', 'wos') . '" /></a>'
        . '</td>';
        echo '</tr>';
        echo '</table>'; // eof #wos_browserTopPanel
        echo '<iframe id="wos_browserFrame" src="' . esc_url(home_url('/')) . '" ></iframe>';
        echo '<div id="wos_browserFooter" class="alert alert-info"><p>' . __('Please keep in mind that some websites may not be loaded through an iframe. This depends on the X-Frame-Options rule in the .htaccess file of the website', 'hfb') . '.</p></div>';
        echo '</div>'; // eof #osdb_bootstraped
    }

    public function view_design_wos() {
        wp_enqueue_style('thickbox');
        wp_enqueue_script('thickbox');
        $settings = $this->getSettings();
        echo '<div id="osdb_bootstraped">';
        echo '<div id="wos_settings">';
        $margTop = '';
        if ((current_user_can('manage_options')||($settings->enableWOS)) && $settings->useAdminSkin) {
            echo '<div class="wos_topBar">';
            echo '<a href="javascript:" data-tab="desktop" class="wos-active">' . __('Desktop', 'wos') . '</a>';
            echo '<a href="javascript:" data-tab="adminskin">' . __('Admin skin', 'wos') . '</a>';
            echo '</div>'; // eof .wos_topBar
        } else {
            $margTop = 'margin-top: 18px;';
        }

        if (current_user_can('manage_options')||($settings->enableWOS)) {
            echo '<div id="wos_designDesktopTab" style="' . $margTop . '">';
            echo '<div class="col-sm-4 col-xs-6">';
            echo '<div class="form-group">';
            echo '<label>' . __('Background color of windows', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorWinHeaderBg" />';
            echo '</div>'; // eof .form-group
            echo '<div class="form-group">';
            echo '<label>' . __('Text color of windows header', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorWinHeader" />';
            echo '</div>'; // eof .form-group
            echo '<div class="form-group">';
            echo '<label>' . __('Background color of windows icons', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorWinIconsBg" />';
            echo '</div>'; // eof .form-group
            echo '<div class="form-group">';
            echo '<label>' . __('Background color of activated windows icons', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorWinIconsSelected" />';
            echo '</div>'; // eof .form-group
            echo '<div class="form-group">';
            echo '<label>' . __('Default color of windows icons', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorWinIcons" />';
            echo '</div>'; // eof .form-group
            echo '<div class="form-group">';
            echo '<label>' . __('Color of shortcuts', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorShortcuts" />';
            echo '</div>'; // eof .form-group    

            echo '</div>';
            echo '<div class="col-sm-4 col-xs-6">';

            echo '<div class="form-group">';
            echo '<label>' . __('Background color of the context menu', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorContextmenuBg" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Color of the context menu links', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorContextmenuLinks" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Color of the context menu hovered links', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorContextmenuLinksHover" />';
            echo '</div>'; // eof .form-group    
            echo '<div class="form-group">';
            echo '<label>' . __('Color of the bottom bar', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorBottomBar" />';
            echo '</div>'; // eof .form-group    
            echo '<div class="form-group">';
            echo '<label>' . __('Opacity of the bottom bar', 'wos') . '</label>';
            echo '<div id="wos_colorBottomAlpha"></div>';
            echo '<input class="form-control" style="display: none;" name="colorBottomAlpha" type="number" step=".1" min="0" max="1" />';
            echo '</div>'; // eof .form-group   



            echo '</div>';
            echo '<div class="col-sm-4 col-xs-6">';

            echo '<div class="form-group">';
            echo '<label>' . __('Background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="colorBg" />';
            echo '</div>'; // eof .form-group  

            echo '<div class="form-group">';
            echo '<label>' . __('Background image', 'wos') . '</label>';
            echo '<input class="form-control" name="backgroundImage" style="margin-right: 6px;display: inline-block; width: 200px;" />';
            if (current_user_can('upload_files')) {
                echo '<a class="btn btn-default imageBtn wos_fieldBtn" style=" display: inline-block; margin-top: -2px; margin-bottom: 4px;"><span class="glyphicon glyphicon-picture"></span></a>';
            }
            echo '</div>'; // eof .form-group

            echo '<div class="form-group">'
            . '<label>' . __('Use a Youtube video as background', 'wos') . '</label>'
            . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>" name="useVideoBackground"/>'
            . '</div>'; // eof .form-group

            echo '<div class="form-group">';
            echo '<label>' . __('URL of the Youtube video', 'wos') . '</label>';
            echo '<input class="form-control" placeholder="https://www.youtube.com/watch?v=P9zHeCA7EdE" name="backgroundVideo" style="margin-right: 6px;display: inline-block;" />';
            echo '</div>'; // eof .form-group

            echo '<div class="form-group">'
            . '<label>' . __('Gray effect on windows in background', 'wos') . '</label>'
            . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>" name="fxWinGray"/>'
            . '</div>'; // eof .form-group
            echo '<div class="form-group">'
            . '<label>' . __('Blur effect on windows in background', 'wos') . '</label>'
            . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>" name="fxWinBlur"/>'
            . '</div>'; // eof .form-group
            echo '<div class="form-group">'
            . '<label>' . __('Dark effect on windows in background', 'wos') . '</label>'
            . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>"  name="fxWinDark"/>'
            . '</div>'; // eof .form-group
            echo '</div>';
            echo '</div>'; // eof #wos_designDesktopTab
        } 
        if ($settings->useAdminSkin) {
            
            $colClass="col-sm-4";            
            if (current_user_can('manage_options')) {
                $colClass="col-sm-3";     
            }

            echo '<div id="wos_designSkinTab"  style="' . $margTop . '">';
            echo '<div class="'.$colClass.' col-xs-6">';
                        
            echo '<h6>'.__('Menus','wos').'</h6>';
            echo '<div class="form-group">';
            echo '<label>' . __('Google font', 'wos') . '</label>';
            echo '<input class="form-control" name="skin_googleFont" style="margin-right: 6px;display: inline-block; width: 200px;" />';
            echo '<a href="https://support.google.com/analytics/answer/1032385?hl=en" target="_blank" style="inline-block; margin-top: -2px; margin-bottom: 4px;" class="btn btn-info btn-circle wos_fieldBtn"><span class="glyphicon glyphicon-info-sign"></span></a>';
            echo '</div>'; // eof .form-group    

            echo '<div class="form-group">';
            echo '<label>' . __('Top bar background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarColorBg" />';
            echo '</div>'; // eof .form-group    

            echo '<div class="form-group">';
            echo '<label>' . __('Top bar links background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarLinksColorBg" />';
            echo '</div>'; // eof .form-group  

            echo '<div class="form-group">';
            echo '<label>' . __('Top bar links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarLinksColor" />';
            echo '</div>'; // eof .form-group   

            echo '<div class="form-group">';
            echo '<label>' . __('Top bar submenus background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarLinksColorBgHover" />';
            echo '</div>'; // eof .form-group  

            echo '<div class="form-group">';
            echo '<label>' . __('Top bar submenus links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarLinksColorHover" />';
            echo '</div>'; // eof .form-group   

            echo '<div class="form-group">';
            echo '<label>' . __('Top submenus hovered links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_topBarLinksColorSubmenuHover" />';
            echo '</div>'; // eof .form-group   
            
             echo '<div class="form-group">';
            echo '<label>' . __('Sidebar background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarColorBg" />';
            echo '</div>'; // eof .form-group    

            
            echo '</div>'; // eof .col-sm-3   
            echo '<div class="'.$colClass.' col-xs-6" style="padding-top: 42px;">';

           
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar links background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorBg" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColor" />';
            echo '</div>'; // eof .form-group   
            
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar hovered links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorHover" />';
            echo '</div>'; // eof .form-group  

            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorBgHover" />';
            echo '</div>'; // eof .form-group  

            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorSubmenu" />';
            echo '</div>'; // eof .form-group    
            

            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus hovered links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorSubmenuHover" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus active header background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarHeaderColorSubmenuActiveBg" />';
            echo '</div>'; // eof .form-group   
            
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus active header color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarHeaderColorSubmenuActive" />';
            echo '</div>'; // eof .form-group   
                        
            echo '<div class="form-group">';
            echo '<label>' . __('Sidebar submenus active link color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_sideBarLinksColorSubmenuActive" />';
            echo '</div>'; // eof .form-group    
            
             echo '</div>'; // eof .col-sm-4   
            echo '<div class="'.$colClass.' col-xs-6">';            
                                   
            echo '<h6>'.__('Pages content','wos').'</h6>';
            
            
            echo '<div class="form-group">';
            echo '<label>' . __('Pages background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_pageBg" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Default buttons texts color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnDefault" />';
            echo '</div>'; // eof .form-group  

            
            echo '<div class="form-group">';
            echo '<label>' . __('Default buttons background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnDefaultBg" />';
            echo '</div>'; // eof .form-group  

            
            echo '<div class="form-group">';
            echo '<label>' . __('Primary buttons texts color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnPrimary" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Primary buttons background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnPrimaryBg" />';
            echo '</div>'; // eof .form-group  

            
            echo '<div class="form-group">';
            echo '<label>' . __('Secondary buttons texts color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnSecondary" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Secondary buttons background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_colorBtnSecondaryBg" />';
            echo '</div>'; // eof .form-group  
            
            

            
            echo '<div class="form-group">';
            echo '<label>' . __('Links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_linksColor" />';
            echo '</div>'; // eof .form-group  
            
            echo '<div class="form-group">';
            echo '<label>' . __('Headers texts color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_headersColor" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Headers background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="skin_headersColorBg" />';
            echo '</div>'; // eof .form-group  

            
             echo '</div>'; // eof .col-sm-4   
             
        if (current_user_can('manage_options')) {
            echo '<div class="col-sm-3 col-xs-6">';    
            echo '<h6>'.__('Login page','wos').'</h6>';
            
            
            
            echo '<div class="form-group">';
            echo '<label>' . __('Background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_colorBg" />';
            echo '</div>'; // eof .form-group  
            
             echo '<div class="form-group">';
            echo '<label>' . __('Background image', 'wos') . '</label>';
            echo '<input class="form-control" name="login_backgroundImage" style="margin-right: 6px;display: inline-block; width: 200px;" />';
            if (current_user_can('upload_files')) {
                echo '<a class="btn btn-default imageBtn wos_fieldBtn" style=" display: inline-block; margin-top: -2px; margin-bottom: 4px;"><span class="glyphicon glyphicon-picture"></span></a>';
            }
            echo '</div>'; // eof .form-group
            
            
            echo '<div class="form-group">'
            . '<label>' . __('Use a Youtube video as background', 'wos') . '</label>'
            . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>" name="login_useVideoBackground"/>'
            . '</div>'; // eof .form-group
            

            echo '<div class="form-group">';
            echo '<label>' . __('URL of the Youtube video', 'wos') . '</label>';
            echo '<input class="form-control" placeholder="https://www.youtube.com/watch?v=P9zHeCA7EdE" name="login_backgroundVideo" style="margin-right: 6px;display: inline-block;" />';
            echo '</div>'; // eof .form-group
            
             echo '<div class="form-group">';
            echo '<label>' . __('Logo image', 'wos') . '</label>';
            echo '<input class="form-control" name="login_logo" style="margin-right: 6px;display: inline-block; width: 200px;" />';
            if (current_user_can('upload_files')) {
                echo '<a class="btn btn-default imageBtn wos_fieldBtn" style=" display: inline-block; margin-top: -2px; margin-bottom: 4px;"><span class="glyphicon glyphicon-picture"></span></a>';
            }
            echo '</div>'; // eof .form-group
            
            echo '<div class="form-group">';
            echo '<label>' . __('Main color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_mainColor" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Panel texts color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_panelColor" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Panel background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_panelColorBg" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Links color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_linksColor" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Button text color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_buttonColor" />';
            echo '</div>'; // eof .form-group  
            echo '<div class="form-group">';
            echo '<label>' . __('Button background color', 'wos') . '</label>';
            echo '<input class="form-control wos_colorpicker" name="login_buttonColorBg" />';
            echo '</div>'; // eof .form-group  
            
            
            echo '</div>'; // eof .col-sm-4
        }
            

            echo '</div>'; // eof #wos_designSkinTab
        }

        echo '<div class="clearfix"></div>';


        echo '<p style="text-align: center; margin-top: 18px;">'
        . ' <a href="javascript:"  onclick="wos_saveSettings();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>' . __('Save', 'wos') . '</a>'
        . ' <a href="javascript:"  onclick="wos_resetColors();" class="btn btn-warning"><span class="glyphicon glyphicon-floppy-diskglyphicon glyphicon-refresh"></span>' . __('Reset colors', 'wos') . '</a>'
        . '</p>';

        echo '</div>';
        echo '</div>';
    }

    public function view_settings_wos() {
        wp_enqueue_style('thickbox');
        wp_enqueue_script('thickbox');

        echo '<div id="osdb_bootstraped" style="margin-top:18px;">';
        echo '<div id="wos_settings">';
        echo '<div class="col-sm-4 col-xs-6">';

        echo '<div class="form-group">';
        echo '<label>' . __('Purchase Code', 'wos') . '</label>';
        echo '<input class="form-control" name="purchaseCode"/>
             <br/>
            <span style="font-size:12px;"><a href="' . $this->parent->assets_url . 'img/purchaseCode.gif" target="_blank">' . __('Where I can find my purchase code ?', 'wos') . '</a></span>';
        echo '</div>'; // eof .form-group

        echo '<div class="form-group">'
        . '<label>' . __('Keyboard shortcut to show next window', 'wos') . '</label>'
        . '<select name="key_nextWin_1"  class="form-control" >';
        echo '<option value="shift">Shift</option>';
        echo '<option value="ctrl">Control</option>';
        echo '<option value="alt">Alt</option>';
        echo '<option value="end">End</option>';
        echo '<option value="home">Home</option>';
        echo '</select> + '
        . '<select name="key_nextWin_2"  class="form-control" >';
        echo '<option value="a">a</option>';
        echo '<option value="b">b</option>';
        echo '<option value="c">c</option>';
        echo '<option value="d">d</option>';
        echo '<option value="e">e</option>';
        echo '<option value="f">f</option>';
        echo '<option value="g">g</option>';
        echo '<option value="h">h</option>';
        echo '<option value="i">i</option>';
        echo '<option value="j">j</option>';
        echo '<option value="k">k</option>';
        echo '<option value="l">l</option>';
        echo '<option value="m">m</option>';
        echo '<option value="n">n</option>';
        echo '<option value="o">o</option>';
        echo '<option value="p">p</option>';
        echo '<option value="q">q</option>';
        echo '<option value="r">r</option>';
        echo '<option value="s">s</option>';
        echo '<option value="t">t</option>';
        echo '<option value="u">u</option>';
        echo '<option value="v">v</option>';
        echo '<option value="w">w</option>';
        echo '<option value="x">x</option>';
        echo '<option value="y">y</option>';
        echo '<option value="z">z</option>';
        echo '<option value="1">1</option>';
        echo '<option value="2">2</option>';
        echo '<option value="3">3</option>';
        echo '<option value="4">4</option>';
        echo '<option value="5">5</option>';
        echo '<option value="6">6</option>';
        echo '<option value="7">7</option>';
        echo '<option value="8">8</option>';
        echo '<option value="9">9</option>';
        echo '<option value="0">0</option>';
        echo '</select>'
        . '</div>'; // eof .form-group

        echo '<div class="form-group">'
        . '<label>' . __('Keyboard shortcut to show next window', 'wos') . '</label>'
        . '<select name="key_prevWin_1"  class="form-control" >';
        echo '<option value="shift">Shift</option>';
        echo '<option value="ctrl">Control</option>';
        echo '<option value="alt">Alt</option>';
        echo '<option value="end">End</option>';
        echo '<option value="home">Home</option>';
        echo '</select> + '
        . '<select name="key_prevWin_2"  class="form-control" >';
        echo '<option value="shift">Shift</option>';
        echo '<option value="ctrl">Control</option>';
        echo '<option value="alt">Alt</option>';
        echo '<option value="end">End</option>';
        echo '<option value="home">Home</option>';
        echo '</select> + '
        . '<select name="key_prevWin_3"  class="form-control" >';
        echo '<option value="a">a</option>';
        echo '<option value="b">b</option>';
        echo '<option value="c">c</option>';
        echo '<option value="d">d</option>';
        echo '<option value="e">e</option>';
        echo '<option value="f">f</option>';
        echo '<option value="g">g</option>';
        echo '<option value="h">h</option>';
        echo '<option value="i">i</option>';
        echo '<option value="j">j</option>';
        echo '<option value="k">k</option>';
        echo '<option value="l">l</option>';
        echo '<option value="m">m</option>';
        echo '<option value="n">n</option>';
        echo '<option value="o">o</option>';
        echo '<option value="p">p</option>';
        echo '<option value="q">q</option>';
        echo '<option value="r">r</option>';
        echo '<option value="s">s</option>';
        echo '<option value="t">t</option>';
        echo '<option value="u">u</option>';
        echo '<option value="v">v</option>';
        echo '<option value="w">w</option>';
        echo '<option value="x">x</option>';
        echo '<option value="y">y</option>';
        echo '<option value="z">z</option>';
        echo '<option value="1">1</option>';
        echo '<option value="2">2</option>';
        echo '<option value="3">3</option>';
        echo '<option value="4">4</option>';
        echo '<option value="5">5</option>';
        echo '<option value="6">6</option>';
        echo '<option value="7">7</option>';
        echo '<option value="8">8</option>';
        echo '<option value="9">9</option>';
        echo '<option value="0">0</option>';
        echo '</select>'
        . '</div>'; // eof .form-group


        echo '</div>'; // eof .col-sm-4


        echo '<div class="col-sm-4 col-xs-6">';


        echo '<div class="form-group">'
        . '<label>' . __('Enable WP OS Backend ?', 'wos') . '</label>'
        . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>" name="enableWOS"/>'
        . '</div>'; // eof .form-group


        echo '<div class="form-group">'
        . '<label>' . __('Enable admin skin', 'wos') . '</label>'
        . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>"  name="useAdminSkin"/>'
        . '</div>'; // eof .form-group

        echo '<div class="form-group">'
        . '<label>' . __('Hide WP menu for non-admin users', 'wos') . '</label>'
        . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>"  name="hideWPMenu"/>'
        . '</div>'; // eof .form-group
        echo '<div class="form-group">'
        . '<label>' . __('Allow non-admins to edit shortcuts', 'wos') . '</label>'
        . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>"  name="usersCanEditShortcut"/>'
        . '</div>'; // eof .form-group   
        echo '<div class="form-group">'
        . '<label>' . __('Non-admins can edit the styles of their desktop', 'wos') . '</label>'
        . '<input type="checkbox" data-toggle="switch" data-on-text="<i class=\'fui-check\'></i>" data-off-text="<i class=\'fui-cross\'></i>"  name="usersCanChangeStyles"/>'
        . '</div>'; // eof .form-group   



        echo '</div>'; // eof .col-sm-4


        echo '<div class="col-sm-4 col-xs-6">';

        echo '<div class="form-group">'
        . '<label>' . __('Roles allowed to use OS Desktop Backend', 'wos') . '</label>'
        . '<select name="rolesAllowed"  class="form-control" multiple >';
        global $wp_roles;
        foreach ($wp_roles->roles as $role) {
            echo '<option value="' . strtolower($role['name']) . '" >' . $role['name'] . '</option>';
        }
        echo '</select>'
        . '</div>'; // eof .form-group

        echo '<div class="form-group">'
        . '<label>' . __('Apply the current shortcuts to the role', 'wos') . '</label>'
        . '<select id="wos_applyshortcutsToRole"  class="form-control" style="margin-right: 6px;" >';
        global $wp_roles;
        foreach ($wp_roles->roles as $role) {
            if ($role != 'administrator') {
                echo '<option value="' . strtolower($role['name']) . '" >' . $role['name'] . '</option>';
            }
        }
        echo '</select>'
        . '<a href="javascript:" id="wos_applyShortcutsRoleBtn" onclick="wos_applyShortCutsRole();" class="btn btn-default wos_fieldBtn" style="margin-top: 0px;margin-bottom: 1px;"><span class="glyphicon glyphicon-ok"></span></a>'
        . '</div>'; // eof .form-group


        echo '</div>'; // eof .col-sm-4

        echo '<div class="clearfix"></div>';

        echo '<p style="text-align: center; margin-top: 18px;">'
        . ' <a href="javascript:"  onclick="wos_saveSettings();" class="btn btn-primary"><span class="glyphicon glyphicon-floppy-disk"></span>' . __('Save', 'wos') . '</a>'
        //   . ' <a href="javascript:"  onclick="wos_resetColors();" class="btn btn-warning"><span class="glyphicon glyphicon-floppy-diskglyphicon glyphicon-refresh"></span>'.__('Reset colors','wos').'</a>'
        . '</p>';

        echo '</div>'; // eof #wos_settings
        echo '</div>'; // eof #osdb_bootstraped
    }

    public function applyShortcutsRole() {
        global $wpdb;

        $role = sanitize_text_field($_POST['role']);
        $table_name = $wpdb->prefix . "wos_shortcuts";

        $usersToReset = array();
        $links = $wpdb->get_results("SELECT DISTINCT userID FROM $table_name ");
        foreach ($links as $link) {
            $user = get_userdata($link->userID);
            if (in_array($role, (array) $user->roles)) {
                $usersToReset[] = $link->userID;
            }
        }
        foreach ($usersToReset as $userToReset) {
            $wpdb->delete($table_name, array('userID' => $userToReset));
        }

        $currentUserID = get_current_user_id();
        $links = $wpdb->get_results("SELECT * FROM $table_name WHERE userID=$currentUserID");

        $allUsers = get_users(array('role' => $role));
        foreach ($allUsers as $aUser) {
            foreach ($links as $link) {
                $wpdb->insert($table_name, array('userID' => $aUser->ID, 'posX' => $link->posX, 'posY' => $link->posY, 'url' => $link->url, 'html' => $link->html));
            }
        }

        die();
    }

    public function checkURL() {
        $error = false;
        $url = sanitize_text_field($_POST['url']);
        $ch = curl_init();

        $options = array(
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_HEADER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_ENCODING => "",
            CURLOPT_AUTOREFERER => true,
            CURLOPT_CONNECTTIMEOUT => 120,
            CURLOPT_TIMEOUT => 120,
            CURLOPT_MAXREDIRS => 10,
        );
        curl_setopt_array($ch, $options);
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch);
        $headers = substr($response, 0, $httpCode['header_size']);
        if (strpos($headers, 'X-Frame-Options: deny') > -1 || strpos($headers, 'X-Frame-Options: SAMEORIGIN') > -1) {
            $error = true;
        }
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        echo json_encode(array('httpcode' => $httpcode, 'error' => $error));
        die();
    }

    /**
     * Main Instance
     *
     *
     * @since 1.0.0
     * @static
     * @return Main instance
     */
    public static function instance($parent) {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($parent);
        }
        return self::$_instance;
    }

    // End instance()

    /**
     * Cloning is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone() {
        _doing_it_wrong(__FUNCTION__, '', $this->parent->_version);
    }

// End __clone()

    /**
     * Unserializing instances of this class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup() {
        _doing_it_wrong(__FUNCTION__, '', $this->parent->_version);
    }

// End __wakeup()
}
