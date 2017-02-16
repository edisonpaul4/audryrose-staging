import React, { Component } from 'react';
import { Table, Input, Divider } from 'semantic-ui-react';
import classNames from 'classnames';
// import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
	render() {  	
		const data = this.props.data;
    return (
      <Table.Row>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
				<Table.Cell><Input type='number' transparent defaultValue={0} /></Table.Cell>
				<Table.Cell className='right aligned'>[not loaded yet]</Table.Cell>
				<Table.Cell className='right aligned'>[not loaded yet]</Table.Cell>
      </Table.Row>
    );
  }
}

class VariantsTable extends Component {
	render() {  	
		const variants = this.props.variants;
		// Sort the data
		if (variants && variants[0].size_value) {
      variants.sort(function(a, b) {
        return parseFloat(a.size_value) - parseFloat(b.size_value);
      });
    }
		let variantRows = [];
		if (variants) {
  		// Determine variant groupings
			variants.map(function(variantRow, i) {
				variantRows.push(<VariantRow data={variantRow} key={i} />);
				return variantRows;
	    });
		}
		const tableTitle = (this.props.title) ? <h3>{this.props.title}</h3> : null;
    return (
      <div>
        <Divider />
        {tableTitle}
        <Table className='variants-table' compact size='small' columns={6}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Style-Color</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell sorted="descending">Size</Table.HeaderCell>
              <Table.HeaderCell>ACT OH</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>RETAIL $</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {variantRows}
          </Table.Body>
        </Table>
      </div>
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
  	const variants = this.props.variants;
		var rowClass = classNames(
			{
				'': show,
				'hidden': !show
			}
		);
		var variantsTables = [];
		if (variants) {
  		let variantGroupings = [];
  		// Determine variant groupings
			variants.map(function(variantItem, i) {
  			const color = (variantItem.color_value) ? {color_label: variantItem.color_label, color_value: variantItem.color_value} : null;
  			if (color && variantGroupings.indexOf(color) < 0) variantGroupings.push(color);
				return variantItem;
	    });
	    
	    if (variantGroupings.length > 0) {
  	    // If there are groupings, create a VariantsTable for each group
  	    variantGroupings.map(function(variantGroup, i) {
    	    var variantsInGroup = [];
    	    variants.map(function(variantItem, j) {
      	    if (variantItem.color_value === variantGroup.color_value) variantsInGroup.push(variantItem);
      	    return variantItem;
    	    });
    	    variantsTables.push(<VariantsTable variants={variantsInGroup} title={variantGroup.color_value} key={i} />);
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(<VariantsTable variants={variants} key={1} />);
	    }
		}
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='12' className='variant-row'>
          <Divider horizontal>Inventory</Divider>
          {variantsTables}
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProductVariants;