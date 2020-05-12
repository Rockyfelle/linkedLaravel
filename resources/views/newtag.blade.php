@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Add New Tag</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div class="container">
                        
                        <form action="/">
                            <label for="tag_name">What do you want the tag to be named?</label><br>
                            <input type="text" id="tag_name"><br><br>

                            <label for="tag_read">Who can see the links under this tag?</label><br>
                            <select id="tag_read" name="Visibility">
                                <option value="private">Private</option>
                                <option value="friends">Friends</option>
                                <option value="public">Public</option>
                            </select><br><br>

                            <label for="tag_write">Who can add/delete links under this tag?</label><br>
                            <select id="tag_write" name="Writeability">
                                <option value="private">Private</option>
                                <option value="friends">Friends</option>
                                <option value="public">Public</option>
                            </select><br><br>
                            
                            <br>
                            <br>
                            <input type="button" value="Add Tag" onClick='getMessage()'>
                        </form>
                    </div>
                    <br/>
                    <div id="msg">Waiting for input</div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
