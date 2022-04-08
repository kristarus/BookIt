import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import ButtonLoader from "../layout/ButtonLoader";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, clearErrors } from "../../redux/actions/userActions";
import { UPDATE_PROFILE_RESET } from "../../redux/constants/userConstants";
import Loader from "../layout/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = {
      email,
    };

    dispatch(forgotPassword(userData));
  };

  const { error, loading, message } = useSelector((state) => state.forgotPassword);

  useEffect(() => {
    if (error) {
      console.log({ error });
      toast.error(error);
      dispatch(clearErrors());
    }

    if (message) {
      toast.success(message);
    }
  }, [dispatch, message, error]);

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form onSubmit={submitHandler} className="shadow-lg">
          <h1 className="mb-3">Forgot Password</h1>
          <div className="form-group">
            <label htmlFor="email_field">Enter Email</label>
            <input
              type="email"
              id="email_field"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            id="forgot_password_button"
            type="submit"
            disabled={loading}
            className="btn btn-block py-3"
          >
            {loading ? <ButtonLoader /> : "SEND EMAIL"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
