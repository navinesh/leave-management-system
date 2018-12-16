// @flow
import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation, ApolloConsumer } from 'react-apollo';
import { Redirect } from 'react-router-dom';

import { TokenSuccess, TokenFailure } from './TokenComponents';
import StaffRecord from './StaffRecord';
import ArchivedStaffRecord from './ArchivedStaffRecord';

const IS_AUTHENTICATED = gql`
  query isAdminAuthenticated {
    isAuthenticated @client
    admin_token @client
  }
`;

const VERIFY_ADMIN_TOKEN = gql`
  mutation verifyAdminToken($adminToken: String!) {
    verifyAdminToken(adminToken: $adminToken) {
      Admin {
        othernames
      }
      token
      ok
    }
  }
`;

type tabsProps = {
  data: Array<any>
};

// type tabsState = {
//   activeIndex: number
// };

function Tabs(props: tabsProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  function selectTabIndex(e: SyntheticEvent<HTMLElement>) {
    setActiveIndex(parseInt(e.currentTarget.id, 10));
  }

  function renderTabs() {
    return props.data.map((tab, index) => {
      const isActive = activeIndex === index;
      return (
        <div className="nav-link btn" key={index}>
          <div
            className={
              isActive
                ? 'border border-right-0 border-left-0 border-top-0 border-secondary'
                : 'text-secondary'
            }
            onClick={selectTabIndex}
            id={index}
          >
            {tab.label}
          </div>
        </div>
      );
    });
  }

  function renderPanel() {
    return <>{props.data[activeIndex].content}</>;
  }

  return (
    <>
      <nav className="container nav">{renderTabs()}</nav>
      <div className="mt-2">{renderPanel()}</div>
    </>
  );
}

type Props = {
  verifyAdminToken: Function
};

function MainView(props: Props) {
  useEffect(function() {
    props.verifyAdminToken();
  }, []);

  const tabData = [
    {
      label: 'Active',
      content: <StaffRecord />
    },
    {
      label: 'Archived',
      content: <ArchivedStaffRecord />
    }
  ];

  return (
    <>
      <Tabs data={tabData} />
    </>
  );
}

export default function StaffView() {
  return (
    <Query query={IS_AUTHENTICATED}>
      {({ data }) => {
        let adminToken = data.admin_token
          ? data.admin_token
          : localStorage.getItem('admin_token');

        return data.isAuthenticated ? (
          <ApolloConsumer>
            {client => (
              <Mutation
                mutation={VERIFY_ADMIN_TOKEN}
                variables={{ adminToken: adminToken }}
                onCompleted={data => {
                  if (data.verifyAdminToken) {
                    TokenSuccess(data, client);
                  } else {
                    TokenFailure(client);
                  }
                }}
              >
                {verifyAdminToken => {
                  return <MainView verifyAdminToken={verifyAdminToken} />;
                }}
              </Mutation>
            )}
          </ApolloConsumer>
        ) : (
          <Redirect to="/login" />
        );
      }}
    </Query>
  );
}
