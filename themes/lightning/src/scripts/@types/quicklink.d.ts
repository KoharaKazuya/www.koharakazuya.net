declare module "quicklink" {
  export function listen(options?: unknown): unknown;

  export function prefretch(
    url: string,
    isPriority?: boolean,
    conn?: Object
  ): Promise<Object>;
}
