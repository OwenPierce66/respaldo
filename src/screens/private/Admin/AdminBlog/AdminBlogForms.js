import Axios from "axios";
import React, { Component } from "react";
import RichTextEditor from "../../../../components/misc/RichTextEditor";
import Spinner from "../../../../components/misc/Spinner";

class AdminBlogCreateForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: "",
      summary: "",
      thumb_nail: "",
      content: "",
      status: "1",
      security: "1",
      formDisabled: false,
      postBeingEdited: null,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleRichTextEditorChange =
      this.handleRichTextEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLiveUpdate = this.handleLiveUpdate.bind(this);
  }

  handleRichTextEditorChange(content) {
    this.setState({ content });
    this.handleLiveUpdate();
  }

  handleFile(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () => this.setState({ thumb_nail: reader.result });
    this.handleLiveUpdate();
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
    this.handleLiveUpdate();
  }

  handleLiveUpdate() {
    clearTimeout(this.timer);
    this.props.saved(false);
    this.timer = setTimeout(() => {
      Axios.put(
        "http://127.0.0.1:8000/api/blog/",
        {
          id: this.state.postBeingEdited,
          title: this.state.title,
          summary: this.state.summary,
          thumb_nail: this.state.thumb_nail,
          content: this.state.content,
          status: this.state.status,
          security: this.state.security,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      )
        .then((res) => {
          this.props.saved(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }

  handleSubmit(event) {
    this.setState({ formDisabled: true });

    Axios.put(
      "http://127.0.0.1:8000/api/blog/",
      {
        id: this.state.postBeingEdited,
        title: this.state.title,
        summary: this.state.summary,
        thumb_nail: this.state.thumb_nail,
        content: this.state.content,
        status: this.state.status,
        security: this.state.security,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        if (res.data.post) {
          this.props.handleSuccessfulPost();
          this.setState({ formDisabled: false });
        } else {
          console.log(res.Errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    event.preventDefault();
  }

  componentDidMount() {
    this.props.saved(false);
    this.timer = null;
    Axios.post(
      "http://127.0.0.1:8000/api/blog/",
      {
        title: "Undefined",
        summary: "",
        thumb_nail: "",
        content: "",
        status: "1",
        security: "1",
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.setState({
          postBeingEdited: res.data.post.id,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentWillUnmount() {
    if (this.state.title === "") {
      Axios.delete("http://127.0.0.1:8000/api/blog/", {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
        data: {
          id: this.state.postBeingEdited,
        },
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  render() {
    if (this.state.formDisabled) {
      return <Spinner />;
    } else {
      return (
        <form
          className="adminCreateForm"
          id="create-form"
          onSubmit={this.handleSubmit}
        >
          <div className="input-container">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Type here..."
              value={this.state.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Summary</label>
            <input
              type="text"
              name="summary"
              placeholder="Type here..."
              value={this.state.summary}
              onChange={this.handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="">Status</label>
            <select
              name="status"
              value={this.state.status}
              onChange={this.handleChange}
            >
              <option value="1" defaultValue>
                Draft
              </option>
              <option value="2">Publish</option>
              <option value="3">Hidden</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="">Security</label>
            <select
              name="security"
              value={this.state.security}
              onChange={this.handleChange}
            >
              <option value="1" defaultValue>
                Private
              </option>
              <option value="2">Public</option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="">Thumbnail</label>
            <input
              className="thumbnail-file"
              type="file"
              name="thumb_nail"
              onChange={this.handleFile}
            />
          </div>
          <div className="rich-editor">
            <label className="content-label">Content</label>
            <RichTextEditor
              handleRichTextEditorChange={this.handleRichTextEditorChange}
            />
          </div>
        </form>
      );
    }
  }
}

class AdminBlogEditForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.post,
      formDisabled: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.handleRichTextEditorChange =
      this.handleRichTextEditorChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleLiveUpdate = this.handleLiveUpdate.bind(this);
  }

  handleRichTextEditorChange(content) {
    this.setState({ post: { ...this.state.post, content } });
    this.handleLiveUpdate();
  }

  handleFile(event) {
    let reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = () =>
      this.setState({
        post: { ...this.state.post, thumb_nail: reader.result },
      });
    this.handleLiveUpdate();
  }

  handleChange(event) {
    this.setState({
      post: {
        ...this.state.post,
        [event.target.name]: event.target.value,
      },
    });
    this.handleLiveUpdate();
  }

  handleLiveUpdate() {
    clearTimeout(this.timer);
    this.props.saved(false);
    this.timer = setTimeout(() => {
      Axios.put(
        "http://127.0.0.1:8000/api/blog/",
        {
          id: this.state.post.id,
          title: this.state.post.title,
          summary: this.state.post.summary,
          thumb_nail: this.state.post.thumb_nail,
          content: this.state.post.content,
          status: this.state.post.status,
          security: this.state.post.security,
        },
        {
          headers: {
            Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
          },
        }
      )
        .then((res) => {
          this.props.saved(true);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 500);
  }

  handleSubmit(event) {
    this.setState({ formDisabled: true });

    Axios.put(
      "http://127.0.0.1:8000/api/blog/",
      {
        id: this.state.post.id,
        title: this.state.post.title,
        summary: this.state.post.summary,
        thumb_nail: this.state.post.thumb_nail,
        content: this.state.post.content,
        status: this.state.post.status,
        security: this.state.post.security,
      },
      {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      }
    )
      .then((res) => {
        this.props.saved(false);
        if (res.data.post) {
          this.props.handleSuccessfulPost();
          this.setState({ formDisabled: false });
        } else {
          console.log(res.Errors);
        }
      })
      .catch((err) => {
        console.log(err);
      });

    event.preventDefault();
  }

  componentDidMount() {
    this.props.saved(true);
    this.timer = null;
  }

  render() {
    if (this.state.formDisabled) {
      return <Spinner />;
    } else {
      const { post } = this.state;
      return (
        <form
          className="adminCreateForm"
          id="edit-form"
          onSubmit={this.handleSubmit}
        >
          <div className="input-container">
            <label>Title</label>
            <input
              type="text"
              name="title"
              placeholder="Type here..."
              value={post.title}
              onChange={this.handleChange}
              required
            />
          </div>
          <div className="input-container">
            <label>Summary</label>
            <input
              type="text"
              name="summary"
              placeholder="Type here..."
              value={post.summary}
              onChange={this.handleChange}
            />
          </div>
          <div className="input-container">
            <label htmlFor="">Status</label>
            <select name="status" onChange={this.handleChange}>
              <option value="1" selected={post.status == "Draft"}>
                Draft
              </option>
              <option value="2" selected={post.status == "Published"}>
                Publish
              </option>
              <option value="3" selected={post.status == "Hidden"}>
                Hidden
              </option>
            </select>
          </div>
          <div className="input-container">
            <label htmlFor="">Security</label>
            <select name="security" onChange={this.handleChange}>
              <option value="1" selected={post.security == "Private"}>
                Private
              </option>
              <option value="2" selected={post.security == "Public"}>
                Public
              </option>
            </select>
          </div>
          <div className="img-container">
            <label htmlFor="">Thumbnail Image</label>
            <img
              src={post.thumb_nail}
              alt="thumbnail"
              className="thumbnail-image"
            />
          </div>
          <div className="input-container">
            <label htmlFor="">New Thumbnail</label>
            <input type="file" name="thumb_nail" onChange={this.handleFile} />
          </div>

          <div className="rich-editor">
            <label>Content</label>
            <RichTextEditor
              handleRichTextEditorChange={this.handleRichTextEditorChange}
              contentToEdit={post.content ? post.content : null}
            />
          </div>
        </form>
      );
    }
  }
}

class AdminBlogDeleteForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      post: this.props.post,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }
  render() {
    return (
      <form className="delete-form">
        <div>
          Enter below "Delete {this.state.post ? this.state.post : null}
        </div>
        <input
          type="text"
          name="delete_input"
          value={this.state.delete_input}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

export { AdminBlogCreateForm, AdminBlogEditForm, AdminBlogDeleteForm };
