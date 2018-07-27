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
    
    sortedProducts(stats, type) {
        const sorter = (a, b, desc = false) => {
            if (!desc) {
                if (a > b) return 1;
                else return -1;
                // else return 0;
            } else {
                if (a < b) return 1;
                else return -1;
                // else return 0;
            }
        };

        switch (type) {
            case 'designer_asc':
                return stats.sort((a, b) => sorter(a.designerName.trim().toLowerCase(), b.designerName.trim().toLowerCase()));

            case 'designer_desc':
                return stats.sort((a, b) => sorter(a.designerName.trim().toLowerCase(), b.designerName.trim().toLowerCase(), true));

            case 'revenue_asc':
                return stats.sort((a, b) => sorter(a.revenue, b.revenue));

            case 'revenue_desc':
                return stats.sort((a, b) => sorter(a.revenue, b.revenue, true));

            case 'sales_asc':
                return stats.sort((a, b) => sorter(a.sales, b.sales));

            case 'sales_desc':
                return stats.sort((a, b) => sorter(a.sales, b.sales, true));
            
            case 'aov_asc':
                    return stats.sort((a, b) => sorter(a.aov, b.aov));

            case 'aov_desc':
                    return stats.sort((a, b) => sorter(a.aov, b.aov, true));
                
            case 'repair_rate_asc':
                    return stats.sort((a, b) => sorter(a.repairedP, b.repairedP));

            case 'repair_rate_desc':
                    return stats.sort((a, b) => sorter(a.repairedP, b.repairedP, true));
                    
            case 'return_rate_asc':
                    return stats.sort((a, b) => sorter(a.returnedP, b.returnedP));

            case 'return_rate_desc':
                    return stats.sort((a, b) => sorter(a.returnedP, b.returnedP, true));
                    
            case 'inventory_bought_asc':
                    return stats.sort((a, b) => sorter(a.sumPriceCheckedInthisMonth, b.sumPriceCheckedInthisMonth));

            case 'inventory_bought_desc':
                    return stats.sort((a, b) => sorter(a.sumPriceCheckedInthisMonth, b.sumPriceCheckedInthisMonth, true));
                    
            case 'inventory_ordered_asc':
                    return stats.sort((a, b) => sorter(a.sumPriceVendorOrdersthisMonth, b.sumPriceVendorOrdersthisMonth));

            case 'inventory_ordered_desc':
                    return stats.sort((a, b) => sorter(a.sumPriceVendorOrdersthisMonth, b.sumPriceVendorOrdersthisMonth, true));
                    
            case 'inventory_outstanding_asc':
                    return stats.sort((a, b) => sorter(a.inventoryPending, b.inventoryPending));

            case 'inventory_outstanding_desc':
                    return stats.sort((a, b) => sorter(a.inventoryPending, b.inventoryPending, true));
            default:
                return stats;
        }
    }
    
    onGetIcon(type) {
        const sortQuery = this.props.location.query.sort ? this.props.location.query.sort : '';
        if (!sortQuery.includes(type))
            return null;
        else if (sortQuery.includes('asc'))
            return <Icon name="triangle up" />
        else if (sortQuery.includes('desc'))
            return <Icon name="triangle down" />
        else
            return null;
    }
    
    onChangeSort(type) {
        const sortQuery = this.props.location.query.sort ? this.props.location.query.sort : '';
        const queryString = `?sort=${type}_${sortQuery.includes('asc') ? 'desc' : 'asc'}`;

        this.props.router.push({
            pathname: this.props.location.pathname,
            search: queryString
        });
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
                                      <Table.HeaderCell 
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'designer')}>
                                          Designer
                                          {this.onGetIcon('designer')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell 
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'revenue')}>
                                          Revenue
                                          {this.onGetIcon('revenue')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell 
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'sales')}>
                                          Sales
                                          {this.onGetIcon('sales')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell 
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'aov')}>
                                          AOV
                                          {this.onGetIcon('aov')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell 
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'repair_rate')}>
                                          Repair Rate (%)
                                          {this.onGetIcon('repair_rate')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'return_rate')}>
                                          Return Rate (%)
                                          {this.onGetIcon('return_rate')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'inventory_bought')}>
                                          Inventory Bought
                                          {this.onGetIcon('inventory_bought')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'inventory_ordered')}>
                                          Inventory Ordered
                                          {this.onGetIcon('inventory_ordered')}
                                      </Table.HeaderCell>
                                      <Table.HeaderCell
                                        className="pointer"
                                        onClick={this.onChangeSort.bind(this, 'inventory_outstanding')}>
                                          Inventory Outstanding
                                          {this.onGetIcon('inventory_outstanding')}
                                      </Table.HeaderCell>
                                  </Table.Row>
                              </Table.Header>
                              <Table.Body>
                                {
                                  this.sortedProducts(this.props.productStats.designerStats, this.props.location.query.sort).map(row => (
                                    <Table.Row key={'key-' + row.designerId}>
                                      <Table.Cell><a href={`/designers/search?q=${row.designerId}`}> {row.designerName} </a></Table.Cell>
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