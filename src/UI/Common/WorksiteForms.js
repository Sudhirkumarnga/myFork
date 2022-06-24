import { Colors, Images, Strings } from "../../res"

const fields = {
  worksiteName: {
    key: "worksiteName",
    dateType: false,
    label: Strings.worksiteName,
    placeholder: Strings.firstNameLabel,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  worksiteLocation: {
    key: "worksiteLocation",
    dateType: false,
    label: Strings.worksiteLocation,
    placeholder: "",
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  description: {
    key: "description",
    dateType: false,
    label: Strings.description,
    placeholder: Strings.description
  },
  monthlyRate: {
    key: "monthlyRate",
    dateType: false,
    label: Strings.monthlyRate,
    placeholder: Strings.monthlyRate
  },
  notes: {
    key: "email",
    dateType: false,
    label: Strings.notes,
    placeholder: Strings.notes
  },
  cleaningFreq: {
    key: "cleaningFreq",
    dateType: false,
    label: Strings.cleaningFreq,
    placeholder: "",
    dropdown: true,
    items: [
      { label: "Sunday", value: "Sunday" },
      { label: "Monday", value: "Monday" },
      { label: "Tuesday", value: "Tuesday" },
      { label: "Wednesday", value: "Wednesday" },
      { label: "Thursday", value: "Thursday" },
      { label: "Friday", value: "Friday" },
      { label: "Saturday", value: "Saturday" }
    ]
  },
  desiredTime: {
    key: "desiredTime",
    label: Strings.desiredTime,
    dateType: false,
    placeholder: "",
    textInputProps: {}
  },
  numWorkers: {
    key: "numWorkers",
    label: Strings.numWorkers,
    placeholder: "",
    regex: null
  },
  supplies: {
    key: "supplies",
    dateType: false,
    label: Strings.supplies,
    placeholder: "",
    regex: null,
    items: [
      { label: "Male", value: "Male" },
      { label: "Female", value: "Female" }
    ],
    dropdown: true
  },
  taskName: {
    key: "taskName",
    dateType: false,
    label: Strings.taskName,
    placeholder: Strings.taskName,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  criticality: {
    key: "criticality",
    dateType: false,
    label: Strings.criticality,
    placeholder: Strings.criticality,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  },
  taskFreq: {
    key: "taskFreq",
    dateType: false,
    label: Strings.taskFreq,
    placeholder: Strings.taskFreq,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: "words" }
  }
}

let formDetails = {
  addWorksite: {
    show: [
      "worksiteName",
      "worksiteLocation",
      "description",
      "notes",
      "monthlyRate",
      "cleaningFreq",
      "desiredTime",
      "numWorkers",
      "supplies"
    ]
  },
  addTask: {
    show: ["taskName", "description", "notes", "criticality", "taskFreq"]
  }
}

export default class WorksiteForms {
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
