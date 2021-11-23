import React, {Component} from 'react'
import {Link, Navigate} from 'react-router-dom'
import {IoChevronBack} from 'react-icons/io5'
import {AiOutlineMail} from 'react-icons/ai'
import {Form, InputGroup} from 'react-bootstrap'
import {FormHelperText} from '@material-ui/core'
import { Spring, animated } from 'react-spring';
import Axios from 'axios';

class ForgotPassword extends Component{
    
    constructor(props) {
        super(props);

    //Initial State
        this.state = ({
            email: "",
            isValid: false,
            enterCode: false,
            redirect: false,
            error: "",
            one: "",
            two: "",
            three: "",
            four: "",
            isValidCode: false,
            code: "",
            nodesTogether: "",
            enterEmailDisplay: true
        });
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handleContinue = this.handleContinue.bind(this);
        this.handleKeyPressContinue = this.handleKeyPressContinue.bind(this);
        this.handleContinueCode = this.handleContinueCode.bind(this);
        this.handleKeyPressContinueCode = this.handleKeyPressContinueCode.bind(this);
        this.onChangeCode = this.onChangeCode.bind(this);
    }

    //Class Properties (Events On Change)
    handleEmail(e){
        let field = e.target.name;
        let value = e.target.value;
        this.setState({
            [field]: value,
            errorEmail: false,
            helperTextEmail: '',
        })
    }


    handleContinue(e){
        // Validators for email
        if(this.state.isValid === false){
            this.setState({
                isValid: true
            })
        }

        // Validators -> email
        if(this.state.email === ""){
            this.setState({
                helperTextEmail: 'Field cannot be empty!',
                errorEmail: true,
                isValid: false
            });
        }else if(!(this.state.email).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            this.setState({
                helperTextEmail: 'This is not a valid email!',
                errorEmail: true,
                isValid: false
            });
        }
    }

    handleKeyPressContinue(e){
        if (e.key === "Enter"){

            if(this.state.isValid === false){
                this.setState({
                    isValid: true
                })
            }

        // Validators -> email
        if(this.state.email === ""){
            this.setState({
                helperTextEmail: 'Field cannot be empty!',
                errorEmail: true,
                isValid: false
            });
        }else if(!(this.state.email).match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)){
            this.setState({
                helperTextEmail: 'This is not a valid email!',
                errorEmail: true,
                isValid: false
            });
        }
        }
    }

    verifyCredentials = async e =>{
        e.preventDefault();
        
        // Authenticate username and password
        Axios.post('http://localhost:3001/Forgot/Email', {
            email: this.state.email
        }).then(res => {

            console.log(res.data);
            //save random 4 digit code for authentication
            if(res.data.code){
                this.setState({
                    code: res.data.code
                });
            }

            console.log(this.state.code);
            if(res.data.message !== "success" || res.data === ""){
                this.setState({
                    helperTextEmail: 'This is not a valid email!',
                    errorEmail: true,
                    isValid: false,
                });
            }else if (this.state.isValid === true){
                this.setState({                    
                    enterCode: true,
                    enterEmailDisplay: false
                });
        }}).catch((e) => {
            this.setState({
                error: `${e.response.status}`
            })

            if(this.state.error === '404'){
                this.setState({
                    helperTextEmail: 'Email could not be found!',
                    errorEmail: true,
                    isValid: false,
                });
            }
            
        });
        
    }

    onChangeCode(e){
        let field = e.target.name;
        let value = e.target.value;
        
        this.setState({
            [field]: value,
            errorCode: false,
            helperTextCode: '',
        })
        
        //code for the the next and previous node
        if (value.length >= e.target.getAttribute("maxlength")) {
            if(value !== this.state.four){
                e.target.nextElementSibling.focus();
            }
        }else if(value.length <= e.target.getAttribute("maxlength")){
            if(value !== this.state.two){
                e.target.previousElementSibling.focus();
            }
        }
    }

    handleContinueCode(e){
        if(this.state.isValidCode === false){
            this.setState({
                isValidCode: true
            })
        }

        if(this.state.one === '' || this.state.two === '' || this.state.three === '' || this.state.four === ''){
            this.setState({
                helperTextCode: 'Fields cannot be empty!',
                errorCode: true,
                isValidCode: false
            });
        }else if(!(this.state.one || this.state.two || this.state.three || this.state.four).match(/^[0-9]+$/)){
            this.setState({
                helperTextCode: 'Fields can only have numbers!',
                errorCode: true,
                isValidCode: false
            });
        }else{
            const nodesTogether = parseInt(this.state.one + this.state.two + this.state.three + this.state.four);
            this.setState({
                nodesTogether: nodesTogether
            })
        }
    }

    handleKeyPressContinueCode(e){
        if (e.key === "Enter"){
            
            if(this.state.isValidCode === false){
                this.setState({
                    isValidCode: true
                })
            }
    
            if(this.state.one === '' || this.state.two === '' || this.state.three === '' || this.state.four === ''){
                this.setState({
                    helperTextCode: 'Fields cannot be empty!',
                    errorCode: true,
                    isValidCode: false
                });
            }else if(!(this.state.one || this.state.two || this.state.three || this.state.four).match(/^[0-9]+$/)){
                this.setState({
                    helperTextCode: 'Fields can only have numbers!',
                    errorCode: true,
                    isValidCode: false
                });
            }else{
                const nodesTogether = parseInt(this.state.one + this.state.two + this.state.three + this.state.four);
                this.setState({
                    nodesTogether: nodesTogether
                })
            }
        }
    }

    validateCode = async e =>{
        e.preventDefault();

        if(this.state.code !== "" && this.state.nodesTogether !== ""){

            if(this.state.nodesTogether === this.state.code){
                this.setState({
                    redirect: true
                })
            }else{
                this.setState({
                    helperTextCode: 'Incorrect Code!',
                    errorCode: true,
                    isValidCode: false
                });
            }
        }
    }

    refreshPage = () => {
        window.location.reload(false);
    }

    renderRedirect(){
        if (this.state.redirect === true){
            return <Navigate  to='/ResetPassword'/>
        }
    }
    
    
    render() {
        if(this.state.enterEmailDisplay === true){
            return (
                <div>
                    <div className="forgotContainer">
                        <div className="forgotPasswordTitleContainer">
                            <h1 className="forgotTitleText"><b>Forgot</b></h1>
                            <h1 className="passwordTitleText"><b>Password?</b></h1>
                        </div>
                        <div>
                            <Form onKeyPress={this.handleKeyPressContinue} onSubmit={this.verifyCredentials}>
                                <div className="forgotPasswordTextContainer">
                                    <p className="forgotPasswordText">
                                        Enter your email for the verification process, we will send a 4 digit code to your email.
                                    </p>
                                </div>

                                <Form.Group className="contentBar">
                                    <InputGroup>
                                        <InputGroup.Text><AiOutlineMail/></InputGroup.Text>
                                        <Form.Control 
                                            type="email"
                                            placeholder="Email" 
                                            name="email"
                                            value={this.state.email}
                                            className="contentBarText" 
                                            onChange={this.handleEmail}
                                            isInvalid={this.state.errorEmail} 
                                        />
                                    </InputGroup>
                                    <FormHelperText error>
                                        <span className="centerReqContainer">
                                            <span className="requirements">{this.state.helperTextEmail}</span>
                                        </span>
                                    </FormHelperText> 
                                </Form.Group>

                                <button className="continue_button_forgotPassword" type="submit"  onClick={this.handleContinue} >
                                    <b>CONTINUE</b>
                                </button>
                                
                            </Form>
                        </div>
                    </div>
                    <Link to="/" className="link"><IoChevronBack className="Back_button_ForgotPassword"/></Link>   
                </div>    
            );
        }else if (this.state.enterCode === true){
            return(
                <Spring from={{ opacity: 0, Transform: `flash(0%)`}} to={{ opacity: 1, Transform: `flash(100%)`}}>
                {style => (
                    <animated.div style={ style } >
                    <div>
                        <div className="forgotContainer">
                            <div className="forgotPasswordTitleContainer">
                                <h1 className="codeTitleText"><b>Enter Code</b></h1>
                            </div>
                            
                            <div>
                                <Form onKeyPress={this.handleKeyPressContinueCode} onSubmit={this.validateCode}>
                                    <div className="forgotPasswordTextContainer">
                                        <p className="forgotPasswordText">
                                            Enter the 4 digit code that you received on your email.
                                        </p>
                                    </div>
            
                                    <Form.Group className="codeBarContainer">
                                        <Form.Control 
                                            type="text" 
                                            maxLength="1"
                                            className="codeBarText"
                                            name="one"
                                            value={this.state.one}   
                                            onChange={this.onChangeCode}
                                            isInvalid={this.state.errorCode} 
                                        />
                                        <Form.Control 
                                            type="text" 
                                            maxLength="1"
                                            className="codeBarText"
                                            name="two"
                                            value={this.state.two}    
                                            onChange={this.onChangeCode}
                                            isInvalid={this.state.errorCode}  
                                        />
                                        <Form.Control 
                                            type="text" 
                                            maxLength="1" 
                                            className="codeBarText" 
                                            name="three"
                                            value={this.state.three}  
                                            onChange={this.onChangeCode} 
                                            isInvalid={this.state.errorCode} 
                                        />
                                        <Form.Control 
                                            type="text" 
                                            maxLength="1" 
                                            className="codeBarText"
                                            name="four"
                                            value={this.state.four}
                                            onChange={this.onChangeCode} 
                                            isInvalid={this.state.errorCode} 
                                        />
                                        <Form.Control.Feedback type='invalid'>
                                            <span className="codeReqContainer">
                                                {this.state.helperTextCode}
                                            </span>
                                        </Form.Control.Feedback>
                                    </Form.Group>
            
                                    <button className="continue_button_forgotPassword" type="submit" onClick={this.handleContinueCode} >
                                        <b>CONTINUE</b>
                                    </button>
                                    {this.renderRedirect()}
                                </Form>
                            </div>
                        </div>   
                        <IoChevronBack className="Back_button_EnterCode link" onClick={this.refreshPage}/>
                    </div>  
                    </animated.div>
                )}
                </Spring>     
            );    
        }
    }  
}

export default ForgotPassword;