import React, { useState } from "react";
import { login } from "../api/auth";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password, dispatch, loginSuccess);

      if (result.success) {
        navigate("/"); // Redirect to home page
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '100px' }}>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Login</h4>
            </div>

            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      type="email"
                      className="form-control"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <span className="input-group-addon">
                      <i className="glyphicon glyphicon-user"></i>
                    </span>
                  </div>
                </div>

                <div className="form-group mb-3">
                  <div className="input-group">
                    <input
                      type="password"
                      className="form-control"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span className="input-group-addon">
                      <i className="glyphicon glyphicon-lock"></i>
                    </span>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="submit"
                    className="form-control btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  {loading && (
                    <div className="progress">
                      <div
                        className="progress-bar progress-bar-primary"
                        role="progressbar"
                        style={{ width: "100%" }}
                      >
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                </div>
              </form>

              <div className="text-center mt-3">
                <p>
                  Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;