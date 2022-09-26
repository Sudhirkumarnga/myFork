import React from "react"
import { View, ScrollView, Dimensions, StyleSheet } from "react-native"
import CreditCardInput from "react-native-credit-card-input/src/CreditCardInput"
import CreditCard from "react-native-credit-card-input/src/CardView"
import CCInput from "react-native-credit-card-input/src/CCInput"
const s = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  form: {
    marginTop: 10,
    paddingTop: 5
  },
  inputContainer: {
    marginLeft: 0,
    marginTop: 0
  },
  input: {
    marginTop: 0
  }
})
CreditCardInput.prototype.render = function () {
  const {
    cardImageFront,
    cardImageBack,
    inputContainerStyle,
    values: { number, expiry, cvc, name, type },
    focused,
    container,
    cardImageSize,
    allowScroll,
    requiresName,
    requiresCVC,
    requiresNumber,

    requiresPostalCode,
    cardScale,
    cardFontFamily,
    cardBrandIcons,
    CVCInputStyle,
    expiryInputStyle,
    cardNumberInputStyle,
    nameInputStyle,
    postalCodeInputStyle,
    placeholderStyle,
    baseTextStyle,
    focusedStyle,
    removeCardView
  } = this.props
  const width = Dimensions.get("window").width
  return (
    <View style={[s.container, container]}>
      {!removeCardView && (
        <CreditCard
          placeholderStyle={placeholderStyle}
          focusedStyle={focusedStyle}
          baseTextStyle={baseTextStyle}
          focused={focused}
          brand={type}
          scale={cardScale}
          baseSize={cardImageSize}
          fontFamily={cardFontFamily}
          imageFront={cardImageFront}
          imageBack={cardImageBack}
          customIcons={cardBrandIcons}
          name={requiresName ? name : " "}
          number={number}
          expiry={expiry}
          cvc={cvc}
        />
      )}
      {this.props.renderScanView && this.props.renderScanView()}

      <ScrollView
        ref="Form"
        keyboardShouldPersistTaps="always"
        scrollEnabled={allowScroll}
        showsHorizontalScrollIndicator={false}
        style={[{ width: "100%" }]}
      >
        {requiresNumber && (
          <CCInput
            {...this._inputProps("number")}
            keyboardType="numeric"
            rightImage
            containerStyle={[
              s.inputContainer,
              {
                width: "100%"
              },
              inputContainerStyle,
              cardNumberInputStyle
            ]}
          />
        )}
        {requiresName && (
          <CCInput
            {...this._inputProps("name")}
            keyboardType="default"
            containerStyle={[
              s.inputContainer,
              { width: "100%" },
              inputContainerStyle,
              nameInputStyle
            ]}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between"
          }}
        >
          <CCInput
            {...this._inputProps("expiry")}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              {
                width: width * 0.43
              },
              inputContainerStyle,
              CVCInputStyle
            ]}
          />

          {requiresCVC && (
            <CCInput
              {...this._inputProps("cvc")}
              keyboardType="numeric"
              containerStyle={[
                s.inputContainer,
                {
                  width: width * 0.43
                },
                inputContainerStyle,
                expiryInputStyle
              ]}
            />
          )}
        </View>

        {requiresPostalCode && (
          <CCInput
            {...this._inputProps("postalCode")}
            keyboardType="numeric"
            containerStyle={[
              s.inputContainer,
              {
                marginTop: 5,
                width: "100%",
                marginBottom: 15
              },
              inputContainerStyle,
              postalCodeInputStyle
            ]}
          />
        )}
      </ScrollView>
    </View>
  )
}
