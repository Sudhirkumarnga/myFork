import Registration from "./Registration"
import Common from "./Common"
import Subscription from "./Subscription"
import Employee from "./Employee"
import Worksites from "./Worksites"
import Home from "./Home"
import Settings from "./Settings"
import Payment from "./Payment"
import TimeOff from "./TimeOff"
import Messages from "./Messages"
import Scheduler from "./Scheduler"

module.exports = {
  ...Registration,
  ...Common,
  ...Subscription,
  ...Employee,
  ...Worksites,
  ...Home,
  ...Settings,
  ...Payment,
  ...TimeOff,
  ...Messages,
  ...Scheduler
}
