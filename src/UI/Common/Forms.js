import { Colors, Images, Strings } from "../../res"

const fields = {
  firstName: {
    key: "first_name",
    dateType: false,
    label: Strings.firstNameLabel,
    placeholder: Strings.firstNameLabel,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  lastName: {
    key: "last_name",
    dateType: false,
    label: Strings.lastNameLabel,
    placeholder: "",
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  businessName: {
    key: "businessName",
    dateType: false,
    label: Strings.businessNameLabel,
    placeholder: "",
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  fullName: {
    key: "fullName",
    dateType: false,
    label: "Full Name",
    placeholder: "",
    onValidationCheck: val =>
      !!val &&
      val.split(" ").length >= 2 &&
      val.split(" ")[1].length > 0 &&
      /^[ a-zA-Z ][a-zA-Z0-9- .'’ \\s ]*$/.test(val),
    textInputProps: { autoCapitalize: "words", maxLength: 33 }
  },
  email: {
    key: "email",
    dateType: false,
    label: Strings.emailLabel,
    placeholder: Strings.emailLabel,
    regex:
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    textInputProps: { keyboardType: "email-address", autoCapitalize: "none" }
  },
  phone: {
    code: {
      key: "countrycode",
      label: "Country Code",
      placeholder: "",
      regex: /^(\+\d{1,4})$/,
      textInputProps: { keyboardType: "phone-pad" }
    },
    countryCodeRequired: true,
    key: "mobile",
    dateType: false,
    label: Strings.phoneLabel,
    placeholder: "",
    regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    phoneNumberValidation: true,
    textInputProps: { keyboardType: "phone-pad", maxLength: 10 }
  },
  password: {
    key: "password",
    dateType: false,
    label: Strings.passwordLabel,
    placeholder: "",
    passwordPolicy: true,
    textInputProps: { autoCapitalize: "none" }
  },
  signUpCode: {
    key: "signUpCode",
    dateType: false,
    label: "Signup Code",
    placeholder: "",
    textInputProps: { maxLength: 4 }
  },
  dob: {
    key: "dob",
    dateType: true,
    label: Strings.birthdayLabel,
    placeholder: "",
    regex: null
  },
  gender: {
    key: "gender",
    dateType: false,
    label: "Gender",
    placeholder: "",
    regex: null,
    items: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" }
    ],
    dropdown: true
  },
  addressLine1: {
    key: "addressLine1",
    dateType: false,
    label: Strings.addressLine1,
    placeholder: "",
    textInputProps: { autoCapitalize: "none" }
  },
  addressLine2: {
    key: "addressLine2",
    dateType: false,
    label: Strings.addressLine1,
    placeholder: "",
    textInputProps: { autoCapitalize: "none" }
  },
  zip: {
    key: "zip",
    dateType: false,
    label: "Zip",
    placeholder: "",
    textInputProps: { maxLength: 4 }
  },
  position: {
    key: "position",
    dateType: false,
    label: Strings.position,
    placeholder: "",
    textInputProps: { autoCapitalize: "none" }
  },
  role: {
    key: "role",
    dateType: false,
    label: Strings.role,
    placeholder: "",
    dropdown: true,
    items: [
      { label: "Role number 1", value: "Role number 1" },
      { label: "Role number 2", value: "Role number 2" }
    ],
    textInputProps: { autoCapitalize: "none" }
  },
  city: {
    key: "city",
    dateType: false,
    label: Strings.city,
    placeholder: "",
    dropdown: true,
    items: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" }
    ],
    textInputProps: { autoCapitalize: "none" }
  },
  state: {
    key: "state",
    dateType: false,
    label: "State",
    placeholder: "State",
    textInputProps: { autoCapitalize: "none" }
  },
  country: {
    key: "country",
    dateType: false,
    label: "Country",
    placeholder: "Country",
    textInputProps: { autoCapitalize: "none" }
  },
  price: {
    key: "price",
    dateType: false,
    label: Strings.pricePerHr,
    placeholder: ""
  },
  payFreq: {
    key: "payFreq",
    dateType: false,
    label: Strings.payFreq,
    placeholder: "",
    dropdown: true,
    items: [
      { label: "Weekly", value: "Weekly" },
      { label: "Every two weeks", value: "Every two weeks" },
      { label: "On the 1st and 15th", value: "On the 1st and 15th" }
    ]
  }
}

let formDetails = {
  signUp: {
    show: ["firstName", "lastName", "phone", "email", "password"]
  },
  signUpEmp: {
    show: ["firstName", "lastName", "phone", "email", "password", "signUpCode"]
  },
  login: {
    show: ["email", "password"],
    updateFields: {
      password: {
        label: "Password"
      }
    }
  },
  changePassword: {
    show: ["password"],
    updateFields: {
      password: {
        label: "New Password"
      }
    }
  },
  feedback: {
    show: ["email"],
    updateFields: {
      email: {
        label: "Email address"
      }
    }
  },
  profile: {
    show: ["firstName", "lastName", "email", "phone"]
  },
  emergencyContact: {
    show: ["firstName", "lastName", "phone"]
  },
  employeePersonalInfo: {
    show: ["firstName", "lastName", "dob", "gender"]
  },
  businessInfo: {
    show: [
      "businessName",
      "payFreq",
      "firstName",
      "lastName",
      "phone",
      "gender",
      "dob"
    ]
  },
  businessAddress: {
    show: ["addressLine1", "addressLine2", "city", "state", "zip"],
    updateFields: {
      addressLine1: {
        label: "Business Address Line 1"
      },
      addressLine2: {
        label: "Business Address Line 2"
      }
    }
  },
  employeeContact: {
    show: ["email", "phone"]
  },
  employeeAddress: {
    show: ["addressLine1", "addressLine2", "city"]
  },
  employeeWorkInfo: {
    show: ["position", "price"]
  },
  cardHolder: {
    show: [
      "firstName",
      "lastName",
      "addressLine1",
      "addressLine2",
      "city",
      "state",
      "country"
    ]
  }
}

export default class Forms {
  static fields(key, updateFields = {}, customFormDetails = null) {
    const form = this.getDetails(key)
    const allFields = form.show.map((k, index) => {
      let nextKey = null
      if (index < form.length - 1) {
        nextKey = this.getFields(form.show[index + 1]).key
      }
      return {
        ...this.getFields(k),
        ...(form.updateFields && form.updateFields[k])
      }
    })
    return allFields
  }
  static getFields(key = null) {
    return key ? fields[key] : fields
  }
  static getDetails(key = null) {
    return key ? formDetails[key] : formDetails
  }
}
