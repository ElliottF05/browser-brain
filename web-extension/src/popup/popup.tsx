import "@/styles.css";
import { createRoot } from "react-dom/client";
import ChatApp from "@/components/ChatApp";

const root = createRoot(document.getElementById("root")!);
root.render(<ChatApp />);