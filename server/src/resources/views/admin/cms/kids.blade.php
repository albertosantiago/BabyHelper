@extends('admin.layout')
@section('content')
@inject('helpers', 'App\Api\BladeHelpers');
<style type="text/css">
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
            <h1>Users</h1>
            <div>
               @if(sizeof($kids)<1)
                   <div class="well">
                       <h3>No Kids found.</h3>
                   </div>
               @else
                   <table class="table table-bordered" id="contact-messages-table">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Sex</th>
                                <th>Created At</th>
                                <th>Updated At</th>
                            </tr>
                        </thead>
                        <tbody>
                            @foreach($kids as $kid)
                                <tr>
                                    <td>{{$kid->id}}</td>
                                    <td>{{$kid->name}}</td>
                                    <td>{{$kid->sex}}</td>
                                    <td>{{$kid->created_at}}</td>
                                    <td>{{$kid->updated_at}}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                    {{ $kids->appends(Input::get())->links() }}
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
