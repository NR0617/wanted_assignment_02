import React, { createContext, useReducer, useContext } from 'react';
import axios from 'axios';
import { apis } from '../api/api';

const initialState = {
  issues: {
    loading: false,
    data: null,
    error: null,
  },
  issue: {
    loading: false,
    data: null,
    error: null,
  },
};

const loadingState = {
  loading: true,
  data: null,
  error: null,
};

const success = data => ({
  loading: false,
  data,
  error: null,
});

const error = error => ({
  loading: false,
  data: null,
  error: error,
});

function issuesReducer(state, action) {
  switch (action.type) {
    case 'GET_ISSUES':
      return {
        ...state,
        issues: loadingState,
      };
    case 'GET_ISSUES_SUCCESS':
      return {
        ...state,
        issues: success(action.data),
      };
    case 'GET_ISSUES_ERROR':
      return {
        ...state,
        issues: error(action.error),
      };
    case 'GET_ISSUE':
      return {
        ...state,
        issue: loadingState,
      };
    case 'GET_ISSUE_SUCCESS':
      return {
        ...state,
        issue: success(action.data),
      };
    case 'GET_ISSUE_ERROR':
      return {
        ...state,
        issue: error(action.error),
      };
    default:
      throw new Error(`Unhanded action type: ${action.type}`);
  }
}

// State 용 Context 와 Dispatch 용 Context 따로 만들어주기
const IssuesStateContext = createContext(null);
const IssuesDispatchContext = createContext(null);

// 위에서 선언한 두가지 Context 들의 Provider 로 감싸주는 컴포넌트
export function IssuesProvider({ children }) {
  const [state, dispatch] = useReducer(issuesReducer, initialState);
  return (
    <IssuesStateContext.Provider value={state}>
      <IssuesDispatchContext.Provider value={dispatch}>{children}</IssuesDispatchContext.Provider>
    </IssuesStateContext.Provider>
  );
}

// State 를 쉽게 조회 할 수 있게 해주는 커스텀 Hook
export function useIssuesState() {
  const state = useContext(IssuesStateContext);
  if (!state) {
    throw new Error('Cannot find issuesProvider');
  }
  console.log(state);
  return state;
}

// Dispatch 를 쉽게 사용 할 수 있게 해주는 커스텀 Hook
export function useIssuesDispatch() {
  const dispatch = useContext(IssuesDispatchContext);
  if (!dispatch) {
    throw new Error('Cannot find issuesProvider');
  }
  return dispatch;
}

export async function getIssues(dispatch) {
  dispatch({ type: 'GET_ISSUES' });
  try {
    const response = await apis.get_issues();
    dispatch({ type: 'GET_ISSUES_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_ISSUES_ERROR', error: e });
  }
}

export async function getUser(dispatch) {
  dispatch({ type: 'GET_USER' });
  try {
    const response = await axios.get_an_issue();
    dispatch({ type: 'GET_USER_SUCCESS', data: response.data });
  } catch (e) {
    dispatch({ type: 'GET_USER_ERROR', error: e });
  }
}
