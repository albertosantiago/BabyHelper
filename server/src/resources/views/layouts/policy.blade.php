@inject('metaCreator', 'metaCreator')
<!doctype html>
<html class="no-js" lang="{{ config('app.locale') }}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>@lang('app.title')</title>
        <link href="https://fonts.googleapis.com/css?family=Chewy|Roboto" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/frontend.css" />
        <link rel="alternate" hreflang="x-default" href="http://babyhelper.info/" />
        <link rel="alternate" hreflang="en" href="http://babyhelper.info/en" />
        <link rel="alternate" hreflang="es" href="http://babyhelper.info/es" />
        {!! $metaCreator->render() !!}
    </head>
    <body>
        @include('includes.menu', ['alone'=>true])
        <div class="container">
            <div id="content-page" style="padding:0px;padding-top:120px;padding-bottom:40px;">
                <div class="row">
                    <div class="col-md-3 col-sm-12">
                        <ul class="privacy-menu" style="padding-bottom:20px">
                            <li><a href="{{route('pages',['page'=>'web-legal'])}}">@lang('policy.web_legal')</a></li>
                            <li><a href="{{route('pages',['page'=>'web-cookies'])}}">@lang('policy.web_cookies')</a></li>
                            <li><a href="{{route('pages',['page'=>'web-privacy'])}}">@lang('policy.web_privacy')</a></li>
                            <li><a href="{{route('pages',['page'=>'app-privacy'])}}">@lang('policy.app_privacy')</a></li>
                            <li><a href="{{route('pages',['page'=>'app-terms-use'])}}">@lang('policy.app_conditions')</a></li>
                        </ul>
                    </div>
                    <div class="col-md-9">
                        @yield('content')
                    </div>
                </div>
                @include('includes.footer')
            </div>
        </div>
        <script type="text/javascript" src="/js/jquery-3.3.1.min.js" ></script>
        <script type="text/javascript" src="/js/bootstrap.min.js" ></script>
    </body>
</html>
