<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>BabyHelper - System Admin</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.5.0/css/font-awesome.min.css" integrity="sha384-XdYbMnZ/QjLh6iI4ogqCTaIjrFk87ip+ekIjefZch0Y+PvJ8CDYtEs1ipDmPorQ+" crossorigin="anonymous">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Lato:100,300,400,700">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.13/css/jquery.dataTables.css">
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.13/css/dataTables.bootstrap.min.css">
    <style>
        body {
            font-family: 'Lato';
            font-size:15px;
        }
        .fa-btn {
            margin-right: 6px;
        }
        .table-bordered td, th {
            vertical-align: middle;
        }
        .table > tbody > tr > td, .table > tbody > tr > th, .table > tfoot > tr > td, .table > tfoot > tr > th, .table > thead > tr > td, .table > thead > tr > th{
            vertical-align: middle;
            text-align: center;
        }
        td{
            vertical-align: center;
        }
        th{
            background-color:#f8f8f8;
        }
        .table tbody tr td{
            font-size:0.8em;
            text-align:center;
        }
        .table tbody tr td pre{
            font-size:0.9em;
            text-align:left;
        }
        h1{
            font-size:2em;
        }
    </style>
</head>
<body id="app-layout">
    @if (Auth::guard('admin')->check())
    <nav class="navbar navbar-default navbar-static-top  navbar-inverse">
        <div class="container">
            <div class="navbar-header">
                <!-- Collapsed Hamburger -->
                <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#app-navbar-collapse">
                    <span class="sr-only">Toggle Navigation</span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                    <span class="icon-bar"></span>
                </button>
                <!-- Branding Image -->
                <a class="navbar-brand" href="{{ url('/adx/') }}">
                    BabyHelper.info&nbsp;&nbsp;<span class="icon-tv"></span>&nbsp;&nbsp;-&nbsp;&nbsp;System Admin&nbsp;&nbsp;/
                </a>
            </div>
            <div class="collapse navbar-collapse" id="app-navbar-collapse">
                <!-- Left Side Of Navbar -->
                <ul class="nav navbar-nav navbar-left">
                    <li>
                        <a href="/adx/">Dashboard</a>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        Server<span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li class="dropdown-header">Server info</li>
                            <li><a href="{{ url('/adx/server/info') }}" role="button">Php</a></li>
                        </ul>
                        <ul class="dropdown-menu" role="menu">
                            <li class="dropdown-header">Server info</li>
                            <li><a href="{{ url('/adx/server/info') }}" role="button">Php</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        System<span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="{{ url('/adx/system/contact')}}">Contact Messages</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                        CMS<span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="{{ url('/adx/cms/users') }}">Users</a></li>
                            <li><a href="{{ url('/adx/cms/kids') }}">Kids</a></li>
                        </ul>
                    </li>
                </ul>
                <!-- Right Side Of Navbar -->
                <ul class="nav navbar-nav navbar-right">
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">
                            {{ Auth::guard("admin")->user()->username }} <span class="caret"></span>
                        </a>
                        <ul class="dropdown-menu" role="menu">
                            <li><a href="{{ url('/adx/change-password') }}">Change Password</a></li>
                            <li><a href="{{ url('/adx/logout') }}"><i class="fa fa-btn fa-sign-out"></i>Logout</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
    @endif
    <div class="container">
        <div class="row">
            <div class="col-md-8 col-md-offset-2">
                @if(Session::has('flash_message'))
                    <div role="alert" class="alert alert-success alert-dismissible fade in">
                        <button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>
                        {{ Session::get('flash_message') }}
                    </div>
                @endif
                @if(Session::has('error_message'))
                    <div role="alert" class="alert alert-danger alert-dismissible fade in">
                        <button aria-label="Close" data-dismiss="alert" class="close" type="button"><span aria-hidden="true">×</span></button>
                        {{ Session::get('error_message') }}
                    </div>
                @endif
            </div>
        </div>
    </div>
    @yield('content')
    <footer class="footer">
    <div class="row" style="padding:0px;margin:0px;padding-top:40px;">
        <div style="float:right;display:block;padding:20px;">
            <p>A <a href="https://wetdog.co">WetDog Company</a> product.
        </div>
    </div>
    </footer>
    <!-- JavaScripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.2.3/jquery.min.js" integrity="sha384-I6F5OKECLVtK/BL+8iSLDEHowSAfUo76ZL9+kGAgTRdiByINKJaqTPH/QVNS1VDb" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>
    <!-- DataTables JavaScript -->
    <script src="//cdn.datatables.net/1.10.13/js/jquery.dataTables.min.js"></script>
    <script src="//cdn.datatables.net/responsive/2.1.1/js/dataTables.responsive.min.js"/></script>
    <script src="//cdn.datatables.net/1.10.13/js/dataTables.bootstrap.min.js"></script>
    <!-- Contenedor para JS de las paǵinas -->
    @yield('js')
</body>
</html>
