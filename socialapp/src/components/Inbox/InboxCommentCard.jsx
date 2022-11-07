import React, { useContext, useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import {useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import { BsCursorFill } from "react-icons/bs";
import "./InboxCommentCard.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
export default function InboxCommentCard(props) {
  // pass in the follow request object in props
  const { baseURL } = useContext(AuthContext); // our api url http://127.0.0.1/service
  const user_id = localStorage.getItem("user_id"); // the currently logged in author
  const api = useAxios();
  const post_uuid = props.comment.id.split("posts/")[1].split("/comments")[0];
  //const [post, setPost] = useState([]);
  const [postsArray, setPostsArray] = useState({});
  const navigate = useNavigate();
  const routeChange = () => {
    navigate(`/authors/${props.comment.author.uuid}/`);
  };
  const postRouteChange = () => {
    var rout = props.comment.id.split("authors/")[1].split("/comments")[0];
    navigate(`/authors/${rout}`, { state: { refresh: true } });
  };

  useEffect(() => {
    api
      .get(`${baseURL}/authors/${user_id}/posts/${post_uuid}`)
      .then((response) => {
        //setPost(response.data);
        setPostsArray(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <Card className="inbox-comment-card">
      <Card.Body>
        <Row>
          <Col md="auto">
            <Card.Title onClick={routeChange}>
              <div className="profilePicCard">
                <img
                  id="profilePicCard"
                  src={props.comment.author.profileImage}
                  alt="profilePic"
                />
              </div>
              <div className="text">{props.comment.author.displayName}</div>
            </Card.Title>
          </Col>
          <Col md="auto">
            <p className="text"> commented your post!</p>
          </Col>
          <Col>
            <Popup
              trigger={
                <button style={{ background: "none", border: "none" }}>
                  <BsCursorFill
                    style={{
                      color: "white",
                      marginTop: "1em",
                      marginBottom: "1em",
                      marginRight: "1em",
                    }}
                    onClick={postRouteChange}
                  />
                </button>
              }
              position="right center"
              on="hover"
              closeOnDocumentClick
              mouseLeaveDelay={300}
              mouseEnterDelay={0}
              contentStyle={{ padding: "0px", border: "none" }}
              arrow={true}
            >
              <span> Click to see Post! </span>
            </Popup>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
