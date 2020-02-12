@extends('admin.layout')
@section('content')
<style>
table.dataTable thead th {
    text-align:center;
}
table.dataTable thead .sorting {
    background-color:#f8f8f8;
}
table.dataTable thead .sorting_desc{
    background-color:#f8f8f8;
}
table.dataTable thead .sorting_asc{
    background-color:#f8f8f8;
}
</style>
<div class="container-fluid">
    <div class="row">
        <div class="col-md-10 col-md-offset-1">
            <h1>Contact Form - Messages</h1>
            <br/>
            <div>
               @if(sizeof($messages)<1)
                   <div class="well">
                       <h3>No messages were found.</h3>
                   </div>
               @else
                   {!! Form::open([
                      'method' => 'DELETE',
                      'route' => ['admin.cms.contact.clear']
                  ]) !!}
                       <table class="table table-bordered" id="contact-messages-table">
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Message</th>
                                    <th>Email</th>
                                    <th>Date</th>
                                    <th>
                                        <input checked='false' type="checkbox" onclick='selectAll(this.checked);' />
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach($messages as $message)
                                    <tr>
                                        <td>{{$message->id}}</td>
                                        <td>{{$message->name}}</td>
                                        <td>{{$message->message}}</td>
                                        <td>{{$message->mail}}</td>
                                        <td>{{$message->created_at}}</td>
                                        <td><input type="checkbox" name="delete[{{$message->id}}]"/></td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                        {{ $messages->appends(Input::get())->links() }}
                        <div class="row" id="selectionActions" style="padding-bottom:20px;">
                            <div class="col-sm-6 pull-right">
                                <button type="submit" class="pull-right btn btn-primary">Clear Selected</button>
                            </div>
                        </div>
                    {!! Form::close() !!}
                @endif
            </div>
            <br/><br/>
        </div>
    </div>
</div>
@endsection
@section('js')
<script type="text/javascript">

function selectAll(status){
    $("#contact-messages-table input:checkbox").prop("checked", status);
}

</script>
@endsection
