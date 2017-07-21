<?php

if (!defined('ABSPATH'))
    exit;

class WOS_Core
{

    /**
     * The single instance
     * @var    object
     * @access  private
     * @since    1.0.0
     */
    private static $_instance = null;

    /**
     * Settings class object
     * @var     object
     * @access  public
     * @since   1.0.0
     */
    public $settings = null;

    /**
     * The version number.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $_version;

    /**
     * The token.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $_token;

    /**
     * The main plugin file.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $file;

    /**
     * The main plugin directory.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $dir;

    /**
     * The plugin assets directory.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_dir;

    /**
     * The plugin assets URL.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $assets_url;

    /**
     * Suffix for Javascripts.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $templates_url;

    /**
     * Suffix for Javascripts.
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $script_suffix;

    /**
     * For menu instance
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $menu;

    /**
     * For template
     * @var     string
     * @access  public
     * @since   1.0.0
     */
    public $plugin_slug;


    /**
     * Constructor function.
     * @access  public
     * @since   1.0.0
     * @return  void
     */
    public function __construct($file = '', $version = '1.0.0')
    {
        $this->_version = $version;
        $this->_token = 'wos';
        $this->plugin_slug = 'wos';

        $this->file = $file;
        $this->dir = dirname($this->file);
        $this->assets_dir = trailingslashit($this->dir) . 'assets';
        $this->assets_url = esc_url(trailingslashit(plugins_url('/assets/', $this->file)));

        add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_scripts'), 10, 1);
        add_action('wp_enqueue_scripts', array($this, 'frontend_enqueue_styles'), 10, 1);   
        add_action('login_enqueue_scripts', array($this, 'login_enqueue_styles'), 10, 1);  
        add_action('login_enqueue_scripts', array($this, 'login_enqueue_scripts'), 10, 1);         
        add_action('plugins_loaded', array($this, 'init_localization'));
        add_action('login_footer',array($this, 'loginfooter'));

    }
    
    /*
     * Plugin init localization
     */
    public function init_localization()
    {
        $moFiles = scandir(trailingslashit($this->dir) . 'languages/');
        foreach ($moFiles as $moFile) {
            if (strlen($moFile) > 3 && substr($moFile, -3) == '.mo' && strpos($moFile, get_locale()) > -1) {
                load_textdomain('wos', trailingslashit($this->dir) . 'languages/' . $moFile);
            }
        }
    }
    public function loginfooter() { 
       $settings = $this->getSettings();
       echo '<div id="wos_loginVideo"></div>';
       
       $output = '';
        if ($settings->useAdminSkin) {
            $output .= 'body {';
            $output .= ' background-color: ' . $settings->login_colorBg . ';';
            $output .= '}';
            $output .= "\n";
            if ($settings->login_backgroundImage != "" && !$settings->login_useVideoBackground) {
                $output .= 'body {';
                $output .= ' background-image: url(' . $settings->login_backgroundImage . ');';
                $output .= '}';
                $output .= "\n";
            }
            $output .= '#loginform,.login #login_error, .login .message, #lostpasswordform {';
            $output .= ' background-color: ' . $settings->login_panelColorBg . ';';
            $output .= ' color: ' . $settings->login_panelColor . ';';
            $output .= '}';
            $output .= "\n";
            $output .= '.login label,#lostpasswordform label {';
            $output .= ' color: ' . $settings->login_panelColor . ';';
            $output .= '}';
            $output .= "\n";
            
            $output .= '.wp-core-ui .button-primary,.wp-core-ui .button-primary.focus, .wp-core-ui .button-primary.hover, .wp-core-ui .button-primary:focus, .wp-core-ui .button-primary:hover {';
            $output .= ' background-color: ' . $settings->login_buttonColorBg . ';';
            $output .= ' border-color: ' . $settings->login_buttonColorBg . ';';
            $output .= ' color: ' . $settings->login_buttonColor . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'a,a:hover,.login #backtoblog a, .login #nav a,.login #backtoblog a:hover, .login #nav a:hover{';
            $output .= ' color: ' . $settings->login_linksColor . ';';
            $output .= '}';
            $output .= "\n"; 
            $output .= '.login #login_error, .login .message {';
            $output .= ' border-left-color: ' . $settings->login_mainColor . ';';
            $output .= '}';
            $output .= "\n";
            $output .= '.login h1 a {';
            $output .= ' background-image: url(' . $settings->login_logo . ');';
            $output .= '}';
            $output .= "\n";
            $output .= 'input.input {';
            $output .= ' border-color: ' . $settings->login_panelColorBg . ';';
            $output .= ' box-shadow: 0px 0px 0px ' . $settings->login_mainColor . ';';
            $output .= '}';
            $output .= "\n";
            $output .= 'input.input:focus {';
            $output .= ' border-color: ' . $settings->login_mainColor . ';';
            $output .= ' box-shadow: 0px 0px 10px ' . $settings->login_mainColor . ';';
            $output .= '}';
            $output .= "\n";
             
            
            
            if ($output != '') {
                $output = "\n<style id=\"wos_styles\" >\n" . $output . "</style>\n";
                echo $output;
            }
        }
    }
    

    public function login_enqueue_scripts($hook = '')
    {
        global $post;                  
        $settings = $this->getSettings();
        
        if ($settings->useAdminSkin && in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php'))){
            wp_register_script($this->_token . '-login', esc_url($this->assets_url) . 'js/osBackendLogin.min.js', array('jquery'), $this->_version);
            wp_enqueue_script($this->_token . '-login');
            $js_data[] = array(
                'useVideoBackground' => $settings->login_useVideoBackground,
                'backgroundVideo' => $settings->login_backgroundVideo);
             wp_localize_script($this->_token . '-login', 'wos_data', $js_data);

        }
    }
    public function login_enqueue_styles($hook = '')
    {
        global $post;                  
        $settings = $this->getSettings();
        if ($settings->useAdminSkin && in_array($GLOBALS['pagenow'], array('wp-login.php', 'wp-register.php'))){             
            wp_register_style($this->_token . '-login', esc_url($this->assets_url) . 'css/osBackendLogin.min.css', array(), $this->_version);
            wp_enqueue_style($this->_token . '-login'); 
        }
    }
    public function frontend_enqueue_scripts($hook = '')
    {
        global $post;                  
        
    }

    public function frontend_enqueue_styles($hook = '')
    {
        global $post;         
        
    }
    

    /**
     * Main WOS_Core Instance
     *
     *
     * @since 1.0.0
     * @static
     * @see WOS_Core()
     * @return Main WOS_Core instance
     */
    public static function instance($file = '', $version = '1.0.0')
    {
        if (is_null(self::$_instance)) {
            self::$_instance = new self($file, $version);
        }
        return self::$_instance;
    }

// End instance()

    /**
     * Cloning is forbidden.
     *
     * @since 1.0.0
     */
    public function __clone()
    {
    }

// End __clone()

    /**
     * Unserializing instances of this class is forbidden.
     *
     * @since 1.0.0
     */
    public function __wakeup()
    {
        //  _doing_it_wrong(__FUNCTION__, __('Cheatin&#8217; huh?'), $this->_version);
    }

// End __wakeup()

    /**
     * Return settings.
     * @access  public
     * @since   1.0.0
     * @return  void
     */
    public function getSettings()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . "wos_settings";
        $settings = $wpdb->get_results("SELECT * FROM $table_name WHERE id=1 LIMIT 1");
        return $settings[0];
    }
    // End getSettings()


    /**
     * Log the plugin version number.
     * @access  public
     * @since   1.0.0
     * @return  void
     */
    private function _log_version_number()
    {
        update_option($this->_token . '_version', $this->_version);
    }

}
