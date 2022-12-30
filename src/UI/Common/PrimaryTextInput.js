import React, { Component } from "react"
import {
  Text,
  StyleSheet,
  View,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
  Platform
} from "react-native"
import { Fonts, Colors, Images } from "../../res"
import RNPickerSelect from "react-native-picker-select"
import DatePicker from "react-native-datepicker"
import { Icon } from "react-native-elements"

class PrimaryTextInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: this.props.text || "",
      isFocused: false,
      isValid: false,
      isPwdVisible: false,
      showDatePicker: false
    }
    this.onFocus = this.onFocus.bind(this)
    this.onChangeText = this.onChangeText.bind(this)
    this.onBlur = this.onBlur.bind(this)
  }

  text() {
    return this.state.text ? this.state.text : ""
  }

  clear() {
    this.setState({ text: "" })
  }

  isValid(text, countryCodeInput) {
    if (!!text || !!this.state.text) {
      let inputText = text || this.state.text
      const regex = this.props.regex
      if (regex && regex instanceof RegExp && !countryCodeInput && inputText) {
        return regex.test(inputText)
      } else if (this.props.onValidationCheck) {
        return this.props.onValidationCheck(inputText.trim())
      } else {
        return true
      }
    }
    return false
  }

  onFocus() {
    if (this.props.handleFocus) {
      Keyboard.dismiss()
      // this.txtInput?.blur()
    } else if (this.props.dateType) {
      // this.txtInput.blur()
      Keyboard.dismiss()
      this.datePicker.onPressDate()
    } else if (this.props.dropdown) {
      // this.txtInput.blur()
      Keyboard.dismiss()
      this.inputRefs.togglePicker(true)
    } else {
      this.setState({ isFocused: true })
    }
  }

  onBlur() {
    this.setState({ isFocused: false })
  }

  borderColor() {
    return this.state.isFocused
      ? this.state.text
        ? this.state.isValid && !this.props.isPassInValid
          ? Colors.VALID_TEXT_INPUT
          : Colors.INVALID_TEXT_INPUT
        : Colors.FOCUSSED_TEXT_INPUT
      : Colors.TEXT_INPUT_BORDER
  }

  onChangeText(text) {
    const isValid = this.isValid(text)
    this.props.onChangeText(text, isValid)
    this.setState({ text, isValid })
  }

  renderDatePicker() {
    if (this.props.dateType) {
      return (
        <DatePicker
          style={{
            width: "87%",
            top: 5,
            position: "absolute",
            justifyContent: "flex-start"
          }}
          ref={o => (this.datePicker = o)}
          mode="date"
          androidMode={"spinner"}
          display="default"
          placeholder=" "
          showIcon={false}
          confirmBtnText={"Confirm"}
          cancelBtnText={"Cancel"}
          format=" MM/DD/YYYY"
          date={new Date(this.props.text ? this.props.text : Date.now())}
          maxDate={this.props.maxDate || new Date()}
          customStyles={{
            dateInput: [
              styles.inputStyle,
              {
                backgroundColor: "transparent",
                borderWidth: 0,
                height: 40,
                borderColor: this.state.isFocused
                  ? Colors.FOCUSSED_TEXT_INPUT
                  : Colors.TEXT_INPUT_BORDER_COLOR
              }
            ],
            dateText: styles.dateText,
            datePicker: { justifyContent: "center" }
          }}
          onDateChange={text => this.onChangeText(text)}
        />
      )
    }
  }

  renderDropDownPicker() {
    if (this.props.dropdown) {
      return (
        <RNPickerSelect
          items={
            this.props.streetCity || !!this.props.secondaryItems
              ? this.props.secondaryItems
                ? this.props.secondaryItems
                : [{ label: "", value: "" }]
              : this.props.items
          }
          ref={el => {
            this.inputRefs = el
          }}
          placeholder={{
            label: this.state.text
              ? this.props.label
              : !this.props.text
              ? this.props.label
              : null,
            value: null
          }}
          fixAndroidTouchableBug
          Icon={() => {
            return <Image {...Images.downArrow} />
          }}
          doneText={this.props.text}
          // value={this.props.text}
          style={{
            inputIOS: styles.inputIOS,
            iconContainer: styles.iconContainer,
            inputAndroid: styles.inputAndroid,
            inputAndroidContainer: {}
          }}
          onValueChange={(itemValue, itemIndex) => {
            this.onChangeText(itemValue)
          }}
        />
      )
    }
  }

  renderRightInputView() {
    if (this.props.passwordPolicy) {
      return (
        <TouchableOpacity
          style={styles.rightInputView}
          hitSlop={{ right: 20, left: 20 }}
          onPress={() => {
            this.setState({ isPwdVisible: !this.state.isPwdVisible })
          }}
        >
          {this.state.isPwdVisible ? (
            <Icon name="eye" type="feather" color={"#818080"} size={20} />
          ) : (
            <Image
              {...Images.hide}
              style={{ resizeMode: "contain", width: 20, height: 20 }}
            />
          )}
        </TouchableOpacity>
      )
    } else if (this.props.dateType) {
      return (
        <TouchableOpacity style={[styles.rightInputView, { top: 17 }]}>
          <Image {...Images.calendar} />
        </TouchableOpacity>
      )
    } else if (this.props.dropdown) {
      return (
        <TouchableOpacity style={[styles.rightInputView, { top: 18 }]}>
          <Image {...Images.arrowDown} />
        </TouchableOpacity>
      )
    } else if (this.props.rightIcon) {
      return (
        <TouchableOpacity
          style={[styles.rightInputView, { top: 15, right: 35 }]}
        >
          <Image
            {...this.props.rightIcon}
            style={{ resizeMode: "contain", width: 20, height: 20 }}
          />
        </TouchableOpacity>
      )
    }
  }

  renderTextInput = () => {
    return (
      <TextInput
        style={[
          styles.inputStyle,
          { borderColor: this.borderColor() },
          this.props.inputStyle
        ]}
        ref={ref =>
          ref &&
          ref.props &&
          ref.setNativeProps({
            text: ref.props.value,
            style: { fontFamily: "Poppins-Regular" }
          })
        }
        placeholder={!this.props.dropdown ? this.props.label : ""}
        textAlignVertical="top"
        multiline={this.props.multiline}
        onFocus={() => this.onFocus()}
        // ref={o => (this.txtInput = o)}
        onBlur={() => this.onBlur()}
        maxLength={this.props.maxLength}
        onChangeText={text => this.onChangeText(text)}
        value={this.state.text || this.props.text}
        secureTextEntry={
          (this.state.text !== "" || this.props.text !== "") &&
          !this.state.isPwdVisible &&
          !!this.props.onPasswordValidationCheck
        }
        {...this.props.textInputProps}
      />
    )
  }

  primaryTextInput(inputStyle) {
    if (this.props.dropdown) {
      return (
        <TouchableOpacity
          disabled={false}
          onPress={() => this.inputRefs.togglePicker()}
        >
          <View>{this.renderTextInput(inputStyle)}</View>
        </TouchableOpacity>
      )
    }
    return this.renderTextInput(inputStyle)
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        {this.renderTextInput(styles)}
        {this.renderRightInputView(styles)}
        {this.renderDatePicker(styles)}
        {this.renderDropDownPicker(styles)}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 7
  },
  inputStyle: {
    height: 50,
    width: "90%",
    paddingTop: Platform.OS === "android" ? 15 : 0,
    borderRadius: 10,
    color: Colors.TEXT_INPUT_COLOR,
    paddingHorizontal: 15,
    ...Fonts.poppinsRegular(14),
    borderWidth: 1,
    backgroundColor: Colors.TEXT_INPUT_BG,
    borderColor: Colors.TEXT_INPUT_BORDER
  },
  rightInputView: {
    position: "absolute",
    right: 30,
    top: 15
  },
  inputIOS: {
    height: 50,
    position: "absolute",
    bottom: 0,
    width: "90%",
    paddingHorizontal: 30,
    color: "transparent",
    ...Fonts.poppinsRegular(14)
  },
  inputAndroid: {
    // height: 44,
    position: "absolute",
    bottom: 0,
    left: 25,
    width: "90%",
    paddingHorizontal: 20
  },
  dateText: { display: "none" }
})

export default PrimaryTextInput
