import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, Grid, Header, Image, Card } from 'semantic-ui-react';
import moment from 'moment';

import { getRatesForShipment } from '../actions';

class OrderShipmentRates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalOpen: false,
        };
    }

    createRatesSquare(rates, isRequesting) {
        if (isRequesting)
            return <h1>Loading...</h1>;

        const providers = rates.reduce((all, current) => {
            let temp = all || {};
            temp[current.provider] = temp[current.provider] ? [...temp[current.provider], current] : [current];
            return temp;
        }, {});

        return (
            Object.keys(providers).map((key, index) => (
                <Grid columns={16} key={index}>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <Header as='h3' dividing>
                                <Image src={providers[key][0].provider_image_200} />
                                <Header.Content>{key}</Header.Content>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        {providers[key].map((rate, index) => (
                            <Grid.Column width={8} style={{ marginBottom: '1rem' }}>
                                <Card>
                                    <Card.Content
                                        header={rate.servicelevel_name} />

                                    <Card.Content>
                                        <Header
                                            textAlign="center"
                                            as="h3"
                                            color="green"
                                            content={`${rate.currency} ${rate.amount}`} />

                                        <Header
                                            style={{ margin: 0 }}
                                            textAlign="center"
                                            as="h4"
                                            content={moment().add(rate.days ? rate.days : 0, 'days').format('[By] ddd, MMM DD')} />

                                        <Header
                                            style={{ margin: 0 }}
                                            textAlign="center"
                                            as="h5"
                                            content={rate.duration_terms} />
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        ))}
                    </Grid.Row>
                </Grid>
            ))
        );
    }

    requestRatesForThisParcel({ length, width, height, weight, orderId, token }) {
        const parcelParams = { length, width, height, weight };
        this.props.getRatesForShipment(parcelParams, orderId, token);
    }

    componentWillMount() {
        this.requestRatesForThisParcel(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.length !== this.props.length
            || newProps.width !== this.props.width
            || newProps.height !== this.props.height
            || newProps.weight !== this.props.weight
            || newProps.orderId !== this.props.orderId)
            this.requestRatesForThisParcel(newProps);
    }

    render() {
        const { modalOpen } = this.state;
        const { length, width, height, weight, rates, requestingForRates } = this.props;
        return (
            <Button onClick={() => this.setState({ modalOpen: true })}>
                Get rates
        <Modal dimmer={true} size="small" open={modalOpen} onClose={() => this.setState({ modalOpen: false })}>
                    <Modal.Header
                        content={`Rates for current package: ${length}in X ${width}in X ${height}in and ${weight}oz`} />

                    <Modal.Content
                        scrolling
                        content={this.createRatesSquare(rates, requestingForRates)} />

                    <Modal.Actions>
                        <Button
                            content='Close'
                            onClick={() => this.setState({ modalOpen: false })} />
                    </Modal.Actions>
                </Modal>
            </Button>
        );
    }
}

OrderShipmentRates.propTypes = {
    length: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    weight: PropTypes.string.isRequired,
    orderId: PropTypes.string.isRequired
};

const state = state => ({
    token: state.auth.token,
    rates: state.shipmentRates.rates,
    requestingForRates: state.shipmentRates.requestingForRates
});

const actions = {
    getRatesForShipment,
};

export default connect(state, actions)(OrderShipmentRates);