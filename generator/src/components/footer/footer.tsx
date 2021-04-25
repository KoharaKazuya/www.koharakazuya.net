import { format } from "date-fns";
import config from "../../config";
import classes from "./footer.module.css";

export default function Footer() {
  const now = new Date();
  return (
    <footer class={classes.footer}>
      &copy; {format(now, "yyyy")} {config.author.name}. All Rights Reserved.
    </footer>
  );
}
