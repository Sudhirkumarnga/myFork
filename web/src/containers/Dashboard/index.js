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
import userProfile from "../../assets/images/sample.png"
import moment from "moment/moment"

export default function Dashboard({}) {
  const navigate = useNavigate()
  const { upcomingShiftData, upcomingShiftTimesDataList } =
    useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    isActive: false,
    upcomingShiftTimesData: upcomingShiftTimesDataList || []
  })

  const { isActive, upcomingShiftTimesData } = state

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
            {upcomingShiftData?.status && (
              <Grid md={6} xs={12}>
                <div className="upcomingBox width95">
                  <img src={calendarGreen} width={30} />
                  <div className="upcomingBoxRight">
                    <p className="heading">
                      {" "}
                      {upcomingShiftData?.status === "CLOCK_OUT"
                        ? "Current Shift"
                        : "Upcoming Shift"}
                    </p>
                    <p>{upcomingShiftData?.worksite?.name}</p>
                    <p className="locationText">
                      Location: {upcomingShiftData?.worksite?.location}{" "}
                    </p>
                    {upcomingShiftData?.status === "CLOCK_IN" && (
                      <p>
                        Clock in time:{" "}
                        {moment
                          .utc(upcomingShiftData?.schedule_shift_start_time)
                          .local()
                          .format("DD,MMM YYYY hh:mm A")}{" "}
                        to{" "}
                        {moment
                          .utc(upcomingShiftData?.schedule_shift_end_time)
                          .local()
                          .format("hh:mm A")}
                      </p>
                    )}
                    {upcomingShiftTimesData?.length > 0 &&
                      upcomingShiftTimesData[upcomingShiftTimesData?.length - 1]
                        ?.clock_out_time === null && (
                        <div>
                          Clock in time:{" "}
                          <div
                            style={{
                              color: COLORS.darkBlack
                            }}
                          >
                            {moment
                              .utc(
                                upcomingShiftTimesData?.length > 0
                                  ? upcomingShiftTimesData[
                                      upcomingShiftTimesData?.length - 1
                                    ]?.clock_in_time
                                  : upcomingShiftData?.schedule_shift_start_time
                              )
                              .local()
                              .format("hh:mm A")}{" "}
                          </div>
                        </div>
                      )}
                    {/* <AppButton
                      backgroundColor={COLORS.primary}
                      color={COLORS.white}
                      width={"80%"}
                      borderRadius={15}
                      title={"Clock in"}
                    /> */}
                  </div>
                </div>
              </Grid>
            )}
            <Grid md={6} xs={12}>
              <div
                className="upcomingBox"
                onClick={() => handleChange("isActive", !isActive)}
              >
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">Active employees</p>
                    <img src={chevronDown} width={18} />
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="activeEmployeeModal">
                  {isActive &&
                    upcomingShiftData?.active_employees?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 20,
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center"
                        }}
                      >
                        <img
                          src={item?.profile_image || userProfile}
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: 8,
                            marginRight: 10,
                            resizeMode: "cover"
                          }}
                        />
                        <div>
                          <div className="employeeName">{item?.name}</div>
                          <div className="employeeWorksite">
                            {item?.worksite?.name}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <div className="upcomingBox mt-2">
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">
                      Pay period to date: {upcomingShiftData?.total_hours || 0}h
                    </p>
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
