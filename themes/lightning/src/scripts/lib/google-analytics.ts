export function gaSocialOpenShare(service: string): void {
  if (typeof gtag === "function") {
    gtag("event", "share_start", {
      event_category: "social",
      event_label: service,
    });
  }
}

export function gaTrackErrors(): void {
  if (typeof gtag === "function") {
    window.addEventListener("error", () => {
      window.onerror = (msg, url, lineNo, columnNo, error) => {
        if (
          !(
            typeof msg === "string" &&
            msg.toLowerCase().indexOf("script error") > -1
          )
        ) {
          const description = [
            "Message: " + msg,
            "URL: " + url,
            "Line: " + lineNo,
            "Column: " + columnNo,
            "Error object: " + JSON.stringify(error)
          ].join(" - ");

          gtag("event", "exception", {
            description,
            fatal: false
          });
        }
      };

      window.addEventListener("unhandledrejection", event => {
        gtag("event", "exception", {
          description: `${event.reason}`,
          fatal: false
        });
      });
    });
  }
}
