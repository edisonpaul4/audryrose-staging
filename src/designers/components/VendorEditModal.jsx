import React, { Component } from 'react';
import { Modal, Button, Form } from 'semantic-ui-react';

class VendorEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formComplete: false,
            vendorData: this.props.vendorData ? this.props.vendorData : null,
            name: this.props.vendorData && this.props.vendorData.name ? this.props.vendorData.name : '',
            firstName: this.props.vendorData && this.props.vendorData.firstName ? this.props.vendorData.firstName : '',
            lastName: this.props.vendorData && this.props.vendorData.lastName ? this.props.vendorData.lastName : '',
            email: this.props.vendorData && this.props.vendorData.email ? this.props.vendorData.email : '',
            waitTime: this.props.vendorData && this.props.vendorData.waitTime ? this.props.vendorData.waitTime : '',
            mode: this.props.mode ? this.props.mode : 'edit'
        };
        this.handleSaveVendor = this.handleSaveVendor.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleFirstNameChange = this.handleFirstNameChange.bind(this);
        this.handleLastNameChange = this.handleLastNameChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handleWaitTimeChange = this.handleWaitTimeChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleSaveVendor() {
        var data = {
            designerId: this.props.designerData.objectId,
            vendorId: this.state.vendorData ? this.state.vendorData.objectId : null,
            name: this.state.name,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            waitTime: this.state.waitTime
        };
        this.props.handleSaveVendor(data);
        this.props.handleVendorEditModalClose();
    }

    handleClose() {
        this.setState({
            formComplete: false,
            vendorData: null,
            name: '',
            firstName: '',
            lastName: '',
            email: '',
            waitTime: ''
        });
        this.props.handleVendorEditModalClose();
    }

    isFormComplete() {
        let formComplete = true;
        if (this.state.email === undefined || this.state.email === '') formComplete = false;
        return formComplete;
    }

    handleNameChange(e, { value }) {
        this.setState({
            name: value
        });
    }

    handleFirstNameChange(e, { value }) {
        this.setState({
            firstName: value
        });
    }

    handleLastNameChange(e, { value }) {
        this.setState({
            lastName: value
        });
    }

    handleEmailChange(e, { value }) {
        this.setState({
            email: value
        });
    }

    handleWaitTimeChange(e, { value }) {
        this.setState({
            waitTime: value
        });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.vendorData) {
            this.setState({
                vendorData: nextProps.vendorData,
                name: nextProps.vendorData.name,
                firstName: nextProps.vendorData.firstName,
                lastName: nextProps.vendorData.lastName,
                email: nextProps.vendorData.email,
                waitTime: nextProps.vendorData.waitTime
            });
        }
    }

    render() {
        const saveVendorButton = <Button disabled={this.props.isLoading || !this.isFormComplete()} color='olive' onClick={this.handleSaveVendor}>Save Vendor</Button>;

        return (
            <Modal open={this.props.open} onClose={this.handleClose} size='small' closeIcon='close'>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Input label='Company Name' value={this.state.name ? this.state.name : ''} onChange={this.handleNameChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label='First Name' value={this.state.firstName ? this.state.firstName : ''} onChange={this.handleFirstNameChange} />
                            <Form.Input label='Last Name' value={this.state.lastName ? this.state.lastName : ''} onChange={this.handleLastNameChange} />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input label='Email' type='email' value={this.state.email ? this.state.email : ''} onChange={this.handleEmailChange} />
                            <Form.Input label='Average Wait Time (days)' type='number' placeholder='21' value={this.state.waitTime ? this.state.waitTime : ''} onChange={this.handleWaitTimeChange} />
                        </Form.Group>
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button basic disabled={this.props.isLoading} color='grey' content='Close' onClick={this.handleClose} />
                    {saveVendorButton}
                </Modal.Actions>
            </Modal>
        );
    }
}

export default VendorEditModal;