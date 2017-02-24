import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
import moment from 'moment';

const yearLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

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
        <Table.Cell>{this.props.styleNumber}</Table.Cell>
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
				variantRows.push(<VariantRow data={variantRow} basePrice={scope.props.basePrice} adjuster={adjuster} adjusterValue={adjusterValue} styleNumber={scope.props.styleNumber} key={i} />);
				return variantRows;
	    });
		}
		const tableTitle = (this.props.title) ? <h3>{this.props.title}</h3> : null;
		
    return (
      <Segment secondary>
        {tableTitle}
        <Table className='variants-table' basic='very' compact size='small' columns={7}>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Style-Color</Table.HeaderCell>
              <Table.HeaderCell>Color</Table.HeaderCell>
              <Table.HeaderCell>Size</Table.HeaderCell>
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

/*
class ProductEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false
    };
  }
  handleSelectChange(event) {
    console.log(event.target);
  }
  handleSelectChange = (e, { value }) => {
    console.log(e);
    console.log(value);
    this.setState({ 
      edited: true,
      value
    });
  }
	render() {
    const classifications = [
      { key: 'one', text: 'One', value: 'one' },
      { key: 'two', text: 'Two', value: 'two' },
    ]; 
    return (
      <Segment hidden={this.props.hidden} color={this.state.edited ? 'blue' : null} >
        <Form>
          <Form.Group>
            <Form.Select required label='Classification' options={classifications} placeholder='Select Classification' onChange={this.handleSelectChange} />
          </Form.Group>
          <Form.Button disabled={this.state.edited ? null : true} primary>Save</Form.Button>
        </Form>
      </Segment>
    );
  }
}
*/

class ProductDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showVariants: false,
      showEditor: false
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	handleToggleEditorClick() {
  	const showEditor = !this.state.showEditor;
  	
  	this.setState({
    	showEditor: showEditor
  	});
	}	
	render() {
  	const scope = this;
  	const showVariants = this.props.expanded ? true : false;
  	const variants = this.props.data.variants;
		var rowClass = classNames(
			{
				'': showVariants,
				'hidden': !showVariants
			}
		);
		
		// Create style number
		var styleNumber = '';
		styleNumber += (this.props.data.designer) ? this.props.data.designer.abbreviation : '[DESIGNER]';
    var yearNum = parseFloat(moment(this.props.data.date_created.iso).format('YYYY')) - 2015;
    styleNumber += yearLetters[yearNum];
    var seasonNum = parseFloat(moment(this.props.data.date_created.iso).format('M'))
    styleNumber += seasonNum;
    styleNumber += (this.props.data.department) ? this.props.data.department.letter : '[DEPARTMENT]';
    styleNumber += (this.props.data.classification_number) ? this.props.data.classification_number : '[CLASS]';
		
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
    	    variantsTables.push(<VariantsTable variants={variantsInGroup} title={variantGroup} basePrice={scope.props.data.price} styleNumber={styleNumber} key={i} />);
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(<VariantsTable variants={variants} basePrice={this.props.data.price} styleNumber={styleNumber} key={1} />);
	    }
		}
// 		const productEditor = this.state.showEditor ? <ProductEditor/> : null;
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='13' className='variant-row'>
          <Button circular compact basic size='tiny' 
            icon='refresh' 
            content='Sync' 
            loading={this.props.isReloading} 
            onClick={()=>this.handleReloadClick(this.props.data.productId)} 
          />
          {/*<Button circular compact basic size='tiny' 
            icon={this.state.showEditor ? 'close' : 'edit'} 
            color={this.state.showEditor ? 'black' : null} 
            content={this.state.showEditor ? 'Cancel' : 'Edit'} 
            onClick={this.handleToggleEditorClick.bind(this)} 
          />
          {productEditor}*/}
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

export default ProductDetails;