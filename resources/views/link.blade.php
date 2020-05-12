@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Tags for Link: <a href="{{ $link->link }}">{{ $link->name }}</a></div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                    <div>
                        <a href="{{ URL::to('me/tags') }}/">Go Back to Tags List</a>
                    </div>
                    <br>
                    <div class="container">
                        @foreach ($tags as $tag)
                            <div>
                                <a href="{{ URL::to('/me/tag') }}/{{ $tag->name }}/{{ $tag->id }}">{{ $tag->name }}</a>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
