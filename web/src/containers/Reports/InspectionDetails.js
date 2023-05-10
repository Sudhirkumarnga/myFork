import React, { useEffect, useState } from "react"
import { createFeedback, getInspectionReport } from "../../api/business"
import { useNavigate, useParams } from "react-router-dom"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"
import { Checkbox, Dialog, Divider } from "@mui/material"
import { CloseOutlined } from "@mui/icons-material"
import { AppButton, Layout, Loader } from "../../components"
import { COLORS } from "../../constants"
import { Chart } from "react-google-charts"

export default function InspectionDetails({}) {
  const { id } = useParams()
  const sliceColor = ["#23C263", "#EFF259", "#F84F31"]
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [state, setState] = useState({
    loading: false,
    visible: false,
    task: "",
    taskIndex: "",
    selectedFeedback: "",
    loadingFeedback: false,
    item: null
  })

  const {
    loading,
    visible,
    task,
    loadingFeedback,
    taskIndex,
    selectedFeedback,
    item
  } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  useEffect(() => {
    if (id) {
      _getInspectionReport()
    }
  }, [id])
  const feedback = [
    { name: "Satisfactory", value: "SATISFACTORY", color: "#23C263" },
    { name: "Needs Attention", value: "NEEDS_ATTENTION", color: "#EFF259" },
    { name: "Unsatisfactory", value: "UNSATISFACTORY", color: "#F84F31" }
  ]

  const handleClose = () => {
    handleChange("visible", false)
    handleChange("selectedFeedback", "")
    handleChange("taskIndex", "")
  }

  const _getInspectionReport = async () => {
    try {
      handleChange("loading", true)
      const res = await getInspectionReport(id, token)
      handleChange("item", res?.data)
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

  const _createFeedback = async () => {
    try {
      handleChange("loadingFeedback", true)
      const payload = {
        feedback: selectedFeedback,
        tasks: task,
        report: item?.id
      }
      await createFeedback(payload, token)
      handleClose()
      handleChange("task", "")
      handleChange("selectedFeedback", "")
      navigate(-1)
    } catch (error) {
      handleChange("loadingFeedback", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const options = {
    pieHole: 0.83,
    is3D: false,
    colors: sliceColor,
    legend: "none"
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div>
      <Layout noFooter>
        <div className="adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">{item?.name}</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          <div style={{ width: "100%" }}>
            <div style={{ width: "100%", marginTop: 20 }}>
              <div className="job">{"Inspection report name:"}</div>
              <div>{item?.name}</div>
              <div
                style={{
                  width: "100%",
                  marginTop: 20
                }}
              >
                <div>
                  <div className="job">{"Worksite name:"}</div>
                  <div>{item?.worksite?.name}</div>
                </div>
                {(Number(item?.stats?.SATISFACTORY) > 0 ||
                  Number(item?.stats?.NEEDS_ATTENTION) > 0 ||
                  Number(item?.stats?.UNSATISFACTORY) > 0) && (
                  <Chart
                    chartType="PieChart"
                    width="100px"
                    height="100px"
                    options={options}
                    data={[
                      ["Task", "Hours per Day"],
                      [
                        "SATISFACTORY",
                        item?.stats?.SATISFACTORY
                          ? Number(item?.stats?.SATISFACTORY)
                          : 0
                      ],
                      [
                        "NEEDS_ATTENTION",
                        item?.stats?.NEEDS_ATTENTION
                          ? Number(item?.stats?.NEEDS_ATTENTION)
                          : 0
                      ],
                      [
                        "UNSATISFACTORY",
                        item?.stats?.UNSATISFACTORY
                          ? Number(item?.stats?.UNSATISFACTORY)
                          : 0
                      ]
                    ]}
                  />
                )}
                {/* {(Number(item?.stats?.SATISFACTORY) > 0 ||
                  Number(item?.stats?.NEEDS_ATTENTION) > 0 ||
                  Number(item?.stats?.UNSATISFACTORY) > 0) && (
                  <PieChart
                    widthAndHeight={60}
                    doughnut={true}
                    coverRadius={0.83}
                    series={[
                      item?.stats?.SATISFACTORY
                        ? Number(item?.stats?.SATISFACTORY)
                        : 0,
                      item?.stats?.NEEDS_ATTENTION
                        ? Number(item?.stats?.NEEDS_ATTENTION)
                        : 0,
                      item?.stats?.UNSATISFACTORY
                        ? Number(item?.stats?.UNSATISFACTORY)
                        : 0
                    ]}
                    sliceColor={sliceColor}
                  />
                )} */}
              </div>
              <Divider className="mt-4 mb-4" />
              <div>Tasks:</div>
              {item?.tasks?.map((task, index) => (
                <div
                  key={index}
                  style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
                >
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        flexDirection: "row",
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between"
                      }}
                    >
                      <div>{task?.tasks}</div>
                      {task?.feedback ? (
                        <div
                          style={{
                            width: 15,
                            height: 15,
                            borderRadius: 15,
                            backgroundColor: feedback.find(
                              e => e.value === task.feedback
                            ).color
                          }}
                        />
                      ) : (
                        <div
                          onClick={() => {
                            handleChange("visible", true)
                            handleChange("task", task?.id)
                            handleChange("taskIndex", task?.tasks)
                          }}
                        >
                          <div className="job c-pointer">{"Review"}</div>
                        </div>
                      )}
                    </div>
                    {/* {area?.tasks?.length < index + 1 && <Divider />} */}
                  </div>
                  {/* ))} */}
                </div>
              ))}
              <div className="job">Media Links:</div>
              {item?.media?.map((task, index) => (
                <div style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      width: "100%",
                      justifyContent: "space-between"
                    }}
                  >
                    <div
                      className="text_primary c-pointer"
                      onClick={() => window.open(task?.file, "_blank")}
                    >
                      Photo {index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
      <Dialog
        open={visible}
        PaperProps={{
          style: { borderRadius: 10 }
        }}
        onClose={handleClose}
      >
        <div className="zipModal">
          <div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <CloseOutlined onPress={handleClose} />
            </div>
            <div className="p-3">
              <div className="heading1">{taskIndex}</div>
              {feedback?.map(feed => (
                <div
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    display: "flex",
                    marginTop: 10,
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    style={{
                      flexDirection: "row",
                      display: "flex",
                      width: "100%",
                      marginLeft: -5,
                      marginTop: 10,
                      alignItems: "center"
                    }}
                  >
                    <Checkbox
                      onClick={() => {
                        if (feed?.value === selectedFeedback) {
                          handleChange("selectedFeedback", "")
                        } else {
                          handleChange("selectedFeedback", feed?.value)
                        }
                      }}
                      checked={selectedFeedback === feed?.value}
                    />
                    <div>{feed?.name}</div>
                  </div>
                  <div
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: feed?.color,
                      borderRadius: 15
                    }}
                  />
                </div>
              ))}
              <AppButton
                onClick={_createFeedback}
                disabled={!selectedFeedback}
                loading={loadingFeedback}
                backgroundColor={COLORS.primary}
                color={COLORS.white}
                className={"mt-3 mb-3"}
                borderRadius={10}
                title={"Save"}
              />

              <AppButton
                onClick={handleClose}
                borderRadius={10}
                color={COLORS.primary}
                backgroundColor={"transparent"}
                title={"Cancel"}
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
