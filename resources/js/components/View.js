import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';
import TagsDiv from './TagsDiv';

function Tags() {
	const params = useParams();
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
	const [isLoading, setIsLoading] = useState(true);
	const [profileId, setProfileId] = useState("");
	const [profileLoading, setProfileLoading] = useState(false);
	const [profileName, setProfileName] = useState("");
	const [profileFriend, setProfileFriend] = useState(false);
	const [profilePendingTo, setProfilePendingTo] = useState(false);
	const [profilePendingFrom, setProfilePendingFrom] = useState(false);
	const [friendDeleteLoading, setFriendDeleteLoading] = useState(false);
	const [tags, setTags] = useState([]);





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
					setIsLoading(false);
				},
				(error) => {
					alert("error");
				}
			);
	}, []);


	return (

				<div className="container">
					<div className="row justify-content-center">
						<div className="col-md-8">
							<div className="card text-light border-0" style={{ backgroundColor: "#3B3B45" }}>
								<div className="mx-3">
									<div className="card-header row" style={{ fontSize: "25px" }}>
										<div className="col-6 text-center">
											{!isLoading &&
												<div className="float-left" >{`${profileName}'s Profile`}</div>
											}
											{isLoading &&
												<div className="float-left" >Loading Profile..</div>
											}
										</div>
										<div className="col-3 text-center pr-0">
											{!isLoading && params.userId !== userid && !profileFriend && profilePendingTo && !profilePendingFrom &&
												<input type="button" className="btn btn-success btn-block float-right h-100 ml-4 shadow-sm" value="Accept Request" onClick={friendRequestAccept} disabled={profileLoading} />
											}
										</div>
										<div className="col-3 text-center pr-0">
											{!isLoading && params.userId !== userid && profileFriend &&
												<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Remove Friend" onClick={friendDelete} disabled={profileLoading} />
											}
											{!isLoading && params.userId !== userid && !profileFriend && !profilePendingTo && !profilePendingFrom &&
												<input type="button" className="btn btn-success btn-block float-right h-100 ml-4 shadow-sm" value="Add Friend" onClick={friendRequestCreate} disabled={profileLoading} />
											}
											{!isLoading && params.userId !== userid && !profileFriend && !profilePendingTo && profilePendingFrom &&
												<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Cancel Request" onClick={friendRequestDelete} disabled={profileLoading} />
											}
											{!isLoading && params.userId !== userid && !profileFriend && profilePendingTo && !profilePendingFrom &&
												<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Deny Request" onClick={friendRequestDelete} disabled={profileLoading} />
											}
										</div>
										
									</div>
									<div className="container-fluid mt-5 mb-3">
										{TagsDiv()}
									</div>
									<br />
								</div>
							</div>
						</div>
					</div>
				</div>
	);
}

export default Tags;

