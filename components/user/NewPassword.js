import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import ButtonLoader from "../layout/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearErrors } from "../../redux/actions/userActions";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const submitHandler = (e) => {
    e.preventDefault();

    const passwords = {
      password,
      confirmPassword,
    };

    dispatch(resetPassword(router.query.token, passwords));
  };

  const { error, loading, success } = useSelector((state) => state.resetPassword);

  useEffect(() => {
    console.log(success, error);
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      router.push("/login");
    }
  }, [dispatch, success, error]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-3">New Password</h1>

          <div className="form-group">
            <label htmlFor="password_field">Password</label>
            <input
              type="password"
              id="password_field"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password_field">Confirm Password</label>
            <input
              type="password"
              id="confirm_password_field"
              className="form-control"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            disabled={loading}
            className="btn btn-block py-3"
          >
            {loading ? <ButtonLoader /> : "SET PASSWORD"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
