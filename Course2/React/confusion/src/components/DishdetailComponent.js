import React,{ Component} from 'react';
import { Card, CardImg, CardText, CardBody,
    CardTitle, Breadcrumb, BreadcrumbItem, Button, Modal,Label,Input,FormGroup,
    ModalBody, ModalHeader, Col, Row } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';


const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

    class CommentForm extends Component{
        constructor(props){
            super(props);
            this.state={
                isCommentOpen:false
            }

            this.toggleCommentForm=this.toggleCommentForm.bind(this);
            this.handleComment=this.handleComment.bind(this);
            
        }

        toggleCommentForm(){
            this.setState({
                isCommentOpen:!this.state.isCommentOpen
            });
        }

        handleComment(values) {
            this.props.postComment(this.props.dishId,values.rating,values.author,values.comment);
            this.toggleCommentForm();
        }

        render(){
            return(
                <React.Fragment>
                    <Button color="secondary" outline onClick={ this.toggleCommentForm }>
                        <span className="fa fa-pencil fa-lg">  </span> Submit Comment
                    </Button>
                    <Modal isOpen={this.state.isCommentOpen} toggle={this.toggleCommentForm}>
                        <ModalHeader toggle={this.toggleCommentForm}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(value) => this.handleComment(value)}>
                                <Row className="form-group">
                                    <Label htmlFor="rating" md={12}>Rating</Label>
                                    <Col md={12}>
                                        <Control.select model=".rating" id="rating" name="rating" className="form-control">
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="author" md={12}>Your Name</Label>
                                    <Col md={12}>    
                                        <Control.text model=".author" id="author" name="author" 
                                            placeholder="Your Name" className="form-control"
                                            validators={{
                                                maxLength:maxLength(15),minLength:minLength(3)
                                            }} />
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                                minLength: 'Must be greater than 2 characters  ',
                                                maxLength: 'Must be 15 characters or less  ',
                                            }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Label htmlFor="comment" md={12}>Comment</Label>
                                    <Col md={12}>
                                        <Control.textarea model=".comment" id="comment" name="comment"
                                            rows="6" className="form-control" />
                                    </Col>
                                </Row>                     
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </React.Fragment>
            );
        }
    }

    function RenderDish({ dish }){
        return (
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }}>
                    <Card>
                        <CardImg top width="100%" src={baseUrl + dish.image} alt={dish.name} />
                        <CardBody>
                            <CardTitle>{ dish.name }</CardTitle>
                            <CardText>{ dish.description }</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div> 
        );
    }


    function RenderComment({ comments,postComment,dishId }){
        if(comments!=null){
            return(
                <div className="col-12 col-md-5 m-1">
                    <h4>Comments</h4>
                    <ul className="list-unstyled">
                        <Stagger in>
                        { comments.map((comment => {
                            return(
                                <Fade in>
                                    <li key={comment.id}>
                                        <p>{comment.comment}</p>
                                        <p>-- { comment.author } , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}</p>
                                    </li>
                                </Fade>
                            );
                        }))}
                        </Stagger>
                    </ul>
                    <CommentForm dishId={dishId} postComment={postComment} />
                </div>
            );
        }
        else{
            return(<div></div>);
        }
    }

    function DishDetail(props){
        if (props.isLoading){
            return (
                <div className="container">
                    <div className="row">
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess){
            return (
                <div className="container">
                    <div className="row">
                        <h4>{ props.errMess }</h4>
                    </div>
                </div>
            );
        }

        else if(props.dish!=null){
            return(
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>{props.dish.name}</h3>
                            <hr />
                        </div>                
                    </div>
                    <div className="row">
                            <RenderDish dish={props.dish} />
                            <RenderComment comments={props.comments}
                            postComment = {props.postComment}
                            dishId = {props.dish.id} /> 
                    </div>
                </div>

            );
        } else {
            return(
                <div></div>
            );
        }
    }

    

export default DishDetail;