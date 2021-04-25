import { Tag } from "../../../core/post";
import classes from "./tag-link.module.css";

type Props = {
  tag: Tag;
};

export default function TagLink({ tag }: Props) {
  const { id, title } = tag;
  return (
    <a class={classes.link} href={`/tags/${id}/`}>
      {title}
    </a>
  );
}
