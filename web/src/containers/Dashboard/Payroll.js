// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useState } from "react"
import { AppButton, AppInput, Layout } from "../../components"
import {
  Grid,
  Divider,
  Button,
  CircularProgress,
  Switch,
  Dialog
} from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import Sample from "../../assets/images/sample.png"
import moment from "moment/moment"
import { CloseOutlined } from "@mui/icons-material"

export default function Payroll({}) {
  const navigate = useNavigate()
  const { earnings, _getEarnings, earningLoading } = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    isActive: false,
    isDisplay: true,
    visible: false,
    name: "",
    date: null
  })

  const { isActive, visible, isDisplay, name, date } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  const hideModal = () => {
    handleChange("selectedEvent", null)
    handleChange("visible", false)
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
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">
                Payroll hours: {earnings?.payroll_hours}h
              </div>
              <div className="dateText mt-4">
                {moment(earnings?.date).format("DD MMMM, YYYY")}
              </div>
            </div>
            <div className="rowEnd">
              <AppButton
                backgroundColor={COLORS.greyButton}
                color={COLORS.white}
                height={30}
                width={150}
                borderRadius={10}
                // icon={"filter"}
                onClick={() => handleChange("visible", true)}
                // iconStyle={{ height: 18, width: 18 }}
                // style={{ height: 40, width: 100, marginTop: 0 }}
                title={"Filter"}
              />
              <div
                className="mt-3"
                style={{
                  flexDirection: "row",
                  display: "flex",
                  width: "100%",
                  alignItems: "center"
                }}
              >
                <div className="displayText">Display earnings</div>
                <Switch
                  checked={isDisplay}
                  onChange={val =>
                    handleChange("isDisplay", val.target.checked)
                  }
                  disabled={false}
                />
              </div>
            </div>
          </div>
          <Divider className="mt-4" />
          {earningLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: 20
              }}
            >
              <CircularProgress
                style={{
                  color: COLORS.primary,
                  width: 20,
                  height: 20
                }}
              />
            </div>
          )}
          <Grid
            container
            justifyContent={"space-between"}
            spacing={1}
            className="mt-4"
          >
            <Grid item md={6} xs={12} container justifyContent={"flex-end"}>
              <div className="job mr-3">Hours</div>
              <div className="job">Earnings</div>
            </Grid>
            <Grid item md={6} xs={12} container justifyContent={"flex-end"}>
              {earnings?.employees?.length > 1 && (
                <>
                  <div className="job mr-3">Hours</div>
                  <div className="job">Earnings</div>
                </>
              )}
            </Grid>

            {earnings?.employees?.map((item, index) => (
              <Grid item md={6} xs={12} key={index}>
                <div className="listContainer">
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={item?.employee_image || Sample}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 8,
                        marginRight: 10
                      }}
                    />
                    <div>
                      <div className="title">{item?.employee_name}</div>
                      <div className="job">{item?.employee_position}</div>
                      <div className="location">{`Hourly rate: $${item?.employee_hourly_rate}/hr`}</div>
                    </div>
                  </div>
                  <div
                    style={{
                      alignItems: "flex-end",
                      display: "flex",
                      justifyContent: "space-between",
                      height: "100%"
                    }}
                  >
                    <div
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        display: "flex",
                        justifyContent: "center"
                      }}
                    >
                      <div className="title" style={{ marginRight: 20 }}>
                        {item?.employee_hours + "h"}
                      </div>
                      <div className="title">
                        {!isDisplay ? "N/A" : "$" + item?.employee_earnings}
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </Layout>
      <Dialog open={visible} onClose={hideModal}>
        <div className={"zipModal"}>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end"
            }}
          >
            <CloseOutlined onClick={hideModal} />
          </div>
          <div className="heading1">{"Filter Payroll"}</div>
          <AppInput
            value={name}
            name="name"
            className={"mt-2"}
            placeholder="Enter employee name"
            label="Employee Name"
            onChange={handleChange}
          />
          <AppInput
            value={date}
            type={"date"}
            className={"mt-2"}
            name="date"
            placeholder="Choose Date"
            label="Choose Date"
            onChange={handleChange}
          />
          <AppButton
            onClick={() => {
              _getEarnings(
                `?date=${moment(date).format("DD")}&month=${moment(date).format(
                  "MM"
                )}&year=${moment(date).format("YYYY")}`
              )
              hideModal()
            }}
            className={"mt-3 mb-3"}
            title={"Apply filter"}
            color={COLORS.white}
            backgroundColor={COLORS.primary}
          />
          <AppButton
            onClick={() => {
              _getEarnings("")
              handleChange("name", "")
              handleChange("date", null)
              hideModal()
            }}
            title={"Cancel"}
            color={COLORS.primary}
            backgroundColor={COLORS.white}
            borderColor={COLORS.primary}
          />
        </div>
      </Dialog>
    </div>
  )
}
