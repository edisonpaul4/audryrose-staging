import React from 'react';
import PropTypes from 'prop-types';
import { Table, Segment, Form, Divider, Button, Label, Icon } from "semantic-ui-react";
import * as moment from 'moment';

export default class EmailFollowUpItemContent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            emailSubject: 'Follow-Up Order #{ID}',
            emailMessage: '',
            segmentLoading: false,
        };
    }



    prepareMessageTemplate(customer, products, user, emailLastLine) {
        const nameToCamelCase = fullName => fullName
            .split(' ')
            .map(name => name.slice(0, 1).toUpperCase() + name.slice(1).toLowerCase())
            .join(' ');

        const getClassificationsName = products => {
            return [...new Set(products.map(item => (item && item.classification) ? item.classification.name : ' Products'))]

        }
        const msgHeader = `Hi ${nameToCamelCase(customer.firstName)},\n\n`;
        let msgContent = 'I just wanted to follow up and make sure you love your new:\n \n' + getClassificationsName(products).map(item => ' - ' + item + '  ');
        const msgFooter = `\n \nYour support means the world to us, and please feel free to reach out anytime with any questions or concerns.\n \nWe do offer free resizing and 60 day returns, kindly let me know if I can assist you with anything.`;
        const msgBrand = `\n \nTracy Inoue\nwww.loveaudryrose.com\n424.387.8000`;
        return msgHeader + msgContent + msgFooter + msgBrand;
    }

    onDelete() {
        this.setState({ segmentLoading: true });
        this.props.handleDeleteOrder(this.props.customer.customerId);
    }

    onSend() {
        const { orderId, handleSendOrder } = this.props;
        const { emailMessage, emailSubject } = this.state;
        this.setState({ segmentLoading: true })
        handleSendOrder(orderId, {
            emailMessage,
            emailSubject: emailSubject.replace('{ID}', `#${orderId}`)
        });
    }

    componentWillMount() {
        const { customer, products, user, emailLastLine } = this.props;
        this.setState({
            emailMessage: this.prepareMessageTemplate(customer, products, user, emailLastLine)
        });
    }

    componentWillReceiveProps(newProps) {
        const { customer, products, user, emailLastLine, emailSubject } = newProps;

        if (emailSubject !== this.props.emailSubject)
            this.setState({ emailSubject: emailSubject });

        if (this.state.segmentLoading
            || customer !== this.props.customer
            || products !== this.props.products
            || user !== this.props.user
            || emailLastLine !== this.props.emailLastLine)
            this.setState({
                segmentLoading: false,
                emailMessage: this.prepareMessageTemplate(customer, products, user, emailLastLine)
            });
    }

    render() {
        const { emailMessage, emailSubject, segmentLoading } = this.state;
        const { products, customer } = this.props;
        return (
            <Table.Row colSpan="12" as="td">
                <Segment loading={segmentLoading} secondary={true}>
                    <Table width={16} basic="very">
                        <Table.Header>
                            <Table.HeaderCell width={4}>Product</Table.HeaderCell>
                        </Table.Header>


                        <Table.Body>
                            {products.map((product, i) => (
                                <Table.Row key={i}>
                                    <Table.Cell
                                        collapsing
                                        content={product ? product.name : ''} />

                                </Table.Row>
                            ))}


                            <Table.Row colSpan="12" as="td" style={{ paddingLeft: '0em' }}>
                                <Divider style={{ marginTop: 0 }} />
                                <Form>
                                    <Form.Group>
                                        <Form.Input
                                            label="Subject (write {ID} where the order's id should be placed)"
                                            value={emailSubject}
                                            onInput={e => this.setState({ emailSubject: e.target.value })} />
                                    </Form.Group>

                                    <Form.Group widths='equal'>
                                        <Form.TextArea
                                            label="Message"
                                            autoHeight={true}
                                            onChange={e => this.setState({ emailMessage: e.target.value })}
                                            value={emailMessage} />
                                    </Form.Group>
                                </Form>
                            </Table.Row>

                            <Table.Row>
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell />
                                <Table.Cell textAlign="right">
                                    <Button
                                        color="red"
                                        content="Delete"
                                        onClick={this.onDelete.bind(this)} />
                                    <Button
                                        color="green"
                                        content="Send"
                                        onClick={this.onSend.bind(this)} />
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Segment>
            </Table.Row>
        );
    }
}