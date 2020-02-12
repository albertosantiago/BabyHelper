<!doctype html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BabyHelper - Api Test Forms</title>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet" integrity="sha384-wvfXpqpZZVQGK6TAh5PVlGOfQNHSoD2xbE+QkPxCAFlNEevoEH3Sl0sibVcOQVnN" crossorigin="anonymous">
        <link rel="stylesheet" href="/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/css/frontend.css">
    </head>
    <body>
        <div class="container">
            <div id="header" style="padding-top:40px;display:block;border:0px solid #000; border-bottom-width:1px">
                <h1>Api Forms</h1>
            </div>
            <div id="content">
                @yield('content')
            </div>
        </div>
        <script type="text/javascript" src="/js/jquery-3.3.1.min.js" ></script>
        <script type="text/javascript" src="/js/bootstrap.min.js" ></script>
        <script type="text/javascript">
            $('#myList a').on('click', function (e) {
                e.preventDefault()
                $(this).tab('show')
            })
        </script>
    </body>
</html>
