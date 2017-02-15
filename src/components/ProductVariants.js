import React, { Component } from 'react';
import { Table, Input } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
	render() {  	
		const data = this.props.data;
		const variantSummary = {};
		if (data.variantOptions) {
  		data.variantOptions.map(function(variantOption, i) {
    		if (variantOption.option_id === 32) variantSummary.size = variantOption.value;
    		return variantSummary;
  		});
		}
    return (
      <Table.Row>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>{variantSummary.size ? variantSummary.size : 'OS'}</Table.Cell>
				<Table.Cell><Input type='number' transparent defaultValue={0} /></Table.Cell>
				<Table.Cell className='right aligned'>[not loaded yet]</Table.Cell>
				<Table.Cell className='right aligned'>[not loaded yet]</Table.Cell>
      </Table.Row>
    );
  }
}

class ProductVariants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
	handleToggleClick(event) {
    event.preventDefault();
	  event.stopPropagation();
		console.log('click');
		// this.props.onToggle(this.props.data.orderId)
	}
	render() {
  	let show = this.props.expanded ? true : false;
		var rowClass = classNames(
			{
				'': show,
				'hidden': !show
			}
		);
		const variants = this.props.variants;
		let variantRows = [];
		if (variants && show) {
			variants.map(function(variantRow, i) {
//   			console.log(variantRow);
				variantRows.push(<VariantRow data={variantRow} key={i} />);
				return variantRows;
	    });
		}
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='12' className='variant-row'>
          <h3>Inventory</h3>
          <Table className='variants-table' compact size='small' columns={6}>
  		      <Table.Header>
  		        <Table.Row>
                <Table.HeaderCell>Style-Color</Table.HeaderCell>
                <Table.HeaderCell>Color</Table.HeaderCell>
                <Table.HeaderCell>Size</Table.HeaderCell>
                <Table.HeaderCell>ACT OH</Table.HeaderCell>
                <Table.HeaderCell className='right aligned'>RETAIL $</Table.HeaderCell>
                <Table.HeaderCell className='right aligned'>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {variantRows}
            </Table.Body>
          </Table>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProductVariants;