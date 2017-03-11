import React, { Component } from 'react';
import { Table, Input, Button, Dropdown, Dimmer, Segment, Loader, Select } from 'semantic-ui-react';
import classNames from 'classnames';
import numeral from 'numeral';
// import moment from 'moment';

class VariantRow extends Component {
  constructor(props) {
    super(props);
    this.state = {
      variantData: this.props.data,
      inventory: parseFloat(this.props.data.inventoryLevel),
      colorCode: this.props.data.colorCode ? this.props.data.colorCode : 'None',
      variantEdited: false,
      variantSaved: false
    };
    this.handleInventoryChange = this.handleInventoryChange.bind(this);
    this.handleColorCodeChange = this.handleColorCodeChange.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
    this.handleCancelVariantClick = this.handleCancelVariantClick.bind(this);
  }
  handleInventoryChange(e, {value}) {
    const defaultColorCode = this.props.data.colorCode ? this.props.data.colorCode : 'None';
    const edited = (this.state.colorCode !== defaultColorCode || parseFloat(value) !== parseFloat(this.props.data.inventoryLevel)) ? true : false;
    this.setState({
      inventory: parseFloat(value),
      variantEdited: edited
    });
  }
  handleColorCodeChange(e, {value}) {
    const defaultColorCode = this.props.data.colorCode ? this.props.data.colorCode : 'None';
    const edited = (value !== defaultColorCode || this.state.inventory !== this.props.data.inventoryLevel) ? true : false;
    this.setState({
      colorCode: value,
      variantEdited: edited
    });
  }
	handleSaveVariantClick(e, {value}) {
  	console.log('save ' + this.state.colorCode);
		this.props.handleSaveVariantClick(this.props.data.objectId, this.state.inventory, this.state.colorCode);
	}
	handleCancelVariantClick(e, {value}) {
    this.setState({
      inventory: parseFloat(this.props.data.inventoryLevel),
      colorCode: this.props.data.colorCode ? this.props.data.colorCode : 'None',
      variantEdited: false,
      variantSaved: false
    });
	}
	componentWillReceiveProps(nextProps) {
  	if (nextProps.updatedVariant) {
    	let updatedVariantJSON = nextProps.updatedVariant.toJSON();
    	if (this.state.variantData.objectId === updatedVariantJSON.objectId) {
      	this.setState({
        	variantData: updatedVariantJSON,
        	variantEdited: false,
        	variantSaved: true
      	});
      }
  	}
	}
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
		
		let codeCodes = [
		  'B74', '100', '001', 'D4D', 'CDD', 'D4A', 'C0S', 'C0X', 'WGE', 'B76', 'WGD', 'YSD', 'WGS', 'PLD', 'D4B', '0D0', 'D4T', 'DBD', 'SD0', 'C0C', 'D4Y', 'WGA', 'YGP', 'D00', 'D4C', 'DWS', 'YGE', 'D4B', 'C0B', 'B0E', '66D', 'B5L', 'DEE', 'D4R', 'DRR', 'DBD', 'DHD', 'DAQ', 'C0C', 'CD7', 'C0T', 'CCB', 'C0P', 'D4P', 'C0C', 'D4A', 'WGA', 'D4W', 'B7P', 'WGP', 'D4A', 'B70', '101', 'A9A', 'CAM', '001', 'D4A', 'DPP', 'D4M', 'CDR', 'BRP', 'B5A', 'DPD', 'DBP', 'B7D', 'BTD', 'BED', 'BPD', 'YGT', 'BTM', 'C0D', 'D4B', 'CBC', 'V0P', 'VBJ', 'VAA', 'VLA', 'D4B', 'C0C', 'YGM'
	  ];
	  codeCodes = codeCodes.filter(function(item, pos, self) { return self.indexOf(item) === pos; });
	  const colorCodeOptions = codeCodes.map(function(code, i) {
  	  return { key: (i+1), value: code, text: code };
	  });
    colorCodeOptions.sort(function(a, b) { return (a.text < b.text) ? -1 : (a.text > b.text) ? 1 : 0; });
    colorCodeOptions.unshift({ key: 0, value: 'None', text: 'None' });
		
		const saveCancelClass = this.state.variantEdited ? '' : 'invisible';
	    
    return (
      <Table.Row warning={this.state.variantEdited ? true: false} positive={this.state.variantSaved ? true: false} disabled={this.props.isSaving}>
        <Table.Cell>{data.styleNumber ? data.styleNumber : ''}</Table.Cell>
        <Table.Cell><Select options={colorCodeOptions} value={this.state.colorCode} onChange={this.handleColorCodeChange} /></Table.Cell>
        <Table.Cell>{data.color_value ? data.color_value : ''}</Table.Cell>
        <Table.Cell>{data.size_value ? data.size_value : 'OS'}</Table.Cell>
        <Table.Cell>{otherOptions ? otherOptions.join(', ') : null}</Table.Cell>
				<Table.Cell><Input type='number' value={this.state.inventory} onChange={this.handleInventoryChange} min={0} disabled={this.props.isSaving} /></Table.Cell>
				<Table.Cell className='right aligned'>{numeral(price).format('$0,0.00')}</Table.Cell>
				<Table.Cell className='right aligned' singleLine>
    		  <Button.Group size='mini'>
    		    <Button 
    		      content='Save' 
    		      className={saveCancelClass} 
    		      primary 
    		      compact 
    		      loading={this.props.isSaving} 
    		      disabled={this.props.isSaving} 
    		      onClick={this.handleSaveVariantClick} 
    		      /> 
    		    <Button content='Cancel' 
      		    className={saveCancelClass} 
      		    secondary 
      		    compact 
      		    loading={this.props.isSaving} 
      		    disabled={this.props.isSaving} 
      		    onClick={this.handleCancelVariantClick} 
    		    />
    	    </Button.Group> 
          <Button.Group color='grey' size='mini' compact>
            <Button content='Order' disabled={this.props.isSaving || this.state.variantEdited} />
            <Dropdown floating button compact className='icon' disabled={this.props.isSaving || this.state.variantEdited}>
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
  constructor(props) {
    super(props);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
  }
	handleSaveVariantClick(objectId, inventory, colorCode) {
		this.props.handleSaveVariantClick(objectId, inventory, colorCode);
	}
	render() {  	
  	var scope = this;
		const variants = this.props.variants;
		// Sort the data
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
  			if (scope.props.updatedVariant) {
    			let updatedVariantRowJSON = scope.props.updatedVariant.toJSON();
    			if (updatedVariantRowJSON.objectId === variantRow.objectId) variantRow = updatedVariantRowJSON;
  			}
  			if (variantRow.variantOptions) {
    			variantRow.variantOptions.map(function(variantOption, j) {
      			if (variantOption.adjuster) adjuster = variantOption.adjuster;
      			if (variantOption.adjuster_value) adjusterValue = variantOption.adjuster_value;
      			return variantOption;
    			});
  			}
  			let isSaving = scope.props.savingVariants.indexOf(variantRow.objectId) >= 0 ? true : false;
				variantRows.push(
				  <VariantRow 
				    data={variantRow} 
				    basePrice={scope.props.basePrice} 
				    adjuster={adjuster} 
				    adjusterValue={adjusterValue} 
				    key={i} 
				    handleSaveVariantClick={scope.handleSaveVariantClick} 
				    isSaving={isSaving} 
				    updatedVariant={scope.props.updatedVariant}
			    />
		    );
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
              <Table.HeaderCell>Color Code</Table.HeaderCell>
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
      showEditor: false,
			editedVariants: [] // GET THIS LIST FROM VARIANT COMPONENTS
    };
    this.handleReloadClick = this.handleReloadClick.bind(this);
    this.handleSaveVariantClick = this.handleSaveVariantClick.bind(this);
  }
	handleReloadClick(productId) {
		this.props.handleReloadClick(productId);
	}
	handleSaveVariantClick(objectId, inventory, colorCode) {
		this.props.handleSaveVariantClick(objectId, inventory, colorCode);
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
    	    variantsTables.push(
    	      <VariantsTable 
    	        variants={variantsInGroup} 
    	        title={variantGroup} 
    	        basePrice={scope.props.data.price} 
    	        key={i} 
    	        handleSaveVariantClick={scope.handleSaveVariantClick} 
    	        savingVariants={scope.props.savingVariants} 
    	        updatedVariant={scope.props.updatedVariant}
  	        />
	        );
    	    return variantGroup;
  	    });
	    } else {
  	    // If no groupings, create one VariantsTable
  	    variantsTables.push(
  	      <VariantsTable 
  	        variants={variants} 
  	        basePrice={scope.props.data.price} 
  	        key={1} 
  	        handleSaveVariantClick={scope.handleSaveVariantClick} 
  	        savingVariants={scope.props.savingVariants} 
  	        updatedVariant={scope.props.updatedVariant}
	        />
        );
	    }
		}
		
		const saveAllButton = this.state.editedVariants.length > 0 ? <Button primary circular compact basic size='small' icon='save' content='Save All' disabled={this.props.isReloading} /> : null;
// 		const productEditor = this.state.showEditor ? <ProductEditor/> : null;
    return (
      <Table.Row className={rowClass}>
        <Table.Cell colSpan='13' className='variant-row'>
          <Segment.Group horizontal compact className='toolbar'>
            <Segment basic>
              <Button circular compact basic size='tiny' 
                icon='refresh' 
                content='Reload' 
                disabled={this.props.isReloading} 
                onClick={()=>this.handleReloadClick(this.props.data.productId)} 
              />
              {/*<Button circular compact basic size='tiny' 
                icon={this.state.showEditor ? 'close' : 'edit'} 
                color={this.state.showEditor ? 'black' : null} 
                content={this.state.showEditor ? 'Cancel' : 'Edit'} 
                onClick={this.handleToggleEditorClick.bind(this)} 
              />
              {productEditor}*/}
            </Segment>
            <Segment basic textAlign='right'>
              {saveAllButton}
            </Segment>
          </Segment.Group>
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