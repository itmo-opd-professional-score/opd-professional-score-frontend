import mitt from "mitt";

type Events = {
  infoPopupCallback: void;
  errorPopupCallback: void;
  sendCode: void;
  approveCode: string;
}

const eventBus = mitt<Events>()

export default eventBus;