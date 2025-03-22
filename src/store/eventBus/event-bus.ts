import mitt from "mitt";
import type {LoginEvent} from "./event-bus.types.ts";

type Events = {
  infoPopupCallback: void;
  errorPopupCallback: void;
  sendCode: void;
  approveCode: string;
  login: LoginEvent
}

const eventBus = mitt<Events>()

export default eventBus;