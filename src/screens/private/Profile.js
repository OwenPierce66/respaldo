import React, { Fragment, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import Axios from "axios";
import ProfilePicture from "./ProfileImageUpload";
import Breadcrumbs from "../misc/Breadcrumbs";
import {updateUser} from "../../store/actions/auth";

function Profile({ user, subscriptionStatus }) {
  const dispatch = useDispatch()
  const [showPhotoAdd, setShowPhotoAdd] = useState(false)
  const [editData, setEditData] = useState({
    first_name: user.first_name || '',
    last_name: user.last_name || '',
    username: user.username || '',
    email: user.email || '',
    phone_number: user.profile.phone_number || '',
    image: user.profile.image || '',
  })

  const handleChange = e => {
    setEditData({ ...editData, [e.target.name]: e.target.value })
  }

  const handleSubmit = e => {
    e.preventDefault()

    Axios.put(
      `http://127.0.0.1:8000/api/edit-user/`,
      {
        first_name: editData.first_name,
        last_name: editData.last_name,
        username: editData.username,
        email: editData.email,
        phone_number: editData.phone_number,
        image: editData.image,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    ).then(response => {
      dispatch(updateUser(response.data.user))
    }).catch((error) => {
      console.warn("Not good man :(", error);
    });
  }

  return (
    <Fragment>
      <div className="profile-breadcrumbs">
        <Breadcrumbs crumbs={[ { label: 'Profile' } ]} />
      </div>
      <div className="profileContainer">
        <div className="profileWrapper">
          <div className={showPhotoAdd ? 'rowAddPhotoShow' : 'rowAddPhoto'}>
            <div className="UPP">
              <button
                className="ClosePictureUpload"
                onClick={() => setShowPhotoAdd(!showPhotoAdd)}
              >
                <i className="fas fa-window-close"></i>
              </button>
              <div className="">
                <ProfilePicture user={user} />
              </div>
            </div>
          </div>

          <div className={showPhotoAdd ? 'topCardHide' : 'topCard'}>
            <div className="banner">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcSBgK5cH3qeoFP_q_T_HP9x9lUzqTR7A19A6A&usqp=CAU" />{" "}
            </div>
            <div className="profileInfo">
              <div className="row">
                <div
                  onClick={() => setShowPhotoAdd(!showPhotoAdd)}
                  className="flex-wrapper"
                >
                  <img
                    className="profileLogo"
                    src={
                      user.profile.image
                        ? user.profile.image
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuUIseBsvJgFgOBzFthISFzE6gkHosm-DszQ&usqp=CAU"
                    }
                  />
                  <button>
                    <i className="fas fa-edit"></i>
                  </button>
                </div>
                <div className="profileName">
                  {editData.first_name}{" "}
                  {editData.last_name}
                </div>
              </div>

              <div className="row">
                <div className="subscriptionWrapper">
                  <div className="row">
                    <p>Subscription Status:</p>
                    {subscriptionStatus.active ? <p className="active">Active</p> : <p className="inactive">Inactive</p>}
                  </div>
                  <div className="row">
                    <Link
                      to="/dashboard/subscription"
                      className="subButton"
                    >
                      Manage Subscription
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="profileWrapper">
          <div className="profileTitle">Profile</div>

          <div className="inputWrapper">
            <div>
              <form className="profileInput" onSubmit={handleSubmit}>
                <div className="pInput">
                  <label>First Name</label>
                  <input
                    type="text"
                    className="ppInput"
                    value={editData.first_name}
                    name="first_name"
                    onChange={handleChange}
                  />
                </div>

                <div className="pInput">
                  <label>Last Name</label>
                  <input
                    type="text"
                    className="ppInput"
                    value={editData.last_name}
                    onChange={handleChange}
                    name="last_name"
                  />
                </div>

                <div className="pInput">
                  <label>Username</label>
                  <input
                    type="text"
                    className="ppInput"
                    value={editData.username}
                    name="username"
                    onChange={handleChange}
                  />
                </div>

                <div className="pInput">
                  <label>Email</label>
                  <input
                    type="text"
                    className="ppInput"
                    value={editData.email}
                    name="email"
                    onChange={handleChange}
                  />
                </div>

                <div className="pInput">
                  <label>Phone</label>
                  <input
                    type="text"
                    className="ppInput"
                    value={editData.phone_number}
                    name="phone_number"
                    onChange={handleChange}
                  />
                </div>
                <div className="EditBtnUserWrapper">
                  <button type="submit" className="EditBtnUser">Save</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

function mapStateToProps(state) {
  return {
    user: state.auth.user,
    subscriptionStatus: state.auth.subscriptionStatus,
  };
}

export default connect(mapStateToProps)(Profile);
