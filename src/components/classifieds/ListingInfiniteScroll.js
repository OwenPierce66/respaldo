import React, { useEffect, useRef } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const ListingInfiniteScroll = (props) => {
  const items = props.items;
  const height = window.innerHeight * .65;
  const classifiedType = props.classifiedType;
  
  const handleItems = () => {
    return items.map((item) => {
      const thumb_nail = item.photos[0];
      return (
        <a href={`/dashboard/classifieds/${classifiedType}/${item.id}`} className="item">
          <img
            src={
              thumb_nail ? thumb_nail.file : "https://via.placeholder.com/150"
            }
            alt=""
            className="item-img"
          />
          <div className="text">
            <div className="price">{item.price}</div>
            <div className="classifiedDescription">{item.title}</div>
            <div className="location">{item.location}</div>
          </div>
        </a>
      );
    });
  };

  return (
    <InfiniteScroll
      className="items"
      dataLength={items.length}
      next={() => props.handleNext()}
      hasMore={props.hasMore}
      loader={<h4>Loading...</h4>}
      height={height}
      endMessage={
        <p style={{ textAlign: "center" }}>
          <b>Yay! You have seen it all</b>
        </p>
      }
    >
      {handleItems()}
    </InfiniteScroll>
  );
};

export default ListingInfiniteScroll;