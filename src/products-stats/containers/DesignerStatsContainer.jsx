import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';
import { ImagesModal } from '../components/components';
import { StatsNav } from '../components/components';
import * as statsActions from '../actions';

import NotificationSystem from 'react-notification-system';

class DesignerStatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false
        }
    }


    componentWillMount() {
        this.props.getDesignerStats();
    }
    

    render() {
        
        return (
          <Grid.Column width='16'>
              <NotificationSystem ref="notificationSystem" />
              <StatsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
              <Grid.Row>
                  <Grid.Column width="16">
                      <Segment style={styles.statsContainer} loading={this.props.productStats.isLoadingDesigners && this.props.productStats.designerStats.length === 0}>
                          <Table celled>
                              <Table.Header>
                                  <Table.Row>
                                      <Table.HeaderCell>
                                          Designer
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Revenue
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Sales
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          AOV
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Repair Rate (%)
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Return Rate (%)
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Inventory Bought
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Inventory Ordered
                                      </Table.HeaderCell>
                                      <Table.HeaderCell>
                                          Inventory Outstanding
                                      </Table.HeaderCell>
                                  </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {
                                  this.props.productStats.designerStats.map(row => (
                                    <Table.Row key={'key-' + row.designerId}>
                                      <Table.Cell>{row.designerName}</Table.Cell>
                                      <Table.Cell>{row.revenue.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.sales} </Table.Cell>
                                      <Table.Cell>{row.aov.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.repairedP.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.returnedP.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.sumPriceCheckedInthisMonth.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.sumPriceVendorOrdersthisMonth.toFixed(2)} </Table.Cell>
                                      <Table.Cell>{row.inventoryPending.toFixed(2)} </Table.Cell>
                                    </Table.Row>
                                    
                                  ))
                                }
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
    getDesignerStats: statsActions.getDesignerStats,
    getPicturesRepairsByProduct: statsActions.getPicturesRepairsByProduct
}

export default connect(state, actions)(DesignerStatsContainer);