@extends('layouts.test')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card text-light rounded border-0" style="background-color: #3B3B45">
                <div class="m-3">
                    @foreach ($friends as $friend)
                        <div class="friend-container-list">
                            <div class="friend_name"><a style="font-size: 20px;" href="{{ URL::to('/user') }}/{{ $friend->username }}/{{ $friend->user_id_2 }}">{{ $friend->username }}</a></div>
                            <div class="friend_space"></div>
                            <div class="friend_remove"><input type="button" class="btn btn-primary btn-block float-right h-100" value="Remove Friend" onClick='friendDelete({{ $friend->user_id_2 }})'></div>
                        </div>
                        <br>
                        <div class="friend-container-list">
                            <div class="friend_name"><a style="font-size: 20px;" href="{{ URL::to('/user') }}/{{ $friend->username }}/{{ $friend->user_id_2 }}">{{ $friend->username }}</a></div>
                            <div class="friend_space"></div>
                            <div class="friend_remove"><input type="button" class="btn btn-primary btn-block float-right h-100" value="Remove Friend" onClick='friendDelete({{ $friend->user_id_2 }})'></div>
                        </div>
                        <br>
                    @endforeach
                    <br>
                    <br>
                    <div class="input-group mb-3">
                        <input type="text" class="form-control bg-theme3 border-0 text-white" placeholder="Username or Email address" aria-label="Recipient's username" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button style="background-color=blue;" class="btn btn-primary" type="button">Add Friend</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
