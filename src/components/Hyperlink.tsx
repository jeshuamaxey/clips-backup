import Link from "next/link";
import { ComponentProps } from "react";

type HyperlinkProps = ComponentProps<typeof Link>;

const Hyperlink = ({
  children,
  ...props
}: HyperlinkProps) => {
  return <Link className="text-blue-400 hover:underline" {...props}>{children}</Link>;
}

export default Hyperlink;