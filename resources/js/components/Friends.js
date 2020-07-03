import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';

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
	const [friends, setFriends] = useState([]);
	const [friendsPending, setFriendsPending] = useState([]);





	function friendDelete(index, friendId) {
		fetch(`http://${window.location.host}/api/user/${userid}/friends/${friendId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					friends.splice(index, 1);
					setFriends([...friends]);
				},
				(error) => {
					alert("error");
				}
			);
	}

	useEffect(() => {	//TODO: add accesstoken defaulting to empty string
		document.body.style.backgroundColor = "#2C2C33";
		fetch(`http://${window.location.host}/api/user/${userid}/friends/`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setFriends([...result.friends]);
					setFriendsPending([...result.friends_pending]);
				},
				(error) => {
					alert("error");
				}
			);
	}, []);


	var friendArr = []
	if (friends.length != 0) {
		friends.map((friend, index) => (
			friendArr.push(<React.Fragment key={index}>
				<div className="row">
					<div className="col-10">
						<Link className="h-100" style={{ fontSize: "25px", color: "white" }} to={`/user/${friend.username}/${friend.id}/view`}>{friend.username}</Link>
					</div>
					<div className="col-2 p-0">
						<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4" value="Remove Friend" onClick={() => friendDelete(index, friend.id)}/>
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
							<div className="card text-light border-0" style={{ backgroundColor: "#3B3B45" }}>
								<div className="mx-3">
									<div className="card-header row" style={{ fontSize: "25px" }}>
										Friends
									</div>
									<div className="container-fluid mt-5 mb-3">
										{friendArr}
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

