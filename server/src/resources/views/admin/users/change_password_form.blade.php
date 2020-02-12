@extends('admin.layout')
@section('content')
<div class="container-fluid">
    <div class="row">
        <br/><br/>
        <div class="col-md-5 col-md-offset-3 well bs-component">
            <form method="POST" action="/adx/change-password" class="form-horizontal">
                <fieldset>
                    <legend>Change Password</legend>
                    <br/>
                    <input type="hidden" name="_token" value="<?php echo csrf_token(); ?>">
                    <div class="form-group">
                        <label class="col-md-5" for="title" >New Password:</label>
                        <div class="col-md-7">
                            <input type="password" class="form-control" name="password" />
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-md-5" for="user">Confirm new password:</label>
                        <div class="col-md-7">
                            <input type="password" class="form-control" name="password_confirmation" />
                        </div>
                    </div>
                    <div class="form-group" style="padding-top:25px">
                        <div class="col-md-12">
                            <input type="submit" class="btn btn-primary pull-right" value="Save" />
                        </div>
                    </div>
                </fieldset>
            </form>
        </div>
    </div>
</div>
@endsection
