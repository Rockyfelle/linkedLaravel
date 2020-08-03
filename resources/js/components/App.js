import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch, Link, useParams} from 'react-router-dom';
import Test from './Test'
import Login from './Login'
import Register from './Register'
import oldTags from './oldTags'
import oldTag from './oldTag'
import Newlink from './Newlink'
import Editlink from './Editlink'
import Edittag from './Edittag'
import Friends from './Friends'
import oldView from './oldView'
import Tag from './Tag'
import View from './View'
import 'bootstrap/dist/css/bootstrap.css';



function testf() {
	let a = {tagname} = useParams();
	return a;
}
function App() {
	const [token, setToken] = React.useState(
		localStorage.getItem('token') || ''
	);
	const [username, setUsername] = React.useState(
        localStorage.getItem('username') || ''
	);
	const [userid, setUserid] = React.useState(
        localStorage.getItem('userid') || ''
	);

    return (
        <Router>
			<div id="app">
				<nav className="navbar navbar-expand-md navbar-light bg-dark shadow-sm p-0">
					<div className="container m-0 min-vw-100">
						<Link className="navbar-brand text-light" to={`/user/${username}/${userid}/tags`} style={{fontSize: "30px"}}>
							Linked
						</Link>
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="">
							<span className="navbar-toggler-icon"></span>
						</button>

						<div className="collapse navbar-collapse" id="navbarSupportedContent">

								<ul className="navbar-nav ml-auto" style={{float: "right"}}>
									{(token == "") &&
										<React.Fragment>
											<li className="nav-item">
												<a className="nav-link" href="{{ route('login') }}">Login</a>
											</li>
											<li className="nav-item">
												<a className="nav-link" href="{{ route('register') }}">Register</a>
											</li>
										</React.Fragment>
									}
									{(token != "") &&
										<React.Fragment>
											<li className="nav-item">
												<Link className="nav-link text-light" to={"/user/" + username + "/" + userid + "/tags/"}>My Tags</Link>
											</li>
											<li className="nav-item">
												<Link className="nav-link text-light" to={"/user/" + username + "/" + userid + "/friends/"}>Friends</Link>
											</li>
											<li className="nav-item">
												<Link className="nav-link text-light" to={"/user/" + username + "/" + userid + "/view"}>{username}</Link>
											</li>
											<li className="nav-item">
												<Link className="nav-link text-light" to={"/login"}>Logout</Link>
											</li>
										</React.Fragment>
									}
							</ul>
						</div>
					</div>
				</nav>

				<div className="py-4">
						<Switch>
							<Route path="/" component={View} exact />
							<Route path="/test" component={Test} />
							<Route path="/login" component={Login} />
							<Route path="/register" component={Register} />
							<Route path="/user/:username/:userId/oldtags" component={oldTags} />
							<Route path="/user/:username/:userId/oldtag/:tagname/:tagId/:tagPerm?" component={oldTag} />
							<Route path="/user/:username/:userId/newlink" component={Newlink} />
							<Route path="/user/:username/:userId/editlink/:tagname/:tagId/:linkname/:linkId" component={Editlink} />
							<Route path="/user/:username/:userId/edittag/:tagname/:tagId/" component={Edittag} />
							<Route path="/user/:username/:userId/friends" component={Friends} />
							<Route path="/user/:username/:userId/oldview" component={oldView} />
							<Route path="/user/:username/:userId/view" component={View} />
							<Route path="/user/:username/:userId/tag/:tagname/:tagId/:tagPerm?" component={Tag} />
							<Route component={Error} />
						</Switch>
				</div>
			</div>
        </Router>
    );
}

export default App;

if (document.getElementById('root')) {
    ReactDOM.render(<App />, document.getElementById('root'));
}
