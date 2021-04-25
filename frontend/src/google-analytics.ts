declare function gtag(...args: unknown[]): void;

export function gaSocialOpenShare(service: string): void {
  gtag("event", "share_start", {
    event_category: "social",
    event_label: service,
  });
}

export function gaTrackErrors(): void {
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
          "Error object: " + JSON.stringify(error),
        ].join(" - ");

        gtag("event", "exception", {
          description,
          fatal: false,
        });
      }
    };

    window.addEventListener("unhandledrejection", (event) => {
      gtag("event", "exception", {
        description: `${event.reason}`,
        fatal: false,
      });
    });
  });
}
