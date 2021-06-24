import React from 'react';
import Web3 from 'web3';
import { OpenSeaPort, Network } from 'opensea-js';
import { OpenSeaAsset, Order, WyvernSchemaName } from 'opensea-js/lib/types';

interface MyState {
	owner: string;
	assets: OpenSeaAsset[];
	isProfilePage: boolean;
}

interface MyProps {
	accountAddress: string;
	owner?: string;
}

export class SearchForm extends React.Component<MyProps, MyState> {
	private seaport!: OpenSeaPort;
	private accountAddress!: string;

	constructor(props: MyProps) {
		super(props);

		const defOwner = '0x76b81595e372733d13688e6da9b1d5474c9c769b';
		this.state = { owner: this.props.owner || defOwner, assets: [], isProfilePage: Boolean(this.props.owner) };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.buy = this.buy.bind(this);
		this.accountAddress = props.accountAddress;
	}

	componentDidMount() {
		console.log('my account', this.accountAddress);

		this.search();
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ owner: event.target.value });
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
			owner: this.state.owner
		});

		this.setState({ assets: resp.assets });

		//const prices = await Promise.all(this.state.assets.map((a) => this.getPrice(a)));
		//const prices = await this.getPrice(this.state.assets[1]);

		//console.log(prices);
	}

	getPrice(asset: OpenSeaAsset) {
		// console.log(asset);
		if (!asset.sellOrders) {
			return '';
		}
		return asset.sellOrders![0].basePrice.toNumber() / 1000000000000000000;
	}

	getLast(asset: OpenSeaAsset) {
		// console.log(asset);
		if (!asset.lastSale) {
			return '';
		}
		return +asset.lastSale.totalPrice / 1000000000000000000;
	}

	async buy(item: OpenSeaAsset) {
		if (!item.sellOrders) {
			alert('no sell orders');
			return;
		}
		let hash = '';
		try {
			hash = await this.seaport.fulfillOrder({ order: item.sellOrders![0], accountAddress: this.accountAddress });
		} catch (e) {
			alert(e);
			return;
		}
		alert(hash);

		window.location.reload();
	}
	render() {
		return (
			<div>
				<form onSubmit={this.handleSubmit} className={this.state.isProfilePage ? 'hidden' : ''}>
					<input
						type="text"
						value={this.state.owner}
						onChange={this.handleChange}
						placeholder="owner adress"
					/>
					<button type="submit">SEARCH</button>
				</form>

				<ul className="list">
					{this.state.assets.map((item, i) => (
						<li key={item.name + i}>
							<img src={item.imageUrl || 'https://dummyimage.com/250x250/fff/000'} />
							<p>{item.collection.name}</p>
							<p>{item.name}</p>
							<p>Price: {this.getPrice(item)}</p>
							<p>Last: {this.getLast(item)}</p>
							<button className={this.state.isProfilePage ? 'hidden' : ''} onClick={() => this.buy(item)}>
								BUY
							</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
