import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Segment } from 'semantic-ui-react';

import { VendorOrdersList, VendorOrderListItem } from '../../components/designers/';

class VendorOrdersContainer extends React.Component {
  constructor(props) { 
    super(props);
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

  render() {
    return (
      <Grid.Column width="16">
        <Segment loading={false} basic style={{ padding: 0 }}>
          <VendorOrdersList
            sort={{
              key: this.props.location.query.sort_by,
              direction: this.props.location.query.sort_direction
            }}
            handleOnSortChange={this.changeSortValue.bind(this)}
            activePage={0}  
            totalPages={5}>
            <VendorOrderListItem
              dateAdded={1514088000000}
              designerName={"AILI JEWELRY"}
              productName={"Postcard Sun Necklace 388NYS"}
              retailPrice={420.00}
              productOptions={[
                {
                  displayName: "COLOR",
                  displayValue: "Yellow Gold"
                }, {
                  displayName: "COLOR",
                  displayValue: "Rose Gold"
                }
              ]}
              totalInventory={5}
              totalAwaiting={3}
              needToOrder={1}
              note={"Product's note"}
              internalNote={"Internal's note"} />
            <VendorOrderListItem
              dateAdded={1513742400000}
              designerName={"AILI JEWELRY"}
              productName={"Postcard Sun Necklace 388NYS"}
              retailPrice={420.00}
              productOptions={[
                {
                  displayName: "COLOR",
                  displayValue: "Yellow Gold"
                }, {
                  displayName: "COLOR",
                  displayValue: "Rose Gold"
                }
              ]}
              totalInventory={5}
              totalAwaiting={3}
              needToOrder={1}
              note={"Product's note"}
              internalNote={"Internal's note"} />
            <VendorOrderListItem
              dateAdded={1512100800000}
              designerName={"AILI JEWELRY"}
              productName={"Postcard Sun Necklace 388NYS"}
              retailPrice={420.00}
              productOptions={[
                {
                  displayName: "COLOR",
                  displayValue: "Yellow Gold"
                }, {
                  displayName: "COLOR",
                  displayValue: "Rose Gold"
                }
              ]}
              totalInventory={5}
              totalAwaiting={3}
              needToOrder={1}
              note={"Product's note"}
              internalNote={"Internal's note"} />
          </VendorOrdersList>
        </Segment>
      </Grid.Column>
    );
  }
}

VendorOrdersContainer.propTypes = {
  
}

const state = state => ({

});

const actions = {

};

export default connect(state, actions)(VendorOrdersContainer);