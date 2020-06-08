import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';

function Tags() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [token, setToken] = React.useState(
        localStorage.getItem('token') || ''
	);
	const [username, setUsername] = React.useState(
        localStorage.getItem('username') || ''
	);
	const [userid, setUserid] = React.useState(
        localStorage.getItem('userid') || ''
    );
    const [tags, setTags] = useState([]);

    function validateForm() {
        return email.length > 0 && password.length > 0;
    }

    function tagAddProceed() {
		//TODO: Api call to see wether tagname exists
		let tagName = $('#tagname').val().replace(/[^a-z0-9]/gi,'');
		$('#tagname').val(tagName)
		if (tagName.length > 2 && tagName.length < 17)
		$("#tagAddExpanded").removeClass('d-none');
    }

    function tagAddSend() {

    }

    useEffect(() => {
        document.body.style.backgroundColor = "#2C2C33";
        fetch("http://localhost:8080/api/tags/me/", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
                //'Content-Type': 'application/x-www-form-urlencoded',
              }
        })
            .then(res => res.json())
            .then(
                (result) => {
                    setTags(result);
                },
                (error) => {
                    alert("error");
                }
            );
      }, []);

    function handleSubmit(event) {
        event.preventDefault();
    }

    var tagArr = []
    if (tags.length != 0) {
        tags.map((tag, index) => (
            tagArr.push(<React.Fragment key={index}>
                <div className="row">
                    <div className="col-8 p-0">
                        <a style={{fontSize: "20px", color: "lightgray"}} href={"http://localhost:8080/user/" + username + "/" + tag.user_id + "/tag/" + tag.name + "/" + tag.id}>{tag.name}</a>
                    </div>
                    <div className="col-2 p-0">
                        <input type="button" className="btn btn-secondary btn-block float-right h-100 mr-4" value="Edit Tag" href={"localhost:8080/rtagedit/" + tag.name + "/" + tag.id}/>
                    </div>
                    <div className="col-2 p-0">
                        <input type="button" className="btn btn-danger btn-block float-right h-100 ml-4" value="Delete Tag" />
                    </div>
                </div>
                <br />
            </React.Fragment>)
        ));
    }

    return (

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-light border-0" style={{backgroundColor: "#3B3B45"}}>
                            <div className="m-3">
                                <div className="container-fluid">
                                    {tagArr}
                                </div>
                                <br />
                                <div>
                                    <a href="">Click here to add a new tag</a>
                                </div>
                                <div className="input-group mb-3">
                                    <input id="tagname" type="text" className="form-control bg-theme3 border-0 text-white" placeholder="Tag Name" aria-label="Tg Name" aria-describedby="basic-addon2" />
                                    <div className="input-group-append">
                                        <button className="btn btn-primary" type="button" onClick={tagAddProceed}>Proceed</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div id="tagAddExpanded" className="d-none card text-light border-0 dx-none" style={{backgroundColor: "#41414C"}}>
                            <div className="m-3 m-0">
                                <div id="tagAddExpanded" className="w-100 ">
                                    <div className="form-group">
                                        <label>Who can view links under this tag?:<br />(You can share tags with non-users using a permalink)</label>
                                        <select id="tagread" className="form-control bg-theme3 border-0 text-white" id="sel1">
                                            <option value="private">Only Me</option>
                                            <option value="friends">Friends</option>
                                            <option value="private">Only These Friends</option>
                                            <option value="public">Public</option>
                                        </select>
                                        <br />
                                        <label>Who can add/remove links under this tag?:<br /></label>
                                        <select id="tagwrite" className="form-control bg-theme3 border-0 text-white" id="sel1">
                                            <option value="private">Only Me</option>
                                            <option value="friends">Friends</option>
                                        </select>
                                        <br />
                                        <button className="btn btn-primary w-100" type="button" onClick={tagAddSend}>Add Tag</button>
                                    </div>
                                </div>
                            <div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    );
}

export default Tags;

