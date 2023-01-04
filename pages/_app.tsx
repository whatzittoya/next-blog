import React, { useEffect, useState, FC } from "react";
import { Layout } from "../components";
import "../styles/globals.scss";

import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

import type { AppProps } from "next/app";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000,
    },
  },
});

const MyApp: FC<AppProps> = ({ Component, pageProps }: AppProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
};

export default MyApp;
