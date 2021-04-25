import config from "../../../config";
import classes from "./about-author.module.css";
import ic from "./icomoon.module.css";

export default function AboutAuthor() {
  return (
    <a class={classes.link} href="/about-me/">
      <div class={classes.card}>
        <div class={classes.icon} />
        <div>
          <div class={classes.header}>
            <div class={classes.name}>{config.author.name}</div>
            <div>
              <span class={`${ic.icon} ${ic["envelope-o"]}`} />
              <span class={`${ic.icon} ${ic.twitter}`} />
              <span class={`${ic.icon} ${ic["github-alt"]}`} />
              <span class={`${ic.icon} ${ic.feed}`} />
            </div>
          </div>
          <div class={classes.biography}>{config.author.biography}</div>
        </div>
      </div>
    </a>
  );
}
