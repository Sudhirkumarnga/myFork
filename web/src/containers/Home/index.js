// @ts-nocheck
/* eslint-disable no-empty-pattern */
import React, { useContext, useEffect, useState } from "react"
import { AppButton } from "../../components"
import { Grid } from "@mui/material"
import { ReactComponent as Logo } from "../../assets/svg/logo.svg"
import { useNavigate } from "react-router-dom"
import AppContext from "../../Context"

export default function MainHome({}) {
  const navigate = useNavigate()
  const { listRVS } = useContext(AppContext)
  const [state, setState] = useState({
    splash: true
  })

  const { splash } = state
  useEffect(() => {
    setTimeout(() => {
      handleChange("splash", false)
    }, 3000)
  }, [])

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  const handleSearch = (route, type) => {
    localStorage.setItem("UserType", type)
    navigate(route)
  }

  return (
    <div className="home">
      <Logo />
      {!splash && (
        <Grid container direction="column" alignItems={"center"} className="">
          <div className="text-white text-center font-16 mt-5 mb-5">I am a</div>
          <AppButton
            title={"Business Admin"}
            className={"mb-3"}
            onClick={() => handleSearch("/login", "admin")}
            width={300}
          />
          <AppButton
            title={"Employee"}
            width={300}
            onClick={() => handleSearch("/login", "employee")}
          />
        </Grid>
      )}
    </div>
  )
}
