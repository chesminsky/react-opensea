import React from 'react';

interface MyState {
	value: string;
}

export class SearchForm extends React.Component<{}, MyState> {
	constructor(props: {}) {
		super(props);
		this.state = { value: '' };

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({ value: event.target.value });
	}

	handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		alert('A name was submitted: ' + this.state.value);
		event.preventDefault();
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<label>
					Name:
					<input type="text" value={this.state.value} onChange={this.handleChange} />
				</label>
				<input type="submit" value="Submit" />
			</form>
		);
	}
}
