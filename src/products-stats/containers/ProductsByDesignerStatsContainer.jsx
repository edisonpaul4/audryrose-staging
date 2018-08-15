import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Table, Icon, Dropdown } from 'semantic-ui-react';
import { Link } from 'react-router';
import { ImagesModal } from '../components/components';
import { StatsNav } from '../components/components';
import { SingleDatePicker } from 'react-dates';
import moment from 'moment';
import * as productStatsActions from '../actions';

import NotificationSystem from 'react-notification-system';

class ProductsByDesignerStatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: '',
            designerIdSelected: null,
            dateSelected: null,
            dateFocused:false
        }
        this.handleDesignerChange = this.handleDesignerChange.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
    }

    componentWillMount() {
        this.props.getDesigners();
    }
    
    handleDesignerChange (event, data) {
      console.log("on change follower", data.value)
      this.setState({designerIdSelected: data.value});
      this.props.getProductStatsByDesigner(data.value, this.state.dateSelected);
    }
    
    handleDateChange(data) {
      var date = data.date ? moment(data.date) : null;
      this.setState({
          dateSelected: date
      });
      
      if (this.state.designerIdSelected !== null) {
        this.props.getProductStatsByDesigner(this.state.designerIdSelected, data.date);
      }
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
            case 'product_name_asc':
                return stats.sort((a, b) => sorter(a.productName.trim().toLowerCase(), b.productName.trim().toLowerCase()));

            case 'product_name_desc':
                return stats.sort((a, b) => sorter(a.productName.trim().toLowerCase(), b.productName.trim().toLowerCase(), true));

            case 'checked_in_asc':
                return stats.sort((a, b) => sorter(a.checkedIn, b.checkedIn));

            case 'checked_in_desc':
                return stats.sort((a, b) => sorter(a.checkedIn, b.checkedIn, true));

            case 'shipped':
                return stats.sort((a, b) => sorter(a.shipped, b.shipped));

            case 'shipped':
                return stats.sort((a, b) => sorter(a.shipped, b.shipped, true));

            case 'on_hand_asc':
                return stats.sort((a, b) => sorter(a.onHand, b.onHand));

            case 'on_hand_desc':
                return stats.sort((a, b) => sorter(a.onHand, b.onHand, true));

            case 'discrepancy_asc':
                return stats.sort((a, b) => sorter(a.discrepancy, b.discrepancy));

            case 'discrepancy_desc':
                return stats.sort((a, b) => sorter(a.discrepancy, b.discrepancy, true));

            case 'ordered_all_time_asc':
                return stats.sort((a, b) => sorter(a.orderedAllTime, b.orderedAllTime));

            case 'ordered_all_time_desc':
                return stats.sort((a, b) => sorter(a.orderedAllTime, b.orderedAllTime, true));

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
              <Dropdown placeholder="Select Designer" fluid search selection options = {this.props.productStats.designers.map(designer => {
                return {
                  key:designer.designerId,
                  value: designer.designerId,
                  flag: designer.designerId,
                  text: designer.name
                }
                })
              } loading={this.props.productStats.isLoadingDesignersName} onChange={this.handleDesignerChange}
              />
              <SingleDatePicker style = {styles.dateStyle}
                  date={this.state.dateSelected !== null ? moment(this.state.dateSelected) : null}
                  placeholder={"Choose Date From..."}
                  numberOfMonths={1}
                  hideKeyboardShortcutsPanel={true}
                  showClearDate={true}
                  onDateChange={date => this.handleDateChange({date})}
                  focused={this.state.dateFocused}
                  onFocusChange={({ focused }) => this.setState({ dateFocused: focused })}
                  disabled={false}
              />
              <Grid.Row style={{"paddingTop":10}}>
                  <Grid.Column width="16">
                    <Segment style={styles.statsContainer} loading={this.props.productStats.isLoadingProductsStatsByDesigner}>
                      <Table celled>
                          <Table.Header>
                              <Table.Row>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'product_name')}>
                                      Product name
                                      {this.onGetIcon('product_name')}
                                  </Table.HeaderCell>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'checked_in')}>
                                      Checked In
                                      {this.onGetIcon('checked_in')}
                                  </Table.HeaderCell>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'shipped')}>
                                      Shipped
                                      {this.onGetIcon('shipped')}
                                  </Table.HeaderCell>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'on_hand')}>
                                      On Hand
                                      {this.onGetIcon('on_hand')}
                                  </Table.HeaderCell>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'discrepancy')}>
                                      Discrepancy
                                      {this.onGetIcon('discrepancy')}
                                  </Table.HeaderCell>
                                  <Table.HeaderCell
                                    className="pointer"
                                    onClick={this.onChangeSort.bind(this, 'ordered_all_time')}>
                                      Sold (All time)
                                      {this.onGetIcon('ordered_all_time')}
                                  </Table.HeaderCell>
                              </Table.Row>
                          </Table.Header>
                          <Table.Body>
                              {this.sortedProducts(this.props.productStats.productsStatsByDesigner, this.props.location.query.sort).map(ps => (
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
                  {this.state.designerIdSelected == null && <center><p style={styles.textStyle}> Choose a Designer... </p></center>}
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
    },
    textStyle : {
      padding:10,
    },
    dateStyle : {
      paddingTop:10
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