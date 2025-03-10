import React from 'react'
import "../styles/forgetPwd.css";
const ForgetPwd = () => {
  return (
        <div className="forgetpwd-container">
        <div className="forgetpwd-box">
            <h1 className="forgetpwd-title">Reset Your Password</h1>
            <form className="forgetpwd-form">
            <div className="form-group">
                <input
                type="email"
                placeholder="Email Address"
                    className="forgetpwd-input"
                />
            </div>
            <button type="submit" className="forgetpwd-button">
                Send Reset Link
            </button>
            </form>
        </div>
    </div>
  )
}

export default ForgetPwd