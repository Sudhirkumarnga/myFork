import React, { useContext, useEffect, useRef, useState } from "react"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { AppButton, AppInput, HomeHeader } from "../../components"
import uploadIcon from "../../assets/svg/uploadIcon.svg"
import { COLORS } from "../../constants"
import { CircularProgress, Dialog, Divider, Grid } from "@mui/material"
import moment from "moment"
import AppContext from "../../Context"
import { createAdminProfile } from "../../api/auth"

export default function Profile({}) {
  const { enqueueSnackbar } = useSnackbar()
  const hiddenFileInput = useRef(null)
  const pathname = window.location.pathname
  const isUpdate = pathname === "/profile/update"
  const {
    _getProfile,
    adminProfile,
    _getCountries,
    cities,
    states,
    _getCities
  } = useContext(AppContext)
  const fileRef = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const user = localStorage.getItem("user")
  const userData = JSON.parse(user)
  const [state, setState] = useState({
    loading: false,
    name: adminProfile?.business_information?.name || "",
    pay_frequency: adminProfile?.business_information?.pay_frequency || "",
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
    profile_image: adminProfile?.business_information?.profile_image || "",
    gender: adminProfile?.personal_information?.gender || "",
    city: adminProfile?.business_address?.city || "",
    address_line_one: adminProfile?.business_address?.address_line_one || "",
    address_line_two: adminProfile?.business_address?.address_line_two || "",
    selectedState: adminProfile?.business_address?.state || "",
    zipcode: adminProfile?.business_address?.zipcode || "",
    photo: null,
    openCity: false,
    cityText: "",
    city_name: "",
    state_name: "",
    loadingCity: false
  })

  const {
    loading,
    name,
    pay_frequency,
    first_name,
    last_name,
    phone,
    date_of_birth,
    profile_image,
    photo,
    city,
    selectedState,
    zipcode,
    address_line_one,
    address_line_two,
    openCity,
    cityText,
    state_name,
    city_name,
    loadingCity
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    _getProfile()
    _getCountries()
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
      handleChange("name", adminProfile?.business_information?.name)
      handleChange(
        "pay_frequency",
        adminProfile?.business_information?.pay_frequency
      )
      handleChange(
        "profile_image",
        adminProfile?.business_information?.profile_image
      )
      handleChange(
        "address_line_one",
        adminProfile?.business_address?.address_line_one
      )
      handleChange(
        "address_line_two",
        adminProfile?.business_address?.address_line_two
      )
      handleChange("zipcode", adminProfile?.business_address?.zipcode)
      handleChange("city_name", adminProfile?.business_address?.city_name)
      handleChange("state_name", adminProfile?.business_address?.state_name)
    }
  }, [adminProfile])

  const handleRequest = async () => {
    try {
      handleChange("loading", true)
      const formData = {
        business_information: {
          name,
          pay_frequency: pay_frequency || "Every two weeks"
        },
        personal_information: {
          first_name,
          last_name,
          phone,
          date_of_birth: moment(date_of_birth).format("YYYY-MM-DD")
        },
        business_address: {
          address_line_one,
          address_line_two,
          city: city,
          state: selectedState,
          zipcode
        }
      }
      photo && (formData.business_information.profile_image = photo)
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

  const hideModal = () => {
    handleChange("openCity", false)
  }

  return (
    <div>
      <HomeHeader />
      <div
        className="adjustMaxWidth minheight80vh ml-5 mr-5"
        style={{  marginTop: 100 }}
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
          <Grid item xs={12}>
            <div className="heading">Business Information</div>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <AppInput
                  value={name}
                  name="name"
                  placeholder="Business Name"
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <AppInput
                  value={pay_frequency}
                  name="pay_frequency"
                  placeholder="Pay frequency"
                  select
                  selectOptions={
                    <>
                      <option value={""}>Pay frequency</option>
                      <option value={"Weekly"}>Weekly</option>
                      <option value={"Every two weeks"}>Every two weeks</option>
                      <option value={"On the 1st and 15th"}>
                        On the 1st and 15th
                      </option>
                    </>
                  }
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </Grid>
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
              value={phone}
              name="phone"
              placeholder="Mobile Number"
              onChange={handleChange}
            />
            <AppInput
              value={date_of_birth}
              name="date_of_birth"
              type={"date"}
              max={moment().format("YYYY-MM-DD")}
              placeholder="Date Of Birth"
              onChange={handleChange}
            />
            {/* <AppInput
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
            /> */}
          </Grid>
          <Grid item xs={12} md={6}>
            <div className="heading">Business Address</div>
            <AppInput
              value={address_line_one}
              name="address_line_one"
              placeholder="Business Address line 1"
              onChange={handleChange}
            />
            <AppInput
              value={address_line_two}
              name="address_line_two"
              placeholder="Business Address line 2"
              onChange={handleChange}
            />
            <div
              className="inputBox"
              onClick={() => handleChange("openCity", true)}
            >
              <div>{city_name || "City"}</div>
            </div>
            <div
              className="inputBox"
              onClick={() => handleChange("openCity", true)}
            >
              <div>{state_name || "State"}</div>
            </div>
            <AppInput
              value={zipcode}
              name="zipcode"
              placeholder="Zip Code"
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
                !first_name || !last_name || !phone || !date_of_birth || !name
                // ||
                // !pay_frequency
              }
              onClick={handleRequest}
              title={"Submit"}
            />
          </Grid>
        </Grid>
      </div>
      <Dialog open={openCity} onClose={hideModal}>
        <div className={"zipModal"}>
          <AppInput
            value={cityText}
            name="cityText"
            placeholder={"Search City"}
            onChange={(name, text) => {
              _getCities(`?search=${cityText}`)
              handleChange(name, text)
            }}
          />
          {loadingCity && <CircularProgress />}
          {cities?.map((item, index) => (
            <div
              onClick={() => {
                handleChange("openCity", false)
                handleChange("cityText", "")
                handleChange("city", item?.id)
                handleChange("city_name", item?.name)
                handleChange("state_name", item?.region?.name)
                handleChange("selectedState", item?.region?.id)
              }}
              key={index}
              style={{
                width: "100%",
                height: 30,
                justifyContent: "center",
                borderBottomWidth: 1,
                borderBottomColor: COLORS.borderColor
              }}
            >
              <div
                style={{
                  color: COLORS.darkBlack,
                  cursor: "pointer"
                }}
              >
                {item?.name}
              </div>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  )
}
