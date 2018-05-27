import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Menu, Segment, Table, Icon, Form, Button, Divider, Modal } from 'semantic-ui-react';

import { getReturnsForEmails, sendReturnEmail } from '../../repairs-resizes/actions';
import { EmailList, EmailListReturnItem, EmailListReturnItemContent } from '../components/components';

class EmailReturnsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeOrderPage: 0,
      totalOrdersPerPage: 20,
      notesModalOpen: false,
      emailSubject: 'Audry Rose',
    };
  }

  componentWillMount() {
    this.props.getReturnsForEmails();
  }

  handlePageChange(newPage) {
    if (newPage < 0
      || newPage >= (this.props.returns.length / this.state.totalOrdersPerPage))
      return;
    this.setState({ activeOrderPage: newPage });
  }

  render() {
    const { activeOrdersIndexes, activeOrderPage, totalOrdersPerPage, emailsLastLine, emailsSubject } = this.state;
    let temp = [];
    const search = this.props.location.query.q ? this.props.location.query.q.toLowerCase() : '';
    let emailListContent = this.props.returns
      .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
      .reduce((all, current, index) => {

        const words = [
          (current.orderNotes.customerNotes !== null || current.orderNotes.staffNotes !== null) ? 'C' : null,
          current.orderNotes.designerNotes !== null ? 'D' : null,
          current.orderNotes.internalNotes !== null ? 'I' : null,
        ].filter(w => w !== null).join(' - ');
        if (search !== '') {
          let fName = current.customerName.toLowerCase();
          let orderId = current.orderId.toString();
          let found = false;
          if (search.includes(orderId)) {
            found = true;
          }
          if (fName != '' && fName.includes(search)) {
            found = true;
          }
          if (!found) return;
        }
        temp.push(
          <EmailListReturnItem
            key={'up-' + index}
            returnId={current.id}
            orderId={current.orderId}
            customerName={current.customerName}
            customerLifetime={current.customerLifetime}
            orderNotes={current.orderNotes} />
        );

        temp.push(
          <EmailListReturnItemContent
            key={'down-' + index}
            returnId={current.id}
            customerName={current.customerName}
            productName={current.productName}
            productClassification={current.productClassification}
            returnType={current.returnType}
            returnTypeId={current.returnTypeId}
            returnOptions={current.returnOptions}
            onSenEmail={this.props.sendReturnEmail.bind(this)}
            isCheckedIn={current.dateCheckedIn !== null} />
        );

        return temp;
      }, []); // END emailListContent
    emailListContent = emailListContent == undefined ? temp : emailListContent;

    return (
      <Grid.Column width="16">
        <Segment loading={this.props.loadingReturns} basic style={{ padding: 0 }}>
          <EmailList
            headerColumns={["Customer", "Lifetime spend", "Order", "Notes"]}
            activePage={activeOrderPage}
            handleOnPageChange={this.handlePageChange.bind(this)}
            totalPages={Math.round(this.props.returns.length / totalOrdersPerPage)}>
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
  returns: state.returns.returns,
  loadingReturns: state.returns.isLoadingReturns
});

const actions = {
  getReturnsForEmails,
  sendReturnEmail
};

export default connect(state, actions)(EmailReturnsContainer);
