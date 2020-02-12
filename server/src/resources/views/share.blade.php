<!doctype html>
<html class="no-js" lang="en" dir="ltr">
<head>
    <meta charset="utf-8">
    <meta http-equiv="x-ua-compatible" content="ie=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="google-signin-client_id" content="728380312031-mrgtbhks8ivn670hisnsc61fsldno7rb.apps.googleusercontent.com">
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
        <div class="container" style="padding-top:60px">
            <div class="row"  style="background-color:#f1f7f9;padding-top:20px;padding-bottom:30px;margin-top:50px">
                <div class="col-md-4" style="text-align:center;padding-top:50px;">
                    <img style="margin:0 auto;width:120px;height:120px;border-radius:60px" src={{$user->picture()->src}} />
                    <h3 style="font-weight:bold;font-size:24px;padding-top:20px">{{$user->name}}</h3>
                </div>
                <div class="col-md-4" style="text-align:center;padding-top:70px;">
                    <p style="padding:20px;padding-bottom:0px">Quiere compartir contigo las notas de</p>
                    <i class="fas fa-share" style="font-size:48px;"></i>
                </div>
                <div class="col-md-4" style="text-align:center;padding-top:50px;">
                    <img style="margin:0 auto;width:120px;height:120px;border-radius:60px" src={{$kid->picture()->src}} />
                    <h3 style="font-weight:bold;font-size:24px;padding-top:20px">{{$kid->name}}</h3>
                </div>
            </div>
            <div class="row">
                <p style="padding:50px;text-align:center;width:100%">Entra ahora con tu cuenta de Google e instala la app en tu dispositivo</p>
            </div>
            <div class="row">
                <div id="my-signin2" style="padding:40px;padding-top:0px;width:100%;text-align:center;"></div>
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
<script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
<script type="text/javascript">

    var token = '{!!$token!!}';
    var lang  = '{!!$lang!!}';

    function onSuccess(googleUser) {
        var data = googleUser.getAuthResponse(true);
        $.post("/shared/"+token,{
            id_token: data.id_token
        }).then(function(){
            window.location = "/"+lang+"/shared/success/"+token;
        });
    }
    function onFailure(error) {
        console.log(error);
    }
    function signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
    function renderButton() {
        gapi.signin2.render('my-signin2', {
          'scope': 'profile email',
          'width': 240,
          'height': 50,
          'longtitle': true,
          'theme': 'dark',
          'onsuccess': onSuccess,
          'onfailure': onFailure
        });
    }
    $(function(){
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        renderButton();
    });
</script>
</body>
</html>
