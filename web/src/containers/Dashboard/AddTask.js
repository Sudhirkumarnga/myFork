// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useRef, useState } from "react"
import { AppButton, AppInput, Layout } from "../../components"
import { Grid, Divider, CircularProgress } from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS, DAYS, criticalitylist, taskFreq } from "../../constants"
import { useSnackbar } from "notistack"
import { ReactComponent as UploadIcon } from "../../assets/svg/upload.svg"
import {
  createTask,
  deleteTask,
  deleteTaskMedia,
  getTask,
  getWorksitesDetail,
  updateTask
} from "../../api/business"
import { getSimplifiedError } from "../../utils/error"
import { updateWorksite } from "../../api/business"
import { createWorksite } from "../../api/business"
import { MultiSelect } from "react-multi-select-component"

export default function AddTask({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const hiddenFileInput = useRef(null)
  const hiddenFileInput1 = useRef(null)
  const { enqueueSnackbar } = useSnackbar()
  let token = localStorage.getItem("token")
  const { id, tid } = useParams()
  const [state, setState] = useState({
    loading: false,
    name: "",
    description: "",
    notes: "",
    criticality: "",
    frequency_of_task: "",
    files: null,
    loading: false,
    loadingDelete: false,
    loadingDeleteMedia: false,
    photos: []
  })

  const {
    loading,
    worksiteData,
    name,
    criticality,
    description,
    notes,
    frequency_of_task,
    files,
    photos,
    loadingDeleteMedia,
    loadingDelete,
    task_media
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
    if (tid) {
      _getTask()
    }
  }, [])

  const _getWorksite = async () => {
    try {
      handleChange("loading", true)
      const res = await getWorksitesDetail(id, token)
      handleChange("loading", false)
      handleChange("worksiteData", res?.data)
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

  const _getTask = async () => {
    try {
      handleChange("loading", true)
      const res = await getTask(tid, token)
      handleChange("name", res?.data?.name)
      handleChange("description", res?.data?.description)
      handleChange("notes", res?.data?.notes)
      handleChange("criticality", res?.data?.criticality)
      handleChange("frequency_of_task", res?.data?.frequency_of_task)
      handleChange("task_media", res?.data?.task_media)
      handleChange("loading", false)
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

  const _deleteTask = async () => {
    try {
      handleChange("loadingDelete", true)
      await deleteTask(tid, token)
      handleChange("loadingDelete", false)
      navigate(`/worksites/${id}`)
    } catch (error) {
      handleChange("loadingDelete", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const _deleteTaskMedia = async id => {
    try {
      handleChange("loadingDeleteMedia", true)
      await deleteTaskMedia(id, token)
      _getTask()
      handleChange("loadingDeleteMedia", false)
    } catch (error) {
      handleChange("loadingDeleteMedia", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const handleSubmit = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const formData = {
        worksite: worksiteData?.id,
        name,
        criticality,
        description,
        notes,
        frequency_of_task
      }
      const obj = {}

      photos.length > 0 &&
        photos.forEach((element, index) => {
          obj["file" + index + 1] = element
        })
      photos.length > 0 && (formData.files = obj)
      if (tid) {
        await updateTask(tid, formData, token)
      } else {
        await createTask(formData, token)
      }
      enqueueSnackbar(
        tid ? `Task has been updated!` : `Task has been created!`,
        {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        }
      )
      handleChange("loading", false)
      navigate(`/worksites/${id}`)
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
      handleChange("photos", [result])
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
              <div className="heading">{id ? "Edit Task" : "Create Task"}</div>
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
                    placeholder={"Task name"}
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
                </Grid>
                <Grid item md={6} xs={12}>
                  <AppInput
                    className="critical"
                    options={criticalitylist}
                    select
                    selectOptions={
                      <>
                        <option>Select Criticality</option>
                        {criticalitylist?.map(item => (
                          <option value={item.value}>{item.label}</option>
                        ))}
                      </>
                    }
                    value={criticality}
                    name={"criticality"}
                    onChange={handleChange}
                    placeholder={"Select Criticality"}
                  />

                  <AppInput
                    value={frequency_of_task}
                    name={"frequency_of_task"}
                    placeholder={"Frequency of task"}
                    select
                    selectOptions={
                      <>
                        <option>Select Frequency of task</option>
                        {taskFreq?.map(item => (
                          <option value={item.value}>{item.label}</option>
                        ))}
                      </>
                    }
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Grid
                containerv
                justifyItems={"flex-end"}
                spacing={3}
                className="mt-5"
              >
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
              </Grid>
              <Grid
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
                    disabled={!name || !frequency_of_task}
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
