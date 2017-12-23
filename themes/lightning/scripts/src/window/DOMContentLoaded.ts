export default new Promise<void>(resolve => {
  const listener = () => {
    if (
      document.readyState === 'interactive' ||
      document.readyState === 'complete'
    ) {
      document.removeEventListener('DOMContentLoaded', listener);
      resolve();
    }
  };

  document.addEventListener('DOMContentLoaded', listener);
  listener();
});
