import { useReducer, useEffect } from 'react';
import axios from 'axios';

const BASE_URL =
  'https://cors-anywhere.herokuapp.com/https://jobs.github.com/positions.json';

const ACTIONS = {
  MAKE_REQUEST: 'make-request',
  GET_DATA: 'get-data',
  ERROR: 'error',
  UPDATE_HAS_NEXT_PAGE: 'update-has-next-page',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTIONS.MAKE_REQUEST:
      return { loading: true, jobs: [] };
    case ACTIONS.GET_DATA:
      return {
        ...state,
        loading: false,
        jobs: action.payload.jobs,
      };
    case ACTIONS.ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload.error,
        jobs: [],
      };
    case ACTIONS.UPDATE_HAS_NEXT_PAGE:
      return { ...state, hasNextPage: action.payload.hasNextPage };
    default:
      return state;
  }
}

export default function useFetchJobs(params, page) {
  const [state, dispatch] = useReducer(reducer, {
    jobs: [],
    loading: true,
  });
  // console.log('re rendered useFetchJobs component');

  useEffect(() => {
    const cancelToken1 = axios.CancelToken.source(); // get a new cancel token

    // clear out the current state value
    dispatch({ type: ACTIONS.MAKE_REQUEST });

    // call the api
    axios
      .get(BASE_URL, {
        params: { markdown: true, page, ...params },
        cancelToken: cancelToken1.token,
      })
      .then((res) => {
        dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;

        dispatch({ type: ACTIONS.ERROR, payload: { error: err } });
      });

    const cancelToken2 = axios.CancelToken.source();

    axios
      .get(BASE_URL, {
        params: { markdown: true, page: page + 1, ...params },
        cancelToken: cancelToken2.token,
      })
      .then((res) => {
        dispatch({
          type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
          //                      !!res.data.length
          payload: { hasNextPage: res.data.length !== 0 },
        });
      })
      .catch((err) => {
        if (axios.isCancel(err)) return;

        dispatch({ type: ACTIONS.ERROR, payload: { error: err } });
      });

    return () => {
      // + cancel the old request
      cancelToken1.cancel();
      cancelToken2.cancel();
    };
  }, [params, page]);

  return state;
}
