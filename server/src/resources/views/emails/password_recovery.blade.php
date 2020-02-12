<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title>BabyHelper Confirmation</title>
        <link href="https://fonts.googleapis.com/css?family=Chewy|Roboto" rel="stylesheet">
        <style>
            html,
            body {
                margin: 0 auto !important;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
            }
            @font-face {
                font-family: 'Lato';
                font-style: normal;
                font-weight: 400;
                src: local('Lato Regular'), local('Lato-Regular'), url(https://fonts.gstatic.com/s/lato/v11/qIIYRU-oROkIk8vfvxw6QvesZW2xOQ-xsNqO47m55DA.woff) format('woff');
            }
            /* latin */
            @font-face {
              font-family: 'Chewy';
              font-style: normal;
              font-weight: 400;
              src: local('Chewy Regular'), local('Chewy-Regular'), url(https://fonts.gstatic.com/s/chewy/v9/uK_94ruUb-k-wn52KjI.woff2) format('woff2');
              unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
            }

            * {
                -ms-text-size-adjust: 100%;
                -webkit-text-size-adjust: 100%;
                font-family: Lato, "Lucida Grande", "Lucida Sans Unicode", Tahoma, Sans-Serif;
            }

            .logo{
                font-family:Chewy, cursive, Georgia;
            }

    </style>
    </head>
    <body>
        <div style="width:100%;text-align:center">
            <div style="max-width:450px;margin:0 auto">
                <h1><span class="logo">BabyHelper</span></h1>
                <img style="width:120px" src="{{$message->embed(public_path('img/kid.png'))}}" />
                <p>Hemos recibido una solicitud de recuperación de contraseña, para cambiar tu contraseña pulsa en el siguiente enlace:</p>
                <br/>
                <div style="padding:20, width:100%;text-align:center">
                    <a href="https://babyhelper.info/password/change?token={{$passwordRequest->token}}">Cambiar contraseña</a>
                </div>
                <br/><br/>
                <small>* Por favor, no respondan a este email. Para contactar con BabyHelper escribenos a contact@babyhelper.info</small>
            </div>
        </div>
    </body>
</html>
