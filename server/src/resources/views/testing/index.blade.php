@extends('testing.layout')
@section('content')
<div class="container" style="padding-top:50px">
    <div class="row">
        <div class="col-8">
            <div class="tab-content" id="nav-tabContent">
                <!--
                LOGIN JWT
                Usuario predeterminado:
                    email:    johndoe@example.com
                    password: johndoe
                -->
                <div class="tab-pane fade show active" id="login_form" role="tabpanel" aria-labelledby="login_label">
                    <h3>Login de usuario</h3>
                    <div class="card" style="padding:40px">
                        <form action="/api/auth/login" method="POST">
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" name="password" class="form-control">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- CREACIÓN DE DISPOSITIVO -->
                <div class="tab-pane fade" id="device_create_form" role="tabpanel" aria-labelledby="device_create_label">
                    <h3>Formulario de creación de dispositivo</h3>
                    <div class="card" style="padding:40px">
                        <form action="/api/devices/new" method="POST">
                            <div class="form-group">
                                <label>Unique ID</label>
                                <input type="text" name="uniqueId" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Device Model</label>
                                <input type="text" name="model" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>System</label>
                                <input type="text" name="systemName" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>System Version</label>
                                <input type="text" name="systemVersion" class="form-control">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
                <!-- CREACIÓN DE USUARIO -->
                <div class="tab-pane fade" id="user_create_form" role="tabpanel" aria-labelledby="user_create_label">
                    <h3>Formulario de creación de usuario</h3>
                    <div class="card" style="padding:40px">
                        <form action="/api/users/store" method="POST" enctype="multipart/form-data">
                            <div class="form-group">
                                <label>Avatar</label>
                                <input type="file" name="picture" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Nombre</label>
                                <input type="text" name="name" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Device Token</label>
                                <input type="text" name="deviceToken" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" class="form-control">
                            </div>
                            <div class="form-group">
                                <label>Password</label>
                                <input type="password" name="password" class="form-control">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="list-group" id="list-tab" role="tablist">
                <a class="list-group-item list-group-item-action active" id="login_label" data-toggle="list" href="#login_form" role="tab" aria-controls="login">Login</a>
                <a class="list-group-item list-group-item-action" id="user_create_label" data-toggle="list" href="#user_create_form" role="tab" aria-controls="user_create">Creación de usuario</a>
                <a class="list-group-item list-group-item-action" id="device_create_label" data-toggle="list" href="#device_create_form" role="tab" aria-controls="device_create">Creación de dispositivo</a>
            </div>
        </div>
    </div>
</div>
@endsection
