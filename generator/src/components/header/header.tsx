import AboutAuthor from "./about-author";
import classes from "./header.module.css";
import NavToHome from "./nav-to-home";

export default function Header() {
  return (
    <header class={classes.header}>
      <NavToHome />
      <AboutAuthor />
    </header>
  );
}
