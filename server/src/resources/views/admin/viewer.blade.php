@extends('admin.layout')
@section('content')
<div class="container-fluid">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <h1>File Viewer</h1>
            <form class="pull-right" action="{{url('adx/viewer/del')}}" method="POST" id="admin_viewer_delete_form">
                <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                <input type="hidden" name="selected" value="{{$selected}}" />
                <button class="btn btn-danger" type="submit" value="del">Delete</button>
            </form>
            <form action="{{url('adx/viewer')}}" method="GET" id="admin_viewer_form">
                <select name="log" onchange="submitForm()">
                    @foreach ($logs as $index => $logGroup)
                        <optgroup label="{{$logGroup['label']}}">
                            @foreach ($logGroup['items'] as $index => $log)
                                @if($index == $selected)
                                    <option value="{{$index}}" selected="selected">{{$log}}</option>
                                @else
                                    <option value="{{$index}}">{{$log}}</option>
                                @endif
                            @endforeach
                       </optgroup>
                    @endforeach
                </select>
            </form>
            <div style="margin-top:20px;">
                <pre style="white-space:pre-wrap;">{{$file}}</pre>
            </div>
        </div>
    </div>
</div>
@endsection
@section('js')
<script type="text/javascript">
    submitForm = function(){
        $("#admin_viewer_form").submit();
    };
</script>
@endsection
