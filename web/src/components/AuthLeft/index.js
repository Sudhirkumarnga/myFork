import { Grid } from "@mui/material"
import React from "react"
import LOGO from "../../assets/svg/loginBG.svg"
import LOGO2 from "../../assets/images/loginBG2.jpg"
import LOGO3 from "../../assets/images/loginBG3.jpg"
import Slider from "react-slick"
import { ReactComponent as LogoText } from "../../assets/svg/LogoText.svg"

export default function AuthLeft(params) {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    autoplay: true,
    lazyLoad: true,
    fade: true,
    speed: 3000,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <Grid item xs={12} md={8} className="LoginBG">
      <div className="fixedContent">
        <LogoText />
        <h1 className="loginText">
          Superior scheduling system for cleaning companies.
        </h1>
      </div>
      <Slider {...settings}>
        <div>
          <img src={LOGO} className="sliderImage" />
        </div>
        <div>
          <img src={LOGO2} className="sliderImage" />
        </div>
        <div>
          <img src={LOGO3} className="sliderImage" />
        </div>
      </Slider>
    </Grid>
  )
}
