import { format } from "date-fns";
import { Meta as Model, urlize } from "../../../core/post";
import classes from "./meta.module.css";

type Props = {
  meta: Model;
};

export default function Meta({ meta }: Props) {
  return (
    <aside class={classes.meta}>
      <div>{format(meta.date, "yyyy/M/d")}</div>
      {meta.tags && (
        <div>
          {meta.tags.map((tag, index) => (
            <>
              {index > 0 && " "}
              <a class={classes.tag} href={`/tags/${urlize(tag)}/`}>
                {tag}
              </a>
            </>
          ))}
        </div>
      )}
    </aside>
  );
}
