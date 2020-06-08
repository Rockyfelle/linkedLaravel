import React from 'react';
import ReactDOM from 'react-dom';

function Test() {
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card text-light border-0" style={{backgroundColor: "#3B3B45"}}>
                        <div className="m-3">
                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right"></label>

                                <div className="col-md-6">
                                    <input id="email" type="email" className="form-control @error('email') is-invalid @enderror" name="email" required autoComplete="email" autoFocus />

                                        <span className="invalid-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                </div>
                            </div>

                            <div className="form-group row">
                                <label className="col-md-4 col-form-label text-md-right"></label>

                                <div className="col-md-6">
                                    <input id="password" type="password" className="form-control @error('password') is-invalid @enderror" name="password" required autoComplete="current-password" />

                                        <span className="invalid-feedback" role="alert">
                                            <strong></strong>
                                        </span>
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="col-md-6 offset-md-4">
                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="remember" id="remember" />

                                        <label className="form-check-label">
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Test;

if (document.getElementById('root')) {
    ReactDOM.render(<Test />, document.getElementById('root'));
}
