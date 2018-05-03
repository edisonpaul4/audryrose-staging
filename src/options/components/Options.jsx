import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { Grid, Table, Dimmer, Loader, Header, Input, Button } from 'semantic-ui-react';
import { OptionsNav } from './components';

class Option extends Component {
    constructor(props) {
        super(props);
        this.state = {
            optionData: this.props.data,
            manualCode: this.props.data.manualCode ? this.props.data.manualCode : '',
            edited: false,
            saved: false
        };
        this.handleManualCodeChange = this.handleManualCodeChange.bind(this);
        this.handleSaveOptionClick = this.handleSaveOptionClick.bind(this);
        this.handleCancelClick = this.handleCancelClick.bind(this);
    }
    handleManualCodeChange(e, { value }) {
        const defaultCode = this.props.data.manualCode ? this.props.data.manualCode : '';
        const edited = (this.state.manualCode !== defaultCode || value !== this.props.data.manualCode) ? true : false;
        this.setState({
            manualCode: value,
            edited: edited,
            saved: false
        });
    }
    handleSaveOptionClick(e, { value }) {
        this.props.handleSaveOptionClick(this.props.data.objectId, this.state.manualCode);
    }
    handleCancelClick(e, { value }) {
        this.setState({
            manualCode: this.props.data.manualCode ? this.props.data.manualCode : '',
            edited: false,
            saved: false
        });
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.updatedOption) {
            let updatedOptionJSON = nextProps.updatedOption.toJSON();
            if (this.state.optionData.objectId === updatedOptionJSON.objectId) {
                this.setState({
                    optionData: updatedOptionJSON,
                    edited: false,
                    saved: true
                });
            }
        }
    }
    render() {
        const data = this.props.data;
        const saveCancelClass = this.state.edited ? '' : 'invisible';
        return (
            <Table.Row warning={this.state.edited && !this.state.saved} positive={this.state.saved && !this.props.isSaving} disabled={this.props.isSaving}>
                <Table.Cell>{data.option_value_id}</Table.Cell>
                <Table.Cell singleLine>{data.label}</Table.Cell>
                <Table.Cell singleLine>{data.generatedCode}</Table.Cell>
                <Table.Cell singleLine><Input type='text' size='mini' value={this.state.manualCode} onChange={this.handleManualCodeChange} disabled={this.props.isSaving} /></Table.Cell>
                <Table.Cell singleLine>
                    <Button.Group size='mini'>
                        <Button
                            content='Save'
                            className={saveCancelClass}
                            primary
                            compact
                            loading={this.props.isSaving}
                            disabled={this.props.isSaving}
                            onClick={this.handleSaveOptionClick}
                        />
                        <Button content='Cancel'
                            className={saveCancelClass}
                            secondary
                            compact
                            loading={this.props.isSaving}
                            disabled={this.props.isSaving}
                            onClick={this.handleCancelClick}
                        />
                    </Button.Group>
                </Table.Cell>
            </Table.Row>
        );
    }
}

class OptionTable extends Component {
    constructor(props) {
        super(props);
        this.handleSaveOptionClick = this.handleSaveOptionClick.bind(this);
    }
    handleSaveOptionClick(objectId, manualCode) {
        this.props.handleSaveOptionClick(objectId, manualCode);
    }
    render() {
        let optionRows = [];
        const scope = this;
        if (this.props.options) {
            this.props.options.map(function (optionRow, i) {
                let optionJSON = optionRow.toJSON();
                let isSaving = scope.props.savingOptions.indexOf(optionJSON.objectId) >= 0 ? true : false;
                return optionRows.push(
                    <Option data={optionJSON}
                        key={`${optionJSON.option_id}-${optionJSON.option_value_id}-1`}
                        handleSaveOptionClick={scope.handleSaveOptionClick}
                        isSaving={isSaving}
                        updatedOption={scope.props.updatedOption}
                    />
                );
            });
        }
        return (
            <div>
                <br />
                <Header>
                    <Header.Content>
                        {this.props.option_name}
                        <Header.Subheader>
                            Option {this.props.option_id}: {this.props.display_name}
                        </Header.Subheader>
                    </Header.Content>
                </Header>
                <Table className='options-table'>
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell width={1}>ID</Table.HeaderCell>
                            <Table.HeaderCell width={3}>Label</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Generated Code</Table.HeaderCell>
                            <Table.HeaderCell width={2}>Manual Code</Table.HeaderCell>
                            <Table.HeaderCell width={2}></Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {optionRows}
                    </Table.Body>
                </Table>
            </div>
        );
    }
}

class Options extends Component {
    constructor(props) {
        super(props);

        this.state = {
            subpage: this.props.router.params.subpage,
            options: null,
            updatedOption: null,
            isSavingOptions: []
        };
        this.handleSaveOptionClick = this.handleSaveOptionClick.bind(this);
    }

    componentDidMount() {
        this.props.getOptions(this.props.token, this.state.subpage);
    }

    componentWillReceiveProps(nextProps) {
        let options = [];
        if (nextProps.updatedOption) {
            // If updated option exists, push it into the state options array
            const updatedOptionJSON = nextProps.updatedOption.toJSON();
            nextProps.options.map(function (option, i) {
                const optionJSON = option.toJSON();
                if (updatedOptionJSON.objectId === optionJSON.objectId) {
                    options.push(nextProps.updatedOption);
                } else {
                    options.push(option);
                }
                return option;
            });

        } else {
            options = nextProps.options;
        }

        let isSavingOptions = this.state.isSavingOptions;
        if (nextProps.updatedOption) {
            const updatedOptionJSON = nextProps.updatedOption.toJSON();
            if (isSavingOptions.length) {
                const index = isSavingOptions.indexOf(updatedOptionJSON.objectId);
                if (index >= 0) isSavingOptions.splice(index, 1);
            }
        }

        this.setState({
            subpage: nextProps.router.params.subpage,
            options: options,
            updatedOption: nextProps.updatedOption,
            isSavingOptions: isSavingOptions
        });
        if (nextProps.router.params.subpage !== this.state.subpage) {
            this.props.getOptions(this.props.token, nextProps.router.params.subpage);
        }
    }

    handleSaveOptionClick(objectId, manualCode) {
        let currentlySaving = this.state.isSavingOptions;
        const index = currentlySaving.indexOf(objectId);
        if (index < 0) {
            currentlySaving.push(objectId);
        }
        this.setState({
            isSavingOptions: currentlySaving
        });
        this.props.saveOption(this.props.token, objectId, manualCode);
    }

    render() {
        const { error, isLoadingOptions } = this.props;
        const scope = this;
        let optionGroups = [];
        let optionTables = null;
        if (this.props.options) {
            this.props.options.map(function (optionRow, i) {
                // Get or create option table groups
                var optionGroup;
                for (var j = 0; j < optionGroups.length; j++) {
                    var optionToCheck = optionGroups[j];
                    if (optionToCheck.option_id === optionRow.get('option_id')) {
                        optionGroup = optionGroups[j];
                        break;
                    }
                }
                if (!optionGroup) {
                    optionGroups.push({ option_id: optionRow.get('option_id'), option_name: optionRow.get('option_name'), display_name: optionRow.get('display_name'), optionRows: [optionRow] });
                } else {
                    optionGroup.optionRows.push(optionRow);
                }
                return optionGroups;
            });
            optionTables = [];

            optionGroups.map(function (optionGroup, i) {
                optionTables.push(
                    <OptionTable
                        key={`${optionGroup.option_id}`}
                        option_id={optionGroup.option_id}
                        option_name={optionGroup.option_name}
                        display_name={optionGroup.display_name}
                        options={optionGroup.optionRows}
                        savingOptions={scope.state.isSavingOptions}
                        handleSaveOptionClick={scope.handleSaveOptionClick}
                        updatedOption={scope.state.updatedOption}
                    />
                );
                return optionTables;
            });
        }

        return (
            <Grid.Column width='16'>
                <OptionsNav key={this.props.location.pathname} pathname={this.props.location.pathname} query={this.props.location.query} />
                {error}
                <Dimmer active={isLoadingOptions} inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
                {optionTables}
            </Grid.Column>
        );
    }
}

export default withRouter(Options);
