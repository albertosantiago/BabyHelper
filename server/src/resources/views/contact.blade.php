@extends('layouts.simple')
@inject('helpers', 'App\Api\FrontalHelpers')
@section('content')
    @if(($previousMessage)&&(!$hasMessageSuccess))
        <div class="contact-form">
            <div class="success">
                <h1 class="brand">BabyHelper</h1>
                <h2>@lang('contact.not_allow_header')</h2>
                <p>@lang('contact.not_allow_message')</p>
                <div class="back-button">
                    <a href="/" class="ui button primary huge">@lang('app.back_to_home')</a>
                </div>
            </div>
        </div>
    @else
        @if($hasMessageSuccess)
            <div class="contact-form">
                <div class="alert alert-success" role="alert">
                    <h1 class="brand">BabyHelper</h1>
                    <h2>@lang('contact.success_header')</h2>
                    <p>@lang('contact.success_message')</p>
                    <div class="back-button">
                        <a href="/" class="alert-link">@lang('app.back_to_home')</a>
                    </div>
                </div>
            </div>
        @else
            <div class="contact-form">
                <h1 class="header" style="width:100%;max-width:100%">@lang('contact.title')</h1>
                @if ($errors->count() > 0)
                    <div class="alert alert-danger" role="alert" style="margin-top:20px">
                        <h4>@lang('contact.errors_header')</h4>
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
                        <label>@lang('contact.field_name')</label>
                        <input type="text" class="form-control" name="name" placeholder="@lang('contact.placeholder_name')" value="{{ old('name') }}">
                    </div>
                    <div class="form-group">
                        <label>@lang('contact.field_email')</label>
                        <input type="text" class="form-control" name="email" placeholder="@lang('contact.placeholder_email')" value="{{ old('email') }}">
                    </div>
                    <div class="form-group">
                        <label>@lang('contact.field_message')</label>
                        <textarea class="form-control" name="message" placeholder="@lang('contact.placeholder_message')">{{ old('message') }}</textarea>
                    </div>
                    <div class="actions">
                        <button class="btn btn-primary" type="submit">@lang('app.submit')</button>
                    </div>
                </form>
            </div>
        @endif
    @endif
@endsection
@section('js')
    @if(!$hasMessageSuccess)
        <script type="text/javascript" src="{{$helpers->cdn("/js/contact.js")}}" ></script>
    @endif
@endsection
