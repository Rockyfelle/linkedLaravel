import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';
import TagDiv from './TagDiv';

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
	const [tagObj, setTagObj] = useState([]);
	const [linksArr, setLinksArr] = useState([]);
	const [tagObjName, setTagObjName] = useState("");
	const [tagObjAccessToken, setTagObjAccessToken] = useState("");
	const [tagObjUserId, setTagObjUserId] = useState("");
	const [tagObjId, setTagObjId] = useState("");
	const [shareLoading, setShareLoading] = useState(false);
	const [tagDeleteLoading, setTagDeleteLoading] = useState(false);

	function validateForm() {
		return email.length > 0 && password.length > 0;
	}

	function tagAddProceed() {
		//TODO: Api call to see wether tagname exists
		let linkName = $('#tagname').val().replace(/[^a-z0-9]/gi, '');
		$('#tagname').val(linkName)
		if (linkName.length > 2 && linkName.length < 17) $("#tagAddExpanded").removeClass('d-none');
	}

	function tagAddSend() {

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
					setTagObjAccessToken(result.token);
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
					setTagObjAccessToken("");
				},
				(error) => {
					alert("error");
				}
			);
	}

	function test() {
		console.log(linksArr);
	}

	function tagDelete() {
		//setTagDeleteLoading(true);
		fetch("http://" + window.location.host + "/api/user/" + params.userId + "/tag/full/" + params.tagId, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					linksArr.splice(index, 1);
					setLinksArr([...linksArr]);
				},
				(error) => {
					alert("error");
				}
			);
	}

	function linkDelete(index, linkId) {
		fetch("http://" + window.location.host + "/api/link/" + linkId + "/" + tagObjId, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					linksArr.splice(index, 1);
					setLinksArr([...linksArr]);
				},
				(error) => {
					alert("error");
				}
			);
	}

	useEffect(() => {	//TODO: add accesstoken defaulting to empty string
		document.body.style.backgroundColor = "#2C2C33";
		let tagPerm = (params.tagPerm == undefined) ? "" : params.tagPerm;
		fetch("http://" + window.location.host + "/api/user/" + params.userId + "/tag/full/" + params.tagId + "/" + tagPerm, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					setTagObj(result);
					setTagObjName(result.tag.name);
					setTagObjAccessToken(result.tag.access_token);
					setTagObjUserId(result.tag.user_id);
					setTagObjId(result.tag.id);
					setLinksArr(result.links); console.log(result.links);
				},
				(error) => {
					alert("error");
				}
			);
	}, [params]);

	function handleSubmit(event) {
		event.preventDefault();
	}

	//TODO: Add a way to quickly remove a link from current tag instead of deleting it wholly
	var linkArr = []
	if (linksArr.length != 0) {
		linksArr.map((link, index) => (
			linkArr.push(<React.Fragment key={index}>
				<div className="row">
					<div className="col-8">
						<Link className="h-100" style={{ fontSize: "25px", color: "white" }} to={link.link}>{link.name}</Link>
					</div>
					<Link className="col-2 p-0" to={"/user/" + params.username + "/" + params.userId + "/editlink/" + params.tagname + "/" + params.tagId + "/" + link.name + "/" + link.id}>
						<input type="button" className="btn btn-secondary btn-block float-right h-100 mr-4" value="Edit Link"  />
					</Link>
					<div className="col-2 p-0">
						<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4" value="Delete Link" onClick={() => linkDelete(index, link.id)}/>
					</div>
				</div>
				<div className="row mt-0">
					<div className="col-7 bg-blue">
						{link.tags.map((tag, index) => (<React.Fragment key={index}>
							<Link className="ml-0 mr-2 .d-inline-block bg-black" style={{ fontSize: "14px", color: "lightgray" }} to={"/user/"  + params.username + "/" + params.userId + "/tag/" + tag.name + "/" + tag.id}>{tag.name}</Link>
							</React.Fragment>))}
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
										<div className="col-4 text-center">
											Links by Tag
										</div>
										<div className="col-4 text-center">
											<Link to={"/user/" + params.username + "/" + params.userId + "/tag/" + params.tagname + "/" + params.tagId} >{tagObjName}</Link>
										</div>
										<div className="col-1 text-center">
										</div>
										<div className="col-3 text-center">
											<input type="button" className="btn btn-danger btn-block float-right h-100 ml-4" value="Delete Tag" onClick={tagDelete} disabled={tagDeleteLoading} />
										</div>
									</div>
									<div className="card-header row" style={{ fontSize: "25px" }}>
										<br />
										{tagObjAccessToken != "" &&
											<div className="col-8 text-center">
												<Link to={"/user/" + params.username + "/" + params.userId + "/tag/" + params.tagname + "/" + params.tagId + "/" + tagObjAccessToken}>{".../" + tagObjAccessToken}</Link>
											</div>
										}
										{tagObjAccessToken == "" &&
											<div className="col-8 text-center">
											</div>
										}
										<div className="col-1 text-center">
										</div>
										{tagObjUserId == userid && tagObjAccessToken == "" &&
											<div className="col-3 text-center">
												<input className="btn btn-primary" type="button" value="Create Sharelink" onClick={tagSharelinkMake} disabled={shareLoading} />
											</div>
										}
										{tagObjUserId == userid && tagObjAccessToken != "" &&
											<div className="col-3 text-center">
												<input className="btn btn-danger btn-block float-right h-100 ml-4" type="button" value="Delete Sharelink" onClick={tagSharelinkDelete} disabled={shareLoading} />
											</div>
										}
									</div>
									<div className="container-fluid mt-5 mb-3">
										{TagDiv()}
									</div>
									<div className="container-fluid p-0">
										<Link to={"/user/" + params.username + "/" + params.userId + "/newlink"} className="btn btn-success btn-block h-100 mr-4">Add New Link</Link>
									</div>
									<div className="container-fluid p-0 pt-4">
										<Link to={"/user/" + params.username + "/" + params.userId + "/tags"} className="btn btn-primary btn-block h-100 mr-4">← Back to Tags</Link>
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

