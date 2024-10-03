import React, { useCallback , useEffect , useState } from 'react';
import Quill from 'quill';
import "quill/dist/quill.snow.css";
import { io } from 'socket.io-client';
import { useParams } from 'react-router-dom';


const SAVE_DOCUMENT=  2;

const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];


export default function TextEditor() {
  const {id: documentId} = useParams();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();

    //socket connection to the server 
    useEffect(() => {
      const s = io("http://localhost:3001");
      setSocket(s);

      return () => {
        s.disconnect();
      }
    }, []);

    const wrapperRef = useCallback(wrapper => {
        if(wrapper == null)  return;

        wrapper.innerHTML = "";
        const editor = document.createElement("div");
        wrapper.append(editor);
        const q = new Quill(editor, {
            modules: {
            toolbar: toolbarOptions
          },theme: "snow"
        }
      );
      q.disable(); //turning off the editor until the document is loaded
      q.setText("Loading...");
      setQuill(q);        
    }, [])


    useEffect(() => {
      if(socket == null || quill == null) return;

      const interval = setInterval(() => {
        socket.emit('save-document', quill.getContents())
      }, SAVE_DOCUMENT);

      return () => {
        clearInterval(interval);
      }
    }, [socket, quill]);

    useEffect(() => {
      if(socket == null || quill == null) return;

      const handler =  (delta) => {
        quill.updateContents(delta);
      };

      socket.on("receive-changes", handler);

      return () => {
        socket.off("receive-changes", handler);
      }
    }, [socket, quill]);


    useEffect(() => {
      if (socket == null || quill == null) return
  
      socket.once("load-document", document => {
        quill.setContents(document)
        quill.enable()
      })
  
      socket.emit("get-document", documentId)
    }, [socket, quill, documentId])

    useEffect(() => {
      if(socket == null || quill == null) return;

      const handler =  (delta, oldDelta, source) => {
        if(source !== 'user') return; //if change not from user return
        socket.emit("send-changes", delta);
      };

      quill.on("text-change", handler);

      return () => {
        quill.off("text-change", handler);
      }
    }, [socket, quill]);

  return (
    <div className='container' ref={wrapperRef}></div>
  )
}
