declare module "quicklink" {
  function listen(options?: unknown): Function;
  function prefetch(
    urls: string | string[],
    isPriority = false
  ): Promise<unknown>;
}
