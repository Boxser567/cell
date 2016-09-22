<!DOCTYPE html>
<html>
    <head>
        <title>Laravel</title>

        <link href="https://fonts.googleapis.com/css?family=Lato:100" rel="stylesheet" type="text/css">

        <style>
            html, body {
                height: 100%;
            }

            body {
                margin: 0;
                padding: 0;
                width: 100%;
                display: table;
                font-weight: 100;
                font-family: 'Lato';
            }

            .container {
                text-align: center;
                display: table-cell;
                vertical-align: middle;
            }

            .content {
                text-align: center;
                display: inline-block;
            }

            .title {
                font-size: 96px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <div class="title">完善信息,才可以使用</div>

                <form name="loginForm"  action="/auth/optimize" role="form" method="POST">
                    <input name="user_id" type="hidden"  value="<?php echo $user['id'] ?>"/>
                    您的名:<input name="account" type="text"  value=" "/>
                    企业名称<input name="org_name" type="text"  value=" "/>
                    手机号 <input name="phone" type="text"  value=" "/>
                    验证码 <input name="verify_code" type="text"  value=" "/>
                    邀请码 <input name="invitation_code" type="text"  value="fd_0800381708"/>
                    <div class="form-group">
                        <button  class="btn btn-lg pb-button btn-block bt_submit">开始使用</button>
                    </div>
                </form>


            </div>
        </div>
    </body>
</html>
