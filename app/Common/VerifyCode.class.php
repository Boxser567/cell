<?php

class VerifyCode {

    private $_width;
    private $_height;
    private $_noise_dot;
    private $_noise_line;
    private $_noise_alpha;
    private $_image;
    private $_color_bg;
    private $_session_name;
    private $_code;

    public function __construct($width, $height, $noise_dot = 0, $noise_line = 0, $noise_alpha = 0) {
        $this->_width = $width;
        $this->_height = $height;
        $this->_noise_dot = $noise_dot;
        $this->_noise_line = $noise_line;
        $this->_noise_alpha = $noise_alpha;
    }

    private function _get_random_color($color_min = 0x00, $color_max = 0xff) {
        return imagecolorallocate($this->_image, mt_rand($color_min, $color_max), mt_rand($color_min, $color_max), mt_rand($color_min, $color_max));
    }

    private function _create_circle() {
        $color = $this->_get_random_color(0, 0xcc);
        $cx = ceil(mt_rand($this->_height / 2 + 1, $this->_width - $this->_height / 2 - 1));
        $cy = ceil(mt_rand($this->_height / 2 - 10, $this->_height / 2 + 10));
        $radius = mt_rand($this->_height / 3, $this->_height - 1);
        imageellipse($this->_image, $cx, $cy, $radius, $radius, $color);
    }

    private function _create_rectangle() {
        $color = $this->_get_random_color(0, 0xcc);
        $x1 = ceil(mt_rand(1, $this->_width - $this->_height));
        $y1 = ceil(mt_rand(1, $this->_height / 3));
        $y2 = ceil(mt_rand($y1 + 10, $this->_height - $y1));
        $x2 = $x1 + $y2 - $y1;
        imagerectangle($this->_image, $x1, $y1, $x2, $y2, $color);
    }

    private function _create_triangle() {
        $color = $this->_get_random_color(0, 0xcc);
        $x1 = ceil(mt_rand(1, $this->_width / 2));
        $y1 = ceil(mt_rand(1, $this->_height / 2));
        $x2 = ceil(mt_rand($x1 + 5, $this->_width - 1));
        $y2 = ceil(mt_rand($y1 + 5, $this->_height / 1.5));
        $x3 = ceil(mt_rand(1, $x2 - 5));
        $y3 = ceil(mt_rand($y2 + 5, $this->_height - 1));
        imagepolygon($this->_image, array($x1, $y1, $x2, $y2, $x3, $y3), 3, $color);
    }

    private function _show_code() {
        if ($this->_image) {
            header("Content-Type: image/png");
            imagepng($this->_image);
            @imagedestroy($this->_image);
            $this->_image = null;
        }
    }
    private function _show_code_tamp() {
        if ($this->_session_name) {
            gksession($this->_session_name, $this->_code);
        }
        if ($this->_image) {
            header("Content-Type: image/png");
            imagepng($this->_image);
            @imagedestroy($this->_image);
            $this->_image = null;
            exit(0);
        }
    }

    private function _create_image() {
        $this->_image = imagecreatetruecolor($this->_width, $this->_height);
        $this->_color_bg = $this->_get_random_color(0xee, 0xff);
        imagefill($this->_image, 0, 0, $this->_color_bg);
    }

    private function _add_noise() {
        for ($i = 0; $i < $this->_noise_dot; $i++) {
            $color = $this->_get_random_color(0x33, 0xcc);
            imagesetpixel($this->_image, mt_rand(0, $this->_width), mt_rand(0, $this->_height), $color);
        }
        for ($i = 0; $i < $this->_noise_line; $i++) {
            $color = $this->_get_random_color(0x33, 0xaa);
            imageline($this->_image, mt_rand(0, $this->_width / 2), mt_rand(0, $this->_height), mt_rand($this->_width / 2, $this->_width), mt_rand(0, $this->_height), $color);
        }
    }

    /**
     * 显示三种图形的验证码
     * @param string $name session中的key
     * session中的值三位依次是圆形个数,方形个数,三角个数
     */
    public function show_pattern($name = false) {
        $this->_session_name = $name;
        $this->_create_image();
        $circle = 0;
        for ($i = 0; $i < mt_rand(1, 2); $i++) {
            $this->_create_circle();
            $circle++;
        }
        $rectangle = 0;
        for ($i = 0; $i < mt_rand(1, 2); $i++) {
            $this->_create_rectangle();
            $rectangle++;
        }
        $triangle = 0;
        for ($i = 0; $i < mt_rand(0, 2); $i++) {
            $this->_create_triangle();
            $triangle++;
        }
        $this->_add_noise();
        $this->_code = sprintf('%s%s%s', $circle, $rectangle, $triangle);
        $this->_show_code_tamp();
    }

    /**
     * 显示汉字验证码
     * @param string $name session中的key
     * @param int $count 字数
     * @param int $min_font_size 最小字体大小
     * @param int $max_font_size 最大字体大小
     */
    public function show_hanzi($name = false, $count = 4, $min_font_size = 16, $max_font_size = 18) {
        $this->_session_name = $name;
        $this->_create_image();
        $this->_add_noise();

        $str = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严龙飞';
        $strlen = mb_strlen($str, 'utf-8');
        $fonts = array(APP_PATH . 'simhei.ttf', APP_PATH . 'simkai.ttf'); //显示的字体样式
        $offset_x = $min_font_size;
        $this->_code = '';
        for ($i = 0; $i < $count; $i++) {
            $font_color = $this->_get_random_color(0, 0x66);
            $str2 = mb_substr($str, mt_rand(0, $strlen - 1), 1, 'utf-8');
            $this->_code .= $str2;
            $font_size = mt_rand($min_font_size, $max_font_size);
            imagettftext($this->_image, mt_rand(18, 20), mt_rand(-15, 15), $font_size * $i * 1.8 + $offset_x, ($this->_height + $font_size) / 2, $font_color, $fonts[mt_rand(0, 1)], $str2);
        }
        $this->_show_code_tamp();
    }

    /**
     * 显示字母和数字验证码
     * @param string $name session中的key
     * @param int $count 字数
     * @param int $min_font_size 最小字体大小
     * @param int $max_font_size 最大字体大小
     */
    public function showAlpha($count = 4, $min_font_size = 16, $max_font_size = 20) {
        $this->_create_image();
        $chars = array(
            array(49, 57), //1-9
            array(65, 90), //A-Z
            array(97, 122) //a-z
        );
        $font = __DIR__.'/lfaxd.ttf';
        for ($i = 0; $i < $this->_noise_alpha; $i++) {
            $font_color = $this->_get_random_color(0xcc, 0xff);
            $c = $chars[mt_rand(0, 2)];
            $str2 = chr(mt_rand($c[0], $c[1]));
            $font_size = mt_rand(ceil($max_font_size / 4), $max_font_size);
            imagettftext($this->_image, $font_size, mt_rand(0, 360), mt_rand(0, $this->_width), mt_rand(0, $this->_height), $font_color, $font, $str2);
        }

        $this->_add_noise();

        $this->_code = '';
        $sep = $this->_width * 0.7 / $count;
        for ($i = 0; $i < $count; $i++) {
            $font_size = mt_rand($min_font_size, $max_font_size);
            $font_color = $this->_get_random_color(0, 0x66);
            $c = $chars[mt_rand(0, 2)];
            $str2 = chr(mt_rand($c[0], $c[1]));
            $this->_code .= $str2;
            imagettftext($this->_image, $font_size, mt_rand(-10, 20), ceil($this->_width * 0.15 + $i * $sep), ceil(($this->_height + $font_size) / 2), $font_color, $font, $str2);
        }
        $this->_show_code();
        return $this->_code;
    }
    public function showAlpha_tamp($name = false, $count = 4, $min_font_size = 16, $max_font_size = 20) {
        $this->_session_name = $name;
        $this->_create_image();

        $chars = array(
            array(49, 57), //1-9
            array(65, 90), //A-Z
            array(97, 122) //a-z
        );
        $font = APP_PATH . 'Common/lfaxd.ttf';
        for ($i = 0; $i < $this->_noise_alpha; $i++) {
            $font_color = $this->_get_random_color(0xcc, 0xff);
            $c = $chars[mt_rand(0, 2)];
            $str2 = chr(mt_rand($c[0], $c[1]));
            $font_size = mt_rand(ceil($max_font_size / 4), $max_font_size);
            imagettftext($this->_image, $font_size, mt_rand(0, 360), mt_rand(0, $this->_width), mt_rand(0, $this->_height), $font_color, $font, $str2);
        }

        $this->_add_noise();

        $this->_code = '';
        $sep = $this->_width * 0.7 / $count;
        for ($i = 0; $i < $count; $i++) {
            $font_size = mt_rand($min_font_size, $max_font_size);
            $font_color = $this->_get_random_color(0, 0x66);
            $c = $chars[mt_rand(0, 2)];
            $str2 = chr(mt_rand($c[0], $c[1]));
            $this->_code .= $str2;
            imagettftext($this->_image, $font_size, mt_rand(-10, 20), ceil($this->_width * 0.15 + $i * $sep), ceil(($this->_height + $font_size) / 2), $font_color, $font, $str2);
        }
        $this->_show_code_tamp();
    }
}