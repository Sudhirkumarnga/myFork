import React, { useCallback, useEffect, useRef, useState } from "react"
import haversine from "haversine"
import { Divider, Grid } from "@mui/material"
import { Layout } from "../../components"
import { useParams } from "react-router-dom"
import { useSnackbar } from "notistack"
import { getWorksitesDetail } from "../../api/business"
import { COLORS } from "../../constants"
import {
  GoogleMap,
  Marker,
  useJsApiLoader,
  Polyline
} from "@react-google-maps/api"
import Geocode from "react-geocode"

Geocode.setApiKey("AIzaSyCndwU13bTZ8w_yhP4ErbFGE1Wr9oiro8Q")

Geocode.setLanguage("en")

const path = [
  { lat: 37.772, lng: -122.214 },
  { lat: 21.291, lng: -157.821 },
  { lat: -18.142, lng: 178.431 },
  { lat: -27.467, lng: 153.027 }
]

const options = {
  strokeColor: "#06726A",
  strokeOpacity: 1,
  strokeWeight: 5,
  fillColor: "#06726A",
  fillOpacity: 1,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
}

export default function WorksiteMapView({ route }) {
  const { enqueueSnackbar } = useSnackbar()
  const { id } = useParams()
  // Geolocation.setRNConfiguration({
  //   skipPermissionRequests: false
  // })
  var mapRef = useRef(null)
  const [state, setState] = useState({
    loading: false,
    pinLocation: null,
    worksiteData: null,
    center: {
      lat: -3.745,
      lng: -38.523
    }
  })

  const { currentLocation, pinLocation, worksiteData, center } = state

  const handleChange = (name, value) => {
    setState(pre => ({ ...pre, [name]: value }))
  }

  const [map, setMap] = useState(null)
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center)
    map.fitBounds(bounds)
    setMap(map)
  }, [])

  const onLoadPolyline = polyline => {
    console.log("polyline: ", polyline)
  }

  const onUnmount = useCallback(function callback(map) {
    setMap(null)
  }, [])

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script"
  })

  useEffect(() => {
    getMyLocation()
    if (id) {
      _getWorksite()
    }
  }, [id])

  useEffect(() => {
    Geocode.fromAddress(worksiteData?.location)
      .then(json => {
        var addressComponent = json.results[0].geometry.location
        console.log("addressComponent", addressComponent)
        handleChange("pinLocation", {
          lat: addressComponent.lat,
          lng: addressComponent.lng
        })
      })
      .catch(error => console.warn(error))
  }, [worksiteData])

  const _getWorksite = async () => {
    try {
      handleChange("loading", true)
      let token = localStorage.getItem("token")
      const res = await getWorksitesDetail(id, token)
      handleChange("loading", false)
      handleChange("worksiteData", res?.data)
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

  const getMyLocation = () => {
    const location = window.navigator && window.navigator.geolocation

    if (location) {
      location.getCurrentPosition(
        async position => {
          handleChange("center", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        error => {
          alert(JSON.stringify(error))
        }
      )
    }
  }

  const calcDistance = () => {
    return (
      (pinLocation &&
        currentLocation &&
        haversine(pinLocation, currentLocation)) ||
      0
    )
  }

  const openMap = () => {
    const latitude = pinLocation?.latitude || "40.7127753"
    const longitude = pinLocation?.longitude || "-74.0059728"
    const label = worksiteData?.location || "New York, NY, USA"
  }

  return (
    <div>
      <Layout noFooter>
        <div className="container adjustMaxWidth minheight80vh">
          <div className="headingrowBetween">
            <div className="headingrowBetween">
              <div className="heading">{worksiteData?.name}</div>
            </div>
          </div>
          <Divider className="mt-4" />
          <Grid container>
            <Grid item xs={12} md={4} style={{ padding: 20 }}>
              <div onPress={openMap}>
                <div style={{ color: COLORS.greyButton }}>
                  Street Address:{" "}
                  <div style={{ color: COLORS.darkBlack }}>
                    {worksiteData?.location}
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: 5,
                  color: COLORS.greyButton
                }}
              >
                Distance:{" "}
                <div style={{ color: COLORS.darkBlack }}>
                  {calcDistance()?.toFixed(2) + " mi"}
                </div>
              </div>
            </Grid>
            <Grid item xs={12} md={8}>
              {isLoaded && pinLocation && (
                <>
                  <GoogleMap
                    mapContainerStyle={{
                      width: "100%",
                      height: 500
                    }}
                    center={pinLocation}
                    zoom={12}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    {pinLocation?.lat && pinLocation?.lng && (
                      <Polyline
                        onLoad={onLoadPolyline}
                        path={[
                          { lat: center?.lat, lng: center?.lng },
                          { lat: pinLocation?.lat, lng: pinLocation?.lng }
                        ]}
                        options={options}
                      />
                    )}

                    {/* Child components, such as markers, info windows, etc. */}
                  </GoogleMap>
                </>
              )}
            </Grid>
          </Grid>
        </div>
      </Layout>
    </div>
  )
}
