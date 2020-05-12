@extends('layouts.app')

@section('content')

<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Add New Link</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div class="container">
                        
                        <form action="/">
                            <label for="link_link">Enter the link</label><br>
                            <input type="text" id="link_link"><br><br>

                            <label for="link_name">Enter a name for the link</label><br>
                            <input type="text" id="link_name"><br><br>

                            @foreach ($tags as $tag)
                                <div>
                                    <input type="checkbox" id="{{ $tag->id }}" name="tagbox" value="{{ $tag->name }}">
                                    <label for="{{ $tag->id }}">{{ $tag->name }}</label><br>
                                </div>
                            @endforeach
                            
                            <br>
                            <br>
                            <input type="button" value="Add Tag" onClick='newLink({{ $tags[0]->user_id }})'>
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
