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
import { getEarnings } from "../../api/business"
import { getSimplifiedError } from "../../utils/error"
import moment from "moment"

export default function MyEarnings({}) {
  const navigate = useNavigate()
  const { adminProfile, user } = useContext(AppContext)
  const UserType = localStorage.getItem("UserType")
  const { enqueueSnackbar } = useSnackbar()
  const location = useLocation()
  const [state, setState] = useState({
    loading: false,
    isDisplay: true,
    earnings: []
  })

  const { loading, earnings, isDisplay } = state

  const handleChange = (key, value) => {
    setState(pre => ({
      ...pre,
      [key]: value
    }))
  }

  useEffect(() => {
    _getEarnings()
  }, [])

  const _getEarnings = async payload => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const qs = payload ? payload : ""
      const res = await getEarnings(qs, token)
      handleChange("earnings", res?.data)
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
              <div className="heading">My Earnings</div>
            </div>
            <div className="d-flex">
              <div className="title mt-1">
                Total amount earned: ${earnings?.total_earned}
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
            {earnings?.worksites?.map((item, index) => (
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
                      <div className="title">{item?.worksite}</div>
                      <div className="job font-12">
                        Amount clocked: {item?.amount_clocked}
                      </div>
                      <div className="job font-12">Earned: ${item?.earned}</div>
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
                        {moment.utc(item?.created_at).local().fromNow()}
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
