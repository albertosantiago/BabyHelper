@extends('layouts.simple')
@inject('helpers', 'App\Api\FrontalHelpers')
@section('content')
<div style="text-align:center">
    @if(($previousRequest)&&(!$hasMessageSuccess))
        <div class="contact-form">
            <div>
                <h2>@lang('password_recovery.not_allow_header')</h2>
                <p>@lang('password_recovery.not_allow_message')</p>
                <div class="back-button">
                    <a href="/" class="ui button primary huge">@lang('app.back_to_home')</a>
                </div>
            </div>
        </div>
    @else
        @if($hasMessageSuccess)
            <div class="contact-form">
                <div class="alert" role="alert">
                    <h2>@lang('password_recovery.success_header')</h2>
                    <p>@lang('password_recovery.success_message')</p>
                    <div class="back-button">
                        <a href="/" class="alert-link">@lang('app.back_to_home')</a>
                    </div>
                </div>
            </div>
        @else
            <div class="contact-form" style="max-width:700px;margin:0 auto;text-align:left;">
                <h1 class="header" style="width:100%;max-width:100%">@lang('password_recovery.title')</h1>
                @if ($errors->count() > 0)
                    <div class="alert alert-danger" role="alert" style="margin-top:20px">
                        <h4>@lang('password_recovery.errors_header')</h4>
                		<button type="button" class="close" data-dismiss="alert">×</button>
                        <ul class="list">
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                        </ul>
                    </div>
                @else
                    <div class="ui error message"></div>
                @endif
                <form class="ui contact big form" method="POST">
                    {{csrf_field()}}
                    <div class="form-group">
                        <label>@lang('password_recovery.field_email')</label>
                        <input type="text" class="form-control" name="email" placeholder="@lang('password_recovery.placeholder_email')" value="{{ old('email') }}">
                    </div>
                    <br/>
                    <div class="actions">
                        <button class="btn btn-primary" type="submit">@lang('password_recovery.submit')</button>
                    </div>
                </form>
            </div>
        @endif
    @endif
</div>
@endsection
@section('js')
    @if(!$hasMessageSuccess)
        <script type="text/javascript" src="{{$helpers->cdn("/js/password_recovery.js")}}" ></script>
    @endif
@endsection
