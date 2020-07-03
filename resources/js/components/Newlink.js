import React, { useState, useEffect } from "react";
import { useParams} from 'react-router-dom';
import { Button, FormGroup, FormControl, FormLabel, withRouter, Form} from "react-bootstrap";
import ReactDOM from 'react-dom';

function Newlink() {
    const [token, setToken] = React.useState(
        localStorage.getItem('token') || ''
	);
	const [userid, setUserid] = React.useState(
        localStorage.getItem('userid') || ''
	);
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState("");
	const [link, setLink] = useState("");
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);

	function validateForm() {
		return (isLoading || (selectedTags.length < 1) || (name.length < 1) || (link.length < 1));
	}

	function updateSelectedTags(e, tagid) {
		if (e.target.checked) {
			if (selectedTags.indexOf(tagid) === -1) selectedTags.push(tagid);
			setSelectedTags([...selectedTags]);
		}
		else {
			if (selectedTags.indexOf(tagid) !== -1) selectedTags.splice(selectedTags.indexOf(tagid), 1);
			setSelectedTags([...selectedTags]);
		}
	}

    useEffect(() => {
		document.body.style.backgroundColor = "#2C2C33";
		setIsLoading(true);

        fetch("http://" + window.location.host + "/api/tags/" + userid, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token,
              }
        })
            .then(res => res.json())
            .then(
                (result) => {
					setTags(result.tags);
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
		fetch("http://" + window.location.host + "/api/link", {
            method: 'POST',
            headers: {
				'Content-Type': 'application/json',
				'Authorization': 'Bearer ' + token,
                //'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({name: name, link: link, tagArr: selectedTags})
        })
            .then(res => res.json())
            .then(
                (result) => {
					setName("");
					setLink("");
					setIsLoading(false);
                },
                (error) => {
                    alert("error");
                }
            );
    }

    var tagArr = []
    if (tags.length != 0) {
        tags.map((tag, index) => (
            tagArr.push(
			<React.Fragment key={index}>
                <FormGroup controlid="tag">
					<Form.Check type="checkbox" label={tag.name} id={tag.id} onChange={e => updateSelectedTags(e, tag.id)}/>
				</FormGroup>
            </React.Fragment>)
        ));
    }

    return (

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                        <div className="card text-light border-0" style={{backgroundColor: "#3B3B45"}}>
                            <div className="mx-3">
								<div className="card-header row" style={{fontSize: "25px"}}>
									<div className="text-center">
										Add New Link
									</div>
								</div>
                                <div className="container-fluid mt-3 mb-3">
									<form onSubmit={handleSubmit}>
										<FormGroup controlId="name">
											<FormLabel>Name</FormLabel>
											<FormControl
												required
												autoFocus
												type="text"
												value={name}
												onChange={e => setName(e.target.value)}
												className="bg-theme3 border-0 text-white"
											/>
										</FormGroup>
										<FormGroup controlId="link">
											<FormLabel>Link</FormLabel>
											<FormControl
												required
												value={link}
												onChange={e => setLink(e.target.value)}
												type="text"
												className="bg-theme3 border-0 text-white"
											/>
										</FormGroup>
										{tagArr}
										<Button block disabled={validateForm()} type="submit">
											Add Link
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

