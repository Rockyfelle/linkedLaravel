import React, { useState, useEffect } from "react";
import { useParams} from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter, Form} from "react-bootstrap";
import ReactDOM from 'react-dom';

function Newlink() {
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

	function validateForm() {
		return (isLoading || name.length < 3);
	}

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
                },
                (error) => {
                    alert("error");
                }
			);
			
      }, []);

    function handleSubmit(event) {
		setIsLoading(true);
		event.preventDefault();
		fetch(`http://${window.location.host}/api/user/${userid}/tag/${params.tagId}`, {
            method: 'PUT',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
                //'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({name: name, perm_read: readPerm, perm_write: writePerm})
        })
            .then(res => res.json())
            .then(
                (result) => {
					setIsLoading(false);
					window.history.back();
                },
                (error) => {
                    alert("error");
                }
            );
    }


    return (

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-light border-0" style={{backgroundColor: "#3B3B45"}}>
                            <div className="mx-3">
								<div className="card-header row" style={{fontSize: "25px"}}>
									<div className="text-center">
										Edit Tag
									</div>
								</div>
                                <div className="container-fluid mt-3 mb-3">
									<form onSubmit={handleSubmit}>
										<FormGroup controlId="name">
											<FormLabel>Name</FormLabel>
											<FormControl
												disabled={isLoading}
												required
												autoFocus
												type="text"
												value={name}
												onChange={e => setName(e.target.value)}
												className="bg-theme3 border-0 text-white"
											/>
										</FormGroup>
										<p>Sharelink</p>
										{accessToken !== "" && !isLoading &&
										<div className="input-group mb-3">
											<input disabled value={`../user/${username}/${userid}/tag/${params.tagname}/${params.tagId}/${accessToken}`} id="sharelinkbox" type="text" className="form-control bg-theme3 border-0 text-white" placeholder="No Sharelink exists" aria-label="Tg Name" aria-describedby="basic-addon2" />
											<div className="input-group-append">
												<button className="btn btn-primary" type="button" onClick={copySharelink}>📋 Copy</button>
												<button disabled={shareLoading} className="btn btn-danger" type="button" onClick={tagSharelinkDelete}>Delete Sharelink</button>
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
										{isLoading &&
										<div className="input-group mb-3">
											<input disabled id="sharelinkbox" type="text" className="form-control bg-theme3 border-0 text-white" placeholder="Loading..." aria-label="Tg Name" aria-describedby="basic-addon2" />
										</div>
										}
										<FormGroup controlId="read_perm">
											<FormLabel>Who can view this tag</FormLabel>
											<FormControl
												as="select"
												disabled={isLoading}
												required
												value={readPerm}
												onChange={e => setReadPerm(e.target.value)}
												className="bg-theme3 border-0 text-white"
											>
											<option>Only Me</option>
											<option>Friends</option>
											<option>Anyone</option>
											</FormControl>
										</FormGroup>
										<FormGroup controlId="write_perm">
											<FormLabel>Who can add/remove links to this tag?</FormLabel>
											<FormControl
												as="select"
												disabled={isLoading}
												required
												value={writePerm}
												onChange={e => setWritePerm(e.target.value)}
												className="bg-theme3 border-0 text-white"
											>
											<option>Only Me</option>
											<option>Friends</option>
											</FormControl>
										</FormGroup>
										<br/>
										<Button block disabled={validateForm()} type="submit">
											Update Tag
										</Button>
									</form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Newlink;

