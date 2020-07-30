import React from 'react';
import {Location} from 'history';
import {browserHistory} from 'react-router';
import styled from '@emotion/styled';

import {Organization} from 'app/types';
import EventView from 'app/utils/discover/eventView';
import DropdownControl, {DropdownItem} from 'app/components/dropdownControl';
import {t} from 'app/locale';
import Feature from 'app/components/acl/feature';
import SearchBar from 'app/views/events/searchBar';
import space from 'app/styles/space';

import {getTransactionSearchQuery} from '../utils';
import {TrendChangeType} from './types';
import {TRENDS_FUNCTIONS, getCurrentTrendFunction} from './utils';
import ChangedTransactions from './changedTransactions';

type Props = {
  organization: Organization;
  location: Location;
  eventView: EventView;
};

type State = {};

class TrendsContent extends React.Component<Props, State> {
  handleSearch = (searchQuery: string) => {
    const {location} = this.props;

    browserHistory.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        cursor: undefined,
        query: String(searchQuery).trim() || undefined,
      },
    });
  };

  handleTrendFunctionChange = (field: string) => {
    const {location} = this.props;

    browserHistory.push({
      pathname: location.pathname,
      query: {
        ...location.query,
        trendFunction: field,
      },
    });
  };

  render() {
    const {organization, eventView, location} = this.props;
    const currentTrendFunction = getCurrentTrendFunction(location);

    const query = getTransactionSearchQuery(location);
    return (
      <Feature features={['internal-catchall']}>
        <StyledSearchContainer>
          <StyledSearchBar
            organization={organization}
            projectIds={eventView.project}
            query={query}
            fields={eventView.fields}
            onSearch={this.handleSearch}
          />
          <TrendsDropdown>
            <DropdownControl
              buttonProps={{prefix: t('Filter')}}
              label={currentTrendFunction.label}
            >
              {TRENDS_FUNCTIONS.map(({label, field}) => (
                <DropdownItem
                  key={field}
                  onSelect={this.handleTrendFunctionChange}
                  eventKey={field}
                  isActive={field === currentTrendFunction.field}
                >
                  {label}
                </DropdownItem>
              ))}
            </DropdownControl>
          </TrendsDropdown>
        </StyledSearchContainer>
        <ChangedTransactionContainer>
          <ChangedTransactions
            trendChangeType={TrendChangeType.IMPROVED}
            eventView={eventView}
            location={location}
          />
          <ChangedTransactions
            trendChangeType={TrendChangeType.REGRESSION}
            eventView={eventView}
            location={location}
          />
        </ChangedTransactionContainer>
      </Feature>
    );
  }
}

const StyledSearchBar = styled(SearchBar)`
  flex-grow: 1;
  margin-bottom: ${space(2)};
  margin-right: ${space(1)};
`;

const TrendsDropdown = styled('div')`
  flex-grow: 0;
`;

const StyledSearchContainer = styled('div')`
  display: flex;
`;

const ChangedTransactionContainer = styled('div')`
  @media (min-width: ${p => p.theme.breakpoints[1]}) {
    display: block;
  }
  @media (min-width: ${p => p.theme.breakpoints[2]}) {
    display: grid;
    column-gap: ${space(2)};
    width: calc(100% - ${space(2)});
    grid-template-columns: 50% 50%;
  }
`;

export default TrendsContent;