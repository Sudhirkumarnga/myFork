// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useRef, useState } from "react"
import { AppButton, AppInput, Layout } from "../../components"
import { Grid, Divider, CircularProgress, Switch } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS, DAYS } from "../../constants"
import { useSnackbar } from "notistack"
import Sample from "../../assets/images/sample.png"
import { ReactComponent as UploadIcon } from "../../assets/svg/upload.svg"
import { ReactComponent as EditIcon } from "../../assets/svg/edit.svg"
import { ReactComponent as AddIcon } from "../../assets/svg/add.svg"
import {
  deleteEmployee,
  getEmployee,
  getWorksitesDetail
} from "../../api/business"
import moment from "moment"
import { getSimplifiedError } from "../../utils/error"
import { updateWorksite } from "../../api/business"
import { createWorksite } from "../../api/business"
import { MultiSelect } from "react-multi-select-component"

export default function AddWorksite({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const hiddenFileInput = useRef(null)
  const hiddenFileInput1 = useRef(null)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const [state, setState] = useState({
    loading: false,
    name: "",
    location: "",
    description: "",
    notes: "",
    monthly_rates: "",
    clear_frequency_by_day: [],
    desired_time: "",
    number_of_workers_needed: "",
    supplies_needed: "",
    upload_instruction_video_link: "",
    contact_person_name: "",
    contact_phone_number: "",
    show_dtails: false,
    // profile_image:  '',
    logo: null,
    instruction_video: null,
    loading: false,
    opened: false,
    desired_time_text: new Date(),
    openStart: false,
    validNumber: false,
    worksiteData: null
  })

  const {
    loading,
    worksiteData,
    name,
    location,
    description,
    notes,
    monthly_rates,
    clear_frequency_by_day,
    desired_time,
    number_of_workers_needed,
    supplies_needed,
    contact_person_name,
    contact_phone_number,
    show_dtails,
    logo,
    instruction_video,
    opened,
    desired_time_text,
    openStart,
    validNumber,
    upload_instruction_video_link
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    if (id) {
      _getWorksite()
    }
  }, [])

  const _getWorksite = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const res = await getWorksitesDetail(id, token)
      handleChange("loading", false)
      console.log("res?.data", res?.data)
      handleChange("worksiteData", res?.data)
      handleChange("name", res?.data?.personal_information?.name)
      handleChange("location", res?.data?.personal_information?.location)
      handleChange("description", res?.data?.personal_information?.description)
      handleChange("notes", res?.data?.personal_information?.notes)
      handleChange(
        "clear_frequency_by_day",
        getOptions(res?.data?.personal_information?.clear_frequency_by_day)
      )
      handleChange(
        "desired_time",
        res?.data?.personal_information?.desired_time
      )
      handleChange(
        "supplies_needed",
        res?.data?.personal_information?.supplies_needed
      )
      handleChange(
        "number_of_workers_needed",
        res?.data?.personal_information?.number_of_workers_needed
      )
      handleChange(
        "contact_person_name",
        res?.data?.contact_person?.contact_person_name
      )
      handleChange(
        "contact_phone_number",
        res?.data?.contact_person?.contact_phone_number
      )
      handleChange("show_dtails", res?.data?.show_dtails)
      handleChange("logo", res?.data?.personal_information?.logo)
      handleChange(
        "instruction_video",
        res?.data?.personal_information?.instruction_video
      )
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

  const getValues = values => {
    const list = []
    values?.map(value => {
      list.push(value?.value)
    })
    return list
  }

  const getOptions = values => {
    const list = []
    if (Array.isArray(values)) {
      values?.map(value => {
        list.push({ label: value, value: value })
      })
    }else{
      list.push({ label: values, value: values })
    }
    return list
  }

  const handleSubmit = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const formData = {
        worksite_information: {
          name,
          location,
          description,
          notes,
          monthly_rates,
          clear_frequency_by_day: getValues(clear_frequency_by_day),
          desired_time,
          number_of_workers_needed: number_of_workers_needed || "1",
          supplies_needed
        },
        contact_person: {
          contact_person_name,
          contact_phone_number
        },
        show_dtails
      }
      logo && (formData.logo = logo)
      instruction_video && (formData.instruction_video = instruction_video)
      upload_instruction_video_link &&
        (formData.upload_instruction_video_link = upload_instruction_video_link)
      if (worksiteData) {
        await updateWorksite(worksiteData?.id, formData, token)
        enqueueSnackbar(`Worksite has been updated!`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      } else {
        await createWorksite(formData, token)
        enqueueSnackbar(`Worksite has been added!`, {
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
      handleChange("logo", result)
    })
  }

  const handleChangeImage1 = event => {
    const fileUploaded = event.target.files[0]
    getBase64(fileUploaded, result => {
      handleChange("upload_instruction_video_link", result)
    })
  }

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">
                {id ? "Edit Worksite" : "Add Worksite"}
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
            spacing={1}
            className="mt-4"
          >
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item md={6} xs={12}>
                  <div className="heading font-18">
                    {"Worksite Information"}
                  </div>
                  <AppInput
                    value={name}
                    name={"name"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Worksite Name"}
                  />
                  <AppInput
                    value={location}
                    name={"location"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Worksite Location"}
                  />
                  <AppInput
                    value={description}
                    name={"description"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Description"}
                  />
                  <AppInput
                    value={notes}
                    name={"notes"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Notes"}
                  />
                  <AppInput
                    value={monthly_rates}
                    name={"monthly_rates"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Monthly rate"}
                  />
                  <MultiSelect
                    options={DAYS}
                    value={clear_frequency_by_day}
                    overrideStrings={{
                      selectSomeItems: "Cleaning frequency by day"
                    }}
                    onChange={props =>
                      handleChange("clear_frequency_by_day", props)
                    }
                    className="dropdown"
                    labelledBy="Cleaning frequency by day"
                  />
                </Grid>
                <Grid item md={6} xs={12}>
                  <div className="heading font-18">{"Address information"}</div>
                  <AppInput
                    value={desired_time}
                    name={"desired_time"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Desired time"}
                  />
                  <AppInput
                    value={number_of_workers_needed}
                    name={"number_of_workers_needed"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Number of workers needed"}
                  />
                  <AppInput
                    value={supplies_needed}
                    name={"supplies_needed"}
                    onChange={handleChange}
                    className="mb-5 mt-3"
                    placeholder={"Supplies needed"}
                  />
                  <Grid container justifyContent={"space-between"}>
                    <div className="heading font-18">{"Contact Person"}</div>
                    <div>
                      <input
                        type="checkbox"
                        id="vehicle1"
                        name="vehicle1"
                        className="mr-2"
                        onClick={() =>
                          handleChange("show_dtails", !show_dtails)
                        }
                        value={show_dtails}
                      />
                      <span>Show details</span>
                    </div>
                  </Grid>
                  <AppInput
                    value={contact_person_name}
                    name={"contact_person_name"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Name"}
                  />
                  <AppInput
                    value={contact_phone_number}
                    name={"contact_phone_number"}
                    onChange={handleChange}
                    className="mb-3 mt-3"
                    placeholder={"Phone Number"}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={3} className="mt-5">
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Upload worksite logo"}
                    onClick={() => hiddenFileInput.current.click()}
                    borderColor={COLORS.primary}
                    prefix={<UploadIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    ref={hiddenFileInput}
                    onChange={handleChangeImage}
                    style={{ display: "none" }}
                  />
                </Grid>
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Upload instruction video"}
                    onClick={() => hiddenFileInput1.current.click()}
                    borderColor={COLORS.primary}
                    prefix={<UploadIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                  <input
                    type="file"
                    accept="video/*"
                    ref={hiddenFileInput1}
                    onChange={handleChangeImage1}
                    style={{ display: "none" }}
                  />
                </Grid>
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Save"}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={
                      !name ||
                      !location ||
                      clear_frequency_by_day.length === 0 ||
                      !desired_time ||
                      !contact_person_name ||
                      !contact_phone_number
                    }
                    backgroundColor={COLORS.primary}
                    borderRadius={12}
                    color={COLORS.white}
                  />
                </Grid>
                {/* <Grid item md={6} lg={3} xs={12}>
                  <AppButton
                    title={"Edit"}
                    // onClick={handleSubmit}
                    borderColor={COLORS.primary}
                    prefix={<EditIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                </Grid>
                <Grid item md={6} lg={3} xs={12}>
                  <AppButton
                    title={"Create a task"}
                    // onClick={handleSubmit}
                    borderColor={COLORS.primary}
                    prefix={<AddIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                </Grid> */}
              </Grid>
              {/* <Grid
                container
                spacing={3}
                justifyContent={"flex-end"}
                className="mt-5"
              >
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Save"}
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={
                      !name ||
                      !location ||
                      clear_frequency_by_day.length === 0 ||
                      !desired_time ||
                      !contact_person_name ||
                      !contact_phone_number
                    }
                    backgroundColor={COLORS.primary}
                    borderRadius={12}
                    color={COLORS.white}
                  />
                </Grid>
              </Grid> */}
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
