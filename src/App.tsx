import './App.css';
import { SearchForm } from './components/search-form/SearchForm';
import detectEthereumProvider from '@metamask/detect-provider';
import React from 'react';

export class App extends React.Component<{}, { provider: any }> {
	constructor(props: {}) {
		super(props);

		this.state = { provider: undefined };
		this.detectProvider = this.detectProvider.bind(this);
	}

	async detectProvider() {
		this.setState({ provider: undefined });
		const provider = await detectEthereumProvider();

		if (provider) {
			this.setState({ provider });
		} else {
			this.setState({ provider: null });
		}
	}

	componentDidMount() {
		this.detectProvider();
	}

	render() {

		let rootNode;
		if (typeof this.state.provider === 'undefined') {
			rootNode =  <div>Initializing...</div>;
		} else if (this.state.provider === null) {
			rootNode =  (
				<div>
					<p>Пожалуйста, установите Ethereum кошелек</p>
					<button onClick={this.detectProvider}>Продолжить</button>
				</div>
			);
		} else {
			rootNode =   <SearchForm />;
		}

		return <div className="container">
			{rootNode}
		</div>

	}
}

export default App;
