import React, { useState, useContext } from 'react';
import { Modal, Button, Form, InputGroup, CloseButton } from "react-bootstrap";
import useAxios from '../../utils/useAxios';
import "./EditPost.css";
import AuthContext from "../../context/AuthContext";
import { FaImage, FaLink } from "react-icons/fa";

export default function CreatePost(props) {
    const [show, setShow] = useState(true);
    const [unlist, setUnlist] = useState(() => props.post.unlisted ? true : false)
    const [isActive, setIsActive] = useState(() => props.post.unlisted ? true : false)
    const [eveActive, setEveActive] = useState(() => props.post.visibility === "PUBLIC" ? true : false)
    const [friActive, setFriActive] = useState(() => props.post.visibility === "FRIENDS" ? true : false)
    const [priActive, setPriActive] = useState(() => props.post.visibility === "PRIVATE" ? true : false)
    const { authTokens } = useContext(AuthContext);
    const { baseURL } = useContext(AuthContext);      // our api url http://127.0.0.1/service
    const api = useAxios();
    const user_id = localStorage.getItem("user_id");
    const [post, setPost] = useState({
        title: props.post.title,
        source: props.post.source,
        origin: props.post.origin,
        description: props.post.description,
        contentType: props.post.contentType,
        content: props.post.content,
        categories: props.post.categories,
        visibility: props.post.visibility,
        unlisted: props.post.unlisted,
    })


    /**
     * In order to change the color of the button when selecting a visibility option, whenever the user clicks on one of the options,
     * we set that as active (EveActive = Everyone, FriActive = Friends-only, PriActive = private) and set the other as false, these
     * variables are used in the style tag to determine if they are active (if so we change the text and background color of that button).
     * 
     * @param {*} option 
     */

    const setVisibility = (option) => {
        setPost({...post, visibility: option})
        if(option === "PUBLIC"){
            setEveActive(true)
            setFriActive(false)
            setPriActive(false)
        } else if(option === "PRIVATE"){
            setEveActive(false)
            setFriActive(false)
            setPriActive(true)
        } else {
            setEveActive(false)
            setFriActive(true)
            setPriActive(false)
        }
    }

    /**
     * Once the user clicks the unlisted button, we set unlisted to the opposite of the current variable value.
     * This way, if the user had previously clicked unlisted before, this changes it to false and viceversa. So
     * we set unlisted to the correct value depending on is unlist is true or not.
     * 
     */

    const unlistPost = () => {
        setUnlist(!unlist)
        if(unlist){
            setIsActive(true)
            setPost({...post, unlisted: true})
        } else {
            setIsActive(false)
            setPost({ ...post, unlisted: false})
        }
    };

    /**
     * When the users click the button "Post", we will use the information created in the variable post to send it to the API.
     * We use the user_id (created using useCOntext of the current autheticated user) to create a path to posts, and we autheticated
     * it using our auth token. If the request is successful we send a response to the console and call the function closePost. If not
     * we will send the error to the console and the error will not be logged. 
     * 
     */

    const sendPost = () => {
        api
            .post(`${baseURL}/authors/${user_id}/posts/${props.post.uuid}`, post)
            .then((response) => {
                console.log(response.data);
                props.onHide()
            })
            .catch((error) => {
                alert(`Something went wrong posting! \n Error: ${error.response.data}`)
                console.log(error);
            });
    };

    return (
        <div class="post-modal">
            <Modal size="lg"
                {...props}
                aria-labelledby="contained-modal-title-vcenter"
                className="edit-post-modal"
                centered
            >
                <Form>
                    <Modal.Header>
                        <Modal.Title className='header'>Edit Post | </Modal.Title>
                        <Modal.Title className="header1">Who can see this post?</Modal.Title>
                        <div className="visibility-options">
                            <Button type="button" value="Everyone" className='option' name="view" 
                                style={{
                                    backgroundColor: eveActive ? ' #BFEFE9' : '',
                                    color: eveActive ? 'black' : '',
                                }} 
                                onClick={() => {
                                    setVisibility("PUBLIC")}}>
                            Everyone </Button>
                            <Button type="button" value="Friends" className='option' name="view" 
                                style={{
                                    backgroundColor: friActive ? ' #BFEFE9' : '',
                                    color: friActive ? 'black' : '',
                                }} 
                                onClick={() => {
                                    setVisibility("FRIENDS")
                                }}>
                            Friends-Only </Button>
                            <Button type="button" value="Private" className='option' name="view" 
                                style={{
                                    backgroundColor: priActive ? ' #BFEFE9' : '',
                                    color: priActive ? 'black' : '',
                                }} 
                                onClick={() => {
                                    setVisibility("PRIVATE")
                            }}>
                                Private 
                            </Button>
                            <Button style={{
                                backgroundColor: isActive ? ' #BFEFE9' : '',
                                color: isActive ? 'black' : '',
                                }} className="unlist" onClick={unlistPost}> 
                                Unlisted 
                            </Button>
                        </div>
                        <CloseButton className='me-2' variant="white" onClick={props.onHide} />
                    </Modal.Header>
                    <Modal.Body>
                        <Form.Group className="title">
                            <Form.Control label="title" name="title" type="text" value={post.title} placeholder="Title" 
                                onChange={(e) => {
                                    setPost({
                                        ...post,
                                        title: e.target.value,
                                    })}} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Control as="textarea" className="body" type="content" value={post.content} placeholder="Write you Post..."
                                onChange={(e) => {
                                    setPost({
                                        ...post,
                                        content: e.target.value,
                                    })
                            }} />
                            <Form.Control.Feedback type="invalid">
                                Please choose a walk type.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <FaImage className="image" onClick={(e) => {
                            setPost({
                                ...post,
                                contentType: "image",
                            });
                        }} />
                        <FaLink className="link" onClick={(e) => {
                            setPost({
                                ...post,
                                contentType: "link",
                            });
                        }} />
                        <Button className="postButton" onClick={sendPost}>
                            Post
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </div>
    );
}
