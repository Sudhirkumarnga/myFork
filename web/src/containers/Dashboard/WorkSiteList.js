// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useEffect, useState } from "react"
import { AppButton, Layout } from "../../components"
import { Grid, Divider, CircularProgress } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import AppContext from "../../Context"
import { useContext } from "react"
import { COLORS } from "../../constants"
import { useSnackbar } from "notistack"
import Sample from "../../assets/images/sample.png"
import { getAllWorksites } from "../../api/business"
import { getAllWorksitesEmp } from "../../api/employee"
import { getSimplifiedError } from "../../utils/error"

export default function WorkSiteList({}) {
  const navigate = useNavigate()
  const { adminProfile, user } = useContext(AppContext)
  const UserType = localStorage.getItem("UserType")
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    allWorksites: []
  })

  const { loading, allWorksites, isDisplay } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getAllWorksites()
  }, [])

  const _getAllWorksites = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      if (adminProfile?.emergency_contact?.first_name) {
        const res = await getAllWorksitesEmp(token)
        handleChange("allWorksites", res?.data?.response)
      } else {
        const res = await getAllWorksites(token)
        handleChange("allWorksites", res?.data?.results)
      }
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
  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">My Worksites</div>
            </div>
            <div className="d-flex">
              <AppButton
                backgroundColor={COLORS.greyButton}
                color={COLORS.white}
                className={"mr-4"}
                height={30}
                width={150}
                borderRadius={10}
                onClick={() => navigate("/worksites/add")}
                title={"Add Worksite"}
              />
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
            {allWorksites?.map((item, index) => (
              <Grid item md={6} xs={12} key={index}>
                <div className="listContainer1">
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div className="title">
                        {UserType !== "admin"
                          ? item?.worksite_name
                          : item?.personal_information?.name}
                      </div>
                      <div className="job font-12">
                        {UserType !== "admin"
                          ? item?.location
                          : item?.personal_information?.location}
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
                      onClick={() =>
                        navigate(
                          UserType !== "admin"
                            ? `/worksite/map/${item?.id}`
                            : `/worksites/${item?.id}`
                        )
                      }
                      style={{
                        marginTop: UserType !== "admin" ? -22 : 0,
                        alignItems:
                          UserType !== "admin" ? "flex-start" : "flex-end",
                        flexDirection: "column",
                        display: "flex",
                        justifyContent: "flex-end"
                      }}
                    >
                      <div className="c-pointer job mt-4 font-12">
                        {UserType !== "admin" ? "Map view" : "View details"}
                      </div>
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
