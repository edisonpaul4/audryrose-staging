import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

const NUM_MENU_ITEMS = 6;

class Pagination extends Component {
  constructor(props) {
    super(props);
    this.state = {
			page: null,
			totalPages: null
    };
  }
  componentWillReceiveProps(nextProps) {
    const totalPages = nextProps.totalPages ? parseFloat(nextProps.totalPages) : 1;
    this.setState({
      page: nextProps.page,
      totalPages: totalPages
    });
  }
	handleClick(page) {
  	let curPage = this.state.page;
		let goToPage;
		switch (page) {
			case 'prev':
				if (curPage > 1) goToPage = curPage - 1;
				break;
			case 'next':
				if (curPage <= this.state.totalPages) goToPage = curPage + 1;
				break;
			default :
				goToPage = parseFloat(page);
				break;
		}
    this.setState({
      page: goToPage
    });
		this.props.onPaginationClick(goToPage);
	}
  render() {
    const totalPages = this.state.totalPages;
    const page = this.state.page;
    var pageLinks = [];
    
    // Limit number of page links to display
    let highestPage = Math.round(page + NUM_MENU_ITEMS / 2);
    if (highestPage < NUM_MENU_ITEMS) highestPage = NUM_MENU_ITEMS;
    if (highestPage > totalPages) highestPage = totalPages;
    let lowestPage = Math.round(page - NUM_MENU_ITEMS / 2);
    if (lowestPage < 1) lowestPage = 1;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i <= highestPage && i >= lowestPage) {
        pageLinks.push(<Menu.Item name={i.toString()} active={page === i} onClick={()=>this.handleClick(i)} key={i}/>);
      }
    }
    return (      
      <Menu pagination borderless size='mini'>
        <Menu.Item icon='angle double left' disabled={page === 1} onClick={page !== 1 ? ()=>this.handleClick(1) : null} />
        <Menu.Item name='prev' disabled={page === 1} onClick={page !== 1 ? ()=>this.handleClick('prev') : null} />
  			{pageLinks}
  			<Menu.Item name='next' disabled={page === totalPages} onClick={page !== totalPages ? ()=>this.handleClick('next') : null} />
  			<Menu.Item icon='angle double right' disabled={page === totalPages} onClick={page !== totalPages ? ()=>this.handleClick(totalPages) : null} />
      </Menu>
    );
  }
}

export default Pagination;
