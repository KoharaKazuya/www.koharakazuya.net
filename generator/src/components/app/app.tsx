import { ComponentChildren } from "preact";
import Footer from "../footer";
import Header from "../header";
import "./global.css";
import "./reset.css";

type Props = {
  children: ComponentChildren;
};

export default function App({ children }: Props) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
