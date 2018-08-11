import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Table, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router';
import { ImagesModal } from '../components/components';
import { StatsNav } from '../components/components';
import * as productStatsActions from '../actions';

import NotificationSystem from 'react-notification-system';

class ProductsByDesignerStatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: '',
            designerIdSelected: null
        }
        this.handleDesignerChange = this.handleDesignerChange.bind(this);
    }

    componentWillMount() {
        this.props.getDesigners();
    }
    
    handleDesignerChange (event, data) {
      console.log("on change follower", data.value)
      this.setState({designerIdSelected: data.value});
      this.props.getProductStatsByDesigner(data.value);
    }
    
  
    render() {
      return (
          <Grid.Column width='16'>
              <NotificationSystem ref="notificationSystem" />
              <StatsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
              <Dropdown placeholder="Select Designer" fluid search selection options = {this.props.productStats.designers.map(designer => {
                return {
                  key:designer.designerId,
                  value: designer.designerId,
                  flag: designer.designerId,
                  text: designer.name
                }
                })
              } loading={this.props.productStats.isLoadingDesignersName} onChange={this.handleDesignerChange}/>
              <Grid.Row style={{"padding-top":10}}>
                  <Grid.Column width="16" padding="20">
                    <Segment style={styles.statsContainer} loading={this.props.productStats.isLoadingProductsStatsByDesigner}>
                      <Table celled>
                          <Table.Header>
                              <Table.Row>
                                  <Table.HeaderCell>
                                      Product name
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                      Checked In
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                      Shipped
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                      On Hand
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                      Discrepancy
                                  </Table.HeaderCell>
                                  <Table.HeaderCell>
                                      Sold (All time)
                                  </Table.HeaderCell>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                              {this.props.productStats.productsStatsByDesigner.map(ps => (
                                  <Table.Row key={'key-' + ps.productId}>
                                      <Table.Cell>
                                          <a href={`/products/search?q=${ps.productId}`}>
                                              {ps.productName}
                                          </a>
                                      </Table.Cell>
                                      <Table.Cell>{ps.checkedIn}</Table.Cell>
                                      <Table.Cell>{ps.shipped}</Table.Cell>
                                      <Table.Cell>{ps.onHand}</Table.Cell>
                                      <Table.Cell>{ps.discrepancy}</Table.Cell>
                                      <Table.Cell>{ps.orderedAllTime}</Table.Cell>
                                  </Table.Row>
                              ))}
                          </Table.Body>
                      </Table>
                    </Segment>
                  </Grid.Column>
              </Grid.Row>
          </Grid.Column>
      );
  }
}

const styles = {
    statsContainer: {
        maxHeight: '85vh',
        overflowY: 'scroll',
        padding: 0
    }
}

const state = state => ({
    productStats: state.productStats,
    isModalOpen: false
});

const actions = {
    getProductStatsByDesigner: productStatsActions.getProductStatsByDesigner,
    getPicturesRepairsByProduct: productStatsActions.getPicturesRepairsByProduct,
    getDesigners : productStatsActions.getDesigners
}

export default connect(state, actions)(ProductsByDesignerStatsContainer);