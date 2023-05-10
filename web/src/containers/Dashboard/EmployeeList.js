// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, Layout } from "../../components"
import { Grid, Divider, CircularProgress, Switch } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import Sample from "../../assets/images/sample.png"
import { getAllEmployee } from "../../api/business"

export default function EmployeeList({}) {
  const navigate = useNavigate()
  const {} = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    allEmployee: []
  })

  const { loading, allEmployee, isDisplay } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getAllEmployee()
  }, [])

  const _getAllEmployee = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const res = await getAllEmployee(token)
      handleChange("loading", false)
      handleChange("allEmployee", res?.data?.results)
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

  return (
    <div>
      <Layout noFooter>
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">My Employees</div>
            </div>
            <div className="d-flex">
              <AppButton
                backgroundColor={COLORS.greyButton}
                color={COLORS.white}
                // className={"mr-4"}
                height={30}
                width={150}
                borderRadius={10}
                onClick={() => navigate("/employees/add")}
                title={"Add Employee"}
              />
              {/* <AppButton
                backgroundColor={COLORS.greyButton}
                color={COLORS.white}
                height={30}
                width={150}
                borderRadius={10}
                onPress={() => handleChange("visible", true)}
                title={"Filter"}
              /> */}
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
            <Grid item md={6} xs={12} container justifyContent={"flex-end"}>
              <div className="hourlyRate">Hourly rate</div>
            </Grid>
            <Grid item md={6} xs={12} container justifyContent={"flex-end"}>
              <div className="hourlyRate">Hourly rate</div>
            </Grid>

            {allEmployee?.map((item, index) => (
              <Grid item md={6} xs={12} key={index}>
                <div className="listContainer">
                  <div
                    onClick={() => navigate(`/employees-view/${item?.id}`)}
                    style={{
                      cursor: "pointer",
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={item?.personal_information?.profile_image || Sample}
                      style={{
                        width: 70,
                        height: 70,
                        borderRadius: 8,
                        marginRight: 10
                      }}
                    />
                    <div className="width70">
                      <div className="title">
                        {item?.personal_information?.first_name +
                          " " +
                          item?.personal_information?.last_name}
                      </div>
                      <div className="job">
                        {item?.work_information?.position}
                      </div>
                      <div className="location">
                        {" "}
                        {(item?.address_information?.address_line_one
                          ? item?.address_information?.address_line_one
                          : "") +
                          " " +
                          (item?.address_information?.address_line_two
                            ? item?.address_information?.address_line_two
                            : "")}
                      </div>
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
                        alignItems: "flex-end",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >
                      <div className="title">
                        ${item?.work_information?.hourly_rate}/hr
                      </div>
                      <div className="job mt-4">Message</div>
                    </div>
                  </div>
                </div>
              </Grid>
            ))}
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
