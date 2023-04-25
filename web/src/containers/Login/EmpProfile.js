import React, { useContext, useEffect, useRef, useState } from "react"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { AppButton, AppInput, HomeHeader } from "../../components"
import uploadIcon from "../../assets/svg/uploadIcon.svg"
import { COLORS } from "../../constants"
import { Divider, Grid } from "@mui/material"
import moment from "moment"
import AppContext from "../../Context"
import { createAdminProfile } from "../../api/auth"

export default function EmpProfile({}) {
  const { enqueueSnackbar } = useSnackbar()
  const hiddenFileInput = useRef(null)
  const pathname = window.location.pathname
  const isUpdate = pathname === "/profile/update"
  const { _getProfile, adminProfile } = useContext(AppContext)
  const fileRef = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const userData = JSON.parse(user)
  const [state, setState] = useState({
    loading: false,
    first_name:
      adminProfile?.personal_information?.first_name ||
      userData?.first_name ||
      "",
    last_name:
      adminProfile?.personal_information?.last_name ||
      userData?.last_name ||
      "",
    phone: adminProfile?.personal_information?.phone || "",
    date_of_birth: adminProfile?.personal_information?.date_of_birth || "",
    profile_image: adminProfile?.personal_information?.profile_image || "",
    gender: adminProfile?.personal_information?.gender || "",
    first_name1: adminProfile?.emergency_contact?.first_name || "",
    last_name1: adminProfile?.emergency_contact?.last_name || "",
    phone1: adminProfile?.emergency_contact?.phone || userData?.phone || "",
    photo: null,
    validNumber: userData?.phone ? true : false
  })

  const {
    loading,
    first_name,
    last_name,
    phone,
    gender,
    first_name1,
    last_name1,
    phone1,
    date_of_birth,
    profile_image,
    photo,
    validNumber
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    _getProfile()
  }, [])
  useEffect(() => {
    if (adminProfile) {
      handleChange("first_name", adminProfile?.personal_information?.first_name)
      handleChange("last_name", adminProfile?.personal_information?.last_name)
      handleChange("phone", adminProfile?.personal_information?.phone)
      handleChange(
        "date_of_birth",
        adminProfile?.personal_information?.date_of_birth
      )
      handleChange("gender", adminProfile?.personal_information?.gender)
      handleChange(
        "profile_image",
        adminProfile?.personal_information?.profile_image
      )
      handleChange("first_name1", adminProfile?.emergency_contact?.first_name)
      handleChange("last_name1", adminProfile?.emergency_contact?.last_name)
      handleChange("phone1", adminProfile?.emergency_contact?.phone)
    }
  }, [adminProfile])

  const handleRequest = async () => {
    try {
      handleChange("loading", true)
      const formData = {
        personal_information: {
          // profile_image: photo,
          first_name,
          last_name,
          phone,
          date_of_birth: moment(date_of_birth).format("YYYY-MM-DD"),
          gender
        },
        emergency_contact: {
          first_name: first_name1,
          last_name: last_name1,
          phone: phone1
        }
      }
      photo && (formData.personal_information.profile_image = photo)
      await createAdminProfile(formData, token)
      handleChange("loading", false)
      navigate("/dashboard")
      enqueueSnackbar(`Your profile has been updated`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    } catch (error) {
      handleChange("loading", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const getBase64 = (file, cb) => {
    let reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      cb(reader.result)
    }
    reader.onerror = function (error) {
      console.log("Error: ", error)
    }
  }

  const handleChangeImage = event => {
    const fileUploaded = event.target.files[0]
    getBase64(fileUploaded, result => {
      handleChange("photo", result)
    })
  }

  return (
    <div>
      <HomeHeader />
      <div
        className="container adjustMaxWidth minheight80vh"
        style={{ marginTop: 100 }}
      >
        <div className="headingrowBetween align-items-center">
          <div className="">
            <div className="heading">
              {isUpdate ? "Update Profile" : "Create Profile"}
            </div>
          </div>
          <div>
            <img
              src={photo || profile_image || uploadIcon}
              onClick={() => hiddenFileInput.current.click()}
              className="profile_image"
            />
            <input
              type="file"
              accept="image/*"
              ref={hiddenFileInput}
              onChange={handleChangeImage}
              style={{ display: "none" }}
            />
          </div>
        </div>
        <Divider className="mt-4 mb-4" />
        <Grid container spacing={3}>
          <Grid item md={6} xs={12}>
            <div className="heading">Personal information</div>
            <AppInput
              value={first_name}
              name="first_name"
              placeholder="First Name"
              onChange={handleChange}
            />
            <AppInput
              value={last_name}
              name="last_name"
              placeholder="Last Name"
              onChange={handleChange}
            />
            <AppInput
              value={date_of_birth}
              name="date_of_birth"
              type={"date"}
              max={moment().format("YYYY-MM_DD")}
              placeholder="Date Of Birth"
              onChange={handleChange}
            />
            <AppInput
              value={gender}
              name="gender"
              select
              selectOptions={
                <>
                  <option value={""}>Gender</option>
                  <option value={"MALE"}>Male</option>
                  <option value={"FEMALE"}>Female</option>
                </>
              }
              placeholder="Date Of Birth"
              onChange={handleChange}
            />
            <AppInput
              value={phone}
              name="phone"
              placeholder="Mobile Number"
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="heading">Emergency Contact</div>
            <AppInput
              value={first_name1}
              name="first_name1"
              placeholder="First Name"
              onChange={handleChange}
            />
            <AppInput
              value={last_name1}
              name="last_name1"
              placeholder="Last Name"
              onChange={handleChange}
            />
            <AppInput
              value={phone1}
              name="phone1"
              placeholder="Mobile Number"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent={"flex-end"} className="mt-4 mb-4">
          <Grid item xs={12} md={4}>
            <AppButton
              borderRadius={10}
              backgroundColor={COLORS.primary}
              color={COLORS.white}
              loading={loading}
              disabled={
                !first_name ||
                !last_name ||
                !phone ||
                !date_of_birth ||
                !gender ||
                !first_name1 ||
                !last_name1 ||
                !phone1
              }
              onClick={handleRequest}
              title={"Submit"}
            />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
