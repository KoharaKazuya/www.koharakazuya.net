import { Post as Model, PostLink } from "../../core/post";
import NavLink from "../nav-link";
import Content from "./content";
import Meta from "./meta";
import classes from "./post.module.css";
import SnsShareButton from "./sns-share-button";

type Props = {
  post: Model;
  links: PostLink[];
};

export default function Post({ post, links }: Props) {
  return (
    <>
      <main class="container">
        <article>
          <h1 class={classes.title}>{post.meta.title}</h1>
          <Meta meta={post.meta} />
          <Content html={post.content} />
          <SnsShareButton />
        </article>
      </main>

      <nav>
        <div class={`container ${classes.nav}`}>最新記事一覧</div>
        <ul class="container">
          {links.map((link) => (
            <li>
              <NavLink link={link} />
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
