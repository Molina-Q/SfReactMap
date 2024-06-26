import React from "react";

function TopicTag(props) {
  return (
    <>
      <strong className="topic-tag">{props.category}</strong>

      <p>
        by&nbsp;
        <a href="">{props.author}</a>
      </p>
    </>
  ); 
}

export default TopicTag;
