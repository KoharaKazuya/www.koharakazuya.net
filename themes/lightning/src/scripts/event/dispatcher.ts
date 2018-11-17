import { eventPagechange } from "./types";

export function dispatchPagechangeEvent(): void {
  let event: CustomEvent<{}>;

  try {
    event = new CustomEvent(eventPagechange, {});
  } catch (e) {
    // fallback for IE
    event = document.createEvent("CustomEvent");
    event.initCustomEvent(eventPagechange, false, false, {});
  }

  window.dispatchEvent(event);
}
