@extends('layouts.app')
@section('content')
<a id="init"></a>
<div class="container" style="padding-top:60px">
    <div class="row">
        <div class="content">
            <div class="row">
                <div class="col-md-6">
                    <div class="block-header">
                        <h1 class="header">@lang('home.title')</h1>
                        <div style="padding-top:30px">
                            @lang('home.subtitle')
                        </div>
                        <div style="text-align:center;padding-top:80px">
                            <a href="#">
                                <img src="/img/section2_icon_googleplay.svg" />
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-md-6  mobile-screen-container" style="text-align:center">
                    <div class="mobile-screen">
                        <img src="/img/screenshot-pictures.png" />
                    </div>
                </div>
            </div>
            <div class="clearfix">
                <br/><br/>
            </div>
            <div class="row" style="background-color:#f1f7f9;">
                <div class="col-md-6 mobile-screen-container" style="background-color:#f1f7f9;text-align:center">
                    <div class="mobile-screen" >
                        <img src="/img/screenshot-tasks.png" />
                    </div>
                </div>
                <div class="col-md-6">
                    <div style="padding-top:40px;">
                        <h2 class="subheader"><a id="features"></a>@lang('home.features_title')</h2>
                        <ul class="features-list">
                            <li>@lang('home.features_1')</li>
                            <li>@lang('home.features_2')</li>
                            <li>@lang('home.features_3')</li>
                            <li>@lang('home.features_4')</li>
                            <li>@lang('home.features_5')</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
