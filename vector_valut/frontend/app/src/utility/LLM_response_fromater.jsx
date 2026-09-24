import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const LLM_response_fromater = ({ response }) => {
  return (
    <div className="text-on-surface/90 text-[15px] leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            const hasLanguage = !!match;
            
            return hasLanguage ? (
              <div className="rounded-lg overflow-hidden border border-white/10 my-4 text-[13px] font-mono">
                <div className="bg-[#0B0E17] px-4 py-1.5 border-b border-white/5 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-on-surface-variant font-mono">
                    {match[1]}
                  </span>
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{
                    margin: 0,
                    background: "rgba(11, 14, 23, 0.5)",
                    padding: "16px",
                  }}
                  {...props}
                >
                  {String(children).replace(/\n$/, "")}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code
                className="bg-white/5 px-1.5 py-0.5 rounded text-primary font-mono text-[13px]"
                {...props}
              >
                {children}
              </code>
            );
          },
          h1: ({ children }) => <h1 className="text-xl font-bold text-primary mt-6 mb-2 font-headline-md">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold text-primary mt-4 mb-2 font-headline-md">{children}</h2>,
          h3: ({ children }) => <h3 className="text-md font-semibold text-primary mt-3 mb-1 font-headline-md">{children}</h3>,
          p: ({ children }) => <p className="leading-relaxed mb-3">{children}</p>,
          ol: ({ children }) => <ol className="list-decimal list-inside space-y-2 ml-2 mb-3">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc list-inside space-y-2 ml-2 mb-3">{children}</ul>,
          li: ({ children }) => <li className="text-on-surface/90">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-brand-indigo hover:text-brand-indigo/80 underline transition-all"
            >
              {children}
            </a>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-white/10">
              <table className="min-w-full divide-y divide-white/10 bg-surface-container-low text-[13px]">{children}</table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-[#0B0E17]">{children}</thead>,
          tbody: ({ children }) => <tbody className="divide-y divide-white/5">{children}</tbody>,
          tr: ({ children }) => <tr>{children}</tr>,
          th: ({ children }) => <th className="px-4 py-2 text-left font-bold text-primary">{children}</th>,
          td: ({ children }) => <td className="px-4 py-2 text-on-surface-variant">{children}</td>,
        }}
      >
        {response}
      </ReactMarkdown>
    </div>
  );
};

export default LLM_response_fromater;