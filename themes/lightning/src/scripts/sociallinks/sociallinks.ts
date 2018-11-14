import { gaSocialOpenShare } from "../lib/google-analytics";

/**
 * SNS シェアボタンの挙動 (GA の追加)
 */
export function socialLinks(): void {
  [].forEach.call(
    document.querySelectorAll(".social-link"),
    (elem: HTMLElement) => {
      const service = elem.dataset.socialLink;
      if (service)
        elem.addEventListener("click", () => gaSocialOpenShare(service));
    }
  );
}
