import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Omnia System",
  description: "Sistema de gerenciamento de projetos",
};

export default function HomePage(): never {
  redirect("/login");
}
