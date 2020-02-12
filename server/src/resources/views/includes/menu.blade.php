@php
 if(empty($alone)){
     $alone = false;
 }
@endphp
<nav class="navbar navbar-expand-lg navbar-light bg-blue fixed-top">
    <div class="container">
        <a class="navbar-brand" style="font-size:28px;font-family:Chewy" href="/">
            <div style="height:64px;width:64px;border-radius:32px;border:4px solid #ccc;display:inline-block;background-color:#fff">
                <img src="/img/kid.png" style="width:50px;height:50px;display:inline-block;margin-top:3px;margin-left:3px;" />
            </div>
            @lang('app.app_name')
        </a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent" >
            <ul class="navbar-nav mr-auto">
                @if(!$alone)
                <li class="nav-item active">
                    <a class="nav-link" href="#init">@lang('menu.home')</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#features">@lang('menu.features')</a>
                </li>
                @endif
            </ul>
            <div id="lang-selector">
                <a rel="alternate" hreflang="es" href="{{ LaravelLocalization::getLocalizedURL('es', null, [], true) }}">
                    Español
                </a>
                <span style="font-weight:bold">|</span>
                <a rel="alternate" hreflang="en" href="{{ LaravelLocalization::getLocalizedURL('en', null, [], true) }}">
                    English
                </a>
            </div>
        </div>
    </div>
</nav>
