import React, { Component } from "react";
import { render } from "react-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { Modal, Button, Table, Form, Input, Header, Segment, Dimmer, Loader, Image, List, Grid, Label } from 'semantic-ui-react';


let images = [
    "https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg",
    "http://www.catster.com/wp-content/uploads/2017/08/A-brown-cat-licking-its-lips.jpg",
    "https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?cs=srgb&dl=animal-cat-cute-126407.jpg&fm=jpg",
    "https://www.catster.com/wp-content/uploads/2017/08/A-fluffy-cat-looking-funny-surprised-or-concerned.jpg",
    "http://www.catster.com/wp-content/uploads/2017/08/A-brown-cat-licking-its-lips.jpg",
    "https://images.pexels.com/photos/126407/pexels-photo-126407.jpeg?cs=srgb&dl=animal-cat-cute-126407.jpg&fm=jpg",
];

class ImagesModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photoIndex: 0,
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
        let pictures = this.props.pictureUrl ? this.props.pictureUrl.map(url => 'https://audryrose-dev.s3.amazonaws.com/'+url) :[];
        const { photoIndex, isOpen } = this.state;
        const imagesList = pictures.map((image, index) => <Grid.Column key={index}>
            <Image src={image} onClick={() => this.setState({ isOpen: true, photoIndex: index })} />
        </Grid.Column>)
        return (
            <Modal open={this.props.open} onClose={this.handleClose} size='large' closeIcon='close'>
                <Modal.Content>
                    <Header>Repairs History of product: {this.props.productName}</Header>
                    <div>
                        {isOpen && (
                            <Lightbox
                                mainSrc={pictures[photoIndex]}
                                nextSrc={pictures[(photoIndex + 1) % pictures.length]}
                                prevSrc={pictures[(photoIndex + pictures.length - 1) % pictures.length]}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                                onMovePrevRequest={() =>
                                    this.setState({
                                        photoIndex: (photoIndex + pictures.length - 1) % pictures.length
                                    })
                                }
                                onMoveNextRequest={() =>
                                    this.setState({
                                        photoIndex: (photoIndex + 1) % pictures.length
                                    })
                                }
                            />
                        )}
                    </div>
                    <Grid columns={3} divided>
                        {imagesList}
                    </Grid>
                   
                </Modal.Content>
                <Modal.Actions>
                {addictureButton}
                </Modal.Actions>
            </Modal>

        );
    }
}
export default ImagesModal;
