import classes from "./web-share.module.css";

export default function WebShare() {
  return (
    <button type="button" class={classes.button} js-web-share hidden>
      この記事をシェアする
    </button>
  );
}
