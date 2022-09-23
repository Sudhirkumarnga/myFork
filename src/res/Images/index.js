import Splash from '../Svgs/splash.svg'
export { default as Sample } from './common/sample.png';

const Bg = {
  splashBg: {
    source: require('./background/SplashBg.jpg'),
    style: {}
  },
  splash: {
    source: Splash,
    style: {}
  },
  appLogo: {
    source: require('./common/logo.png'),
    style: {}
  },
  hide: {
    source: require('./common/hide.png'),
    style: { height: 22, width: 22, resizeMode: 'contain' }
  },
  checkbox: {
    source: require('./common/checkbox.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  checked: {
    source: require('./common/checked.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  arrowLeft: {
    source: require('./common/arrowLeft.png'),
    style: { height: 14, width: 14, resizeMode: 'contain' }
  },
  arrowDown: {
    source: require('./common/arrowDown.png'),
    style: { height: 14, width: 14, resizeMode: 'contain' }
  },
  camera: {
    source: require('./common/camera.png'),
    style: { height: 22, width: 18, resizeMode: 'contain' }
  },
  calendar: {
    source: require('./background/calendar.png'),
    style: { height: 18, width: 20, resizeMode: 'contain' }
  },
  radio: {
    source: require('./common/radio.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  close: {
    source: require('./common/close.png'),
    style: { height: 12, width: 12, resizeMode: 'contain' }
  },
  edit: {
    source: require('./common/edit.png'),
    style: { height: 20, width: 18, resizeMode: 'contain' }
  },
  delete: {
    source: require('./common/delete.png'),
    style: { height: 20, width: 18, resizeMode: 'contain' }
  },
  add: {
    source: require('./common/add.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  upload: {
    source: require('./common/upload.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  bar: {
    source: require('./common/bar.png'),
    style: { height: 16, width: 24, resizeMode: 'contain' }
  },
  cross: {
    source: require('./common/cross.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  },
  bell: {
    source: require('./common/bell.png'),
    style: { height: 20, width: 18, resizeMode: 'contain' }
  },
  search: {
    source: require('./common/search.png'),
    style: { height: 18, width: 18, resizeMode: 'contain' }
  }
}
const drawerStyle = { height: 20, width: 20, resizeMode: 'contain' }

const drawer = {
  profile: {
    source: require('./drawer/profile.png')
  },
  schedule: {
    source: require('./drawer/schedule.png')
  },
  timer: {
    source: require('./drawer/timer.png')
  },
  report: {
    source: require('./drawer/report.png')
  },
  settings: {
    source: require('./drawer/settings.png')
  },
  worksites: {
    source: require('./drawer/worksites.png')
  },
  list: {
    source: require('./drawer/list.png'),
    style: drawerStyle
  },
  logout: {
    source: require('./drawer/logout.png')
  },
  lock: {
    source: require('./drawer/lock.png')
  },
  privacy: {
    source: require('./drawer/privacy.png')
  },
  terms: {
    source: require('./drawer/bar.png')
  },
  chat: {
    source: require('./drawer/chat.png')
  },
  payment: {
    source: require('./drawer/payment.png')
  }
}

const payment = {
  visa: {
    source: require('./payment/visa.png'),
    style: { height: 12, width: 36, resizeMode: 'contain' }
  }
}

const tab = {
  home: {
    source: require('./tab/home.png'),
    style: { height: 12, width: 36, resizeMode: 'contain' }
  },
  scheduler: {
    source: require('./tab/scheduler.png'),
    style: { height: 12, width: 36, resizeMode: 'contain' }
  },
  earnings: {
    source: require('./tab/earnings.png'),
    style: { height: 12, width: 36, resizeMode: 'contain' }
  },
  messages: {
    source: require('./tab/messages.png'),
    style: { height: 12, width: 36, resizeMode: 'contain' }
  }
}

module.exports = {
  ...Bg,
  ...drawer,
  ...payment,
  ...tab
}
