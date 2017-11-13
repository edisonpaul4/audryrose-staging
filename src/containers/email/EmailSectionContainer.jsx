import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { getOrdersToSendEmails, sendOrderEmail, deleteOrderEmail } from '../../actions/emailOrders';
import { EmailList, EmailListItem, EmailListItemContent } from '../../components/email/';

export class EmailSectionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderActiveIndex: -1,
      activeOrderPage: 0,
      totalOrdersPerPage: 20
    };
  }

  handleClickOnOrder(index) {
    this.setState({
      orderActiveIndex: this.state.orderActiveIndex === index ? -1 : index
    });
  }

  handleSendOrder(orderId, emailMsg) {
    console.log('EmailSectionContainer::handleSendOrder');
    this.setState({ orderActiveIndex: -1 });
    this.props.sendOrderEmail(orderId, emailMsg, this.props.token);
  }

  handleDeleteOrder(orderId) {
    console.log('EmailSectionContainer::handleDeleteOrder');
    this.setState({ orderActiveIndex: -1 });
    this.props.deleteOrderEmail(orderId, this.props.token);
  }

  handlePageChange(newPage) {
    if (newPage < 0 
      || newPage >= (this.props.emailOrders.orders.length / this.state.totalOrdersPerPage))
      return;
    this.setState({ 
      activeOrderPage: newPage,
      orderActiveIndex: -1
    });
  }

  componentWillMount() {
    this.props.getOrdersToSendEmails();
  }

  render() {
    const { orderActiveIndex, activeOrderPage, totalOrdersPerPage } = this.state;

    const emailListContent = this.props.emailOrders.orders
      .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
      .reduce((all, current, index) => {
        let temp = all || [];

        temp.push(
          <EmailListItem
            key={'ELI' + index}
            active={orderActiveIndex === index}
            customerId={current.customer.customerId}
            name={`${current.customer.firstName} ${current.customer.lastName}`}
            orderNumber={current.orderId}
            handleClick={this.handleClickOnOrder.bind(this, index)}
            lifetimeSpend={current.customer.totalSpend}
            lifetimeOrders={current.customer.totalOrders} />
        );

        if(orderActiveIndex === index)
          temp.push(
            <EmailListItemContent
              key={'ELIC' + index}
              user={this.props.user}
              active={orderActiveIndex === current}
              orderId={current.orderId}
              products={current.orderProducts}
              customer={current.customer}
              handleSendOrder={this.handleSendOrder.bind(this)}
              handleDeleteOrder={this.handleDeleteOrder.bind(this)} />
          );

        return temp;
      }, []); // END emailListContent

    return (
      <Grid.Column width="16">
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