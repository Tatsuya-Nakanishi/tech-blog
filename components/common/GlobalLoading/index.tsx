"use client";

import React from "react";
import { useLoading } from "@/contexts/LoadingContext";
import LoadingUI from "@/app/loading";

const GlobalLoading: React.FC = () => {
  const { isLoading } = useLoading();

  if (!isLoading) return null;

  return <LoadingUI />;
};

export default GlobalLoading;