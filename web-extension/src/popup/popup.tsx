import "@/styles.css";
import { createRoot } from "react-dom/client";
import LlmQueryBox from "@/components/LlmQueryBox";

const root = createRoot(document.getElementById("root")!);
root.render(<LlmQueryBox />);