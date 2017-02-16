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
    let highestPage = Math.floor(page + NUM_MENU_ITEMS / 2);
    if (highestPage < NUM_MENU_ITEMS) highestPage = NUM_MENU_ITEMS;
    if (highestPage > totalPages) highestPage = totalPages;
    let lowestPage = Math.ceil(page - NUM_MENU_ITEMS / 2);
    if ((highestPage - lowestPage) < NUM_MENU_ITEMS || lowestPage < 1) lowestPage = 1;
    
    for (let i = 1; i <= totalPages; i++) {
      if (i <= highestPage && i >= lowestPage) {
        pageLinks.push(<Menu.Item link={page !== i} name={i.toString()} active={page === i} onClick={()=>this.handleClick(i)} key={i}/>);
      }
    }
    return (      
      <Menu pagination borderless size='mini'>
        <Menu.Item link={page !== 1} name='prev' active={page === 1} onClick={()=>this.handleClick('prev')} />
  			{pageLinks}
  			<Menu.Item link={page !== totalPages} name='next' active={page === totalPages} onClick={()=>this.handleClick('next')} />
      </Menu>
    );
  }
}

export default Pagination;
