@extends('layouts.test')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card text-light border-0" style="background-color: #3B3B45">
                <div class="m-3">
                    <div class="container-fluid">
                        @foreach ($tags as $tag)
                            <div class="row">
                                <div class="col-8 p-0">
                                    <a style="font-size: 20px; color: lightgray;" href="{{ URL::to('/tagedit') }}/{{ $tag->name }}/{{ $tag->id }}">{{ $tag->name }}</a>
                                </div>
                                <div class="col-2 p-0">
                                    <input type="button" class="btn btn-secondary btn-block float-right h-100 mr-4" value="Edit Tag" onClick='friendDelete({{ $tag->id }})'>
                                </div>
                                <div class="col-2 p-0">
                                    <input type="button" class="btn btn-danger btn-block float-right h-100 ml-4" value="Delete Tag" onClick='friendDelete({{ $tag->id }})'>
                                </div>
                            </div>
                            <br>
                        @endforeach
                        </div>
                    <br>
                    <div>
                        <a href="{{ URL::to('/newtag') }}">Click here to add a new tag</a>
                    </div>
                    <div class="input-group mb-3">
                        <input id="tagname" type="text" class="form-control bg-theme3 border-0 text-white" placeholder="Tag Name" aria-label="Tg Name" aria-describedby="basic-addon2">
                        <div class="input-group-append">
                            <button class="btn btn-primary" type="button" onClick="tagAddProceed()">Proceed</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div id="tagAddExpanded" class="d-none card text-light border-0 dx-none" style="background-color: #41414C;">
                <div class="m-3 m-0">
                    <div id="tagAddExpanded" class="w-100 ">
                        <div class="form-group">
                            <label for="sel1">Who can view links under this tag?:<br>(You can share tags with non-users using a permalink)</label>
                            <select id="tagread" class="form-control bg-theme3 border-0 text-white" id="sel1">
                                <option value="private" selected>Only Me</option>
                                <option value="friends">Friends</option>
                                <option value="private">Only These Friends</option>
                                <option value="public">Public</option>
                            </select>
                            <br>
                            <label for="sel1">Who can add/remove links under this tag?:<br></label>
                            <select id="tagwrite" class="form-control bg-theme3 border-0 text-white" id="sel1">
                                <option value="private" selected>Only Me</option>
                                <option value="friends">Friends</option>
                            </select>
                            <br>
                            <button class="btn btn-primary w-100" type="button" onClick="tagAddSend({{ Auth::id() }})">Add Tag</button>
                        </div>
                    </div>
                <div>
            </div>
        </div>
    </div>
</div>
@endsection
