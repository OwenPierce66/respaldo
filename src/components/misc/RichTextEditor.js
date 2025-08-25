import React, { Component } from "react";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { Editor } from "react-draft-wysiwyg";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";

export default class RichTextEditor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editorState: EditorState.createEmpty(),
    };

    this.onEditorStateChange = this.onEditorStateChange.bind(this)
  }

  onEditorStateChange(editorState){
    this.setState({ editorState }, this.props.handleRichTextEditorChange(
      draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    ))
  }

  componentDidMount(){
    if (this.props.contentToEdit) {
      const blocksFromHtml = htmlToDraft(this.props.contentToEdit);
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(
        contentBlocks,
        entityMap
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({ editorState });
    }
  }

  render() {
    return (
        <Editor
          editorState={this.state.editorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor-editor"
          onEditorStateChange={this.onEditorStateChange}
        />
    );
  }
}

