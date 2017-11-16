import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { getOrdersToSendEmails, sendOrderEmail, deleteOrderEmail } from '../../actions/emailOrders';
import { EmailList, EmailListItem, EmailListItemContent, EmailLastLineUpdater } from '../../components/email/';

export class EmailSectionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOrdersIndexes: [...Array(20)].map((u,i) => i),
      activeOrderPage: 0,
      totalOrdersPerPage: 20,
      lastLineText: 'Thanks again!',
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
    this.setState({ lastLineText: text });
  }

  componentWillMount() {
    this.props.getOrdersToSendEmails();
  }

  render() {
    const { activeOrdersIndexes, activeOrderPage, totalOrdersPerPage } = this.state;

    const emailListContent = this.props.emailOrders.orders
      .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
      .reduce((all, current, index) => {
        let temp = all || [];

        temp.push(
          <EmailListItem
            key={'ELI' + index}
            active={activeOrdersIndexes.indexOf(index) !== -1}
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
              lastLineText={this.state.lastLineText}
              handleSendOrder={this.handleSendOrder.bind(this)}
              handleDeleteOrder={this.handleDeleteOrder.bind(this)} />
          );

        return temp;
      }, []); // END emailListContent

    return (
      <Grid.Column width="16">
        <EmailLastLineUpdater
          handleUpdateAll={this.handleUpdateLastLine.bind(this)}/>

        <Segment loading={this.props.emailOrders.isLoading} basic style={{ padding: 0 }}>
          <EmailList
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
  deleteOrderEmail
};

export default connect(state, actions)(EmailSectionContainer);