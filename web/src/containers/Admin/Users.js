// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, AdminLayout, AppInput } from "../../components"
import { Grid, Divider, Button, CircularProgress } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { useSnackbar } from "notistack"
import chevronDown from "../../assets/svg/chevronDown.svg"
import userProfile from "../../assets/images/sample.png"
import searchIcon from "../../assets/svg/search.svg"
import moment from "moment"
import { COLORS } from "../../constants"

export default function Users({}) {
  const navigate = useNavigate()
  const { businessUsers, employeeUsers } = useContext(AppContext)
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    isActive: false,
    isActive1: false,
    searchText: "",
    searchText1: "",
    filteredList: [],
    filteredList1: []
  })

  const {
    isActive,
    isActive1,
    searchText,
    searchText1,
    filteredList,
    filteredList1
  } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    if (businessUsers) {
      handleChange("filteredList", businessUsers)
    }
    if (employeeUsers) {
      handleChange("filteredList1", employeeUsers)
    }
  }, [businessUsers, employeeUsers])

  const filtered = (list, key, name, value) => {
    handleChange(name, value)
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = list?.filter(entry =>
        (entry?.first_name + " " + entry?.last_name)
          ?.toLowerCase()
          ?.includes(value?.toLowerCase())
      )
      handleChange(key, filtered)
    } else {
      handleChange(key, list)
    }
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
      <AdminLayout>
        <div className="container adjustMaxWidth minheight80vh">
          <Grid spacing={3} container>
            <Grid item md={6} xs={12}>
              <AppInput
                placeholder={"Search Business User"}
                borderRadius={10}
                inputWidthFull
                height={40}
                name="searchText"
                value={searchText}
                onChange={(key, value) =>
                  filtered(businessUsers, "filteredList", key, value)
                }
                postfix={<img src={searchIcon} width={"20px"} />}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <AppInput
                placeholder={"Search Employees"}
                borderRadius={10}
                inputWidthFull
                height={40}
                name="searchText1"
                value={searchText1}
                onChange={(key, value) =>
                  filtered(employeeUsers, "filteredList1", key, value)
                }
                postfix={<img src={searchIcon} width={"20px"} />}
              />
            </Grid>
          </Grid>
          <Divider className="mt-4" />
          <Grid container spacing={3} className="mt-4">
            <Grid item md={6} xs={12}>
              <div
                className="upcomingBox"
                onClick={() => handleChange("isActive", !isActive)}
              >
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">Business Admin</p>
                    <img src={chevronDown} width={18} />
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="activeEmployeeModal">
                  {filteredList?.length === 0 && <div className="noUser">No User</div>}
                  {isActive &&
                    filteredList?.length > 0 &&
                    filteredList?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 20,
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <div
                          key={index}
                          style={{
                            width: "80%",
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
                            <div className="employeeName">
                              {(item?.first_name || "") +
                                " " +
                                (item?.last_name || "")}
                            </div>
                            <div className="employeeWorksite">
                              {item?.phone}
                            </div>
                            <div className="dob">
                              DOB:{" "}
                              {item?.date_of_birth &&
                                moment(item?.date_of_birth).format("LL")}
                            </div>
                          </div>
                        </div>
                        <AppButton
                          backgroundColor={COLORS.primary}
                          color={COLORS.white}
                          width={100}
                          className={"mt-2"}
                          height={30}
                          title={item?.is_active ? "Flag" : "Unflagged"}
                        />
                      </div>
                    ))}
                </div>
              )}
            </Grid>
            <Grid item md={6} xs={12}>
              <div
                className="upcomingBox"
                onClick={() => handleChange("isActive1", !isActive1)}
              >
                <div className="upcomingBoxRight">
                  <div className="rowBetween">
                    <p className="heading">Employees</p>
                    <img src={chevronDown} width={18} />
                  </div>
                </div>
              </div>
              {isActive1 && (
                <div className="activeEmployeeModal">
                  {filteredList1?.length === 0 && <div className="noUser">No User</div>}
                  {isActive1 &&
                    filteredList1?.length > 0 &&
                    filteredList1?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          padding: 20,
                          width: "100%",
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between"
                        }}
                      >
                        <div
                          key={index}
                          style={{
                            width: "80%",
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
                            <div className="employeeName">
                              {(item?.first_name || "") +
                                " " +
                                (item?.last_name || "")}
                            </div>
                            <div className="employeeWorksite">
                              {item?.phone}
                            </div>
                            <div className="dob">
                              DOB:{" "}
                              {item?.date_of_birth &&
                                moment(item?.date_of_birth).format("LL")}
                            </div>
                          </div>
                        </div>
                        <AppButton
                          backgroundColor={COLORS.primary}
                          color={COLORS.white}
                          width={100}
                          className={"mt-2"}
                          height={30}
                          title={item?.is_active ? "Flag" : "Unflagged"}
                        />
                      </div>
                    ))}
                </div>
              )}
            </Grid>
          </Grid>
        </div>
      </AdminLayout>
    </div>
  )
}
