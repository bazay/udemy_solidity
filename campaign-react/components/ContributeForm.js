import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from '../lib/campaign';
import web3 from '../lib/web3';
import { Router } from '../routes';

class ContributeForm extends Component {
  state = {
    value: '',
    errorMessage: '',
    submitting: false
  }

  onSubmit = async (event) => {
    event.preventDefault();

    if (this.state.submitting) { return };

    this.setState({ submitting: true, errorMessage: '' });

    const campaign = Campaign(this.props.address);

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, 'ether')
      });

      Router.replaecRoute(`/campaigns/${this.props.address}`);
    } catch(err) {
      this.setState({ errorMessage: err.message });
    }

    this.setState({ submitting: false, value: '' });
  }

  render() {
    return(
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={event =>
              this.setState({ value: event.target.value })
            }
          />
        </Form.Field>

        <Message error header='Oops!' content={this.state.errorMessage} />

        <Button primary loading={this.state.submitting}>Contribute</Button>
      </Form>
    );
  }
};

export default ContributeForm;
