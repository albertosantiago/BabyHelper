<!doctype html>
<html class="no-js" lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-signin-client_id" content="1022001068564-uq2ge0u73dt0eifadggk67uj216liriv.apps.googleusercontent.com">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@lang('app.title')</title>
    <link href="https://fonts.googleapis.com/css?family=Chewy|Roboto" rel="stylesheet">
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.10/css/all.css" integrity="sha384-+d0P83n9kaQMCwj8F4RJB66tzIwOKmrdb46+porD/OvrJ+37WqIM7UoBtwHO6Nlg" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="/css/bootstrap.min.css" />
    <link rel="stylesheet" href="/css/frontend.css" />
    <link rel="alternate" hreflang="x-default" href="http://babyhelper.info/" />
    <link rel="alternate" hreflang="en" href="http://babyhelper.info/en" />
    <link rel="alternate" hreflang="es" href="http://babyhelper.info/es" />
    <style type="text/css">
        .abcRioButtonBlue{
            margin: 0 auto;
        }
    </style>
</head>
<body>
@include('includes.menu', ['alone'=>true])
<div class="container">
    <div id="content-page">
        <a id="init"></a>
        <div class="container" style="padding-top:50px">
            <div class="row" style="padding-top:40px;padding-bottom:20px;">
                <div class="col-md-12" style="text-align:center;">
                    <?php
                        $src = "";
                        $picture = $user->picture();
                        if(!empty($picture)){
                            $src = $picture->src;
                        }
                    ?>
                    <img style="margin:0 auto;width:120px;height:120px;border-radius:60px" src={{$src}} />
                    <p>¡¡Bienvenid@ <span style="font-weight:bold;font-size:24px;padding-top:20px">{{$user->name}}</span>!!</p>
                </div>
            </div>
            <div class="row" style="background-color:#fff;padding-top:20px;padding-bottom:30px;">
                <div class="col-md-12" style="text-align:center;">
                    <?php
                        $src = "";
                        $picture = $kid->picture();
                        if(!empty($picture)){
                            $src = $picture->src;
                        }
                    ?>
                    <img style="margin:0 auto;width:120px;height:120px;border-radius:60px;margin-bottom:20px" src={{$src}} />
                    <p>Para poder ver las notas y fotos de <span style="font-weight:bold;font-size:24px;padding-top:20px">{{$kid->name}}</span> continua desde la aplicación movil de Babyhelper</p>
                    <p>Recuerda acceder desde tu usuario de <strong>Google</strong>, si aun no tienes instalada la aplicación puedes instalarla desde aquí</p>
                </div>
            </div>
            <div class="row">
                <div style="text-align:center;padding-top:20px;padding-bottom:20px;width:100%">
                    <a href="{{ env('PLAY_STORE_LINK') }}">
                        <img src="/img/section2_icon_googleplay.svg" />
                    </a>
                </div>
            </div>
            <div class="row" style="padding-top:100px">
                <br/><br/><br/><br/><br/>
            </div>
            @include('includes.footer')
        </div>
    </div>
</div>
<script type="text/javascript" src="/js/jquery-3.3.1.min.js" ></script>
<script type="text/javascript" src="/js/bootstrap.min.js" ></script>

</body>
</html>
