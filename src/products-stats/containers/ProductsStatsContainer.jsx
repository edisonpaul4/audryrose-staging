import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';
import { ImagesModal } from '../components/components';
import * as productStatsActions from '../actions';

import NotificationSystem from 'react-notification-system';

class ProductsStatsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: ''
        }
    }


    componentWillMount() {
        this.props.getProductStats();
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

            case 'units_sold_asc':
                return stats.sort((a, b) => sorter(a.totalSold, b.totalSold));

            case 'units_sold_desc':
                return stats.sort((a, b) => sorter(a.totalSold, b.totalSold, true));

            case 'units_returned_asc':
                return stats.sort((a, b) => sorter(a.unitsReturned, b.unitsReturned));

            case 'units_returned_desc':
                return stats.sort((a, b) => sorter(a.unitsReturned, b.unitsReturned, true));

            case 'units_returned_p_asc':
                return stats.sort((a, b) => sorter(a.unitsReturnedP, b.unitsReturnedP));

            case 'units_returned_p_desc':
                return stats.sort((a, b) => sorter(a.unitsReturnedP, b.unitsReturnedP, true));

            case 'units_repaired_asc':
                return stats.sort((a, b) => sorter(a.unitsRepaired, b.unitsRepaired));

            case 'units_repaired_desc':
                return stats.sort((a, b) => sorter(a.unitsRepaired, b.unitsRepaired, true));

            case 'units_repaired_p_asc':
                return stats.sort((a, b) => sorter(a.unitsRepairedP, b.unitsRepairedP));

            case 'units_repaired_p_desc':
                return stats.sort((a, b) => sorter(a.unitsRepairedP, b.unitsRepairedP, true));

            case 'total_revenue_asc':
                return stats.sort((a, b) => sorter(a.totalReveneu, b.totalReveneu));

            case 'total_revenue_desc':
                return stats.sort((a, b) => sorter(a.totalReveneu, b.totalReveneu, true));

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
    handleOpenModal(productId, productName) {
        this.setState({
            isModalOpen: true,
            focusedProductId: productId,
            focusedProductName: productName
        })
        this.props.getPicturesRepairsByProduct(productId,this.props.token);
    }
    handleImagesModalClose() {
        this.setState({
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: ''
        })
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
                <Grid.Row>
                    <Grid.Column width="16">
                        <Segment style={styles.statsContainer} loading={this.props.productStats.isLoadingProducts && this.props.productStats.stats.length === 0}>
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
                                            onClick={this.onChangeSort.bind(this, 'units_sold')}>
                                            Units Sold
                      {this.onGetIcon('units_sold')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            className="pointer"
                                            onClick={this.onChangeSort.bind(this, 'units_returned')}>
                                            Units Returned
                      {this.onGetIcon('units_returned')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            className="pointer"
                                            onClick={this.onChangeSort.bind(this, 'units_returned_p')}>
                                            Returns %
                      {this.onGetIcon('units_returned_p')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            className="pointer"
                                            onClick={this.onChangeSort.bind(this, 'units_repaired')}>
                                            Units Repaired
                      {this.onGetIcon('units_repaired')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            className="pointer"
                                            onClick={this.onChangeSort.bind(this, 'units_repaired_p')}>
                                            Repair %
                      {this.onGetIcon('units_repaired_p')}
                                        </Table.HeaderCell>
                                        <Table.HeaderCell
                                            className="pointer"
                                            onClick={this.onChangeSort.bind(this, 'total_revenue')}>
                                            Total Revenue
                      {this.onGetIcon('total_revenue')}
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.sortedProducts(this.props.productStats.stats, this.props.location.query.sort).map(ps => (
                                        <Table.Row key={'key-' + ps.productId}>
                                            <Table.Cell>
                                                <a href={`/products/search?q=${ps.productId}`}>
                                                    {ps.productName}
                                                </a>
                                            </Table.Cell>
                                            <Table.Cell>{ps.totalSold}</Table.Cell>
                                            <Table.Cell>{ps.unitsReturned}</Table.Cell>
                                            <Table.Cell>{ps.unitsReturnedP.toFixed(2)}</Table.Cell>
                                            <Table.Cell onClick={() => {
                                                if (ps.unitsRepairedP > 0) {
                                                    this.handleOpenModal(ps.productId, ps.productName)
                                                }
                                            }}>{ps.unitsRepaired}</Table.Cell>
                                            <Table.Cell>{ps.unitsRepairedP.toFixed(2)}</Table.Cell>
                                            <Table.Cell>{ps.totalReveneu}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                                <ImagesModal
                                    open={this.state.isModalOpen}
                                    productName={this.state.focusedProductName}
                                    handleImagesModalClose={this.handleImagesModalClose.bind(this)}
                                    pictureUrl={this.props.productStats.pictureUrl}/>
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
    getProductStats: productStatsActions.getProductStats,
    getPicturesRepairsByProduct: productStatsActions.getPicturesRepairsByProduct
}

export default connect(state, actions)(ProductsStatsContainer);