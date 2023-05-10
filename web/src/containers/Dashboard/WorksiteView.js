// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, Layout } from "../../components"
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
  deleteEmployee,
  deleteWorksite,
  getWorksitesDetail
} from "../../api/business"
import moment from "moment"
import { getSimplifiedError } from "../../utils/error"

export default function WorksiteView({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const [state, setState] = useState({
    loading: false,
    loadingDelete: false,
    isDisplay: true,
    worksiteData: null
  })

  const { loading, loadingDelete, worksiteData } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getWorksite()
  }, [])

  const _getWorksite = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const res = await getWorksitesDetail(id, token)
      handleChange("loading", false)
      handleChange("worksiteData", res?.data)
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

  const handleSubmit = async () => {
    try {
      handleChange("loadingDelete", true)
      let token = localStorage.getItem("token")
      await deleteWorksite(worksiteData?.id, token)
      handleChange("loadingDelete", false)
      navigate(-1)
      enqueueSnackbar(`Worksite has been deleted!`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
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

  const info = [
    {
      title: "Worksite Name:",
      description: worksiteData?.personal_information?.name
    },
    {
      title: "Worksite Location:",
      description: worksiteData?.personal_information?.location
    },
    {
      title: "Description:",
      description: worksiteData?.personal_information?.description
    }
  ]
  const info1 = [
    {
      title: "Notes:",
      description: worksiteData?.personal_information?.notes
    },
    {
      title: "Monthly rate:",
      description: "$ " + worksiteData?.personal_information?.monthly_rates
    },
    {
      title: "Cleaning rate by day:",
      description:
        worksiteData?.personal_information?.clear_frequency_by_day?.toString()
    }
  ]
  const info2 = [
    {
      title: "Desired time:",
      description: worksiteData?.personal_information?.desired_time
    },
    {
      title: "Number of workers needed:",
      description: worksiteData?.personal_information?.number_of_workers_needed
    },
    {
      heading: "Contact Person"
    },
    {
      title: "Name:",
      description: worksiteData?.contact_person?.contact_person_name
    },
    {
      title: "Phone number:",
      description: worksiteData?.contact_person?.contact_phone_number
    }
  ]

  return (
    <div>
      <Layout noFooter>
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div className="headingrowBetween">
              <div className="heading">
                {worksiteData?.personal_information?.name}
              </div>
              <div className="d-flex">
                <AppButton
                  backgroundColor={COLORS.greyButton}
                  color={COLORS.white}
                  height={30}
                  width={150}
                  borderRadius={10}
                  onClick={() => navigate("/worksites/add")}
                  title={"Add Worksite"}
                />
              </div>
            </div>
          </div>
          <Divider className="mt-4" />
          {loading && (
            <div className="d-flex mt-4 justify-content-center">
              <CircularProgress />
            </div>
          )}
          <div className="heading font-18 mt-4">Worksite Information</div>
          <Grid
            container
            justifyContent={"space-between"}
            spacing={2}
            className="mt-4"
          >
            <Grid item md={4} xs={12}>
              {info.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="text-wrap job font-14 mt-4">
                      {item.title}
                    </div>
                    <div className="location text-wrap">{item.description}</div>
                  </div>
                )
              })}
            </Grid>
            <Grid item md={4} xs={12}>
              {info1.map((item, index) => {
                return (
                  <div key={index}>
                    <div className="text-wrap job font-14 mt-4">
                      {item.title}
                    </div>
                    <div className="location text-wrap">{item.description}</div>
                  </div>
                )
              })}
            </Grid>
            <Grid item md={4} xs={12}>
              {info2.map((item, index) => {
                if (item?.heading) {
                  return (
                    <div key={index}>
                      <div className="text-wrap font-18 font-bold500 mt-4">
                        {item?.heading}
                      </div>
                    </div>
                  )
                } else {
                  return (
                    <div key={index}>
                      <div className="text-wrap job font-14 mt-4">
                        {item.title}
                      </div>
                      <div className="location text-wrap">
                        {item.description}
                      </div>
                    </div>
                  )
                }
              })}
            </Grid>
            <Grid container>
              <div className="heading font-18 mt-4">Instructional Video</div>
            </Grid>
            <Grid container className="mt-3">
              {worksiteData?.upload_instruction_video_link ? (
                <video width={"100%"} height="340" controls>
                  <source
                    src={worksiteData?.upload_instruction_video_link}
                    type="video/mp4"
                  />
                  {/* <source src="movie.ogg" type="video/ogg" /> */}
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div>No Video Available</div>
              )}
            </Grid>
            <Divider className="mt-4 mb-4" />
            <Grid container>
              <div className="heading font-18 mt-4">Tasks </div>
            </Grid>
            {worksiteData?.tasks?.map((task, index) => (
              <Grid item md={6} xs={12} key={index}>
                <div className="listContainer1">
                  <div
                    onClick={() => navigate(`/employees-view/${task?.id}`)}
                    style={{
                      cursor: "pointer",
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div className="title">{task?.name}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      height: "100%"
                    }}
                  >
                    <div
                      onClick={() =>
                        navigate(
                          `/worksites/${worksiteData?.id}/task/edit/${task?.id}`
                        )
                      }
                      className="job c-pointer"
                    >
                      View details
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
            <Grid container spacing={3} className="mt-5">
              <Grid item md={6} lg={4} xs={12}>
                <AppButton
                  title={"Edit"}
                  onClick={() =>
                    navigate(`/worksites/edit/${worksiteData?.id}`)
                  }
                  borderColor={COLORS.primary}
                  prefix={<EditIcon className="mr-4" />}
                  borderRadius={12}
                  color={COLORS.primary}
                />
              </Grid>
              <Grid item md={6} lg={4} xs={12}>
                <AppButton
                  title={"Delete Worksite"}
                  onClick={handleSubmit}
                  loading={loadingDelete}
                  borderColor={COLORS.primary}
                  prefix={<DeleteIcon className="mr-4" />}
                  borderRadius={12}
                  color={COLORS.primary}
                />
              </Grid>
              <Grid item md={6} lg={4} xs={12}>
                <AppButton
                  title={"Create a task"}
                  onClick={() =>
                    navigate(`/worksites/${worksiteData?.id}/task/add`)
                  }
                  backgroundColor={COLORS.primary}
                  borderRadius={12}
                  color={COLORS.white}
                />
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
