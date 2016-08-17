<?php
/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/8/15
 * Time: 下午4:29
 */

namespace App\Http\Controllers;

use Session;
use Auth;
use Exception;
use Endroid\QrCode\QrCode;
class BaseController extends Controller
{
    public $member;
    
    public function __construct($member = [])
    {
        $member = Session::get('member', $member);
        if (!$member) {
            throw new Exception(40106);
        } else {
            $this->member = $member;
        }
    }


    public function getQr()
    {
        $text=inputGetOrFail("text");
        $type=inputGet('type','png');
        $size=inputGet('size',100);
        $qrCode = new QrCode();
        $qrCode
            ->setText($text)
            ->setExtension($type)
            ->setSize($size)
            ->setPadding(10)
            ->setBackgroundColor(array('r' => 255, 'g' => 255, 'b' => 255, 'a' => 0))
            ->setForegroundColor(array('r' => 0, 'g' => 0, 'b' => 0, 'a' => 0))
            ->setErrorCorrection(QrCode::LEVEL_MEDIUM);
           header('Content-Type: '.$qrCode->getContentType());
        $qrCode->render();
        exit();
    }
}