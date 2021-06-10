import React from 'react';
import Web3 from 'web3';
import { OpenSeaPort, Network } from 'opensea-js';
import { OpenSeaAsset, Order } from 'opensea-js/lib/types';

interface MyState {
	value: string;
	assets: OpenSeaAsset[];
}

export class SearchForm extends React.Component<{}, MyState> {
	constructor(props: {}) {
		super(props);
		this.state = { value: '', assets: [] };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	componentDidMount() {
		this.search();
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		this.search();
		event.preventDefault();
	}

	async search() {
		// This example provider won't let you make transactions, only read-only calls:
		const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');

		const seaport = new OpenSeaPort(provider, {
			networkName: Network.Main
		});
		const resp = await seaport.api.getAssets({
			owner: '0x1a45356fd0e8c90c05f45a70a549531b5090f97e'
		});

		this.setState({ assets: resp.assets });
	}

	getPrice(item: OpenSeaAsset): number {
        console.log(item);
        
		const p = (item.sellOrders as Order[])[0].currentPrice?.toNumber() as number / 1000000;
		console.log('price', p);
		return p;
	}

	render() {
		return (
			<div>
				{/* <form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.value} onChange={this.handleChange} placeholder="search" />
					<button type="submit">SEARCH</button>
				</form> */}

				<ul className="list">
					{this.state.assets.map((item) => (
						<li key={item.tokenId}>
							<img src={item.imageUrl} />
							<p>{item.collection.name}</p>
							<p>{item.name}</p>
							<p>Price: {this.getPrice(item)}</p>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
