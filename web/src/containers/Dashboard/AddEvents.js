import React, { useEffect, useState } from "react"
import moment from "moment"
import { useContext } from "react"
import {
  createEvent,
  deleteEvent,
  getAllEmployee,
  getAllWorksites,
  getEventDetails,
  updateEvent
} from "../../api/business"
import userProfile from "../../assets/images/sample.png"
import { AppButton, AppInput, Layout, Loader } from "../../components"
import { COLORS, FREQUENCIES, reminderList } from "../../constants"
import { Checkbox, Dialog, Divider, Grid } from "@mui/material"
import { CloseOutlined } from "@mui/icons-material"
import AppContext from "../../Context"
import { useNavigate, useParams } from "react-router-dom"
import { getSimplifiedError } from "../../utils/error"
import { useSnackbar } from "notistack"

export default function AddEvents({}) {
  const { schedules } = useContext(AppContext)
  const { id } = useParams()
  const { enqueueSnackbar } = useSnackbar()
  const token = localStorage.getItem("token")
  const navigate = useNavigate()
  const [state, setState] = useState({
    mode: "week",
    worksite: "",
    start_date: "",
    end_date: "",
    frequency: "",
    description: "",
    start_time: new Date(),
    start_time_text: "",
    end_time: new Date(),
    frequency_end_date: new Date(),
    end_time_text: "",
    notes: "",
    openStart: false,
    reminder: false,
    loading: false,
    visible: false,
    schedule_inspection: false,
    loadingDelete: false,
    loadingMain: false,
    openEnd: false,
    visible1: false,
    worksiteOptions: [],
    selected_tasks: [],
    allEmployee: [],
    employees: [],
    event_status: "",
    publishing_reminder: "",
    eventDetails: null,
    deleteAll: false,
    deleteThis: true,
    deleteFollowing: false,
    type: "text",
    type2: "text",
    type3: "text",
    type4: "text",
    selectedEvent: null
  })
  const {
    end_date,
    worksite,
    start_date,
    end_time,
    endStart,
    end_time_text,
    frequency,
    frequency_end_date,
    description,
    notes,
    reminder,
    schedule_inspection,
    openStart,
    start_time,
    start_time_text,
    allWorksites,
    worksiteOptions,
    selected_tasks,
    allEmployee,
    employees,
    event_status,
    publishing_reminder,
    loading,
    eventDetails,
    visible,
    visible1,
    loadingDelete,
    loadingMain,
    deleteAll,
    deleteFollowing,
    deleteThis,
    selectedEvent,
    type,
    type2,
    type3,
    type4
  } = state

  const getReminderListText = value => {
    const filtered = reminderList.filter(e => e.value === value)
    return filtered.length > 0 ? filtered[0].label : ""
  }

  const handleChange = (key, value) => {
    setState(pre => ({ ...pre, [key]: value }))
  }

  useEffect(() => {
    _getAllWorksites()
    _getAllEmployee()
    if (id) {
      _getEventDetails()
    }
  }, [id])

  const handleSubmit = async () => {
    try {
      handleChange("loading", true)
      const payload = {
        worksite,
        start_time: moment
          .utc(moment(start_date + " " + start_time_text))
          .format("YYYY-MM-DD HH:mm:ss"),
        end_time: moment
          .utc(moment(end_date + " " + end_time_text))
          .format("YYYY-MM-DD HH:mm:ss"),
        description,
        notes,
        reminder,
        schedule_inspection,
        event_status,
        employees,
        selected_tasks
      }
      publishing_reminder &&
        (payload["publishing_reminder"] = publishing_reminder)
      frequency && (payload["frequency"] = frequency)
      frequency_end_date &&
        (payload["frequency_end_date"] = moment
          .utc(moment(frequency_end_date))
          .format("YYYY-MM-DD"))
      if (id) {
        await updateEvent(id, payload, token)
        enqueueSnackbar("Event has been updated", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      } else {
        await createEvent(payload, token)
        enqueueSnackbar("Event has been created", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right"
          }
        })
      }
      handleChange("loading", false)
      handleChange("visible1", false)
      navigate(-1)
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

  const _getAllEmployee = async () => {
    try {
      handleChange("loading", true)
      const res = await getAllEmployee(token)
      handleChange("loading", false)
      handleChange("allEmployee", res?.data?.results)
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

  const _getAllWorksites = async () => {
    try {
      handleChange("loading", true)
      const res = await getAllWorksites(token)
      handleChange("allWorksites", res?.data?.results)
      const list = []
      res?.data?.results?.forEach(element => {
        if (element) {
          list.push({
            value: element?.id,
            label: element?.personal_information?.name
          })
        }
      })
      handleChange("worksiteOptions", list)
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

  const _getEventDetails = async () => {
    try {
      handleChange("loadingMain", true)
      const res = await getEventDetails(id, token)
      handleChange("loadingMain", false)
      handleChange("eventDetails", res?.data)
      handleChange("worksite", res?.data?.worksite)
      handleChange(
        "start_date",
        moment.utc(res?.data?.start_time).local().format("MM/DD/YYYY")
      )
      handleChange(
        "start_time",
        new Date(moment.utc(res?.data?.start_time).local().format())
      )
      handleChange(
        "start_time_text",
        moment.utc(res?.data?.start_time).local().format("hh:mm A")
      )
      handleChange(
        "end_date",
        moment.utc(res?.data?.end_time).local().format("MM/DD/YYYY")
      )
      handleChange(
        "end_time",
        new Date(moment.utc(res?.data?.end_time).local().format())
      )
      handleChange(
        "end_time_text",
        moment.utc(res?.data?.end_time).local().format("hh:mm A")
      )
      handleChange("frequency", res?.data?.frequency)
      handleChange(
        "frequency_end_date",
        moment.utc(res?.data?.frequency_end_date).local().format("MM/DD/YYYY")
      )
      handleChange("description", res?.data?.description)
      handleChange("notes", res?.data?.notes)
      handleChange("reminder", res?.data?.reminder)
      handleChange("schedule_inspection", res?.data?.schedule_inspection)
      handleChange("event_status", res?.data?.event_status)
      handleChange("employees", res?.data?.employees)
      handleChange("selected_tasks", res?.data?.selected_tasks)
      handleChange("publishing_reminder", res?.data?.publishing_reminder)
    } catch (error) {
      handleChange("loadingMain", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }

  const _deleteEvent = async () => {
    try {
      handleChange("loadingDelete", true)
      const payload = {
        event: id,
        all_events: deleteAll,
        this_and_following_event: deleteFollowing
      }
      await deleteEvent(payload, token)
      handleChange("loadingDelete", false)
      handleChange("visible", false)
      navigate(-1)
    } catch (error) {
      handleChange("loadingDelete", false)
      enqueueSnackbar(getSimplifiedError(error), {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      })
    }
  }
  const getWorksiteText = id => {
    const filtered = allWorksites?.filter(e => e.id === id)
    return (
      (filtered?.length > 0 && filtered[0]?.personal_information?.name) || ""
    )
  }

  const getWorksiteTask = id => {
    if (id) {
      const filtered = allWorksites?.filter(e => e.id == id)
      return (filtered?.length > 0 && filtered[0]?.tasks) || []
    } else return []
  }

  if (loadingMain) {
    return <Loader />
  }

  return (
    <Layout noFooter>
      <div className="adjustMaxWidth minheight80vh">
        <div className="headingrowBetween">
          <div>
            <div className="heading">
              {eventDetails ? "Edit Event" : "Create Event"}
            </div>
          </div>
        </div>
        <Divider className="mt-4" />
        <div className="heading1">{"Worskite Information"}</div>
        <Grid container spacing={3}>
          <Grid item md={6}>
            <AppInput
              select
              value={worksite}
              selectOptions={
                <>
                  <option value={""}>{"Select Worksite"}</option>
                  {worksiteOptions?.map((item, index) => (
                    <option key={index} value={item?.value}>
                      {item?.label}
                    </option>
                  ))}
                </>
              }
              placeholder={getWorksiteText(worksite) || "Worksite"}
              name="worksite"
              // placeholder='worksite'
              onChange={handleChange}
            />
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
              }}
            >
              <div style={{ width: "48%" }}>
                <AppInput
                  value={start_date}
                  onFocus={() => handleChange("type", "date")}
                  onBlur={() => handleChange("type", "text")}
                  type={start_date ? "date" : type}
                  max={new Date("2050/01/01")}
                  // label="From"
                  name="start_date"
                  placeholder="From"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "48%" }}>
                <AppInput
                  onFocus={() => handleChange("type2", "date")}
                  onBlur={() => handleChange("type2", "text")}
                  type={end_date ? "date" : type2}
                  max={new Date("2050/01/01")}
                  value={end_date}
                  // label="To"
                  name={"end_date"}
                  key="end_date"
                  placeholder="To"
                  onChange={handleChange}
                />
              </div>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                width: "100%",
                justifyContent: "space-between"
              }}
            >
              <div style={{ width: "48%" }}>
                <AppInput
                  onFocus={() => handleChange("type3", "time")}
                  onBlur={() => handleChange("type3", "text")}
                  type={start_time_text ? "time" : type3}
                  value={start_time_text}
                  // label="From"
                  name="start_time_text"
                  placeholder="From"
                  onChange={handleChange}
                />
              </div>
              <div style={{ width: "48%" }}>
                <AppInput
                  onFocus={() => handleChange("type4", "time")}
                  onBlur={() => handleChange("type4", "text")}
                  type={end_time_text ? "time" : type4}
                  value={end_time_text}
                  // label="To"
                  name={"end_time_text"}
                  placeholder="To"
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* <div
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "90%",
            marginVertical: 10,
            justifyContent: "space-between"
          }}
        >
          <div style={{ width: "48%" }}>
            <TouchableOpacity
              style={styles.inputStyle}
              onPress={() => handleChange("openStart", true)}
            >
              <Text
                style={[
                  styles.inputText,
                  {
                    color: start_time_text
                      ? Colors.TEXT_COLOR
                      : Colors.BLUR_TEXT
                  }
                ]}
              >
                {start_time_text || "From"}
              </Text>
              <Icon
                name={"time-outline"}
                type={"ionicon"}
                color={Colors.BLUR_TEXT}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              open={openStart}
              mode={"time"}
              date={start_time}
              onConfirm={date => {
                handleChange("openStart", false)
                handleChange("start_time", date)
                handleChange("start_time_text", moment(date).format("hh:mm A"))
              }}
              onCancel={() => {
                handleChange("openStart", false)
              }}
            />
          </div>
          <div style={{ width: "47%" }}>
            <TouchableOpacity
              style={styles.inputStyle}
              onPress={() => handleChange("endStart", true)}
            >
              <Text
                style={[
                  styles.inputText,
                  {
                    color: end_time_text ? Colors.TEXT_COLOR : Colors.BLUR_TEXT
                  }
                ]}
              >
                {end_time_text || "To"}
              </Text>
              <Icon
                name={"time-outline"}
                type={"ionicon"}
                color={Colors.BLUR_TEXT}
              />
            </TouchableOpacity>
            <DatePicker
              modal
              mode={"time"}
              open={endStart}
              date={end_time}
              onConfirm={date => {
                handleChange("endStart", false)
                handleChange("end_time", date)
                handleChange("end_time_text", moment(date).format("hh:mm A"))
              }}
              onCancel={() => {
                handleChange("endStart", false)
              }}
            />
          </div>
        </div> */}
          </Grid>
          <Grid item md={6}>
            <AppInput
              select={true}
              value={frequency}
              selectOptions={
                <>
                  <option value={""}>Select Frequency</option>
                  {FREQUENCIES?.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </>
              }
              placeholder="Frequency of event"
              name="frequency"
              onChange={handleChange}
            />
            {frequency !== "" && frequency && (
              <AppInput
                type={"date"}
                max={new Date("2050/01/01")}
                min={new Date()}
                value={frequency_end_date}
                name="frequency_end_date"
                placeholder="End Date"
                onChange={handleChange}
              />
            )}
            <AppInput
              value={description}
              placeholder="Description"
              name="description"
              onChange={handleChange}
            />
            <AppInput
              value={notes}
              placeholder="Notes"
              name="notes"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
        <div
          style={{
            flexDirection: "row",
            width: "90%",
            display: "flex",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          {/* <BouncyCheckbox
          size={20}
          fillColor={COLORS.primary}
          unfillColor={Colors.WHITE}
          disableBuiltInState
          innerIconStyle={{
            borderColor: Colors.BLUR_TEXT,
            borderRadius: 5,
            marginBottom: 2
          }}
          iconStyle={{
            borderColor: Colors.BLUR_TEXT,
            borderRadius: 5,
            marginBottom: 2
          }}
          onPress={() => handleChange("reminder", !reminder)}
          isChecked={reminder}
        /> */}
          <div>*Remember to account for the travel time</div>
        </div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            width: "90%",
            marginTop: 10,
            alignItems: "center"
          }}
        >
          <Checkbox
            onClick={() =>
              handleChange("schedule_inspection", !schedule_inspection)
            }
            checked={schedule_inspection}
          />
          <div>Scheduled inspection</div>
        </div>
        <Divider className="mt-4" />
        <div className="heading1">Tasks </div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            width: "90%",
            alignItems: "center"
          }}
        >
          <Checkbox
            onCLick={() => {
              if (
                selected_tasks?.length === getWorksiteTask(worksite)?.length
              ) {
                handleChange("selected_tasks", [])
              } else {
                if (getWorksiteTask(worksite)?.length > 0) {
                  const tasklist = []
                  getWorksiteTask(worksite)?.forEach(element => {
                    if (element) {
                      tasklist.push(element?.id?.toString())
                    }
                  })
                  handleChange("selected_tasks", tasklist)
                }
              }
            }}
            checked={
              selected_tasks?.length == getWorksiteTask(worksite)?.length
            }
          />
          <div>Select all</div>
        </div>
        <div className="heading1">Every Time</div>
        {getWorksiteTask(worksite)?.length > 0 &&
          getWorksiteTask(worksite)?.map((task, index) => (
            <div
              key={index}
              style={{
                flexDirection: "row",
                width: "100%",
                display: "flex",
                marginTop: 10,
                marginBottom: 10,
                alignItems: "center",
                paddingBottom: 8,
                borderBottom: `1px solid ${COLORS.borderColor}`
              }}
            >
              <Checkbox
                onClick={() => {
                  if (selected_tasks?.includes(task?.id)) {
                    const removed = selected_tasks?.filter(e => e !== task?.id)
                    handleChange("selected_tasks", removed)
                  } else {
                    handleChange("selected_tasks", [
                      ...selected_tasks,
                      task?.id
                    ])
                  }
                }}
                isChecked={selected_tasks?.includes(task?.id)}
              />
              <div>{task?.name}</div>
            </div>
          ))}
        <div className="heading1 mt-4">{"Assign Employees"}</div>
        <Grid container spacing={3} className="mt-2">
          {allEmployee?.map((item, index) => (
            <Grid
              item
              md={6}
              key={index}
              style={{
                flexDirection: "row",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
                paddingBottom: 10,
                borderBottom: `1px solid ${COLORS.borderColor}`
              }}
            >
              <div className="d-flex align-items-center">
                <img
                  src={
                    item?.personal_information?.profile_image
                      ? item?.personal_information?.profile_image
                      : userProfile
                  }
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 10,
                    marginRight: 20
                  }}
                />
                <div>{item?.personal_information?.first_name}</div>
              </div>
              <Checkbox
                onClick={() => {
                  if (employees?.includes(Number(item?.id))) {
                    const removed = employees?.filter(
                      e => e !== Number(item?.id)
                    )
                    handleChange("employees", removed)
                  } else {
                    handleChange("employees", [...employees, Number(item?.id)])
                  }
                }}
                checked={employees?.includes(Number(item?.id))}
              />
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={3} className="mt-2">
          <Grid item md={6}>
            <div className="heading1">{"Event Status"}</div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                width: "90%",
                alignItems: "center"
              }}
            >
              <Checkbox
                onClick={() => {
                  if (event_status === "DRAFT") {
                    handleChange("event_status", "")
                  } else {
                    handleChange("event_status", "DRAFT")
                  }
                }}
                checked={event_status === "DRAFT"}
              />
              <div>Draft</div>
            </div>
            <div
              style={{
                flexDirection: "row",
                display: "flex",
                width: "90%",
                marginTop: 10,
                alignItems: "center"
              }}
            >
              <Checkbox
                onClick={() => {
                  if (event_status === "PUBLISHED") {
                    handleChange("event_status", "")
                  } else {
                    handleChange("event_status", "PUBLISHED")
                  }
                }}
                checked={event_status === "PUBLISHED"}
              />
              <div>Published</div>
            </div>
          </Grid>
          <Grid item md={6}>
            <div className="heading1">Reminder for publishing draft event</div>
            <AppInput
              select={true}
              value={publishing_reminder}
              selectOptions={
                <>
                  <option value={""}>Select Reminder</option>
                  {reminderList?.map((item, index) => (
                    <option key={index} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </>
              }
              placeholder="Reminder of event"
              name="publishing_reminder"
              onChange={handleChange}
            />
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                marginBottom: 20,
                marginTop: 50
              }}
            >
              {id && (
                <AppButton
                  borderColor={COLORS.primary}
                  backgroundColor={COLORS.white}
                  color={COLORS.primary}
                  onClick={() => handleChange("visible", true)}
                  title={"Delete"}
                  borderRadius={10}
                  width={"60%"}
                />
              )}
              <AppButton
                backgroundColor={COLORS.primary}
                borderRadius={10}
                className={"mt-4"}
                loading={loading}
                color={COLORS.white}
                width={"60%"}
                disabled={
                  // !frequency ||
                  // !description ||
                  !start_date ||
                  !start_time ||
                  !start_time_text ||
                  !end_date ||
                  !end_time ||
                  !end_time_text ||
                  !frequency ||
                  !event_status ||
                  employees.length === 0 ||
                  selected_tasks.length === 0
                }
                onClick={() =>
                  event_status === "PUBLISHED"
                    ? handleChange("visible1", true)
                    : handleSubmit()
                }
                title={id ? "Save" : "Create"}
              />
            </div>
          </Grid>
        </Grid>
        <Dialog open={visible} onClose={() => handleChange("visible", false)}>
          <div className={"zipModal"}>
            <div>
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-end"
                }}
              >
                <CloseOutlined onClick={() => handleChange("visible", false)} />
              </div>
              <div className="heading1" style={{ textAlign: "center" }}>
                {"Are you sure you want to delete this event?"}
              </div>
              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  width: "80%",
                  marginLeft: "5%",
                  marginTop: 10,
                  alignItems: "center"
                }}
              >
                <Checkbox
                  onClick={() => {
                    handleChange("deleteFollowing", false)
                    handleChange("deleteThis", false)
                    handleChange("deleteAll", !deleteAll)
                  }}
                  checked={deleteAll}
                />
                <div>Delete All Frequency Events</div>
              </div>

              <div
                style={{
                  flexDirection: "row",
                  display: "flex",
                  width: "80%",
                  marginLeft: "5%",
                  marginTop: 10,
                  alignItems: "center"
                }}
              >
                <Checkbox
                  onClick={() => {
                    handleChange("deleteAll", false)
                    handleChange("deleteThis", false)
                    handleChange("deleteFollowing", !deleteFollowing)
                  }}
                  checked={deleteFollowing}
                />
                <div>Delete This And Following Events</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "80%",
                  marginLeft: "5%",
                  marginTop: 10,
                  alignItems: "center"
                }}
              >
                <Checkbox
                  onCLick={() => {
                    handleChange("deleteFollowing", false)
                    handleChange("deleteAll", false)
                    handleChange("deleteThis", !deleteThis)
                  }}
                  checked={deleteThis}
                />
                <div>Delete This Event</div>
              </div>
              <AppButton
                backgroundColor={COLORS.primary}
                color={COLORS.white}
                borderRadius={10}
                onClick={_deleteEvent}
                className={"mt-3"}
                loading={loadingDelete}
                title={"Yes"}
              />
              <AppButton
                borderRadius={10}
                className={"mt-3"}
                onClick={() => handleChange("visible", false)}
                color={COLORS.primary}
                borderColor={COLORS.primary}
                backgroundColor={"transparent"}
                title={"Cancel"}
              />
            </div>
          </div>
        </Dialog>
        <Dialog open={visible1} onClose={() => handleChange("visible1", false)}>
          <div className={"zipModal"}>
            <div>
              <div className="rowBetween mb-4">
                <div className="heading1">Message</div>
                <div style={{ alignItems: "flex-end" }}>
                  <CloseOutlined
                    onClick={() => handleChange("visible1", false)}
                  />
                </div>
              </div>
              <div>
                {
                  "All impacted employees will receive a notification regarding the shift change"
                }
              </div>
              <AppButton
                style={{ height: 40 }}
                onClick={handleSubmit}
                backgroundColor={COLORS.primary}
                color={COLORS.white}
                disabled={loading}
                className={"mt-4"}
                borderRadius={10}
                title={"Publish"}
              />
              <AppButton
                onClick={handleSubmit}
                disabled={loading}
                borderRadius={10}
                className={"mt-3"}
                borderColor={COLORS.primary}
                color={COLORS.primary}
                title={"Do not notify"}
              />
            </div>
          </div>
        </Dialog>
      </div>
    </Layout>
  )
}
