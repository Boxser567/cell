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
                <div class="title">上传测试</div>

                <form name="loginForm" action="http://up-yk3-dev.goukuai.cn/2/web_upload" enctype="multipart/form-data" method="POST">
                    <input name="file" type="file"  />
                    <input name="org_client_id" type="text"  value="akLlMNgYQIg4rFFnCKCQKRV4O8"/>
                    <input name="path" type="text"  value="wang"/>
                    <input name="name" type="text"  value="yuxiang"/>
                    <input name="filefield" type="text"  value="file"/>
                    <div class="form-group">
                        <button  class="btn btn-lg pb-button btn-block bt_submit">登陆</button>
                    </div>
                </form>


            </div>
        </div>
    </body>
</html>
