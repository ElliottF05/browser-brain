import React from "react";
import { createRoot } from "react-dom/client";
import LlmQueryBox from "../components/llmQueryBox";

const root = createRoot(document.getElementById("root")!);
root.render(<LlmQueryBox />);