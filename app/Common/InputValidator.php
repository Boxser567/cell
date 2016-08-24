<?php

/**
 * Created by PhpStorm.
 * User: yuxiangwang
 * Date: 16/4/8
 * Time: 下午4:08
 */
class InputValidator
{
    public static function __callStatic($name, $arguments)
    {
        self::SingleJudgement($name, $arguments[0]);
    }

    private static function SingleJudgement($key, $value)
    {
        $validator = Validator::make([$key => $value], self::Judgement($key));
        if ($validator->fails()) {
            foreach ($validator->messages()->toArray() as $k => $value) {
                throw new Exception($value[0]);
            }
        }
    }

    private static function Judgement($key = "")
    {
        $array = config("validator");
        if ($key) {
            $key = is_string($key) ? [$key] : $key;
            $data = [];
            foreach ($key as $k) {
                $data[$k] = $array[$k];
            }
            if (!$data) {
                throw new Exception("无校验字段" . $array[1]);
            }
            return $data;
        } else {
            return $array;
        }
    }
}