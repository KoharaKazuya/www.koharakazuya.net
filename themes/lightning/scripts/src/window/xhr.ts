interface Response {
  status: number;
  headers: {
    get: (key: string) => string | null;
  };
  text: () => Promise<string>;
}

export const get = (url: string): Promise<Response> =>
  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open('GET', url);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        resolve({
          status: xhr.status,
          headers: {
            get: (key: string) => xhr.getResponseHeader(key)
          },
          text: () => Promise.resolve(xhr.responseText)
        });
      }
    };
    xhr.send();
  });
