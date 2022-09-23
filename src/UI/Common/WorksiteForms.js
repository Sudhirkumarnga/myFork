import { Colors, Images, Strings } from '../../res'

const fields = {
  worksiteName: {
    key: 'name',
    dateType: false,
    label: Strings.worksiteName,
    placeholder: Strings.firstNameLabel,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: 'words' }
  },
  worksiteLocation: {
    key: 'location',
    dateType: false,
    label: Strings.worksiteLocation,
    placeholder: '',
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: 'words' }
  },
  description: {
    key: 'description',
    dateType: false,
    label: Strings.description,
    placeholder: Strings.description
  },
  monthlyRate: {
    key: 'monthly_rates',
    dateType: false,
    label: Strings.monthlyRate,
    placeholder: Strings.monthlyRate,
    textInputProps: { keyboardType: 'phone-pad' }
  },
  notes: {
    key: 'notes',
    dateType: false,
    label: Strings.notes,
    placeholder: Strings.notes
  },
  cleaningFreq: {
    key: 'clear_frequency_by_day',
    dateType: false,
    label: Strings.cleaningFreq,
    placeholder: '',
    dropdown: true,
    items: [
      { label: 'Sunday', value: 'Sunday' },
      { label: 'Monday', value: 'Monday' },
      { label: 'Tuesday', value: 'Tuesday' },
      { label: 'Wednesday', value: 'Wednesday' },
      { label: 'Thursday', value: 'Thursday' },
      { label: 'Friday', value: 'Friday' },
      { label: 'Saturday', value: 'Saturday' }
    ]
  },
  desiredTime: {
    key: 'desired_time',
    label: Strings.desiredTime,
    dateType: false,
    placeholder: '',
    textInputProps: {}
  },
  numWorkers: {
    key: 'number_of_workers_needed',
    label: Strings.numWorkers,
    placeholder: '',
    regex: null,
    textInputProps: { keyboardType: 'phone-pad' }
  },
  supplies: {
    key: 'supplies_needed',
    dateType: false,
    label: Strings.supplies,
    placeholder: '',
    regex: null,
    textInputProps: { keyboardType: 'phone-pad' }
  },
  taskName: {
    key: 'name',
    dateType: false,
    label: Strings.taskName,
    placeholder: Strings.taskName,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: 'words' }
  },
  criticality: {
    key: 'criticality',
    dateType: false,
    label: Strings.criticality,
    placeholder: Strings.criticality,
    dropdown: true,
    items: [
      { label: 'LOW', value: 'LOW' },
      { label: 'MEDIUM', value: 'MEDIUM' },
      { label: 'HIGH', value: 'HIGH' }
    ]
  },
  taskFreq: {
    key: 'frequency_of_task',
    dateType: false,
    label: Strings.taskFreq,
    placeholder: Strings.taskFreq,
    dropdown: true,
    items: [
      { label: 'WEEKLY', value: 'WEEKLY' },
      { label: 'MONTHLY', value: 'MONTHLY' },
      { label: 'YEARLY', value: 'YEARLY' }
    ]
  },
  contactName: {
    key: 'contact_person_name',
    dateType: false,
    label: Strings.name,
    placeholder: Strings.name,
    regex: /^[a-zA-Z- .' \\s ]*$/,
    textInputProps: { autoCapitalize: 'words' }
  },
  phone: {
    code: {
      key: 'countrycode',
      label: 'Country Code',
      placeholder: '',
      regex: /^(\+\d{1,4})$/,
      textInputProps: { keyboardType: 'phone-pad' }
    },
    countryCodeRequired: true,
    key: 'contact_phone_number',
    dateType: false,
    label: Strings.phoneLabel,
    placeholder: '',
    regex: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
    phoneNumberValidation: true,
    textInputProps: { keyboardType: 'phone-pad' }
  }
}

let formDetails = {
  addWorksite: {
    show: [
      'worksiteName',
      'worksiteLocation',
      'description',
      'notes',
      'monthlyRate',
      'cleaningFreq',
      'desiredTime',
      'numWorkers',
      'supplies'
    ]
  },
  worksiteContact: {
    show: ['contactName', 'phone']
  },
  addTask: {
    show: ['taskName', 'description', 'notes', 'criticality', 'taskFreq']
  }
}

export default class WorksiteForms {
  static fields (key, updateFields = {}, customFormDetails = null) {
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
  static getFields (key = null) {
    return key ? fields[key] : fields
  }
  static getDetails (key = null) {
    return key ? formDetails[key] : formDetails
  }
}
