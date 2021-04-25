import { PostLink } from "../../core/post";
import NavLink from "../nav-link";

type Props = {
  links: PostLink[];
};

export default function PostLinks({ links }: Props) {
  return (
    <main>
      <ul class="container">
        {links.map((link) => (
          <li>
            <NavLink link={link} />
          </li>
        ))}
      </ul>
    </main>
  );
}
