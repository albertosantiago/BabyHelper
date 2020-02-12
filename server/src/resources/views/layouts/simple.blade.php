@inject('metaCreator', 'metaCreator')
<!doctype html>
<html class="no-js" lang="{{ config('app.locale') }}" dir="ltr">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="https://fonts.googleapis.com/css?family=Chewy|Roboto" rel="stylesheet">
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/frontend.css" />
        {!! $metaCreator->render() !!}
    </head>
    <body>
        @include('includes.menu', ['alone'=>true])
        <div class="container">
            <div id="content-page">
                @yield('content')
                @include('includes.footer')
            </div>
        </div>
        <script type="text/javascript" src="/js/jquery-3.3.1.min.js" ></script>
        <script type="text/javascript" src="/js/bootstrap.min.js" ></script>
    </body>
</html>
