import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';
import TagDiv from './TagDiv';
import LinkAddDiv from './LinkAddDiv';

function NewTags() {
	const params = useParams();
    const [token, setToken] = React.useState(
        localStorage.getItem('token') || ''
	);
	const [username, setUsername] = React.useState(
        localStorage.getItem('username') || ''
	);
	const [userid, setUserid] = React.useState(
        localStorage.getItem('userid') || ''
	);
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState("Loading...");
	const [accessToken, setAccessToken] = useState("");
	const [shareLoading, setShareLoading] = useState(false);
	const [readPerm, setReadPerm] = useState(false);
	const [writePerm, setWritePerm] = useState(false);
	const [testing, setTesting] = useState([parseInt(params.tagId)]);

	function copySharelink() {
		navigator.clipboard.writeText(`${window.location.host}/user/${username}/${userid}/tag/${params.tagname}/${params.tagId}/${accessToken}`).then(function() {
		}, function() {});
	}

	function tagSharelinkMake() {
		setShareLoading(true);
		fetch("http://" + window.location.host + "/api/sharelink/", {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			},
			body: JSON.stringify({tagId: params.tagId})
		})
			.then(res => res.json())
			.then(
				(result) => {
					setShareLoading(false);
					setAccessToken(result.token);
				},
				(error) => {
					alert("error");
				}
			);
	}

	function tagSharelinkDelete() {
		setShareLoading(true);
		fetch("http://" + window.location.host + "/api/sharelink/" + params.tagId, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setShareLoading(false);
					setAccessToken("");
				},
				(error) => {
					alert("error");
				}
			);
	}


	function copyShareLink() {

	}

    useEffect(() => {
		document.body.style.backgroundColor = "#2C2C33";
		setIsLoading(true);
			
		fetch(`http://${window.location.host}/api/user/${userid}/tag/simple/${params.tagId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              }
        })
            .then(res => res.json())
            .then(
                (result) => {
					setName(result.tag.name);
					setAccessToken(result.tag.access_token);
					setIsLoading(false);
					setReadPerm(result.tag.perm_read);
					setWritePerm(result.tag.perm_write);
                },
                (error) => {
                    alert("error");
                }
			);
			
      }, [testing]);console.log(testing);
	  
	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="cw-90" style={{maxWidth: "2000px"}}>
				<p className="mb-0 gray" style={{color: "gray"}}>User</p>
				<h1 style={{color: "lightgray"}}>{params.username} >_</h1>
				<div className="d-flex justify-content-center">
					<div className="cw-90">
						<p className="mb-0" style={{color: "gray"}}>Tag</p>
						<div>
							<h1 className="d-inline" style={{color: "lightgray"}}>{name} >_</h1>
						</div>
						<div className="d-flex justify-content-center mt-5">
							<div className="cw-90">
								<div className="row">
									<div className="col-8 cmf pl-0">
										<TagDiv />
										<br/>
										<br/>
										<LinkAddDiv testing={testing} />
									</div>
									<div className="col-4">
										<div className="card text-white bg-dark">
											<div className="card-header"><h2>Tag Info</h2></div>
											<div className="card-body">
												<div className="card-text">
													<div>
														<h4>Read Permission</h4>
														<select className="custom-select bg-theme3 border-0 text-white">
																<option value="0">Only Me</option>
																<option value="1">Friends</option>
																<option value="2">Anyone</option>
														</select>
														<br/>
														<br/>
														<h4>Write Permission</h4>
														<select className="custom-select bg-theme3 border-0 text-white">
																<option value="0">Only Me</option>
																<option value="1">Friends</option>
														</select>
														<br/>
														<br/>
														<h4>Sharing Link</h4>
														{accessToken !== "" && !isLoading &&
														<div>
															<div className="input-group mb-3">
																<input disabled value={`../user/${username}/${userid}/tag/${params.tagname}/${params.tagId}/${accessToken}`} id="sharelinkbox" type="text" className="form-control bg-theme3 border-0 text-white" placeholder="No Sharelink exists" aria-label="Sharelink" aria-describedby="basic-addon2" />
																<div className="input-group-append">
																	<button className="btn btn-primary" type="button" onClick={copySharelink}>📋 Copy</button>
																	<button disabled={shareLoading} className="btn btn-danger" type="button" onClick={tagSharelinkDelete}>Delete</button>
																</div>
															</div>
														</div>
														}
														{accessToken === "" && !isLoading &&
															<div className="input-group mb-3">
																<input disabled id="sharelinkbox" type="text" className="form-control bg-theme3 border-0 text-white" placeholder="No Sharelink exists" aria-label="Tg Name" aria-describedby="basic-addon2" />
																<div className="input-group-append">
																	<button disabled={shareLoading} className="btn btn-success" type="button" onClick={tagSharelinkMake}>Create Sharelink</button>
																</div>
															</div>
														}
													</div>
													<br/>
													<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Delete Tag" />
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
);
}

export default NewTags;

