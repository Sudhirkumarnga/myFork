import React from "react"
import {
  StyleSheet,
  View,
  ScrollView,
  KeyboardAvoidingView
} from "react-native"
import { Fonts, Colors } from "../../res"
import { Button, BaseComponent } from "../Common"
import { CreditCardInput } from "react-native-credit-card-input"

class CardInput extends BaseComponent {
  constructor(props) {
    super()
    this.state = {
      isCardValid: false,
      ccData: null
    }
  }

  onCCChange(form) {
    if (form.valid) {
      this.setState({ ccData: form, isCardValid: true })
    } else {
      this.setState({ ccData: null, isCardValid: false })
    }
  }

  componentDidMount() {}

  getCCProps() {
    return {
      ref: o => (this.CCInput = o),
      labels: {},
      placeholders: {
        number: "Card Number",
        expiry: "Expiration Date",
        cvc: "CVV"
      },
      inputContainerStyle: {
        paddingVertical: 7
      },
      removeCardView: true,
      requiresName: false,
      inputStyle: {
        height: 50,
        width: "100%",
        borderRadius: 10,
        color: Colors.TEXT_INPUT_COLOR,
        padding: 10,
        ...Fonts.poppinsRegular(14),
        borderWidth: 1,
        backgroundColor: Colors.TEXT_INPUT_BG,
        borderColor: Colors.TEXT_INPUT_BORDER
      },
      requiresNumber: true,
      maxLengths: { cvc: 4 },
      labelStyle: {
        ...Fonts.poppinsRegular(14),
        fontWeight: "normal"
      }
    }
  }

  // onSubmit() {
  //   this.showSpinner(true);
  //   let params = {};
  //   params = {...this.state.ccData?.values};
  //   let newParams = Object.assign({}, params);
  //   delete newParams.cvv;
  //   newParams = {
  // 	card_number: params.number,
  // 	card_holder_name: params.name,
  // 	expiry: params.expiry,
  //   };
  //   if (this.state.isCardValid) {
  // 	UserManager.addCardDetails(newParams)
  // 	  .then(res => {
  // 		this.showSpinner(false);
  // 		this.props.addPaymentCard(newParams);
  // 		this.props.navigation.goBack({isDrawer: true});
  // 	  })
  // 	  .catch(err => {
  // 		this.showSpinner(false);
  // 		alert(err.response.data.message);
  // 		console.log(err);
  // 	  });
  //   }
  // }

  renderForms() {
    return (
      <CreditCardInput
        {...this.getCCProps()}
        onChange={text => this.onCCChange(text)}
      />
    )
  }

  renderFooterButton() {
    return (
      <Button
        title={this.strings("add")}
        style={styles.footerButton}
        onPress={() => this.onSubmit()}
        disabled={!this.state.isCardValid}
      />
    )
  }

  renderContent() {
    return <View style={styles.mainContainer}>{this.renderForms()}</View>
  }

  render() {
    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <View style={styles.container}>{this.renderContent()}</View>
      </KeyboardAvoidingView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  mainContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 0
  }
})

export default CardInput
