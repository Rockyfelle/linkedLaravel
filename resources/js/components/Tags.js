import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';
import TagsDiv from './TagsDiv';

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

    function tagAddProceed() {
		//TODO: Api call to see wether tagname exists
		let tagName = $('#tagname').val().replace(/[^a-z0-9]/gi,'');
		$('#tagname').val(tagName)
		if (tagName.length > 2 && tagName.length < 17)
		$("#tagAddExpanded").removeClass('d-none');
    }

    function tagAddSend() {

    }


    return (

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-light border-0" style={{backgroundColor: "#3B3B45"}}>
                            <div className="mx-3">
								<div className="card-header row" style={{ fontSize: "25px" }}>
									<div className="col-4 text-center">
											Your Tags
									</div>
								</div>
								{TagsDiv()}
                                <br />
                                <div>
                                    <Link to="">Click here to add a new tag</Link>
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

