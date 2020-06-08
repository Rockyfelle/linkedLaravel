import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const [username, setUsername] = useState("");
	const [name, setName] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
	}
	
	useEffect(() => {
        document.body.style.backgroundColor = "#2C2C33";
      }, []);

    function handleSubmit(event) {
        event.preventDefault();
        fetch("http://localhost:8080/api/register", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({email: email, password: password, username: username, name: name})//probably errors in registerauth function and is silent thus leading to 302
        })
            .then(res => res.json())
            .then(
                (result) => {
					window.location.replace("http://localhost:8080/rlogin");
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
									<div className="Register" className="w-100">
										<form onSubmit={handleSubmit}>
											<FormGroup controlId="name">
												<FormLabel>Name</FormLabel>
												<FormControl
													autoFocus
													type="text"
													value={name}
													onChange={e => setName(e.target.value)}
													className="bg-theme3 border-0 text-white"
												/>
											</FormGroup>
											<FormGroup controlId="username">
												<FormLabel>Username</FormLabel>
												<FormControl
													type="text"
													value={username}
													onChange={e => setUsername(e.target.value)}
													className="bg-theme3 border-0 text-white"
												/>
											</FormGroup>
											<FormGroup controlId="email">
												<FormLabel>Email</FormLabel>
												<FormControl
													type="email"
													value={email}
													onChange={e => setEmail(e.target.value)}
													className="bg-theme3 border-0 text-white"
												/>
											</FormGroup>
											<FormGroup controlId="password">
												<FormLabel>Password</FormLabel>
												<FormControl
													value={password}
													onChange={e => setPassword(e.target.value)}
													type="password"
													className="bg-theme3 border-0 text-white"
												/>
											</FormGroup>
											<Button block disabled={!validateForm()} type="submit">
												Register
										</Button>
									</form>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

    );
}

export default Register;