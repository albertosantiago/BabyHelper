@extends('admin.layout')
@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-8 col-md-offset-2">
            <div style="text-align:center;margin-top:50px;" class="well">
                <h1>ERROR 404</h1>
                <br/>
                <p>{{$message}}</p>
            </div>
        </div>
    </div>
</div>
@endsection
