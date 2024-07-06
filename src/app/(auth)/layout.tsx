import { FC, ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return <div className="bg-slate-200 mt-32 p-10 rounded-md">{children}</div>;
};

export default AuthLayout;
