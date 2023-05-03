// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useRef, useState } from "react"
import { AppButton, AppInput, Layout } from "../../components"
import { Grid, Divider, CircularProgress, Switch } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import Sample from "../../assets/images/sample.png"
import { ReactComponent as MessageIcon } from "../../assets/svg/message.svg"
import { ReactComponent as EditIcon } from "../../assets/svg/edit.svg"
import { ReactComponent as DeleteIcon } from "../../assets/svg/delete.svg"
import {
  createEmployee,
  deleteEmployee,
  getEmployee,
  updateEmployee
} from "../../api/business"
import moment from "moment"
import { getSimplifiedError } from "../../utils/error"

export default function AddEmployee({}) {
  const navigate = useNavigate()
  const { _getCountries, states, cities, loadingCity, _getCities } =
    useContext(AppContext)
  const ref = useRef()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const { id } = useParams()
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    employee: null,
    type: "text"
  })

  const {
    loading,
    first_name,
    last_name,
    phone,
    mobile,
    date_of_birth,
    type,
    address_line_one,
    address_line_two,
    selectedState,
    city,
    profile_image,
    photo,
    price,
    gender,
    email,
    position,
    validNumber,
    validNumber1,
    cityText,
    openCity,
    city_name,
    state_name
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getCountries()
    if (id) {
      _getEmployee()
    }
  }, [])

  const _getEmployee = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const res = await getEmployee(id, token)
      handleChange("loading", false)
      handleChange(
        "first_name",
        res?.data?.response?.personal_information?.first_name || ""
      )
      handleChange(
        "last_name",
        res?.data?.response?.personal_information?.last_name || ""
      )
      handleChange(
        "date_of_birth",
        res?.data?.response?.personal_information?.date_of_birth || ""
      )
      handleChange(
        "profile_image",
        res?.data?.response?.personal_information?.profile_image || ""
      )
      handleChange("phone", res?.data?.response?.contact?.phone || "")
      handleChange("mobile", res?.data?.response?.contact?.mobile || "")
      handleChange("email", res?.data?.response?.contact?.email || "")
      handleChange(
        "address_line_one",
        res?.data?.response?.address_information?.address_line_one || ""
      )
      handleChange(
        "address_line_two",
        res?.data?.response?.address_information?.address_line_two || ""
      )
      handleChange("city", res?.data?.response?.address_information?.city || "")
      handleChange(
        "selectedState",
        res?.data?.response?.address_information?.state || ""
      )
      handleChange(
        "position",
        res?.data?.response?.work_information?.position || ""
      )
      handleChange(
        "price",
        res?.data?.response?.work_information?.hourly_rate?.toString() || ""
      )
    } catch (error) {
      handleChange("loading", false)
      const showWError = Object.values(error.response?.data?.error)
      if (showWError.length > 0) {
        alert(`Error: ${JSON.stringify(showWError[0])}`)
      } else {
        alert(`Error: ${JSON.stringify(error)}`)
      }
    }
  }

  const getStateText = value => {
    const filtered = cities?.find(e => e?.id == value)
    console.log("filtered", filtered)
    handleChange("selectedState", filtered?.region?.id)
  }

  const handleSubmit = async () => {
    try {
      handleChange("loading", true)
      const formData = {
        personal_information: {
          // profile_image: photo,
          first_name,
          last_name,
          date_of_birth: moment(date_of_birth).format("YYYY-MM-DD"),
          gender
        },
        contact: {
          email,
          mobile,
          phone
        },
        address_information: {
          address_line_one,
          address_line_two,
          city: city,
          state: selectedState?.toString()
        },
        work_information: {
          position: position || "Cleaner",
          hourly_rate: price ? Number(price) : 0
        }
      }
      photo && (formData.personal_information.profile_image = photo)
      console.log("formData", formData)
      if (id) {
        await updateEmployee(id, formData, token)
        enqueueSnackbar(`Employee has been updated!`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      } else {
        await createEmployee(formData, token)
        navigate(-1)
        enqueueSnackbar(`Employee has been added!`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      }
      handleChange("loading", false)
      navigate(-1)
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

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">
                {id ? "Edit Employees" : "Add Employees"}
              </div>
            </div>
          </div>
          <Divider className="mt-4" />
          {loading && (
            <div className="d-flex mt-4 justify-content-center">
              <CircularProgress />
            </div>
          )}
          <Grid
            container
            justifyContent={"space-between"}
            spacing={3}
            className="mt-4"
          >
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <div className="heading font-18">
                    {"Personal information"}
                  </div>
                  <AppInput
                    value={first_name}
                    name={"first_name"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"First Name"}
                  />
                  <AppInput
                    value={last_name}
                    name={"last_name"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Last Name"}
                  />
                  <AppInput
                    value={date_of_birth}
                    onFocus={() => handleChange("type", "date")}
                    onBlur={() => handleChange("type", "text")}
                    name={"date_of_birth"}
                    type={date_of_birth ? "date" : type}
                    max={moment().format("YYYY-MM-DD")}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Date of Birth"}
                  />
                  <div className="heading font-18">{"Contact"}</div>
                  <AppInput
                    value={email}
                    name={"email"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Email Address"}
                  />
                  <AppInput
                    value={mobile}
                    name={"mobile"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Mobile Number"}
                  />
                  <AppInput
                    value={phone}
                    name={"phone"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Phone Number"}
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <div className="heading font-18">{"Address information"}</div>
                  <AppInput
                    value={address_line_one}
                    name={"address_line_one"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Address line 1"}
                  />
                  <AppInput
                    value={address_line_two}
                    name={"address_line_two"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Address line 2"}
                  />
                  <AppInput
                    value={city}
                    name={"city"}
                    select
                    selectOptions={
                      <>
                        <option value={""}>Select City</option>
                        {cities?.map((item, index) => (
                          <option key={index} value={item?.id}>
                            {item?.name}
                          </option>
                        ))}
                      </>
                    }
                    onChange={(key, value) => {
                      handleChange(key, value)
                      getStateText(value)
                      // handleChange("selectedState", item?.region?.id)
                    }}
                    className="mb-3 mt-3"
                    placeholder={"Address line 2"}
                  />
                  <div className="heading font-18">{"Work information"}</div>
                  <AppInput
                    value={position}
                    name={"position"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Position"}
                  />
                  <AppInput
                    value={price}
                    name={"price"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Hourly rate"}
                  />
                </Grid>
              </Grid>
              <Grid
                container
                spacing={3}
                justifyContent={"flex-end"}
                className="mt-5"
              >
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Submit"}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={
                      !first_name ||
                      !last_name ||
                      !date_of_birth ||
                      !email ||
                      !mobile ||
                      !address_line_one ||
                      !city ||
                      !selectedState
                    }
                    backgroundColor={COLORS.primary}
                    borderRadius={12}
                    color={COLORS.white}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
