import React, { useState } from 'react';
import './App.css';

// Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

// + Custom Hooks
import useFetchJobs from './useFetchJobs';

import Job from './Job';
import JobsPagination from './JobsPagination';
import SearchForm from './SearchForm';

function App() {
  //                                  { location: '', description: '' }
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);

  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  // console.log('re rendered app component');

  const handleParamChange = (e) => {
    const param = e.target.name;
    const value = e.target.value;

    setPage(1);

    setParams({ ...params, [param]: value });
  };
  return (
    <Container className='my-4'>
      <h1 className='mb-4'>GitHub Jobs</h1>

      <SearchForm params={params} onParamChange={handleParamChange} />

      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />

      {loading && <h1>Loading</h1>}
      {error && <h1>Error . try again</h1>}
      {jobs.map((job) => (
        <Job key={job.id} job={job} />
      ))}

      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage} />
    </Container>
  );
}

export default App;
