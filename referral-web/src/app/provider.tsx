"use client";

import { ReactNode } from "react";
import {
  ApolloClient as StreamingApolloClient,
  InMemoryCache as StreamingInMemoryCache,
  ApolloNextAppProvider,
  SSRMultipartLink,
} from "@apollo/client-integration-nextjs";
import { HttpLink } from "@apollo/client";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

function makeClient() {
  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || "http://localhost:4000/graphql",
    fetchOptions: { cache: "no-store" },
  });

  return new StreamingApolloClient({
    cache: new StreamingInMemoryCache(),
    link:
      typeof window === "undefined"
        ? new SSRMultipartLink({ stripDefer: true }).concat(httpLink)
        : httpLink,
  });
}

export default function ApolloProviderNext({ children }: { children: ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      <TooltipProvider>
        {children}
        {/* Mount toasters once at the root */}
        <Toaster />
      </TooltipProvider>
    </ApolloNextAppProvider>
  );
}
