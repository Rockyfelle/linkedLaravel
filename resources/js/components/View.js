import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';
import TagsDiv from './TagsDiv';
import TagAddDiv from './TagAddDiv';

function Tag() {
	const [didMount, setDidMount] = useState(false);
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
	const [readPerm, setReadPerm] = useState(false);
	const [writePerm, setWritePerm] = useState(false);
	const [testing, setTesting] = useState([parseInt(params.tagId)]);
	const [state, setState] = useState([[]]);
	const [profileLoading, setProfileLoading] = useState(false);
	const [profileVisibility, setProfileVisibility] = useState("");
	const [profileId, setProfileId] = useState("");
	const [profileEditLoading, setProfileEditLoading] = useState(false);
	const [profileName, setProfileName] = useState("");
	const [profileFriend, setProfileFriend] = useState(false);
	const [profilePendingTo, setProfilePendingTo] = useState(false);
	const [profilePendingFrom, setProfilePendingFrom] = useState(false);
	const [userErrorMessage, setUserErrorMessage] = useState("");

	function handleProfileVisibilityChange(e) {
		setProfileVisibility(e.target.value);
	}

	//Update tag info
	useEffect(() => {
		if (didMount) {
			updateTag();
		}
	}, [profileVisibility]);

	function updateTag() {
		setTagEditLoading(true);
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
					setTagEditLoading(false);
                },
                (error) => {
                    alert("error");
                }
            );
	}

	function friendDelete(index) {
		setProfileLoading(true);
		fetch(`http://${window.location.host}/api/user/${profileId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setProfileLoading(false);
					setProfileFriend(false);
				},
				(error) => {
					alert("error");
				}
			);
	}

	function friendRequestCreate(index) {
		setProfileLoading(true);
		fetch(`http://${window.location.host}/api/user/${profileId}/add`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setProfileLoading(false);
					setProfilePendingFrom(true);
				},
				(error) => {
					alert("error");
				}
			);
	}

	function friendRequestAccept(index) {
		setProfileLoading(true);
		fetch(`http://${window.location.host}/api/user/${profileId}/request`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setProfileLoading(false);
					setProfileFriend(true);
					setProfilePendingTo(false);
				},
				(error) => {
					alert("error");
				}
			);
	}

	function friendRequestDelete(index) {
		setProfileLoading(true);
		fetch(`http://${window.location.host}/api/user/${profileId}/request`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setProfileLoading(false);
					setProfilePendingTo(false);
					setProfilePendingFrom(false);
				},
				(error) => {
					alert("error");
				}
			);
	}

	useEffect(() => {	//TODO: add accesstoken defaulting to empty string
		document.body.style.backgroundColor = "#2C2C33";
		fetch(`http://${window.location.host}/api/user/${params.userId}/details/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setIsLoading(false);
					if (result.status === "success") {
						setProfileId(params.userId);
						setProfileId(result.user.id);
						setProfileName(result.user.username);
						if (result.isfriend === true) {
							setProfileFriend(true);
						} else {
							setProfileFriend(false);
							if (result.pending === "from") {
								setProfilePendingFrom(true);
							}
							else
								if (result.pending === "to") {
								setProfilePendingTo(true);
							}
						}
					} else {
						setUserErrorMessage(result.message);
					}
				},
				(error) => {
					alert("error");
				}
			);
	}, [state]);
	  
	return (
		<div className="container-fluid d-flex justify-content-center">
			<div className="cw-90" style={{maxWidth: "2000px"}}>
				<p className="mb-0 gray" style={{color: "gray"}}>User</p>
				<h1 style={{color: "lightgray"}}>{params.username} >_</h1>
				<div className="d-flex justify-content-center">
					<div className="cw-90">
						<p className="mb-0" style={{color: "gray"}}>Profile</p>
						<div>
							<h1 className="d-inline" style={{color: "lightgray"}}>Profile >_</h1>
						</div>
						<div className="d-flex justify-content-center mt-5">
							<div className="cw-90">
								<div className="row">
									<div className="col-8 cmf pl-0">
										<TagsDiv makeUpdate={state}/>
										<br/>
										<br/>
										{!isLoading && userid === params.userId &&
											<TagAddDiv testing={testing} setData={setState}/>
										}
									</div>
									<div className="col-4">
										<div className="card text-white bg-dark">
											<div className="card-header"><h2>Tag Info</h2></div>
											<div className="card-body">
												<div className="card-text">
													{!isLoading && userErrorMessage &&
														<h4>{userErrorMessage}</h4>
													}
													{!isLoading && userid === params.userId &&
														<div>
															<h4>Profile Visibility</h4>
															<select onChange={e => handleProfileVisibilityChange(e)} value={profileVisibility} disabled={profileEditLoading} className="custom-select bg-theme3 border-0 text-white">
																	<option value="private">Only Me</option>
																	<option value="friends">Friends</option>
																	<option value="public">Anyone</option>
															</select>
															<br/>
															<br/>
														</div>
													}
													{!isLoading && params.userId !== userid && !profileFriend && profilePendingTo && !profilePendingFrom &&
														<div className="pb-5">
															<input type="button" className="btn btn-success btn-block float-right h-100 ml-4 shadow-sm" value="Accept Request" onClick={friendRequestAccept} disabled={profileLoading} />
														</div>
													}
													<div className="pt-1">
														{!isLoading && params.userId !== userid && profileFriend &&
															<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Remove Friend" onClick={friendDelete} disabled={profileLoading} />
														}
														{!isLoading && params.userId !== userid && !profileFriend && !profilePendingTo && !profilePendingFrom && !userErrorMessage &&
															<input type="button" className="btn btn-success btn-block float-right h-100 ml-4 shadow-sm" value="Add Friend" onClick={friendRequestCreate} disabled={profileLoading} />
														}
														{!isLoading && params.userId !== userid && !profileFriend && !profilePendingTo && profilePendingFrom &&
															<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Cancel Request" onClick={friendRequestDelete} disabled={profileLoading} />
														}
														{!isLoading && params.userId !== userid && !profileFriend && profilePendingTo && !profilePendingFrom &&
															<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Deny Request" onClick={friendRequestDelete} disabled={profileLoading} />
														}
													</div>
													{!isLoading && userid === params.userId &&
														<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Delete Account" />
													}
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

export default Tag;

