import './App.css';
import { SearchForm } from './components/search-form/SearchForm';
import detectEthereumProvider from '@metamask/detect-provider';
import React from 'react';
import Web3 from 'web3';

export class App extends React.Component<{}, { provider: any; accounts: Array<any> }> {
	constructor(props: {}) {
		super(props);

		this.state = { provider: undefined, accounts: [] };
		this.detectProvider = this.detectProvider.bind(this);
		this.getAccounts = this.getAccounts.bind(this);
	}

	async detectProvider() {
		this.setState({ provider: undefined });
		const provider = await detectEthereumProvider();

		if (provider) {
			const accounts = await this.getAccounts();
			this.setState({ provider, accounts });
			console.log(this.state);
			
		} else {
			this.setState({ provider: null });
		}
	}

	getAccounts() {
		return Web3.givenProvider.request({ method: 'eth_requestAccounts' });
	}

	componentDidMount() {
		this.detectProvider();
	}

	render() {
		let rootNode;
		if (typeof this.state.provider === 'undefined') {
			rootNode = <div>Initializing...</div>;
		} else if (this.state.provider === null) {
			rootNode = (
				<div>
					<p>Пожалуйста, установите Ethereum кошелек</p>
					<button onClick={this.detectProvider}>Продолжить</button>
				</div>
			);
		} else {
			rootNode = <SearchForm />;
		}

		return <div className="container">{rootNode}</div>;
	}
}

export default App;
