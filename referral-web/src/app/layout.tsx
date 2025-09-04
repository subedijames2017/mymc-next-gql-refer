import "./globals.css";
import type { Metadata } from "next";
import ApolloProviderNext from "./provider";

export const metadata: Metadata = {
  title: "Referral Credits",
  description: "Next.js + Apollo + Nest GraphQL",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ApolloProviderNext>{children}</ApolloProviderNext>
      </body>
    </html>
  );
}
