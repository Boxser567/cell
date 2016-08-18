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
                <div class="title">添加会展请求</div>

                <form name="loginForm" action="/auth/login" role="form" method="post">
                    <input name="__RequestVerificationToken" type="hidden" value="rt5Airmw3jY8JxfwdGzn-X6N_d_ytWSSxziBSHzOUPAh9bxIAg2mbsMJQkkjfxXmQpfsP1Uq_ZipFo2e16JVN6WU8ltGOL3wJd39W3CH4-I1" />


                    <div class="form-group">
                        <button  class="btn btn-lg pb-button btn-block bt_submit">登陆</button>
                    </div>
                </form>


            </div>
        </div>
    </body>
</html>
