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
import { Divider, Grid } from "@mui/material"
import { leaveRequest } from "../../api/employee"
import moment from "moment"

export default function LeaveRequest({}) {
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

  const { loading, title, request_type, from_date, to_date, description } =
    state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const handleRequest = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        title,
        request_type,
        from_date: moment(from_date).format("YYYY-MM-DD"),
        to_date: moment(to_date).format("YYYY-MM-DD"),
        description
      }
      await leaveRequest(payload, token)
      handleChange("loading", false)
      handleChange("title", "")
      handleChange("request_type", "")
      handleChange("description", "")
      handleChange("from_date", new Date())
      handleChange("to_date", new Date())
      enqueueSnackbar(`Leave Request Successfully Sent!`, {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
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
              <div className="heading">Time off Request</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <AppInput
                value={title}
                // label="Inspection report name"
                name="title"
                placeholder="Title"
                onChange={handleChange}
              />
              <AppInput
                select={true}
                value={request_type}
                selectOptions={
                  <>
                    <option value={""}>Type of leave</option>
                    {[
                      { label: "Paid", value: "PAID" },
                      { label: "Unpaid", value: "UNPAID" },
                      { label: "Sick", value: "SICK" }
                    ]?.map((ws, index) => (
                      <option key={index} value={ws?.value}>
                        {ws?.label}
                      </option>
                    ))}
                  </>
                }
                name="request_type"
                placeholder="Type of leave"
                onChange={handleChange}
              />
              <Grid container spacing={3}>
                <Grid item xs={6}>
                  <AppInput
                    value={from_date}
                    type={"date"}
                    // label="Inspection report name"
                    name="from_date"
                    min={moment().format("YYYY-MM-DD")}
                    placeholder="From"
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <AppInput
                    value={to_date}
                    type={"date"}
                    min={moment(from_date).format("YYYY-MM-DD")}
                    // label="Inspection report name"
                    name="to_date"
                    placeholder="To"
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} md={6}>
              <AppInput
                value={description}
                height={180}
                multiline
                // label="Inspection report name"
                name="description"
                placeholder="Description"
                onChange={handleChange}
              />
              <div className="d-flex justify-content-end mt-4">
                <Grid item xs={12} md={8}>
                  <AppButton
                    borderRadius={10}
                    backgroundColor={COLORS.primary}
                    color={COLORS.white}
                    loading={loading}
                    disabled={
                      !title ||
                      !request_type ||
                      !description ||
                      !from_date ||
                      !to_date
                    }
                    onClick={handleRequest}
                    title={"Send Request"}
                  />
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
