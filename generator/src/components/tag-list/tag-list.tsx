import { Tag } from "../../core/post";
import TagLink from "./tag-link";
import classes from "./tag-list.module.css";

type Props = {
  tags: Tag[];
};

export default function TagList({ tags }: Props) {
  return (
    <main>
      <h1 class={classes.header}>タグ</h1>
      <ul class="container">
        {tags.map((tag) => (
          <li class={classes.item}>
            <TagLink tag={tag} />
          </li>
        ))}
      </ul>
    </main>
  );
}
