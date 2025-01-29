import CodeRenderer from "./CodeRenderer";

const renderContent = (content: string) => {
  const parts = content.split(/(<code>[\s\S]*?<code>)/g);

  return parts.map((part, index) => {
    if (part.startsWith("<code>") && part.endsWith("<code>")) {
      const code = part.replace(/<code>/g, "");
      return <CodeRenderer key={index} code={code} />;
    } else {
      return (
        <p key={index} className="text-white">
          {part}
        </p>
      );
    }
  });
};

interface TextWithCodeProps {
  content: string;
}

const TextWithCode: React.FC<TextWithCodeProps> = ({ content }) => {
  return <>{renderContent(content)}</>;
};

export default TextWithCode;
