import React from 'react';
import Web3 from 'web3';
import { OpenSeaPort, Network } from 'opensea-js';
import { OpenSeaAsset, Order, WyvernSchemaName } from 'opensea-js/lib/types';

interface MyState {
	owner: string;
	assets: OpenSeaAsset[];
}

interface MyProps {
	accountAddress: string;
}

export class SearchForm extends React.Component<MyProps, MyState> {
	private seaport!: OpenSeaPort;
	private accountAddress!: string;

	constructor(props: MyProps) {
		super(props);
		this.state = { owner: '0x76b81595e372733d13688e6da9b1d5474c9c769b', assets: [] };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.makeOffer = this.makeOffer.bind(this);
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

	async makeOffer(asset: OpenSeaAsset) {
		console.log(asset);

		// Token ID and smart contract address for a non-fungible token:
		const { tokenId, tokenAddress } = asset;
		// The offerer's wallet address:
		const accountAddress = this.accountAddress;

		let offer;
		try {
			offer = await this.seaport.createBuyOrder({
				asset: { tokenId, tokenAddress },
				accountAddress,
				// Value of the offer, in units of the payment token (or wrapped ETH if none is specified):
				startAmount: 0.5,
				quantity: 1
			});
		} catch (e) {
			alert(e);
		}

		alert(offer);

		window.location.reload();
	}

	async buy(item: OpenSeaAsset) {
		if (!item.sellOrders) {
			alert('no sell orders');
			return
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
				<form onSubmit={this.handleSubmit}>
					<input type="text" value={this.state.owner} onChange={this.handleChange} placeholder="owner adress" />
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
							{/* <button onClick={() => this.makeOffer(item)}>MAKE OFFER</button>
							<br/> */}
							<button onClick={() => this.buy(item)}>BUY</button>
						</li>
					))}
				</ul>
			</div>
		);
	}
}
