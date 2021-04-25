import classes from "./sns-buttons.module.css";

export default function SnsButtons() {
  return (
    <div>
      <Button
        sns="facebook"
        title="この記事を Facebook でシェアする"
        icon="facebook-square"
        brandColor="#4267B2"
      />
      <Button
        sns="twitter"
        title="この記事を Twitter でシェアする"
        icon="twitter-square"
        brandColor="#1da1f2"
      />
      <Button
        sns="line"
        title="この記事を Line でシェアする"
        icon="line"
        brandColor="#00b900"
      />
      <Button
        sns="pocket"
        title="この記事を Pocket に保存する"
        icon="get-pocket"
        brandColor="#ee4056"
      />
    </div>
  );
}

function Button({
  sns,
  title,
  icon,
  brandColor,
}: {
  sns: string;
  title: string;
  icon: string;
  brandColor: string;
}) {
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      class={classes.button}
      title={title}
      js-sns-share={sns}
      hidden
    >
      <i class={`fab fa-${icon}`} style={{ color: brandColor }} />
    </a>
  );
}
