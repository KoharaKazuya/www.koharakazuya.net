import { get } from './xhr';

type Content = { main: HTMLElement; nav: HTMLElement | null };
type URLHref = string;
type HTMLText = string;

export default class SpeedLinks {
  private contentPool: { [urlHref: string]: Promise<HTMLText> };
  private removers: Array<() => void>;
  private domParser = new DOMParser();

  constructor() {
    this.contentPool = {};
    this.removers = [];

    window.addEventListener('popstate', () => this.renderPage(location.href));
    this.reset();
  }

  public reset(): void {
    this.removers.forEach(r => r());
    this.removers = [];

    [].forEach.call(document.querySelectorAll('a'), (a: HTMLAnchorElement) =>
      this.speedup(a)
    );
  }

  private speedup(link: HTMLAnchorElement): void {
    if (link.hostname !== location.hostname) return;

    const clickListener = async (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();
      removeListener();

      try {
        await this.renderPage(link.href);
        history.pushState({}, '', link.href);
      } catch (err) {
        console.log(err);
        location.href = link.href;
      }
    };

    const enterListener = async (event: MouseEvent) => {
      this.fetchContent(link.href);
    };

    const removeListener = () => {
      link.removeEventListener('click', clickListener);
      link.removeEventListener('mouseenter', enterListener);
    };

    link.addEventListener('click', clickListener);
    link.addEventListener('mouseenter', enterListener);
    this.removers.push(removeListener);
  }

  private async renderPage(href: string): Promise<void> {
    this.startSwapping();
    const newContent = await this.fetchContent(href);
    this.swapContent(newContent);
    this.reset();
  }

  private async fetchContent(href: string): Promise<Content> {
    const cache = this.contentPool[href];
    if (cache !== undefined) {
      return this.parseContent(await cache);
    }

    const fetching = (async () => {
      const response = await get(href);
      const responseText = await response.text();
      if (response.status !== 200) {
        throw new Error(
          `NetworkError in fetchContent: ${response.status} ${responseText}`
        );
      }
      const contentType = response.headers.get('Content-Type');
      if (contentType !== null && contentType.split(';')[0] !== 'text/html') {
        throw new Error(`ContentTypeError in fetchContent: ${contentType}`);
      }
      return responseText;
    })();

    this.contentPool[href] = fetching;
    return this.parseContent(await fetching);
  }

  private swapContent(newContent: Content): void {
    const oldMain = document.querySelector('#view-main');
    if (oldMain === null) {
      throw new Error('Not Found Content section in swapContent');
    }
    const mainContainer = oldMain.parentElement;
    if (mainContainer === null) {
      throw new Error('Not Found Container section in swapContent');
    }
    const oldNav = document.querySelector('#view-nav');

    mainContainer.insertBefore(newContent.main, oldMain);
    if (newContent.nav) {
      mainContainer.insertBefore(newContent.nav, oldMain);
    }

    mainContainer.removeChild(oldMain);
    if (oldNav !== null) {
      mainContainer.removeChild(oldNav);
    }

    this.resetScroll();
  }

  private parseContent(text: string): Content {
    const doc = this.domParser.parseFromString(text, 'text/html');

    const newMainOrNull = doc.querySelector<HTMLElement>('#view-main');
    if (newMainOrNull === null) {
      throw new Error(`Not Found Content section in parseContent: ${text}`);
    }
    const newNavOrNull = doc.querySelector<HTMLElement>('#view-nav');

    return { main: newMainOrNull, nav: newNavOrNull };
  }

  private startSwapping(): void {
    document.querySelector('#view-main')!.classList.add('swapping');
  }

  private resetScroll(): void {
    window.scrollTo(0, 0);
  }
}
