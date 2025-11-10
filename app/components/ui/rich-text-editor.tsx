import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import { useEffect } from 'react'
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  Link as LinkIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Code,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react'
import { Button } from './button'
import { Separator } from './separator'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function RichTextEditor({ value, onChange, placeholder, disabled }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline cursor-pointer',
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[150px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editable: !disabled,
  })

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [value, editor])

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt('Enter URL:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="border rounded-md overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={disabled}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={disabled}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          disabled={disabled}
          className={editor.isActive('underline') ? 'bg-gray-200' : ''}
          title="Underline"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={disabled}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 my-auto" />

        {/* Headings */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          disabled={disabled}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          disabled={disabled}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          disabled={disabled}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 my-auto" />

        {/* Lists */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          disabled={disabled}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          disabled={disabled}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 my-auto" />

        {/* Alignment */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          disabled={disabled}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
          title="Align Left"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          disabled={disabled}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
          title="Align Center"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          disabled={disabled}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
          title="Align Right"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 my-auto" />

        {/* Other Formatting */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          disabled={disabled}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={disabled}
          className={editor.isActive('code') ? 'bg-gray-200' : ''}
          title="Code"
        >
          <Code className="h-4 w-4" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={addLink}
          disabled={disabled}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
          title="Add Link"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6 my-auto" />

        {/* Undo/Redo */}
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={disabled || !editor.can().undo()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={disabled || !editor.can().redo()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
