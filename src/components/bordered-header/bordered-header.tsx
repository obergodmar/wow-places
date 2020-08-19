import * as React from "react";

import "./bordered-header.scss";

interface Props {
  children: React.ReactNode;
}

export const BorderedHeader: React.FC<Props> = ({ children }: Props) => (
  <div className="header">{children}</div>
);

BorderedHeader.displayName = "BorderedHeader";
