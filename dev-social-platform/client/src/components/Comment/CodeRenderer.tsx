import hljs from "highlight.js";
import "highlight.js/styles/vs2015.css";
import { useEffect, useRef } from "react";

interface CodeRendererProps {
  code: string;
}

const CodeRenderer: React.FC<CodeRendererProps> = ({ code }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      const result = hljs.highlightAuto(code);

      codeRef.current.innerHTML = `<code class="hljs  bg-gray-900 ${result.language}">${result.value}</code>`;
    }
  }, [code]);

  return <pre ref={codeRef} className="language-auto p-4 rounded-md" />;
};

export default CodeRenderer;
