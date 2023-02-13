// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from "react"
import { AppButton, Layout } from "../../components"
import { Grid, Divider, Button, CircularProgress } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import calendarGreen from "../../assets/svg/calendarGreen.svg"
import chevronRight from "../../assets/svg/chevronRight.svg"
import chevronDown from "../../assets/svg/chevronDown.svg"

export default function Dashboard({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    loading: false,
    categories: "",
    searchText: "",
    coins: []
  })

  const { loading, coins } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const handleSubmit = async () => {
    try {
      handleChange("loading", true)
    } catch (error) {
      handleChange("loading", false)
    }
  }

  return (
    <div>
      <Layout>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="heading">My Dashboard</div>
          <Divider className="mt-4" />
          <Grid container spacing={1} className="mt-4">
            <Grid md={6} xs={12}>
              <div className="upcomingBox width95">
                <img src={calendarGreen} width={30} />
                <div className="upcomingBoxRight">
                  <p className="heading">Upcoming shift</p>
                  <p>Worksite number 1</p>
                  <p className="locationText">Location: </p>
                  <AppButton
                    backgroundColor={COLORS.primary}
                    color={COLORS.white}
                    width={"80%"}
                    borderRadius={15}
                    title={"Clock in"}
                  />
                </div>
              </div>
            </Grid>
            <Grid md={6} xs={12}>
              <div className="upcomingBox">
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">Active employees</p>
                    <img src={chevronDown} width={18} />
                  </div>
                </div>
              </div>
              <div className="upcomingBox mt-2">
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">Pay period to date: 23h</p>
                    <img src={chevronRight} width={10} />
                  </div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
