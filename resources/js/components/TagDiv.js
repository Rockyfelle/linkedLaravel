import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, Form, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';

function TagDiv(props) {
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
	const [linksArr, setLinksArr] = useState([]);
	const [linksLoading, setLinksLoading] = useState(true);

	function linkDelete(index, linkId) {
		fetch("http://" + window.location.host + "/api/link/" + linkId + "/" + params.tagId, {
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
		document.body.style.backgroundColor = "#2C2C33";console.log("test");
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
					setLinksArr(result.links); console.log(result.links);
					setLinksLoading(false);
				},
				(error) => {
					alert("error");
				}
			);console.log("TagList Update");
	}, [params, props.makeUpdate]);

	//TODO: Add a way to quickly remove a link from current tag instead of deleting it wholly
	var linkArr = []
	if (linksArr.length != 0) {
		linksArr.map((link, index) => (
			linkArr.push(<React.Fragment key={index}>
				<div>
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
						<div className="w-50 bg-blue d-flex flex-wrap">
							{link.tags.map((tag, index) => (<React.Fragment key={index}>
								<Link className="ml-0 mr-2 bg-black" style={{ fontSize: "14px", color: "lightgray" }} to={"/user/"  + params.username + "/" + params.userId + "/tag/" + tag.name + "/" + tag.id}>{tag.name}</Link>
								</React.Fragment>))}
						</div>
				</div>
				<br />
			</React.Fragment>)
		));
	}

	return (

		<React.Fragment>
			<div className="container-fluid text-light">
				{!linksLoading && linkArr.length > 0 &&
					linkArr
				}
				{!linksLoading && linkArr.length === 0 &&
					<center><h2>This tag is empty, or you do not have permission to view this tag</h2></center>
				}
				{linksLoading &&
					<center><h2>Loading links...</h2></center>
				}
			</div>
		</React.Fragment>
	);
}

export default TagDiv;

