import SnsButtons from "./sns-buttons";
import classes from "./sns-share-button.module.css";
import WebShare from "./web-share";

export default function SnsShareButton() {
  return (
    <aside class={classes.container}>
      <WebShare />
      <SnsButtons />
    </aside>
  );
}
