/* eslint-disable no-unused-vars */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LuCopy, LuCheck, LuCode } from "react-icons/lu";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

const AIResponsePreview = ({ content }) => {
  if (!content) return null;

  return (
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="text-[14px] prose prose-invert max-w-none"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            code({ node, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || "");
              const language = match ? match[1] : "";
              const isInline = !className;

              return !isInline ? (
                <CodeBlock
                  code={String(children).replace(/\n$/, "")}
                  language={language}
                />
              ) : (
                <motion.code
                  className="px-1.5 py-0.5 bg-neutral-800 rounded-md text-sm font-mono text-white"
                  whileHover={{ scale: 1.02 }}
                  {...props}
                >
                  {children}
                </motion.code>
              );
            },
            p({ children }) {
              return (
                <motion.p
                  className="mb-4 leading-7 text-neutral-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.p>
              );
            },
            strong({ children }) {
              return (
                <strong className="font-semibold text-white">
                  {children}
                </strong>
              );
            },
            em({ children }) {
              return <em className="italic text-neutral-400">{children}</em>;
            },
            ul({ children }) {
              return (
                <motion.ul
                  className="list-disc pl-6 space-y-2 my-4 marker:text-neutral-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.ul>
              );
            },
            ol({ children }) {
              return (
                <motion.ol
                  className="list-decimal pl-6 space-y-2 my-4 marker:text-neutral-500"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.ol>
              );
            },
            li({ children }) {
              return (
                <motion.li
                  className="mb-1 text-neutral-300 leading-relaxed"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.li>
              );
            },
            blockquote({ children }) {
              return (
                <motion.blockquote
                  className="border-l-4 border-white/20 bg-white/5 pl-4 pr-3 py-3 my-4 rounded-r-lg italic text-neutral-400"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.blockquote>
              );
            },
            h1({ children }) {
              return (
                <motion.h1
                  className="text-2xl font-bold mt-8 mb-4 text-white border-b border-neutral-800 pb-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.h1>
              );
            },
            h2({ children }) {
              return (
                <motion.h2
                  className="text-xl font-bold mt-6 mb-3 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.h2>
              );
            },
            h3({ children }) {
              return (
                <motion.h3
                  className="text-lg font-bold mt-5 mb-2 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.h3>
              );
            },
            h4({ children }) {
              return (
                <motion.h4
                  className="text-base font-bold mt-4 mb-2 text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {children}
                </motion.h4>
              );
            },
            a({ children, href }) {
              return (
                <motion.a
                  href={href}
                  className="text-white underline underline-offset-2 transition-colors hover:text-neutral-300"
                  whileHover={{ scale: 1.02 }}
                >
                  {children}
                </motion.a>
              );
            },
            table({ children }) {
              return (
                <motion.div
                  className="overflow-x-auto my-6 rounded-lg border border-neutral-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <table className="min-w-full divide-y divide-neutral-800">
                    {children}
                  </table>
                </motion.div>
              );
            },
            thead({ children }) {
              return (
                <thead className="bg-neutral-900 text-left">{children}</thead>
              );
            },
            tbody({ children }) {
              return (
                <tbody className="divide-y divide-neutral-800 bg-neutral-900/50">
                  {children}
                </tbody>
              );
            },
            tr({ children }) {
              return (
                <motion.tr className="hover:bg-neutral-800/50 transition-colors">
                  {children}
                </motion.tr>
              );
            },
            th({ children }) {
              return (
                <th className="px-4 py-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  {children}
                </th>
              );
            },
            td({ children }) {
              return (
                <td className="px-4 py-3 text-sm text-neutral-300">{children}</td>
              );
            },
            hr() {
              return (
                <motion.hr
                  className="my-8 border-neutral-800"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.4 }}
                />
              );
            },
            img({ src, alt }) {
              return (
                <motion.img
                  src={src}
                  alt={alt}
                  className="my-6 max-w-full rounded-lg shadow-lg shadow-black/30"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                />
              );
            },
          }}
        >
          {content}
        </ReactMarkdown>
      </motion.div>
    </motion.div>
  );
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      className="relative my-6 rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-lg shadow-black/30"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div
        className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border-b border-neutral-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
            <div className="w-3 h-3 rounded-full bg-neutral-700" />
          </div>
          <span className="text-xs font-medium text-neutral-500 ml-2 uppercase tracking-wide">
            {language || "Code"}
          </span>
        </div>

        <motion.button
          onClick={copyCode}
          className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.div
                key="check"
                className="flex items-center gap-1 text-green-400"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <LuCheck size={14} />
                <span>Copied!</span>
              </motion.div>
            ) : (
              <motion.div
                key="copy"
                className="flex items-center gap-1"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <LuCopy size={14} />
                <span>Copy</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
      >
        <SyntaxHighlighter
          language={language}
          style={oneDark}
          customStyle={{
            fontSize: 13,
            margin: 0,
            padding: "1.25rem",
            background: "transparent",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </motion.div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-white via-neutral-500 to-white"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ originX: 0 }}
      />
    </motion.div>
  );
}

export default AIResponsePreview;
