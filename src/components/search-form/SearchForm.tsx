import React from 'react';
import Web3 from 'web3';
import { OpenSeaPort, Network } from 'opensea-js';
import { OpenSeaAsset, Order } from 'opensea-js/lib/types';

interface MyState {
	value: string;
	assets: OpenSeaAsset[];
}

export class SearchForm extends React.Component<{}, MyState> {
	private seaport!: OpenSeaPort;
	private owner = '0x6235f76c0ff77e9bffabcbf68cc6f4a74190c7f3';

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
		// const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io');

		this.seaport = new OpenSeaPort(Web3.givenProvider, {
			networkName: Network.Rinkeby
		});
		const resp = await this.seaport.api.getAssets({
			owner: this.owner
		});

		this.setState({ assets: resp.assets });

		//const prices = await Promise.all(this.state.assets.map((a) => this.getPrice(a)));
		//const prices = await this.getPrice(this.state.assets[1]);

		//console.log(prices);
	}


	getPrice(asset: OpenSeaAsset) {
		console.log(asset);
		if (!asset.sellOrders) {
			return ''
		}
		return asset.sellOrders![0].basePrice.toNumber() / 1000000000000000000;

	}

	getLast(asset: OpenSeaAsset) {
		console.log(asset);
		if (!asset.lastSale) {
			return ''
		}
		return +asset.lastSale.totalPrice / 1000000000000000000;

	}
	render() {
		return (
			<div>
				{/* <form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.value} onChange={this.handleChange} placeholder="search" />
					<button type="submit">SEARCH</button>
				</form> */}

				<ul className="list">
					{this.state.assets.map((item, i) => (
						<li key={item.name + i}>
							<img src={item.imageUrl} />
							<p>{item.collection.name}</p>
							<p>{item.name}</p>
							<p>Price: {this.getPrice(item)}</p>
							<p>Last: {this.getLast(item)}</p>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
