import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { getOrdersToSendEmails, sendOrderEmail, deleteOrderEmail, getCustomerToFollowUp, deleteFollowUpEmail, sendFollowUpEmail } from '../actions';
import { updateOrderNotes } from '../../orders/actions';
import { EmailList, EmailListItem, EmailListItemContent, EmailsFieldUpdater, EmailFollowUpItem, EmailFollowUpItemContent } from '../components/components';

export class EmailFollowUpContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeOrdersIndexes: [...Array(20)].map((u, i) => i),
            activeOrderPage: 0,
            totalOrdersPerPage: 20,
            emailsLastLine: 'Thanks again!',
            emailsSubject: 'Audry Rose Order {ID}'
        };
    }

    handleClickOnOrder(orderIndex) {
        const { activeOrdersIndexes } = this.state;
        const index = activeOrdersIndexes.indexOf(orderIndex);
        if (index === -1)
            this.setState({
                activeOrdersIndexes: [...activeOrdersIndexes, orderIndex]
            });
        else
            this.setState({
                activeOrdersIndexes: [...activeOrdersIndexes.slice(0, index), ...activeOrdersIndexes.slice(index + 1)]
            });
    }

    handleSendOrder(objectId, emailParams) {
        this.props.sendOrderEmail(objectId, emailParams, this.props.token);
    }

    handleDeleteOrder(customerId) {
        this.props.sendFollowUpEmail(customerId, this.props.token);
    }

    handlePageChange(newPage) {
        if (newPage < 0
            || newPage >= (this.props.followUpsCustomers.followUpsCustomers.length / this.state.totalOrdersPerPage))
            return;
        this.setState({ activeOrderPage: newPage });
    }

    handleUpdateLastLine(text) {
        //this.setState({ emailsLastLine: text });
    }

    handleUpdateSubject(text) {
        //this.setState({ emailsSubject: text });
    }

    componentWillMount() {
        this.props.getCustomerToFollowUp();
    }

    handleUpdateOrderNotes(orderId, orderNotes) {
        this.props.updateOrderNotes(this.props.token, orderId, orderNotes);
    }

    render() {
        const { activeOrdersIndexes, activeOrderPage, totalOrdersPerPage, emailsLastLine, emailsSubject } = this.state;
        const search = this.props.location.query.q ? this.props.location.query.q.toLowerCase() : '';
        let temp = [];
        let emailListContent = this.props.followUpsCustomers.followUpsCustomers
            .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
            .reduce((all, current, index) => {
                if (search !== '') {
                    let fName = current.firstName.toLowerCase();
                    let lName = current.lastName.toLowerCase();
                    let orderId = current.lastOrder.orderId.toString();
                    let found = false;
                    if (search.includes(orderId)) {
                        found = true;
                    }
                    if (fName != '' && search.includes(fName)) {
                        found = true;
                    }
                    if (lName != '' && search.includes(lName)) {
                        found = true;
                    }
                    if (!found) return;
                }
                temp.push(
                    <EmailFollowUpItem
                        key={'ELI' + index}
                        active={activeOrdersIndexes.indexOf(index) !== -1}
                        orderId={current.lastOrder.orderId}
                        customerMessage={current.lastOrder.customerMessage}
                        staffNotes={current.lastOrder.staffNotes}
                        internalNotes={current.lastOrder.internalNotes}
                        designerNotes={current.lastOrder.designerNotes}
                        handleUpdateOrderNotes={this.handleUpdateOrderNotes.bind(this)}
                        customerId={current.customerId}
                        name={`${current.firstName} ${current.lastName}`}
                        orderNumber={current.lastOrder.orderId}
                        handleClick={this.handleClickOnOrder.bind(this, index)}
                        lifetimeSpend={current.totalSpend}
                        lifetimeOrders={current.totalOrders} />
                );

                if (activeOrdersIndexes.indexOf(index) !== -1)
                    temp.push(
                        <EmailFollowUpItemContent
                            key={'ELIC' + index}
                            user={this.props.user}
                            active={activeOrdersIndexes === current}
                            orderId={current.lastOrder.orderId}
                            products={current.products}
                            customer={current}
                            emailLastLine={emailsLastLine}
                            emailSubject={emailsSubject}
                            handleSendOrder={this.handleSendOrder.bind(this)}
                            handleDeleteOrder={this.handleDeleteOrder.bind(this)} />
                    );
                return temp;
            }, []); // END emailListContent
        emailListContent = emailListContent == undefined ? temp : emailListContent;
        return (
            <Grid.Column width="16">
                <Segment loading={this.props.followUpsCustomers.isLoading} basic style={{ padding: 0 }}>
                    <EmailList
                        headerColumns={["Customer", "Lifetime spend", "Last Order", "Notes", ""]}
                        activePage={activeOrderPage}
                        handleOnPageChange={this.handlePageChange.bind(this)}
                        totalPages={Math.round(this.props.followUpsCustomers.followUpsCustomers.length / totalOrdersPerPage)}>
                        {emailListContent}
                    </EmailList>
                </Segment>
            </Grid.Column>
        );
    }
}




const state = state => ({
    user: state.auth.user,
    token: state.auth.token,
    followUpsCustomers: state.emailOrders,
});

const actions = {
    getOrdersToSendEmails,
    sendOrderEmail,
    deleteOrderEmail,
    updateOrderNotes,
    getCustomerToFollowUp,
    deleteFollowUpEmail,
    sendFollowUpEmail
};

export default connect(state, actions)(EmailFollowUpContainer);