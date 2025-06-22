"use client";

import { MDXEditor, MDXEditorMethods } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  ListsToggle,
  Separator,
} from "@mdxeditor/editor";
import "@mdxeditor/editor/style.css";
import { forwardRef, useImperativeHandle, useRef } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const MarkdownEditor = forwardRef<MDXEditorMethods, MarkdownEditorProps>(
  (
    {
      value,
      onChange,
      placeholder = "Enter your content...",
      disabled = false,
    },
    ref
  ) => {
    const editorRef = useRef<MDXEditorMethods>(null);

    useImperativeHandle(ref, () => ({
      focus: () => editorRef.current?.focus(),
      getMarkdown: () => editorRef.current?.getMarkdown() || "",
      setMarkdown: (markdown: string) =>
        editorRef.current?.setMarkdown(markdown),
      insertMarkdown: (markdown: string) =>
        editorRef.current?.insertMarkdown(markdown),
    }));

    return (
      <div className="border rounded-md overflow-hidden w-full">
        <MDXEditor
          ref={editorRef}
          markdown={value}
          onChange={onChange}
          placeholder={placeholder}
          readOnly={disabled}
          plugins={[
            headingsPlugin(),
            listsPlugin(),
            quotePlugin(),
            thematicBreakPlugin(),
            markdownShortcutPlugin(),
            linkPlugin(),
            linkDialogPlugin(),
            imagePlugin(),
            tablePlugin(),
            codeBlockPlugin({ defaultCodeBlockLanguage: "javascript" }),
            codeMirrorPlugin({
              codeBlockLanguages: {
                js: "JavaScript",
                css: "CSS",
                txt: "Plain Text",
              },
            }),
            toolbarPlugin({
              toolbarContents: () => (
                <>
                  <UndoRedo />
                  <Separator />
                  <BoldItalicUnderlineToggles />
                  <Separator />
                  <BlockTypeSelect />
                  <Separator />
                  <CreateLink />
                  <InsertImage />
                  <Separator />
                  <ListsToggle />
                  <Separator />
                  <InsertTable />
                  <InsertThematicBreak />
                </>
              ),
            }),
          ]}
          className="min-h-[200px] w-full"
          contentEditableClassName="prose max-w-none"
        />
      </div>
    );
  }
);

MarkdownEditor.displayName = "MarkdownEditor";

export default MarkdownEditor;
