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

export default function EmployeeView({}) {
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
    _getEmployee()
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

  const createMessageList = item => {
    // const id = `${user?.id}_${item?.id}`
    // const rid = `${item?.id}_${user?.id}`
    // const db = database()
    // db.ref('Messages/' + id).once('value', snapshot => {
    //   if (snapshot.val()) {
    //     let value = {
    //       sender: user,
    //       senderId: user?.id,
    //       id: id,
    //       timeStamp: Date.now(),
    //       receiverRead: 0,
    //       receiverId: item.id,
    //       receiver: item
    //     }
    //     database()
    //       .ref('Messages/' + id)
    //       .update(value)
    //       .then(res => {
    //         navigation.navigate('MessageChat', { messageuid: id })
    //       })
    //       .catch(err => {
    //         Toast.show('Something went wrong!')
    //       })
    //   } else {
    //     db.ref('Messages/' + rid).once('value', snapshot => {
    //       if (snapshot.val()) {
    //         let value = {
    //           sender: user,
    //           senderId: user?.id,
    //           id: rid,
    //           timeStamp: Date.now(),
    //           receiverRead: 0,
    //           receiverId: item.id,
    //           receiver: item
    //         }
    //         database()
    //           .ref('Messages/' + rid)
    //           .update(value)
    //           .then(res => {
    //             navigation.navigate('MessageChat', { messageuid: rid })
    //           })
    //           .catch(err => {
    //             Toast.show('Something went wrong!')
    //           })
    //       } else {
    //         let value = {
    //           sender: user,
    //           senderId: user?.id,
    //           id: id,
    //           timeStamp: Date.now(),
    //           receiverRead: 0,
    //           receiverId: item.id,
    //           receiver: item
    //         }
    //         database()
    //           .ref('Messages/' + id)
    //           .update(value)
    //           .then(res => {
    //             navigation.navigate('MessageChat', { messageuid: id })
    //           })
    //           .catch(err => {
    //             Toast.show('Something went wrong!')
    //           })
    //       }
    //     })
    //   }
    // })
  }

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">View Employees</div>
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
              <div className="">
                <div
                  style={{
                    flexDirection: "row",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  <img
                    src={
                      employee?.personal_information?.profile_image || Sample
                    }
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 8,
                      marginRight: 10
                    }}
                  />
                  <div>
                    <div className="title">
                      {employee?.personal_information?.first_name +
                        " " +
                        employee?.personal_information?.last_name}
                    </div>
                    <div className="job font-12">
                      Position:{" "}
                      <span className="text_black font-14">
                        {employee?.work_information?.position}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="job font-14 mt-4">Date of birth:</div>
                <div className="location">
                  {moment(employee?.personal_information?.date_of_birth).format(
                    "MM/DD/YYYY"
                  )}
                </div>
                <div className="job font-14 mt-4">Email Address:</div>
                <div className="location">
                  {employee?.contact?.email ? employee?.contact?.email : ""}
                </div>
                <div className="job font-14 mt-4">Phone Number:</div>
                <div className="location">
                  {employee?.contact?.email ? employee?.contact?.phone : ""}
                </div>
                <div className="job font-14 mt-4">Address:</div>
                <div className="location">
                  {(employee?.address_information?.address_line_one
                    ? employee?.address_information?.address_line_one
                    : "") +
                    " " +
                    (employee?.address_information?.address_line_two
                      ? employee?.address_information?.address_line_two
                      : "")}
                </div>
                <div className="job font-14 mt-4">Hourly Rate:</div>
                <div className="location">
                  ${employee?.work_information?.hourly_rate}/hr
                </div>
              </div>
              <Grid container spacing={3} className="mt-5">
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Message"}
                    onClick={() => createMessageList(employee)}
                    borderColor={COLORS.primary}
                    prefix={<MessageIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                </Grid>
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Edit"}
                    onClick={() => navigate(`/edit-employee/${employee?.id}`)}
                    borderColor={COLORS.primary}
                    prefix={<EditIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
                  />
                </Grid>
                <Grid item md={6} lg={4} xs={12}>
                  <AppButton
                    title={"Delete Employee"}
                    onClick={handleSubmit}
                    borderColor={COLORS.primary}
                    prefix={<DeleteIcon className="mr-4" />}
                    borderRadius={12}
                    color={COLORS.primary}
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
