import React, { Component } from "react";
import { render } from "react-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Modal, Button, Table, Form, Input, Header, Segment, Dimmer, Loader, Image, List, Grid, Label } from 'semantic-ui-react';



class ImagesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoSrc: '',
            isOpen: false
        };
        this.handleClose = this.handleClose.bind(this);
        this.handleRepairPictureUpload = this.handleRepairPictureUpload.bind(this);
    }
    handleClose() {
        this.props.handleImagesModalClose();
    }

    handleRepairPictureUpload(e) {
        this.props.handleUploadRepairImage(e.target.files[0]);
    }

    render() {
        const addictureButton = this.props.isUniqueReturn ? (<Input
            type="file"
            onChange={this.handleRepairPictureUpload}
            name="file"
            accept="image/x-png,image/gif,image/jpeg" />) : null;
        let pictures;
        let imagesList;
        if (this.props.pictureUrl) {
            pictures = this.props.pictureUrl ? this.props.pictureUrl.map(url => 'https://audryrose-dev.s3.amazonaws.com/' + url) : [];
            imagesList =
                (<Grid columns={3} divided>
                    {pictures.map((image, index) => <Grid.Column key={index}>
                        <Image src={image} onClick={() => this.setState({ isOpen: true, photoSrc: image })} />
                    </Grid.Column>)}
                </Grid>)

        }
        if (this.props.returnObj) {
            pictures = ['test'];
            imagesList = this.props.returnObj.map((returnIn) =>
                <Segment key={returnIn.objectId}>
                    <Label>For Order ID: {returnIn.orderId}, Created at: {returnIn.createdAt}</Label>
                    <Grid columns={3} divided key={returnIn.objectId}>
                        {returnIn.pictureUrl.map((url, index) => {
                            url = 'https://audryrose-dev.s3.amazonaws.com/' + url;
                            return (
                                <Grid.Column key={index}>
                                    <Image src={url} onClick={() => this.setState({ isOpen: true, photoSrc: url })} />
                                </Grid.Column>)
                        })}
                    </Grid>
                </Segment>
            )
        }
        if ((imagesList && imagesList.length == 0) || imagesList == undefined) {
            imagesList =
                (<Grid columns={3} divided>
                    <Grid.Column>
                        <Image src={'https://www.allwoodstairs.com/wp-content/uploads/2015/07/Photo_not_available-4-300x300.jpg'} />
                    </Grid.Column>
            </Grid>)
        }
        const { photoSrc, isOpen } = this.state;
        return (
            <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
                <Modal.Content>
                    <Header>Repairs History of product: {this.props.productName}</Header>
                    <div>
                        {isOpen && (
                            <Lightbox
                                mainSrc={photoSrc}
                                onCloseRequest={() => this.setState({ isOpen: false })}

                            />
                        )}
                    </div>

                    {imagesList}


                </Modal.Content>
                <Modal.Actions>
                    {addictureButton}
                </Modal.Actions>
            </Modal>

        );
    }
}
export default ImagesModal;
