import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
	render() {  	
		const data = this.props.data;
		// Create an array of other options values
		let otherOptions = [];
		if (data.gemstone_value) otherOptions.push(data.gemstone_value);
		if (data.singlepair_value) otherOptions.push(data.singlepair_value);
		if (data.letter_value) otherOptions.push(data.letter_value);
		if (data.length_value) otherOptions.push(data.length_value);
		if (data.font_value) otherOptions.push(data.font_value);
		
		let price = this.props.basePrice;
		if (this.props.adjuster && this.props.adjuster === 'absolute') price = this.props.adjusterValue;
		if (this.props.adjuster && this.props.adjuster === 'relative') price += this.props.adjusterValue;
    return (
      <Table.Row>
        <Table.Cell>asdf</Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input type='number' transparent defaultValue={0} /></Table.Cell>
				<Table.Cell className='right aligned'>{numeral(price).format('$0,0.00')}</Table.Cell>
				<Table.Cell className='right aligned'>
          <Button.Group color='grey' size='mini' compact>
            <Button content='Order' />
            <Dropdown floating button compact className='icon'>
              <Dropdown.Menu>
                <Dropdown.Item icon='exchange' text='Resize' />
                <Dropdown.Item icon='hide' text='Hide' />
              </Dropdown.Menu>
            </Dropdown>
          </Button.Group>
				</Table.Cell>
      </Table.Row>
    );
  }
}

class VariantsTable extends Component {
	render() {  	
  	var scope = this;
		const variants = this.props.variants;
		// Sort the data
// 		console.log(variants);
		if (variants.length && variants[0].size_value) {
      variants.sort(function(a, b) {
        return parseFloat(a.size_value) - parseFloat(b.size_value);
      });
    }
		let variantRows = [];
		if (variants) {
			variants.map(function(variantRow, i) {
  			let adjuster = null;
  			let adjusterValue = 0;
  			if (variantRow.variantOptions) {
    			variantRow.variantOptions.map(function(variantOption, j) {
      			if (variantOption.adjuster) adjuster = variantOption.adjuster;
      			if (variantOption.adjuster_value) adjusterValue = variantOption.adjuster_value;
      			return variantOption;
    			});
  			}
				variantRows.push(<VariantRow data={variantRow} basePrice={scope.props.basePrice} adjuster={adjuster} adjusterValue={adjusterValue} key={i} />);
				return variantRows;
	    });
		}
		const tableTitle = (this.props.title) ? <h3>{this.props.title}</h3> : null;
    return (
      <Segment>
        {tableTitle}
        <Table className='variants-table' basic='very' compact size='small' columns={6}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Style-Color</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell sorted="descending">Size</Table.HeaderCell>
              <Table.HeaderCell>Other Options</Table.HeaderCell>
              <Table.HeaderCell>ACT OH</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>RETAIL $</Table.HeaderCell>
              <Table.HeaderCell className='right aligned'>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {variantRows}
          </Table.Body>
        </Table>
      </Segment>
    );
  }
}

class ProductVariants extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	render() {
  	var scope = this;
  	let show = this.props.expanded ? true : false;
  	const variants = this.props.data.variants;
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
  			const color = (variantItem.color_value) ? variantItem.color_value : null;
  			if (color && variantGroupings.indexOf(color) < 0) {
    			variantGroupings.push(color);
  			}
				return variantItem;
	    });
	    
	    if (variantGroupings.length > 0) {
  	    // If there are groupings, create a VariantsTable for each group
  	    variantGroupings.map(function(variantGroup, i) {
    	    var variantsInGroup = [];
    	    variants.map(function(variantItem, j) {
      	    if (variantItem.color_value === variantGroup) variantsInGroup.push(variantItem);
      	    return variantItem;
    	    });
    	    variantsTables.push(<VariantsTable variants={variantsInGroup} title={variantGroup} basePrice={scope.props.data.price} key={i} />);
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(<VariantsTable variants={variants} basePrice={this.props.data.price} key={1} />);
	    }
		}
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='12' className='variant-row'>
          <Button icon='refresh' size='mini' content='Reload' loading={this.props.isReloading} onClick={()=>this.handleReloadClick(this.props.data.productId)} />
          <Dimmer.Dimmable as={Segment} vertical blurring dimmed={this.props.isReloading}>
            <Dimmer active={this.props.isReloading} inverted>
              <Loader>Loading</Loader>
            </Dimmer>
            {variantsTables}
          </Dimmer.Dimmable>
        </Table.Cell>
      </Table.Row>
    );
  }
}

export default ProductVariants;