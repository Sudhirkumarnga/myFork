import React, { useEffect, useRef, useState } from "react"
import { MultiSelect } from "react-multi-select-component"
import {
  createInspectionReport,
  getWorksitesInspection,
  getWorksitesTasks
} from "../../api/business"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { useNavigate } from "react-router-dom"
import { AppButton, AppInput, Layout } from "../../components"
import { COLORS } from "../../constants"
import { Divider } from "@mui/material"

export default function CreateInspection({}) {
  const { enqueueSnackbar } = useSnackbar()
  const fileRef = useRef()
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const [state, setState] = useState({
    loading: false,
    allWorksites: [],
    worksiteTasks: [],
    areas: [],
    worksite: "",
    name: "",
    tasks: [],
    task: "",
    photo: "",
    loadingCreate: false,
    opened: false
  })

  const {
    loading,
    tasks,
    task,
    worksiteTasks,
    allWorksites,
    name,
    worksite,
    areas,
    photo,
    opened,
    loadingCreate
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    _getReports()
  }, [])

  // const _uploadImage = async type => {
  //   handleChange("uploading", true)
  //   let OpenImagePicker =
  //     type == "camera"
  //       ? ImagePicker.openCamera
  //       : type == ""
  //       ? ImagePicker.openPicker
  //       : ImagePicker.openPicker
  //   OpenImagePicker({
  //     cropping: true,
  //     includeBase64: true
  //   })
  //     .then(async response => {
  //       if (!response.path) {
  //         handleChange("uploading", false)
  //       } else {
  //         const uri = response.path
  //         const uploadUri =
  //           Platform.OS === "ios" ? uri.replace("file://", "") : uri
  //         handleChange("profile_image", uploadUri)
  //         handleChange("photo", response.data)
  //         handleChange("uploading", false)
  //         Toast.show("Media uploaded")
  //       }
  //     })
  //     .catch(err => {
  //       handleChange("showAlert", false)
  //       handleChange("uploading", false)
  //     })
  // }

  const _getReports = async () => {
    try {
      handleChange("loading", true)
      const res = await getWorksitesInspection(token)
      const list = []
      res?.data?.response?.forEach(element => {
        if (element) {
          list.push({
            value: element?.id,
            label: element?.name
          })
        }
      })
      handleChange("allWorksites", list)
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

  const _getWorksiteArea = async id => {
    try {
      handleChange("loading", true)
      const res = await getWorksitesTasks(id, token)
      const list = []
      res?.data?.response?.forEach(element => {
        if (element) {
          list.push({
            value: element?.id,
            label: element?.name
          })
        }
      })
      handleChange("worksiteTasks", list)
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

  const _createInspectionReport = async () => {
    try {
      handleChange("loadingCreate", true)
      const list = []
      tasks?.map(task => {
        list.push(task?.value)
      })
      const payload = {
        name,
        worksite,
        tasks: list,
        media: [{ file: photo }]
      }
      const res = await createInspectionReport(payload, token)
      handleChange("loadingCreate", false)
      handleChange("name", "")
      handleChange("worksite", "")
      handleChange("tasks", [])
      handleChange("areas", [])
      handleChange("photo", "")
      enqueueSnackbar(`Inspection report has been created`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
      navigate(-1)
    } catch (error) {
      handleChange("loadingCreate", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const handleUploadClick = () => {
    fileRef.current?.click()
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

  const handleFileChange = e => {
    if (!e.target.files) {
      return
    }

    const fileUploaded = e.target.files[0]
    getBase64(fileUploaded, result => {
      handleChange("photo", result)
    })
  }

  const getWorksiteText = (data, id) => {
    const filtered = data?.filter(e => e.value === id)
    return (filtered?.length > 0 && filtered[0]?.label) || ""
  }

  return (
    <div>
      <Layout noFooter>
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">Create Inspection Report</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          <div
            contentContainerStyle={{ alignItems: "center" }}
            style={{ width: "100%" }}
          >
            <AppInput
              value={name}
              // label="Inspection report name"
              name="name"
              placeholder="Inspection report name"
              onChange={handleChange}
            />
            <AppInput
              select={true}
              value={getWorksiteText(allWorksites, worksite)}
              selectOptions={allWorksites?.map((ws, index) => (
                <option key={index} value={ws?.value}>
                  {ws?.label}
                </option>
              ))}
              // label={getWorksiteText(allWorksites, worksite) || "Worksite name"}
              name="worksite"
              placeholder="Worksite name"
              onChange={(name, value) => {
                handleChange("worksite", value)
                _getWorksiteArea(value)
              }}
            />
            <MultiSelect
              options={worksiteTasks}
              value={tasks}
              overrideStrings={{
                selectSomeItems: "Task name"
              }}
              onChange={props => handleChange("tasks", props)}
              className="dropdown mt-2"
              labelledBy="Task name"
            />
            {/* <select placeholder="Task name">
              {worksiteTasks?.map(item => {
                const isSelected = tasks?.some(e => e === item?.value)
                return (
                  <option
                    style={{ width: "100%" }}
                    onSelect={() => {
                      if (isSelected) {
                        const removed = tasks?.filter(e => e !== item?.value)
                        handleChange("tasks", removed)
                      } else {
                        handleChange("tasks", [...tasks, item?.value])
                      }
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        width: "100%",
                        justifyContent: "space-between",
                        paddingHorizontal: 10
                      }}
                    >
                      <Text style={{ ...Fonts.poppinsRegular(14) }}>
                        {item?.label}
                      </Text>
                      <Image {...Images[isSelected ? "checked" : "checkbox"]} />
                    </View>
                  </option>
                )
              })}
            </select> */}
            <div className="d-flex mt-4">
              <AppButton
                onClick={handleUploadClick}
                color={COLORS.primary}
                borderRadius={10}
                className={"mr-3"}
                borderColor={COLORS.primary}
                backgroundColor={"transparent"}
                title={"Upload media"}
              />
              <input
                type="file"
                ref={fileRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <AppButton
                borderRadius={10}
                backgroundColor={COLORS.primary}
                color={COLORS.white}
                loading={loadingCreate}
                disabled={!name || !worksite || task || !photo}
                onClick={_createInspectionReport}
                title={"Create"}
              />
            </div>
          </div>
        </div>
      </Layout>
    </div>
  )
}
