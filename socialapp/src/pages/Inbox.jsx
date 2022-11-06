import React, { useEffect, useState, useContext } from 'react';
import useAxios from "../utils/useAxios";
import AuthContext from "../context/AuthContext";
import "./pages.css";
import FollowRequestCard from "../components/Inbox/FollowRequestCard";
import LikeCard from "../components/Inbox/LikeCard";
import PostCard from "../components/Posts/PostCard";
import InboxCommentCard from '../components/Inbox/InboxCommentCard';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { BsFillTrashFill } from "react-icons/bs";
import { confirmAlert } from 'react-confirm-alert';
import "react-confirm-alert/src/react-confirm-alert.css";
import Popup from 'reactjs-popup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Toast from 'react-bootstrap/Toast'
import Nav from 'react-bootstrap/Nav';
export default function Inbox() {
  const [inboxItems, setInboxItems] = useState([]);      
  const [posts, setPosts] = useState([]);
  const [postNum, setPostNum] = useState(0);
  const [likeNum, setlikeNum] = useState(0);
  const [commentNum, setCommentNum] = useState(0);
  const [followNum, setFollowNum] = useState(0);

  const [followRequests, setFollowRequests] = useState([]);
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const { baseURL } = useContext(AuthContext);   // our api url http://127.0.0.1/service
  const user_id = localStorage.getItem("user_id"); // the currently logged in author
  const api = useAxios();
  const [key, setKey] = useState('post');  
  const [show, setShow] = useState(false);  

  function RenderInboxItem(props, type) {
    // renders a single inbox item based on its type
    if (props.item.type.toLowerCase() === "follow") {
      return <FollowRequestCard followRequest={props.item} />
    } else if (props.item.type.toLowerCase() === "like") {
      return <LikeCard like={props.item} />
    } else if (props.item.type.toLowerCase() === "comment") {
      if (props.item.author!=null){
        return <InboxCommentCard comment={props.item} />
      }
      
    } else if (props.item.type.toLowerCase() === "post") {
      return <PostCard post={props.item} />;
    }
    
  }
  
  

  useEffect(() => {
    const fetchData = async () => {
      await api      
        .get(`${baseURL}/authors/${user_id}/inbox/all`)
        .then((response) => {
          setInboxItems(response.data.items);
            for (let i = 0; i < response.data.items.length; i++) {
              if (response.data.items[i].type.toLowerCase() === "follow") {
                setFollowNum(followNum =>followNum+1);
                setFollowRequests(followRequests=>[...followRequests, response.data.items[i]] );
              } else if (response.data.items[i].type.toLowerCase() === "like") {
                setlikeNum(likeNum =>likeNum+1);
                setLikes(likes => [...likes, response.data.items[i]]);
              } else if (response.data.items[i].type.toLowerCase() === "comment") {
                if (response.data.items[i].author!=null){
                  setCommentNum(commentNum =>commentNum+1);
                  setComments(comments => [...comments, response.data.items[i]]);
                }
                
              } else if (response.data.items[i].type.toLowerCase() === "post") {
                setPostNum(postNum =>postNum+1);
                setPosts(posts => [...posts, response.data.items[i]]);
              }
              
            }


          console.log("Got inbox of author")
        })
        .catch((error) => {
          console.log("Failed to get inbox of author. " + error);
        });
    };
    fetchData();
  }, []);

  const clearInbox = ()=>{
    confirmAlert({
      title: 'Confirm to delete',
      message: 'Are you sure to clear inbox?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => deleteInbox(),                        
        },
        {
          label: 'No',
        }
      ]
    });
  }
  const deleteInbox =()=>{
    api.delete(`${baseURL}/authors/${user_id}/inbox/`)
      .then((response)=>
      setShow(true),
      setPosts([]),
      setComments([]),
      setLikes([]),
      setFollowRequests([]),
      ).catch((error)=> {
        console.log(error)
      })
  }

  return (
    <div className="inbox-container">
      <Row xs='auto'>
        <Col>
        <h1>Inbox</h1>
        </Col>
        <Col>
        
        <Popup
            trigger={<div><BsFillTrashFill style={{color: 'white',marginTop: '1em',marginBottom: '1em', marginRight:'1em'}}
            onClick={clearInbox}
            /> </div>}
            position="bottom center"
            on="hover"
            closeOnDocumentClick
            contentStyle={{ padding: '0px', border: 'none', color:'black' }}
            arrow={true}
          >
            <span> Click to clear inbox! </span>

        </Popup>
        </Col>
      </Row>
      
      <div className="inbox-items-container">
      <Tab.Container id="left-tabs-example" defaultActiveKey="post">
        <Row>
          <Row >
            <Nav variant="tabs" id="justify-tab-example"transition={true} justify fill>
              <Nav.Item>
                <Nav.Link eventKey="post">Post {postNum}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="like">Like {likeNum}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="comment">Comment  {commentNum}</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="follow">Follow Request {followNum}</Nav.Link>
              </Nav.Item>
            </Nav>
          </Row>
          <Col>
            <Tab.Content>
              <Tab.Pane eventKey="post">
              {
                typeof posts !== 'undefined' ? 
                posts.length!==0 ?
                  posts.map((item) =><PostCard post={item} />)
                :  <h4>No post yet! </h4>
                  :<h4>No post yet! </h4>
                }
              </Tab.Pane>
              <Tab.Pane eventKey="like">
              {
              typeof likes !== 'undefined' ? 
              likes.length!==0?
                likes.map((item) =><LikeCard like={item} />)
                : <h4>No like yet! </h4>
              : <h4>No like yet! </h4>  
              }
              </Tab.Pane>
              <Tab.Pane eventKey="comment">
              {
                typeof comments !== 'undefined' ? 
                comments.length!==0?
                  comments.map((item) =><InboxCommentCard comment={item} />)
                  : <h4>No comment yet! </h4>
                : <h4>No comment yet! </h4>
                }
              </Tab.Pane>
              <Tab.Pane eventKey="follow">
              {
                typeof followRequests !== 'undefined'? 
                followRequests.length!==0?
                  followRequests.map((item) =><FollowRequestCard followRequest={item} />)
                  :<h4>No follow request yet! </h4>
                : <h4>No follow request yet! </h4>
                }
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
      </div>
      <Toast onClose={() => setShow(false)} show={show} delay={1500} autohide>
          <Toast.Header>
            <img
              src="holder.js/20x20?text=%20"
              className="rounded me-2"
              alt=""
            />
            <strong className="me-auto">Bootstrap</strong>
          </Toast.Header>
          <Toast.Body>You successfully delet inbox!</Toast.Body>
        </Toast>
    </div>
  );
}
