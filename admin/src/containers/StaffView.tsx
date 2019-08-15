import React, { useState, useEffect } from 'react';
import gql from 'graphql-tag';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
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

interface TabsProps {
  data: Array<TabData>;
}

interface TabData {
  label: string;
  content: any;
}

function Tabs(props: TabsProps): JSX.Element {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  function selectTabIndex(index: number): void {
    setActiveIndex(index);
  }

  function renderTabs(): JSX.Element[] {
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
            onClick={() => selectTabIndex(index)}
          >
            {tab.label}
          </div>
        </div>
      );
    });
  }

  function renderPanel(): JSX.Element {
    return <>{props.data[activeIndex].content}</>;
  }

  return (
    <>
      <nav className="container nav">{renderTabs()}</nav>
      <div className="mt-2">{renderPanel()}</div>
    </>
  );
}

export default function StaffView(): JSX.Element {
  const client = useApolloClient();

  const { data } = useQuery(IS_AUTHENTICATED);
  let adminToken = data.admin_token
    ? data.admin_token
    : localStorage.getItem('admin_token');

  const [verifyAdminToken] = useMutation(VERIFY_ADMIN_TOKEN, {
    variables: { adminToken: adminToken },
    onCompleted(data) {
      if (data.verifyAdminToken) {
        TokenSuccess(data, client);
      } else {
        TokenFailure(client);
      }
    }
  });

  useEffect((): void => {
    verifyAdminToken();
  }, [verifyAdminToken]);

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

  return data.isAuthenticated ? (
    <Tabs data={tabData} />
  ) : (
    <Redirect to="/login" />
  );
}
