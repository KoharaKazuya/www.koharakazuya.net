import { eventPagechange } from "./types";

export function dispatchPagechangeEvent(): void {
  const event = new Event(eventPagechange);
  window.dispatchEvent(event);
}
