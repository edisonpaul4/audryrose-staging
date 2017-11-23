import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { getAllPendingVendorOrders } from '../../actions/designers';
import { VendorOrdersList, VendorOrderListItem } from '../../components/designers/';

class VendorOrdersContainer extends React.Component {
  constructor(props) { 
    super(props);
    this.state = {
      activeOrderPage: 0,
      totalOrdersPerPage: 20,
    }
  }

  handlePageChange(newPage) {
    if (newPage < 0
      || newPage >= (this.props.vendorOrders.length / this.state.totalOrdersPerPage))
      return;
    this.setState({ activeOrderPage: newPage });
  }

  changeSortValue(sortBy) {
    const params = {
      ...this.props.location.query,
      sort_by: sortBy,
      sort_direction: this.props.location.query.sort_direction === 'ASC' ? 'DESC' : 'ASC'
    };

    const queryString = Object.keys(params).reduce((all, key) => {
      let temp = all || '';
      temp = `${temp}&${key}=${params[key]}`;
      return temp;
    }, '?');

    this.props.router.push({
      pathname: this.props.location.pathname,
      search: queryString
    });
  }

  getSortedVendorOrders(sortBy = 'all', sortDirection = "ASC") {
    const { vendorOrders } = this.props;
    switch (true) {
      case sortBy === "dateAdded":
        return vendorOrders.sort((a, b) => {
          const aTime = new Date(a.dateAdded.iso).getTime();
          const bTime = new Date(b.dateAdded.iso).getTime()
          if(sortDirection === 'ASC')
            return aTime - bTime;
          else if(sortDirection === 'DESC')
            return bTime - aTime;
        });

      case ["retailPrice", "totalInventory", "totalAwaiting", "unitsToOrder"].indexOf(sortBy) !== -1:
        return vendorOrders.sort((a, b) => sortDirection === 'DESC' ? (b[sortBy] | 0) - (a[sortBy] | 0) : (a[sortBy] | 0) - (b[sortBy] | 0));
      
      case ["designerName", "productName", "note", "internalNote"].indexOf(sortBy) !== -1:
        return vendorOrders.sort((a, b) => sortDirection === 'DESC' ? b[sortBy].localeCompare(a[sortBy]) : a[sortBy].localeCompare(b[sortBy]));
      
      default:
        return vendorOrders;
    }
  }

  componentWillMount() {
    this.props.getAllPendingVendorOrders();
  }

  render() {
    const { activeOrderPage, totalOrdersPerPage } = this.state;
    const { vendorOrders, requestingVendorOrders, location } = this.props;
    return (
      <Grid.Column width="16">
        <Segment loading={requestingVendorOrders && vendorOrders.length === 0} basic style={{ padding: 0 }}>
          <VendorOrdersList
            sort={{
              key: location.query.sort_by,
              direction: location.query.sort_direction
            }}
            handleOnPageChange={this.handlePageChange.bind(this)}
            handleOnSortChange={this.changeSortValue.bind(this)}
            activePage={activeOrderPage}
            totalPages={Math.round(vendorOrders.length / totalOrdersPerPage)}>

            {this.getSortedVendorOrders(location.query.sort_by, location.query.sort_direction)
              .slice(activeOrderPage * totalOrdersPerPage, (activeOrderPage * totalOrdersPerPage) + totalOrdersPerPage)
              .map((vendorOrder, i) => (
                <VendorOrderListItem
                  key={i}
                  designerId={vendorOrder.designerId}
                  productId={vendorOrder.productId}
                  dateAdded={vendorOrder.dateAdded}
                  designerName={vendorOrder.designerName}
                  productName={vendorOrder.productName}
                  retailPrice={vendorOrder.retailPrice}
                  productOptions={vendorOrder.productOptions}
                  totalInventory={vendorOrder.totalInventory}
                  totalAwaiting={vendorOrder.totalAwaiting}
                  unitsToOrder={vendorOrder.unitsToOrder}
                  note={vendorOrder.note}
                  internalNote={vendorOrder.internalNote} />
            ))}

          </VendorOrdersList>
        </Segment>
      </Grid.Column>
    );
  }
}

VendorOrdersContainer.propTypes = {
  
}

const state = state => ({
  vendorOrders: state.vendorOrders.vendorOrders,
  requestingVendorOrders: state.vendorOrders.requestingForVendorOrders
});

const actions = {
  getAllPendingVendorOrders: getAllPendingVendorOrders
};

export default connect(state, actions)(VendorOrdersContainer);