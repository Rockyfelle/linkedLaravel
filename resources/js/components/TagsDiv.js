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
					setTags(result.tags);
					setTagsLoading(false);
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
                        <Link style={{fontSize: "20px", color: "white"}} to={"/user/" + username + "/" + tag.user_id + "/tag/" + tag.name + "/" + tag.id}>{tag.name}</Link>
                    </div>
                    <div className="col-2 p-0">
						<Link to={`/user/${username}/${userid}/edittag/${tag.name}/${tag.id}`}>
                        	<input type="button" className="btn btn-secondary btn-block float-right h-100 mr-4" value="Edit Tag" />
						</Link>
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
		<div className="container-fluid">
			{!tagsLoading && tagArr.length > 0 &&
				tagArr
			}
			{!tagsLoading && tagArr.length === 0 &&
				<center><h2>This user has no tags, or the tags visibility is set to private</h2></center>
			}
		</div>
);
}

export default TagsDiv;

