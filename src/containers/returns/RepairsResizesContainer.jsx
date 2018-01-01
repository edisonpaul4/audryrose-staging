import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Grid, Menu, Segment, Table } from 'semantic-ui-react';

import { ReturnProductRow } from '../../components/returns';
import { getReturns } from '../../actions/returns';

class RepairsResizesContainer extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getReturns(this.props.token);
  }

  checkInProductHandler(returnId) {
    console.log(returnId);
  }

  render() {
    return (
      <Grid.Row>
        <Grid.Column width="16" style={{ marginBottom: '2rem' }}>
          <Menu pointing secondary>
            <Menu.Item
              as={Link}
              to="/repairs-resizes/all"
              active={this.props.location.pathname === "/repairs-resizes/" || this.props.location.pathname === "/repairs-resizes/all"}
              link
              content="All" />

            <Menu.Item
              as={Link}
              to="/repairs-resizes/returns"
              active={this.props.location.pathname === "/repairs-resizes/returns"}
              link
              content="Returns" />

            <Menu.Item
              as={Link}
              to="/repairs-resizes/repair"
              active={this.props.location.pathname === "/repairs-resizes/repair"}
              link
              content="Repairs" />

            <Menu.Item
              as={Link}
              to="/repairs-resizes/resize"
              active={this.props.location.pathname === "/repairs-resizes/resize"}
              link
              content="Resizes" />
          </Menu>
        </Grid.Column>

        <Grid.Column width="16">
          <Segment>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Date requested</Table.HeaderCell>
                  <Table.HeaderCell>Date Checked in</Table.HeaderCell>
                  <Table.HeaderCell>Order #</Table.HeaderCell>
                  <Table.HeaderCell>Customer name</Table.HeaderCell>
                  <Table.HeaderCell>Product name</Table.HeaderCell>
                  <Table.HeaderCell>Product image</Table.HeaderCell>
                  <Table.HeaderCell>Notes</Table.HeaderCell>
                  <Table.HeaderCell>Status</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Today at 2:49 PM</Table.Cell>
                  <Table.Cell>Today at 2:49 PM</Table.Cell>
                  <Table.Cell>12123</Table.Cell>
                  <Table.Cell>Enrique Arrieta</Table.Cell>
                  <Table.Cell>Aring Ring</Table.Cell>
                  <Table.Cell>IMAGE</Table.Cell>
                  <Table.Cell>C-S</Table.Cell>
                  <Table.Cell>requested</Table.Cell>
                </Table.Row>
                {this.props.returns.map(returnObject => (
                  <ReturnProductRow
                    key={`return-${returnObject.id}`}
                    returnId={returnObject.id}
                    dateRequested={returnObject.dateRequested}
                    dateCheckedIn={returnObject.dateCheckedIn}
                    checkedInHandler={this.checkInProductHandler.bind(this, returnObject.id)}
                    orderId={returnObject.orderId}
                    customerName={returnObject.customerName}
                    productName={returnObject.productName}
                    productImage={returnObject.productImage}
                    orderNotes={returnObject.orderNotes}
                    returnStatus={returnObject.returnStatus}
                    returnStatusId={returnObject.returnStatusId}
                    returnType={returnObject.returnType}
                    returnTypeId={returnObject.returnTypeId}
                    />
                ))}
              </Table.Body>
            </Table>
          </Segment>
        </Grid.Column>
      </Grid.Row>
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
  getReturns
};

export default connect(state, actions)(RepairsResizesContainer);