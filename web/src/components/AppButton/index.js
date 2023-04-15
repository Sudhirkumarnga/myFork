import { Button, CircularProgress } from "@mui/material"
import React from "react"

export default function AppButton({
  title,
  backgroundColor,
  color,
  borderRadius,
  borderColor,
  className,
  onClick,
  loading,
  disabled,
  width,
  height,
  prefix
}) {
  return (
    <Button
      className={className}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: width || "100%",
        borderRadius: borderRadius || 5,
        backgroundColor: backgroundColor || "#fff",
        borderColor: borderColor || "#fff",
        borderWidth: borderColor ? 1 : 0,
        borderStyle: "solid",
        color: color || "#000",
        textTransform: "capitalize",
        height: height || 50,
        opacity: disabled ? 0.5 : 1
      }}
    >
      {prefix && prefix}
      {loading ? <CircularProgress className="loadingButton" /> : title}
    </Button>
  )
}
