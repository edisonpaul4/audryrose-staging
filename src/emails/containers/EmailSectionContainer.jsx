import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { getOrdersToSendEmails, sendOrderEmail, deleteOrderEmail } from '../../actions/emailOrders';
import { updateOrderNotes } from '../../orders/actions';
import { EmailList, EmailListItem, EmailListItemContent, EmailsFieldUpdater } from '../../components/email/';

export class EmailSectionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOrdersIndexes: [...Array(20)].map((u,i) => i),
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

  handleDeleteOrder(orderId) {
    this.props.deleteOrderEmail(orderId, this.props.token);
  }

  handlePageChange(newPage) {
    if (newPage < 0 
      || newPage >= (this.props.emailOrders.orders.length / this.state.totalOrdersPerPage))
      return;
    this.setState({ activeOrderPage: newPage });
  }

  handleUpdateLastLine(text) {
    this.setState({ emailsLastLine: text });
  }

  handleUpdateSubject(text) {
    this.setState({ emailsSubject: text });
  }

  componentWillMount() {
    this.props.getOrdersToSendEmails();
  }

  handleUpdateOrderNotes(orderId, orderNotes) {
    this.props.updateOrderNotes(this.props.token, orderId, orderNotes);
  }

  render() {
    const { activeOrdersIndexes, activeOrderPage, totalOrdersPerPage, emailsLastLine, emailsSubject } = this.state;

    const emailListContent = this.props.emailOrders.orders
      .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
      .reduce((all, current, index) => {
        let temp = all || [];

        temp.push(
          <EmailListItem
            key={'ELI' + index}
            active={activeOrdersIndexes.indexOf(index) !== -1}
            orderId={current.orderId}
            customerMessage={current.customerMessage}
            staffNotes={current.staffNotes}
            internalNotes={current.internalNotes}
            designerNotes={current.designerNotes}
            handleUpdateOrderNotes={this.handleUpdateOrderNotes.bind(this)}
            customerId={current.customer.customerId}
            name={`${current.customer.firstName} ${current.customer.lastName}`}
            orderNumber={current.orderId}
            handleClick={this.handleClickOnOrder.bind(this, index)}
            lifetimeSpend={current.customer.totalSpend}
            lifetimeOrders={current.customer.totalOrders} />
        );

        if(activeOrdersIndexes.indexOf(index) !== -1)
          temp.push(
            <EmailListItemContent
              key={'ELIC' + index}
              user={this.props.user}
              active={activeOrdersIndexes === current}
              orderId={current.orderId}
              products={current.orderProducts}
              customer={current.customer}
              emailLastLine={emailsLastLine}
              emailSubject={emailsSubject}
              handleSendOrder={this.handleSendOrder.bind(this)}
              handleDeleteOrder={this.handleDeleteOrder.bind(this)} />
          );

        return temp;
      }, []); // END emailListContent

    return (
      <Grid.Column width="16">
        <EmailsFieldUpdater
          button="Update emails' Last line"
          header="Update all emails"
          label="Emails' Last line"
          value={emailsLastLine}
          handleUpdateAll={this.handleUpdateLastLine.bind(this)} />

        <EmailsFieldUpdater
          button="Update email's subject"
          header="Update all emails"
          label="Write {ID} where the order's id should be placed"
          value={emailsSubject}
          handleUpdateAll={this.handleUpdateSubject.bind(this)} />

        <Segment loading={this.props.emailOrders.isLoading} basic style={{ padding: 0 }}>
          <EmailList
            headerColumns={["Customer", "Lifetime spend", "Order", "Notes", "Label", ""]}
            activePage={activeOrderPage}
            handleOnPageChange={this.handlePageChange.bind(this)}
            totalPages={Math.round(this.props.emailOrders.orders.length / totalOrdersPerPage)}>
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
  emailOrders: state.emailOrders,
});

const actions = {
  getOrdersToSendEmails,
  sendOrderEmail,
  deleteOrderEmail,
  updateOrderNotes
};

export default connect(state, actions)(EmailSectionContainer);