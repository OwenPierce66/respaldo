import React, { Component } from "react";
import axios from "axios";
import { Link, Route } from "react-router-dom";
import Moment from "moment";
import Cookies from "js-cookie";

// import BlogItem from "./pages/blog/blogItem";

class Community extends Component {
  constructor() {
    super();
    this.state = {
      posts: [],
      loading: false,
      prevY: 0,
      imageUrl: "Hi",
    };
  }

  // <Route path={`${item.blogId}`} component={BlogItem} />

  getPosts(url) {
    this.setState({ loading: true });
    axios
      .get(url, {
        headers: {
          Authorization: `Token ${localStorage.getItem("userTokenLG")}`,
        },
      })
      .then((res) => {
        this.setState({
          posts: [...this.state.posts, ...res.data.results],
          next: res.data.next,
        });
        this.setState({ loading: false });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleObserver(entities, observer) {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y) {
      this.getPosts(this.state.next);
    }
    this.setState({ prevY: y });
  }

  cardMaker3000(item) {
    switch (item.post_type) {
      // TODO : probably isn't the best way of handling this, but will change as data needs change.

      case "ad":
        return (
          <div className={"card " + item.post_type} key={item.id}>
            <div className="card-top">
              <div className="card-type">Ad</div>
              <p className="card-title">{item.title}</p>
              <p className="card-subtitle">
                Posted {Moment(item.submittedOn, Moment.ISO_8601).fromNow()}
              </p>
            </div>
            {item.itemForSale ? (
              <div className="card-sale">
                <img className="card-image" src={item.imageURL} alt="image" />
                <h3>{item.itemForSale + ":"} </h3> <h3>${item.price}</h3>
              </div>
            ) : null}
            <span className="card-content">{item.content}</span>
          </div>
        );

      case "blog":
        return (
          <div className={"card " + item.post_type} key={item.id}>
            <div className="card-top">
              <div className="card-type">Blog</div>
              <p className="card-title">{item.title}</p>
              <p className="card-subtitle">
                Posted {Moment(item.submittedOn, Moment.ISO_8601).fromNow()}
              </p>
              {/* <img src={item.imageURL} alt="" /> */}
            </div>
            <div className="card-bottom">
              <img className="card-image" src={item.imageURL} alt="image" />
              <span className="card-content">{item.content}</span>
              <Link to={`blog/${item.blogId}`}>Read more.</Link>
            </div>
          </div>
        );

      case "announcement":
        return (
          <div className={"card " + item.post_type} key={item.id}>
            <div className="card-top">
              <div className="card-type">announcement</div>
              <p className="card-title">{item.title}</p>
              <p className="card-subtitle">
                Posted {Moment(item.submittedOn, Moment.ISO_8601).fromNow()}
              </p>
            </div>
            <div className="card-bottom">
              <img className="card-image" src={item.imageURL} alt="image" />
              <span className="card-content">{item.content}</span>
            </div>
          </div>
        );
    }
  }

  componentDidMount() {
    this.getPosts("http://127.0.0.1:8000/api/posts/");

    var options = {
      root: null,
      rootMargin: "0px",
      threshold: 0.1,
    };

    this.observer = new IntersectionObserver(
      this.handleObserver.bind(this),
      options
    );
    this.observer.observe(this.loadingRef);
  }

  render() {
    // Additional css
    const loadingCSS = {
      height: "100px",
      margin: "30px",
    };

    // To change the loading icon behavior
    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div className="community-container">
        <h1 className="header">Community</h1>

        <div className="card-container" style={{ minHeight: "800px" }}>
          {this.state.posts.map((post) => this.cardMaker3000(post))}
        </div>
        <div
          ref={(loadingRef) => (this.loadingRef = loadingRef)}
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    );
  }
}

export default Community;
