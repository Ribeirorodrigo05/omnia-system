import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnia - Entre na sua conta",
  description:
    "Faça login na sua conta do Omnia para acessar seus workspaces e projetos.",
};

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="min-h-screen ">{children}</div>;
}
