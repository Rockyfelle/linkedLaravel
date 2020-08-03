import React, { useState, useEffect } from "react";
import { useParams, Link } from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter } from "react-bootstrap";
import ReactDOM from 'react-dom';

function TagsDiv() {
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
	const [tags, setTags] = useState([]);
	const [tagsLoading, setTagsLoading] = useState(true);
	const [errorMessage, setErrorMessage] = useState("");
	
    useEffect(() => {
        document.body.style.backgroundColor = "#2C2C33";
        fetch(`http://${window.location.host}/api/tags/${params.userId}/`, {
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
					setTagsLoading(false);
					if (result.status === "success") {
						setTags(result.tags);
					} else {
						setErrorMessage(result.message);
					}
                },
                (error) => {
                    alert("error");
                }
            );
	}, []);

	function tagDelete(index, tagId) {
		fetch(`http://${window.location.host}/api/user/${params.userId}/tag/${tagId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
			}
		})
			.then(res => res.json())
			.then(
				(result) => {
					tags.splice(index, 1);
					setTags([...tags]);
				},
				(error) => {
					alert("error");
				}
			);
	}

    var tagArr = [];
    if (tags.length != 0) {
        tags.map((tag, index) => (
            tagArr.push(<React.Fragment key={index}>
                <div className="row">
                    <div className="col-8 p-0">
                        <Link style={{fontSize: "20px", color: "white"}} to={"/user/" + username + "/" + tag.user_id + "/tag/" + tag.name + "/" + tag.id}>{tag.name} <sup>({tag.perm_read})</sup></Link>
                    </div>
                    <div className="col-2 p-0">
						<Link to={`/user/${username}/${userid}/edittag/${tag.name}/${tag.id}`}>
                        	<input type="button" className="btn btn-secondary btn-block float-right h-100 mr-4 shadow-sm" value="Edit Tag" />
						</Link>
                    </div>
                    <div className="col-2 p-0">
                        <input type="button" className="btn btn-danger btn-block float-right h-100 ml-4 shadow-sm" value="Delete Tag" onClick={() => tagDelete(index, tag.id)}/>
                    </div>
                </div>
                <br />
            </React.Fragment>)
        ));
	}
	
	return (
		<div className="container-fluid">
			{!tagsLoading && tagArr.length > 0 && errorMessage === "" &&
				tagArr
			}
			{!tagsLoading && tagArr.length === 0 && errorMessage === "" &&
				<center><h2 className="text-white">This user has no tags yet.</h2></center>
			}
			{!tagsLoading && errorMessage &&
				<center><h2 className="text-white">{errorMessage}</h2></center>
			}
		</div>
);
}

export default TagsDiv;

