import React, { Component } from 'react';
import Layout from '../../components/Layout';
import ContributeForm from '../../components/ContributeForm';
import Campaign from '../../lib/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../lib/web3';
import { Link } from '../../routes';

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();

    return {
      address: props.query.address,
      minimumContribution: summary[0],
      balance: web3.utils.fromWei(summary[1], 'ether'),
      requestsCount: summary[2],
      contributorsCount: summary[3],
      owner: summary[4]
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      contributorsCount,
      owner
    } = this.props;

    const items = [
      {
        header: minimumContribution + ' wei',
        description:
          'The minimum amount that must be sent in order to become a contributor',
        meta: 'Minimum Contribution',
        style: { 'overflowWrap': 'break-word' }
      },
      {
        header: balance + ' ether',
        description:
          'The total amount of contributions to the campaign',
        meta: 'Balance',
        style: { 'overflowWrap': 'break-word' }
      },
      {
        header: requestsCount,
        description:
          'A request is an attempt to spend money from the contributed funds. They need to be approved by contributors',
        meta: 'Number of Requests',
        style: { 'overflowWrap': 'break-word' }
      },
      {
        header: contributorsCount,
        description:
          'The total amount of contributors for the campaign',
        meta: 'Number of Contributors',
        style: { 'overflowWrap': 'break-word' }
      },
      {
        header: owner,
        description:
          'The address for the campaign owner',
        meta: 'Campaign Owner',
        style: { 'overflowWrap': 'break-word' }
      }
    ]

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign Details</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Link route={`/campaigns/${this.props.address}/requests`}>
                <a>
                  <Button primary>View Requests</Button>
                </a>
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignShow;
