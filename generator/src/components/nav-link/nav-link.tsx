import { format } from "date-fns";
import { PostLink } from "../../core/post";
import classes from "./nav-link.module.css";

type Props = {
  link: PostLink;
};

export default function NavLink({ link }: Props) {
  const { absolutePath, title, date, thumbnail, summary } = link;

  return (
    <a class={classes.link} href={absolutePath}>
      {thumbnail ? (
        <div
          class={classes.thumbnail}
          style={`background-image: url('${(thumbnail.match(/^(http|\/)/)
            ? thumbnail
            : absolutePath + thumbnail
          ).replace(/\/\.\//g, "/")}')`}
        />
      ) : (
        <div
          class={`${classes.thumbnail} ${classes["no-image"]}`}
          role="img"
          aria-label="No thumbnail"
        >
          No Image
        </div>
      )}
      <div class={classes.info}>
        <div class={classes.title}>
          {title}
          <span class={classes.date}>{format(date, "yyyy/M/d")}</span>
        </div>
        <div class={classes.summary}>
          {summary} …<span class={classes.prompt}>続きを読む</span>
        </div>
      </div>
    </a>
  );
}
