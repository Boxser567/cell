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
                <div class="title">会展信息列表</div>


                <form name="loginForm" action="/auth/login" role="form" method="post">
                    <input name="__RequestVerificationToken" type="hidden" value="rt5Airmw3jY8JxfwdGzn-X6N_d_ytWSSxziBSHzOUPAh9bxIAg2mbsMJQkkjfxXmQpfsP1Uq_ZipFo2e16JVN6WU8ltGOL3wJd39W3CH4-I1" />


                    <div class="form-group">
                        <label for="Account">微信Unique_code</label>
                        <input class="form-control" data-val="true" data-val-required="The Email field is required." id="Account" name="Account" type="text" value="" />
                        <span class="field-validation-valid" data-valmsg-for="Email" data-valmsg-replace="true"></span>
                    </div>
                    <div class="form-group">
                        <label for="Password">name</label>
                        <input class="form-control" data-val="true" data-val-required="The Password field is required." id="Password" name="Password" type="password" />
                        <span class="field-validation-valid" data-valmsg-for="Password" data-valmsg-replace="true"></span>
                    </div>

                    <div class="form-group">
                        <button  class="btn btn-lg pb-button btn-block bt_submit">保存</button>
                    </div>
                </form>


            </div>
        </div>
    </body>
</html>
