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
	const [isLoading, setIsLoading] = useState(true);
	const [name, setName] = useState("");
	const [link, setLink] = useState("");
	const [tags, setTags] = useState([]);
	const [selectedTags, setSelectedTags] = useState([]);
	const [preChecked, setPreChecked] = useState(props.testing);
	const [callParent, setCallParent] = useState(null);

	function validateForm() {
		return (isLoading || (selectedTags.length < 1) || (name.length < 1) || (link.length < 1));
	}

	function updateSelectedTags(e, tagid) {
		if (e.target.checked) {
			if (selectedTags.indexOf(tagid) === -1) selectedTags.push(tagid);
			setSelectedTags([...selectedTags]);
			tags.find(x => x.id === tagid).isChecked = true;
		}
		else {
			if (selectedTags.indexOf(tagid) !== -1) selectedTags.splice(selectedTags.indexOf(tagid), 1);
			setSelectedTags([...selectedTags]);
			tags.find(x => x.id === tagid).isChecked = false;
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
					result.tags.forEach(tag => {
						if (preChecked.indexOf(tag.id) !== -1) {
							selectedTags.push(tag.id);
						}
						tag.isChecked = (preChecked.indexOf(tag.id) !== -1) ? true : false;
					});
					setTags(result.tags);
					setIsLoading(false);
                },
                (error) => {
                    alert("error");
                }
            );console.log("LinkMaker Update");
	}, [callParent]);
	  
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
					//Update parent and siblings
					props.setData([...[]]);
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
					<Form.Check type="checkbox" label={tag.name} id={tag.id} onChange={e => updateSelectedTags(e, tag.id)} checked={tag.isChecked}/>
				</FormGroup>
            </React.Fragment>)
		));
	}
	

	return (

		<div className="text-light">
			<div className="">
				<h2>Add New Link</h2>
			</div>
			<div className="container-fluid mt-3 mb-3">
				<form onSubmit={handleSubmit}>
					<FormGroup controlId="name">
						<FormLabel>Name</FormLabel>
						<FormControl
							required
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
	);
}

export default TagDiv;

