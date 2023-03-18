import { Input } from "@mui/material"
import React from "react"
import Label from "./Label"

export default function AppInput({
  backgroundColor,
  color,
  borderRadius,
  placeholder,
  multiline,
  prefix,
  border,
  inputWidthFull,
  postfix,
  label,
  className,
  value,
  onChange,
  name,
  type,
  select,
  selectOptions,
  height,
  max
}) {
  return (
    <div style={{ width: "100%" }} className={className}>
      <Label text={label} />
      <div
        style={{
          width: "100%",
          display: "flex",
          borderRadius: borderRadius || 5,
          backgroundColor: backgroundColor || "#F7F7F7",
          color: color || "#000",
          padding: "0 15px",
          height: multiline ? height || 150 : height || 55,
          justifyContent: "space-between",
          border: border || "1px solid #CECECE"
        }}
      >
        <div className="d-flex" style={{ width: "100%" }}>
          {prefix}
          {multiline ? (
            <textarea
              type={type}
              placeholder={placeholder}
              onChange={value => onChange(name, value.target.value)}
              value={value}
              style={{
                border: "none",
                backgroundColor: backgroundColor || "#F7F7F7",
                color: color || "#000",
                width: "100%"
              }}
            />
          ) : (
            <>
              {select ? (
                <select
                  value={value}
                  style={{
                    border: "none",
                    backgroundColor: backgroundColor || "#F7F7F7",
                    color: color || "#000",
                    height: height || 50,
                    width: "100%"
                  }}
                  placeholder={placeholder}
                  onChange={value => onChange(name, value.target.value)}
                >
                  {selectOptions}
                </select>
              ) : (
                <input
                  type={type}
                  max={max}
                  placeholder={placeholder}
                  onChange={value => onChange(name, value.target.value)}
                  value={value}
                  style={{
                    border: "none",
                    backgroundColor: backgroundColor || "#F7F7F7",
                    color: color || "#000",
                    height: height - 3 || 50,
                    width: "100%"
                  }}
                />
              )}
            </>
          )}
        </div>
        {postfix}
      </div>
    </div>
  )
}
