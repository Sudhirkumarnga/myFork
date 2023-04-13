import React from "react"
import { Layout } from "../../components"
import { Divider } from "@mui/material"
import { useNavigate } from "react-router-dom"

export default function Reports({}) {
  const navigate = useNavigate()
  const reportList = [
    { title: "Schedule Variances" },
    { title: "Location Variances" },
    // { title: 'Employee Time-off Requests' },
    { title: "Payroll Reports" },
    // { title: 'Mindset Reports' },
    // { title: 'Employee Skill Reports' },
    { title: "Inspection" }
  ]
  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div>
              <div className="heading">Reports</div>
            </div>
          </div>
          <Divider className="mt-4 mb-4" />
          <div style={{ width: "100%", marginTop: 20, alignItems: "center" }}>
            {reportList.map((report, index) => (
              <div
                key={index}
                onClick={() => navigate(`/reports/list?type=${report.title}`)}
                style={{ width: "90%", cursor: "pointer", marginBottom: 20 }}
              >
                <div>{report.title}</div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  )
}
