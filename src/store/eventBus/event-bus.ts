import mitt from "mitt";
import type {LoginEvent, RegisterFirstStepEvent, RegisterSecondStepEvent} from "./event-bus.types.ts";

type Events = {
  infoPopupCallback: void;
  errorPopupCallback: void;
  sendCode: void;
  approveCode: string;
  login: LoginEvent;
  registerFirstStep: RegisterFirstStepEvent;
  registerSecondStep: RegisterSecondStepEvent;
}

const eventBus = mitt<Events>()

export default eventBus;