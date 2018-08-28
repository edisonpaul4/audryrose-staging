import React from 'react';
import { connect } from 'react-redux';
import { Grid, Segment, Table, Icon } from 'semantic-ui-react';
import { Link } from 'react-router';
import { ImagesModal } from '../components/components';
import { StatsNav } from '../components/components';
import * as productStatsActions from '../actions';

import NotificationSystem from 'react-notification-system';

class ProductsStatsInStoreContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModalOpen: false,
            focusedProductId: null,
            focusedProductName: ''
        }
    }


    componentWillMount() {
        this.props.getProductStatsInStore();
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
                return stats.sort((a, b) => sorter(a.soldInStore, b.soldInStore));

            case 'units_sold_desc':
                return stats.sort((a, b) => sorter(a.soldInStore, b.soldInStore, true));

            case 'total_revenue_asc':
                return stats.sort((a, b) => sorter(a.totalRevenue, b.totalRevenue));

            case 'total_revenue_desc':
                return stats.sort((a, b) => sorter(a.totalRevenue, b.totalRevenue, true));

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
                <StatsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
                <Grid.Row>
                    <Grid.Column width="16">
                        <Segment style={styles.statsContainer} loading={this.props.productStats.isLoadingProductsInStore && this.props.productStats.statsInStore.length === 0}>
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
                                            onClick={this.onChangeSort.bind(this, 'total_revenue')}>
                                            Total Revenue
                      {this.onGetIcon('total_revenue')}
                                        </Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.sortedProducts(this.props.productStats.statsInStore, this.props.location.query.sort).map(ps => (
                                        <Table.Row key={'key-' + ps.productId}>
                                            <Table.Cell>
                                                <a href={`/products/search?q=${ps.productId}`}>
                                                    {ps.productName}
                                                </a>
                                            </Table.Cell>
                                            <Table.Cell>{ps.soldInStore}</Table.Cell>
                                            
                                            <Table.Cell>{ps.totalRevenue}</Table.Cell>
                                        </Table.Row>
                                    ))}
                                </Table.Body>
                                <ImagesModal
                                    open={this.state.isModalOpen}
                                    productName={this.state.focusedProductName}
                                    handleImagesModalClose={this.handleImagesModalClose.bind(this)}
                                    returnObj={this.props.productStats.pictureUrl}/>
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
    getProductStatsInStore: productStatsActions.getProductStatsInStore,
    getPicturesRepairsByProduct: productStatsActions.getPicturesRepairsByProduct
}

export default connect(state, actions)(ProductsStatsInStoreContainer);