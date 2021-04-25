import config from "../../../config";
import classes from "./nav-to-home.module.css";

export default function NavToHome() {
  return (
    <a class={classes.link} href="/">
      <h1 class={classes.title}>{config.title}</h1>
      <div class={classes.description}>{config.description}</div>
    </a>
  );
}
