export function importScript(src: string, integrity?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = src;
    if (integrity) script.integrity = integrity;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve();
    script.onerror = reject;
    document!.head!.appendChild(script);
  });
}

export function importStyle(src: string, integrity?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = src;
    if (integrity) link.integrity = integrity;
    link.crossOrigin = "anonymous";
    link.onload = () => resolve();
    link.onerror = reject;
    document!.head!.appendChild(link);
  });
}
