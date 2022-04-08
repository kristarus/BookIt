import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import Link from "next/link";
import { MDBDataTable } from "mdbreact";
import Loader from "../layout/Loader";
import { updateUser, getUserDetails, clearErrors } from "../../redux/actions/userActions";
import { UPDATE_USER_RESET } from "../../redux/constants/userConstants";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const { error, isUpdated } = useSelector((state) => state.user);
  const { user, loading } = useSelector((state) => state.userDetails);

  const userId = router.query.id;

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearErrors());
    }

    if (user && user._id === userId) {
      setName(user.name);
      setEmail(user.email);
      setRole(user.role);
    }

    if (userId && user?._id !== userId) {
      dispatch(getUserDetails(userId));
    }

    if (isUpdated) {
      router.push("/admin/users");
      dispatch({ type: UPDATE_USER_RESET });
    }
  }, [dispatch, error, isUpdated, userId, user]);

  const submitHandler = (e) => {
    e.preventDefault();

    const userData = { name, email, role };

    console.log(userData);

    dispatch(updateUser(user._id, userData));
  };

  return (
    <div classNameName="container container-fluid">
      {loading ? (
        <Loader />
      ) : (
        <div className="container container-fluid">
          <div className="row wrapper">
            <div className="col-10 col-lg-5">
              <form onSubmit={submitHandler} className="shadow-lg">
                <h1 className="mt-2 mb-5">Update User</h1>

                <div className="form-group">
                  <label htmlFor="name_field">Name</label>
                  <input
                    type="name"
                    id="name_field"
                    className="form-control"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email_field">Email</label>
                  <input
                    type="email"
                    id="email_field"
                    className="form-control"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="role_field">Role</label>

                  <select
                    id="role_field"
                    className="form-control"
                    name="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                  </select>
                </div>

                <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                  Update
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateUser;
