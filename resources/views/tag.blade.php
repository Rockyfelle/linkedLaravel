@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Links in Tag: <a href="{{ URL::to('me/tag') }}{{ $tag->name }}/{{ $tag->id }}">{{ $tag->name }}</a>
                    @if ($tag->user_id == Auth::id())
                        @if ($tag->access_token == "")
                            <input type="button" value="Create a share link" onClick='tagSharelinkMakeDelete(0, {{ $tag->id }})'>
                        @endif
                        @if ($tag->access_token != "")
                            <input type="button" value="Delete share link" onClick='tagSharelinkMakeDelete(1, {{ $tag->id }})'>
                            
                        @endif
                    @endif
                    @if ($tag->access_token != "")
                    <br>
                    <a href="{{ URL::to(Auth::id().'/tag/'.$tag->name.'/'.$tag->id.'/'.$tag->access_token) }}">Copy this link to share</a>
                    @endif
                </div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div>
                        <a href="{{ URL::to('me/tags') }}">Go Back to Tags List</a>
                    </div>
                    <br>
                    <div class="container">
                        @foreach ($links as $link)
                            <div>
                                <a href="{{ $link->link }}">{{ $link->name }}</a> <a href="{{ URL::to('me/link') }}/{{ str_slug($link->name) }}/{{ $link->id }}">(info)</a>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
