import { useEffect, useRef } from "react"
import Codemirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'

function EditorLogic({ socketRef, roomId, onCodeChange }) {
  const editorRef = useRef(null) // set init value to null
  useEffect(() => {
    async function init() {
      // init the code editor
      editorRef.current = Codemirror.fromTextArea(
        document.getElementById('editorRef'),
        {
          mode: { name: 'javascript', json: true },
          theme: 'dracula',
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          tabSize: 2,
          indentWithTabs: true,
          rtlMoveVisually: true,
          coverGutterNextToScrollbar: true,
          showCursorWhenSelecting: true,
          lineSeparator: '\n',
        },
      )

      // listen for code changes
      editorRef.current.on('change', (instance, changes) => {
        const { origin } = changes
        // store code changes in the variable code
        const code = instance.getValue()
        // pass the code changes as an argument to onCodeChange
        onCodeChange(code)
        // setValue ???
        if (origin !== 'setValue') {    
          // notify other users about the code change                                                                                                                                                                                     
          socketRef.current.emit('code-change', {
            roomId,
            code,
          })
        }
      })
    }
    init()
  }, [])

  // listen to code changes from server
  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on('code-change', ({ code }) => {
        if (code !== null) {
          // update editor's content with new code
          editorRef.current.setValue(code)
        }
      })
    }

    return () => {
      if (socketRef.current !== null) {
        socketRef.current.off('code-change')
      }
    }
  }, [socketRef.current])

  // render the textarea element with the id editorRef
  return <textarea id='editorRef'></textarea>
}
  
  export default EditorLogic
