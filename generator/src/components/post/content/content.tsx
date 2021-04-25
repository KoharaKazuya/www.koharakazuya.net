import classes from "./content.module.css";

type Props = {
  html: string;
};

export default function Content({ html }: Props) {
  return (
    <div class={classes.content} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
