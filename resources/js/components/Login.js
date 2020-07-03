import React, { useState, useEffect } from "react";
import { Button, FormGroup, FormControl, FormLabel } from "react-bootstrap";
import ReactDOM from 'react-dom';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [token, setToken] = useState("");
	const [username, setUsername] = useState("");
	const [userid, setUserid] = useState("");

    function validateForm() {
        return email.length > 0 && password.length > 0;
	}
	
	useEffect(() => {
        document.body.style.backgroundColor = "#2C2C33";
      }, []);

    function handleSubmit(event) {
        event.preventDefault();
        fetch("http://" + window.location.host + "/api/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: JSON.stringify({email: email, password: password})
        })
            .then(res => res.json())
            .then(
                (result) => {
					setToken(result.token);
					setUsername(result.username);
					setUserid(result.userid);
					localStorage.setItem('token', result.token);
					localStorage.setItem('username', result.username);
					localStorage.setItem('userid', result.userid);
					window.location.replace(window.location.host + "/user/me/me/tags");
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
									<div className="Login" className="w-100">
										<form onSubmit={handleSubmit}>
											<FormGroup controlId="email">
												<FormLabel>Email</FormLabel>
												<FormControl
													autoFocus
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
												Login
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

export default Login;