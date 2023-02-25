import * as React from "react"
import {
  Grid,
  Container,
  Button,
  Dialog,
  CircularProgress,
  TextField
} from "@mui/material"
import { AdminLayout, AppInput } from "../../components"
import { useContext } from "react"
import AppContext from "../../Context"
import { useState } from "react"
import {
  createSubscription,
  replyFeedback,
  updateSubscription
} from "../../api/admin"
import { useEffect } from "react"
import { DataGrid } from "@mui/x-data-grid"
import searchIcon from "../../assets/svg/search.svg"

function SubscriptionsContent() {
  const headCells1 = [
    {
      field: "name",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "TITLE",
      renderCell: row => {
        return <div className="textBreak">{row?.row?.name}</div>
      }
    },
    {
      field: "description",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "DESCRIPTION",
      renderCell: row => {
        return <div className="textBreak">{row?.row?.description}</div>
      }
    },
    {
      field: "active",
      width: 300,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTIVE",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{row?.row?.active ? "Yes" : "No"}</div>
          </div>
        )
      }
    },
    {
      field: "price",
      numeric: false,
      width: 200,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "PRICE",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>
              ${Number(row?.row?.price[0]?.unit_amount / 100).toFixed(2)}
            </div>
          </div>
        )
      }
    },
    {
      field: "allowed_employees",
      numeric: false,
      width: 200,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ALLOWED EMPLOYEE",
      renderCell: row => {
        return (
          <div className="d-flex align-items-center">
            <div>{Number(row?.row?.metadata?.allowed_employees)}</div>
          </div>
        )
      }
    },

    {
      field: "action",
      width: 200,
      numeric: false,
      disablePadding: false,
      disableColumnMenu: true,
      headerName: "ACTION",
      renderCell: row => {
        return (
          <div className="d-flex">
            <Button
              variant="contained"
              onClick={() => {
                handleNewClose(true)
                handleChange("ID", row?.row?.djstripe_id)
                handleChange("name", row?.row?.name)
                handleChange("description", row?.row?.description)
                handleChange(
                  "price",
                  Number(row?.row?.price[0]?.unit_amount / 100)
                )
                handleChange(
                  "allowed_employees",
                  row?.row?.metadata?.allowed_employees?.toString()
                )
              }}
              style={{ backgroundColor: "orange" }}
              className="ml-2"
            >
              Update
            </Button>
          </div>
        )
      }
    }
  ]
  const { subscriptions, allUsers, _getAdminData } = useContext(AppContext)
  const [state, setState] = useState({
    filteredList: subscriptions,
    userDeleteDialog: false,
    userDeleteLoading: false,
    newDialog: false,
    newLoading: false,
    name: "",
    ID: "",
    description: "",
    price: "",
    allowed_employees: ""
  })
  const {
    filteredList,
    newDialog,
    newLoading,
    name,
    price,
    description,
    allowed_employees,
    ID
  } = state
  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (subscriptions) {
      handleChange("filteredList", subscriptions)
    }
  }, [subscriptions])

  const filtered = value => {
    if (value) {
      const re = new RegExp(value, "i")
      var filtered = subscriptions?.filter(entry =>
        Object.values(entry).some(
          val => typeof val === "string" && val.match(re)
        )
      )
      handleChange("filteredList", filtered)
    } else {
      handleChange("filteredList", subscriptions)
    }
  }

  const handleDeleteClose = status => {
    handleChange("userDeleteDialog", status)
    if (!status) {
      handleChange("ID", "")
    }
  }
  const handleNewClose = status => {
    handleChange("newDialog", status)
  }

  const _createSubscription = async () => {
    try {
      if (ID) {
        _updateSubscription()
        return
      }
      handleChange("newLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        name,
        description,
        price: Number(price),
        type: "service",
        active: true,
        currency: "usd",
        metadata: {
          allowed_employees
        }
      }
      await createSubscription(payload, token)
      handleChange("newLoading", false)
      handleChange("description", "")
      handleChange("price", "")
      handleChange("allowed_employees", "")
      handleChange("name", "")
      handleChange("newDialog", false)
      _getAdminData()
      alert(`Subscription has been created`)
    } catch (error) {
      handleChange("newLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _updateSubscription = async () => {
    try {
      handleChange("newLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        name,
        description,
        price: Number(price),
        active: true,
        metadata: {
          allowed_employees
        }
      }
      await updateSubscription(ID, payload, token)
      handleChange("newLoading", false)
      handleChange("description", "")
      handleChange("price", "")
      handleChange("allowed_employees", "")
      handleChange("name", "")
      handleChange("ID", "")
      handleChange("newDialog", false)
      _getAdminData()
      alert(`Subscription has been updated`)
    } catch (error) {
      handleChange("newLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  const _readFeedback = async id => {
    try {
      handleChange("newLoading", true)
      const token = localStorage.getItem("token")
      const payload = {
        is_read: true
      }
      await replyFeedback(id, payload, token)
      handleChange("newLoading", false)
      handleChange("name", "")
      handleChange("newDialog", false)
      _getAdminData()
      alert(`Feedback has been read`)
    } catch (error) {
      handleChange("newLoading", false)
      const errorText = Object.values(error?.response?.data)
      alert(`Error: ${errorText[0]}`)
    }
  }

  return (
    <AdminLayout>
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        <Grid container>
          <div class="search">
            <span class="form-element">
              <AppInput
                inputWidthFull
                height={40}
                borderRadius={10}
                postfix={<img src={searchIcon} width={"20px"} />}
                placeholder="Search Subscriptions"
                onChange={(name, value) => filtered(value)}
              />
            </span>
          </div>
        </Grid>
        <Button
          onClick={() => handleNewClose(true)}
          variant="contained"
          style={{ backgroundColor: "orange" }}
          className="mt-4 ml-2"
        >
          Create New
        </Button>
        <div
          style={{
            height: 500,
            background: "#fff",
            marginTop: 20,
            borderRadius: 10,
            width: "100%"
          }}
        >
          <DataGrid
            rows={filteredList}
            columns={headCells1}
            pageSize={30}
            rowsPerPageOptions={[30]}
          />
        </div>
        <Dialog onClose={() => handleNewClose(false)} open={newDialog}>
          <div className={"zipModal"}>
            <p style={{ fontSize: 24, fontWeight: "bold" }}>
              Create New Subscription
            </p>
            <AppInput
              placeholder={"Name"}
              name={"name"}
              value={name}
              onChange={handleChange}
            />
            <AppInput
              placeholder={"Description"}
              name={"description"}
              value={description}
              onChange={handleChange}
            />
            <AppInput
              placeholder={"Price"}
              name={"price"}
              value={price}
              type="number"
              onChange={handleChange}
            />
            <AppInput
              placeholder={"Allowed Employees"}
              name={"allowed_employees"}
              type="number"
              value={allowed_employees}
              onChange={handleChange}
            />
            <div className="d-flex justify-content-between mt-4">
              <p
                className="c-pointer text_secondary"
                onClick={() => handleNewClose(false)}
              >
                Cancel
              </p>
              <p
                className="c-pointer text_secondary"
                style={{
                  width: 120,
                  textAlign: "right",
                  opacity:
                    !name || !description || !price || !allowed_employees
                      ? 0.5
                      : 1
                }}
                onClick={
                  name &&
                  description &&
                  price &&
                  allowed_employees &&
                  _createSubscription
                }
              >
                {newLoading ? (
                  <CircularProgress style={{ width: 15, height: 15 }} />
                ) : ID ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </p>
            </div>
          </div>
        </Dialog>
      </Container>
    </AdminLayout>
  )
}

export default function Subscriptions() {
  return <SubscriptionsContent />
}
