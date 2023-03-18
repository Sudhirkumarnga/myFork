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
import { deleteEmployee, getEmployee } from "../../api/business"
import moment from "moment"
import { getSimplifiedError } from "../../utils/error"

export default function AddEmployee({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    employee: null
  })

  const { loading, employee } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
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
      handleChange("employee", res?.data?.response)
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
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      await deleteEmployee(employee?.id, token)
      handleChange("loading", false)
      navigate(-1)
      enqueueSnackbar(`Employee has been deleted!`, {
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
            spacing={1}
            className="mt-4"
          >
            <Grid item xs={12}>
             
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
