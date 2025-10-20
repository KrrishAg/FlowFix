import { useEffect, useRef } from "react";

export const EnhancedTextarea = () => {
  const editorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const wrappingPairs = {
      '"': '"',
      "'": "'",
      "(": ")",
      "{": "}",
      "[": "]",
      "`": "`",
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const { selectionStart: start, selectionEnd: end } = editor;

      // --- 1. Handle Tab Key for Indentation ---
      if (e.key === "Tab") {
        e.preventDefault();
        const tabCharacter = "    "; // Four spaces
        editor.value =
          editor.value.substring(0, start) +
          tabCharacter +
          editor.value.substring(end);
        editor.selectionStart = editor.selectionEnd =
          start + tabCharacter.length;
        return; // Early return
      }

      // --- 2. Handle Auto-wrapping of Selected Text ---
      const closingChar = wrappingPairs[e.key as keyof typeof wrappingPairs];
      // Combine checks: Does the key exist in our map AND is text selected?
      if (closingChar && start !== end) {
        e.preventDefault();
        const selectedText = editor.value.substring(start, end);

        // Construct the new value and update the selection in one go
        editor.value =
          editor.value.substring(0, start) +
          e.key + // The opening character
          selectedText +
          closingChar +
          editor.value.substring(end);

        editor.selectionStart = start + 1;
        editor.selectionEnd = end + 1;
      }
    };

    editor.addEventListener("keydown", handleKeyDown);

    return () => {
      editor.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl">
      <textarea
        ref={editorRef}
        className="code-editor w-full h-96 p-4 rounded-lg border-2 transition duration-200"
        placeholder="Type your code or text here..."
      ></textarea>

      <style jsx>{`
        .code-editor {
          font-family: "Courier New", Courier, monospace;
          background-color: #2d3748;
          color: #e2e8f0;
          border-color: #4a5568;
          caret-color: #63b3ed;
        }
        .code-editor::placeholder {
          color: #718096;
        }
        .code-editor:focus {
          outline: none;
          border-color: #63b3ed;
          box-shadow: 0 0 0 2px rgba(99, 179, 237, 0.5);
        }
      `}</style>
    </div>
  );
};
